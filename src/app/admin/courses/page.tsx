import React from "react";
import { db } from "../../../lib/db";
import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";
import CoursesClient from "./CoursesClient";

// Mock Fallbacks
const MOCK_COURSES = [
  {
    id: "course-1",
    slug: "executive-leadership-mastery",
    titleEn: "Executive Leadership Mastery (ELM)",
    titleTh: "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)",
    shortDescEn: "Learn to build high-performance executive teams and scale your enterprise strategically.",
    shortDescTh: "เรียนรู้วิธีการสร้างทีมผู้บริหารประสิทธิภาพสูงและขยายขนาดองค์กรของคุณอย่างมียุทธศาสตร์",
    descriptionEn: "",
    descriptionTh: "",
    category: "Leadership",
    courseType: "HYBRID",
    status: "PUBLISHED",
    price: 45000.0,
    thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    instructorId: "inst-1"
  },
  {
    id: "course-2",
    slug: "sme-scaleup-blueprint",
    titleEn: "SME Scale-Up Blueprint",
    titleTh: "พิมพ์เขียวการขยายธุรกิจ SME",
    shortDescEn: "Systemize your sales, marketing, and operations to grow your business without burning out.",
    shortDescTh: "จัดระบบการขาย การตลาด และปฏิบัติการเพื่อขยายธุรกิจโดยไม่ต้องทำงานจนหมดไฟ",
    descriptionEn: "",
    descriptionTh: "",
    category: "Management",
    courseType: "ONLINE",
    status: "PUBLISHED",
    price: 19500.0,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    instructorId: "inst-2"
  },
];

const MOCK_INSTRUCTORS = [
  { id: "inst-1", nameEn: "Dr. Walter Peterson", nameTh: "ดร. วอลเตอร์ พีเตอร์สัน" },
  { id: "inst-2", nameEn: "Coach Pitchaya S.", nameTh: "โค้ชพิชญะ เอส." }
];

export default async function AdminCoursesPage() {
  const isEnabled = await getFeatureToggle("courses");
  if (!isEnabled) {
    return <FeatureDisabled moduleNameEn="Courses & LMS System" moduleNameTh="ระบบหลักสูตรออนไลน์ (LMS)" isAdminPage={true} />;
  }

  let courses: any[] = MOCK_COURSES;
  let instructors: any[] = MOCK_INSTRUCTORS;

  try {
    // 1. Fetch live courses
    const dbCourses = await db.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbCourses.length > 0) {
      courses = dbCourses.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        titleEn: c.titleEn,
        titleTh: c.titleTh,
        shortDescEn: c.shortDescEn,
        shortDescTh: c.shortDescTh,
        descriptionEn: c.descriptionEn,
        descriptionTh: c.descriptionTh,
        category: c.category,
        courseType: c.courseType,
        status: c.status,
        price: c.price,
        thumbnail: c.thumbnail,
        instructorId: c.instructorId
      }));
    }

    // 2. Fetch live instructors (for select options)
    const dbInstructors = await db.instructor.findMany({
      select: {
        id: true,
        nameEn: true,
        nameTh: true
      },
      orderBy: { createdAt: "asc" }
    });
    if (dbInstructors.length > 0) {
      instructors = dbInstructors;
    }
  } catch (error) {
    console.warn("Prisma query failed in AdminCoursesPage, using mock database fallbacks.", error);
  }

  return (
    <CoursesClient 
      initialCourses={courses} 
      instructors={instructors}
    />
  );
}
