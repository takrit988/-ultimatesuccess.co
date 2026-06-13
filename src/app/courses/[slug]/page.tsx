import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "../../../lib/db";
import { CourseInteractive } from "./CourseInteractive";
import { Calendar, Award, Globe, PlayCircle } from "lucide-react";

// Fallback Mock data mapping for safe SSR rendering if database isn't initialized yet
const MOCK_COURSES_MAP: Record<string, any> = {
  "executive-leadership-mastery": {
    slug: "executive-leadership-mastery",
    titleEn: "Executive Leadership Mastery (ELM)",
    titleTh: "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)",
    shortDescEn: "Learn to build high-performance executive teams and scale your enterprise strategically.",
    shortDescTh: "เรียนรู้วิธีการสร้างทีมผู้บริหารประสิทธิภาพสูงและขยายขนาดองค์กรของคุณอย่างมียุทธศาสตร์",
    descriptionEn: "This program is designed specifically for business owners, CEOs, and corporate executives who want to break through growth ceilings. Under the guidance of Dr. Walter Peterson, you will map out a 12-month scaling strategy and align your leadership team.",
    descriptionTh: "หลักสูตรนี้ออกแบบมาโดยเฉพาะสำหรับเจ้าของธุรกิจ ซีอีโอ และผู้บริหารองค์กรที่ต้องการก้าวข้ามขีดจำกัดการเติบโต ภายใต้การนำของ ดร. วอลเตอร์ พีเตอร์สัน คุณจะร่วมวางแผนกลยุทธ์การเติบโตแบบทวีคูณภายใน 12 เดือน",
    price: 45000.0,
    thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    category: "Leadership",
    courseType: "HYBRID",
    startDate: new Date("2026-07-01"),
    endDate: new Date("2026-07-30"),
    learningOutcomes: [
      "Formulate a scalable corporate strategy",
      "Develop executive communication and command",
      "Optimize operations and delegate effectively",
      "สร้างแผนกลยุทธ์ธุรกิจที่เติบโตได้",
      "พัฒนาการสื่อสารและสั่งการระดับผู้บริหาร",
    ],
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
    faq: [
      { qEn: "Who is this program for?", qTh: "หลักสูตรนี้เหมาะสำหรับใคร?", aEn: "Entrepreneurs, CEOs, and Executive Directors.", aTh: "เจ้าของกิจการ, ซีอีโอ, และผู้บริหารระดับสูง" },
      { qEn: "Is there physical coaching?", qTh: "มีการพบปะเรียนตัวต่อตัวหรือไม่?", aEn: "Yes, this is a hybrid program with 4 onsite workshops in Bangkok.", aTh: "มี หลักสูตรนี้เป็นไฮบริดโดยมีเวิร์กชอป 4 ครั้งในกรุงเทพฯ" },
    ],
    instructor: {
      nameEn: "Dr. Walter Peterson",
      nameTh: "ดร. วอลเตอร์ พีเตอร์สัน",
      titleEn: "Executive Leadership Coach & Strategist",
      titleTh: "โค้ชและนักยุทธศาสตร์การนำทางผู้บริหาร",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      bioEn: "Over 20 years of experience coaching Fortune 500 CEOs globally.",
      bioTh: "ประสบการณ์กว่า 20 ปีในการโค้ชซีอีโอ Fortune 500 ทั่วโลก",
    },
  },
  "sme-scaleup-blueprint": {
    slug: "sme-scaleup-blueprint",
    titleEn: "SME Scale-Up Blueprint",
    titleTh: "พิมพ์เขียวการขยายธุรกิจ SME",
    shortDescEn: "Systemize your sales, marketing, and operations to grow your business without burning out.",
    shortDescTh: "จัดระบบการขาย การตลาด และปฏิบัติการเพื่อขยายธุรกิจโดยไม่ต้องทำงานจนหมดไฟ",
    descriptionEn: "SME Scale-Up Blueprint provides practical templates, growth engines, and structural formulas to turn your small business into an automated, self-sustaining enterprise.",
    descriptionTh: "พิมพ์เขียวการขยายธุรกิจ SME มอบชุดเครื่องมือ เทมเพลต และโครงสร้างการทำงานจริงเพื่อช่วยเปลี่ยนธุรกิจขนาดเล็กของคุณเป็นระบบที่ขับเคลื่อนตัวเองได้อย่างสมบูรณ์",
    price: 19500.0,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    category: "Management",
    courseType: "ONLINE",
    startDate: new Date("2026-08-15"),
    endDate: new Date("2026-09-15"),
    learningOutcomes: [
      "Create standard operating procedures (SOPs)",
      "Build automated client acquisition pipelines",
      "Manage small teams using transparent KPIs",
      "จัดทำคู่มือ SOP ที่พร้อมใช้งาน",
      "สร้างช่องทางหาลูกค้าใหม่อัตโนมัติ",
    ],
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
    faq: [
      { qEn: "How long is the course access?", qTh: "ระยะเวลาการเข้าเรียนนานเท่าใด?", aEn: "Lifetime access to all modules and updates.", aTh: "เข้าเรียนและรับอัปเดตได้ตลอดชีพ" },
    ],
    instructor: {
      nameEn: "Coach Pitchaya S.",
      nameTh: "โค้ชพิชญะ เอส.",
      titleEn: "SME Scaling Specialist & Marketing Architect",
      titleTh: "ผู้เชี่ยวชาญการขยายขนาด SME และสถาปนิกการตลาด",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      bioEn: "Helping retail and services businesses scale through digital transformation.",
      bioTh: "ช่วยธุรกิจค้าปลีกและบริการเติบโตอย่างมั่นคงผ่านการเปลี่ยนผ่านดิจิทัล",
    },
  },
};

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const isEnabled = await getFeatureToggle("courses");
  if (!isEnabled) {
    return (
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
        <FeatureDisabled moduleNameEn="Courses & LMS System" moduleNameTh="ระบบหลักสูตรออนไลน์ (LMS)" />
      </div>
    );
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";


  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let course = MOCK_COURSES_MAP[slug];

  try {
    const dbCourse = await db.course.findUnique({
      where: { slug },
      include: { instructor: true },
    });
    if (dbCourse) {
      course = {
        slug: dbCourse.slug,
        titleEn: dbCourse.titleEn,
        titleTh: dbCourse.titleTh,
        shortDescEn: dbCourse.shortDescEn,
        shortDescTh: dbCourse.shortDescTh,
        descriptionEn: dbCourse.descriptionEn,
        descriptionTh: dbCourse.descriptionTh,
        price: dbCourse.price,
        thumbnail: dbCourse.thumbnail,
        category: dbCourse.category,
        courseType: dbCourse.courseType,
        startDate: dbCourse.startDate,
        endDate: dbCourse.endDate,
        learningOutcomes: dbCourse.learningOutcomes,
        // JSON parsing
        curriculum: dbCourse.curriculum as any,
        faq: dbCourse.faq as any,
        instructor: dbCourse.instructor,
      };
    }
  } catch (error) {
    console.warn("Prisma fetch failed for CourseDetailPage, resolving using map fallback.", error);
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Banner Header */}
      <section className="bg-slate-950 text-white py-16 md:py-24 dark-premium-gradient border-b border-gold-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Header Description */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-gold-500 tracking-widest uppercase">
                {course.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {isEn ? course.titleEn : course.titleTh}
              </h1>
              <p className="text-slate-300 font-light text-base sm:text-lg max-w-3xl leading-relaxed">
                {isEn ? course.shortDescEn : course.shortDescTh}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gold-500" />
                  <span>{isEn ? `Type: ${course.courseType}` : `ประเภท: ${course.courseType}`}</span>
                </div>
                {course.startDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gold-500" />
                    <span>
                      {isEn
                        ? `Starts: ${new Date(course.startDate).toLocaleDateString()}`
                        : `เริ่มเรียน: ${new Date(course.startDate).toLocaleDateString("th-TH")}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Video / Visual Placeholder */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <img
                  src={course.thumbnail}
                  alt={isEn ? course.titleEn : course.titleTh}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <PlayCircle className="h-12 w-12 text-gold-500 hover:text-gold-600 transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Page Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          {/* Main Description details */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              {isEn ? "Course Overview" : "รายละเอียดหลักสูตร"}
            </h2>
            <div className="text-sm sm:text-base text-slate-650 leading-relaxed font-light whitespace-pre-wrap">
              {isEn ? course.descriptionEn : course.descriptionTh}
            </div>

            {/* Instructor Bio Profile */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-10 space-y-4">
              <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase">
                {isEn ? "Your Mentor" : "ผู้ดูแลและโค้ชประจำหลักสูตร"}
              </h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
                <img
                  src={course.instructor.avatar}
                  alt={isEn ? course.instructor.nameEn : course.instructor.nameTh}
                  className="w-16 h-16 rounded-full object-cover border border-gold-500/20"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-slate-900">
                    {isEn ? course.instructor.nameEn : course.instructor.nameTh}
                  </h4>
                  <p className="text-xs text-gold-600 font-medium">
                    {isEn ? course.instructor.titleEn : course.instructor.titleTh}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-light pt-2">
                    {isEn ? course.instructor.bioEn : course.instructor.bioTh}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive layout details wrapper */}
        <CourseInteractive
          curriculum={course.curriculum}
          faq={course.faq}
          learningOutcomes={course.learningOutcomes}
          isEn={isEn}
          price={course.price}
          courseTitle={isEn ? course.titleEn : course.titleTh}
        />
      </section>
    </div>
  );
}
