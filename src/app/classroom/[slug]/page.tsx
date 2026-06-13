import React from "react";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "../../../auth";
import { db } from "../../../lib/db";
import { ClassroomClient } from "./ClassroomClient";

// Fallback Mock data map in case database connection fails or course isn't found
const MOCK_COURSES_MAP: Record<string, any> = {
  "executive-leadership-mastery": {
    id: "course-1",
    slug: "executive-leadership-mastery",
    titleEn: "Executive Leadership Mastery (ELM)",
    titleTh: "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)",
    curriculum: [
      {
        sectionEn: "Module 1: Strategic Vision",
        sectionTh: "บทเรียนที่ 1: วิสัยทัศน์เชิงกลยุทธ์",
        lectures: [
          { titleEn: "1.1 Establishing Corporate Alignment", titleTh: "1.1 การจัดเป้าหมายองค์กรให้ตรงกัน" },
          { titleEn: "1.2 Designing Growth Flywheels", titleTh: "1.2 การออกแบบวงล้อการเติบโตธุรกิจ" },
        ],
      },
      {
        sectionEn: "Module 2: High Performance Teams",
        sectionTh: "บทเรียนที่ 2: ทีมงานประสิทธิภาพสูง",
        lectures: [
          { titleEn: "2.1 Building Trust and Accountability", titleTh: "2.1 การสร้างความน่าเชื่อถือและความรับผิดชอบ" },
          { titleEn: "2.2 Scaling Decision Protocols", titleTh: "2.2 เกณฑ์การตัดสินใจในระดับองค์กร" },
        ],
      },
    ],
  },
  "sme-scaleup-blueprint": {
    id: "course-2",
    slug: "sme-scaleup-blueprint",
    titleEn: "SME Scale-Up Blueprint",
    titleTh: "พิมพ์เขียวการขยายธุรกิจ SME",
    curriculum: [
      {
        sectionEn: "Module 1: Core Systemization",
        sectionTh: "บทเรียนที่ 1: การวางโครงสร้างระบบหลัก",
        lectures: [
          { titleEn: "1.1 Documenting Standard Operating Procedures", titleTh: "1.1 การสร้างคู่มือปฏิบัติงานมาตรฐาน (SOP)" },
          { titleEn: "1.2 KPI Frameworks for Small Teams", titleTh: "1.2 โครงสร้าง KPI สำหรับทีมขนาดเล็ก" },
        ],
      },
    ],
  },
};

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ClassroomPage({ params }: PageProps) {
  const isEnabled = await getFeatureToggle("courses");
  if (!isEnabled) {
    return (
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
        <FeatureDisabled moduleNameEn="Courses & LMS System" moduleNameTh="ระบบหลักสูตรออนไลน์ (LMS)" />
      </div>
    );
  }

  const session = await auth();


  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";

  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let course = MOCK_COURSES_MAP[slug];
  let completedLessons: string[] = ["1.1 Establishing Corporate Alignment"]; // seed mock fallback

  try {
    const dbCourse = await db.course.findUnique({
      where: { slug },
    });

    if (dbCourse) {
      // 1. Verify user enrollment
      const enrollment = await db.enrollment.findFirst({
        where: { userId, courseId: dbCourse.id, status: "ACTIVE" },
      });

      // Grant admins access automatically even if not enrolled
      const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session.user.role || "");

      if (!enrollment && !isAdmin) {
        redirect(`/courses/${slug}`);
      }

      course = {
        id: dbCourse.id,
        slug: dbCourse.slug,
        titleEn: dbCourse.titleEn,
        titleTh: dbCourse.titleTh,
        curriculum: dbCourse.curriculum as any[],
      };

      // 2. Fetch User completed lessons
      const dbProgress = await db.lessonProgress.findMany({
        where: { userId, courseId: dbCourse.id, isCompleted: true },
      });

      completedLessons = dbProgress.map((p) => p.lessonId);
    }
  } catch (error) {
    console.warn("Prisma fetch failed for ClassroomPage, loading default fallbacks.", error);
  }

  if (!course) {
    notFound();
  }

  return (
    <ClassroomClient
      course={course}
      completedLessons={completedLessons}
      userId={userId}
      isEn={isEn}
    />
  );
}
