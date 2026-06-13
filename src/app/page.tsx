import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "../lib/db";
import { Award, BookOpen, Star, ArrowRight, Calendar, Users, Briefcase, PlayCircle } from "lucide-react";

// Graceful fallback mock data in case the database is empty or offline
const MOCK_PROMOTIONS = [
  {
    id: "promo-1",
    headlineEn: "Ignite Your Growth with Executive Leadership Mastery",
    headlineTh: "ยกระดับภาวะผู้นำสู่ความสำเร็จขั้นสูงสุดกับ ELM",
    ctaTextEn: "Apply for Intake 2026",
    ctaTextTh: "สมัครเข้าเรียนรุ่นปี 2026",
    ctaLink: "/courses/executive-leadership-mastery",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
  },
];

const MOCK_COURSES = [
  {
    id: "course-1",
    slug: "executive-leadership-mastery",
    titleEn: "Executive Leadership Mastery (ELM)",
    titleTh: "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)",
    shortDescEn: "Learn to build high-performance executive teams and scale your enterprise strategically.",
    shortDescTh: "เรียนรู้วิธีการสร้างทีมผู้บริหารประสิทธิภาพสูงและขยายขนาดองค์กรของคุณอย่างมียุทธศาสตร์",
    price: 45000.0,
    thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    category: "Leadership",
    courseType: "HYBRID",
  },
  {
    id: "course-2",
    slug: "sme-scaleup-blueprint",
    titleEn: "SME Scale-Up Blueprint",
    titleTh: "พิมพ์เขียวการขยายธุรกิจ SME",
    shortDescEn: "Systemize your sales, marketing, and operations to grow your business without burning out.",
    shortDescTh: "จัดระบบการขาย การตลาด และปฏิบัติการเพื่อขยายธุรกิจโดยไม่ต้องทำงานจนหมดไฟ",
    price: 19500.0,
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    category: "Management",
    courseType: "ONLINE",
  },
];

const MOCK_TESTIMONIALS = [
  {
    nameEn: "Somchai Devahastin",
    nameTh: "คุณสมชาย เทวหัสดิน",
    roleEn: "Founder, Zenith Logistics",
    roleTh: "ผู้ก่อตั้ง, เซนิท โลจิสติกส์",
    quoteEn: "The Executive Leadership Mastery program completely re-aligned our executive committee. Within 8 months of applying the scaling systems, our revenue increased by 42%.",
    quoteTh: "หลักสูตร ELM ช่วยปรับทิศทางทีมบริหารของเราอย่างยอดเยี่ยม หลังจากนำระบบการขยายขนาดองค์กรไปปรับใช้ได้ 8 เดือน รายได้ของธุรกิจเราเติบโตขึ้นถึง 42%",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
  },
  {
    nameEn: "Nattaporn S.",
    nameTh: "คุณณัฐพร เอส.",
    roleEn: "CEO, BioFresh Retail",
    roleTh: "ประธานเจ้าหน้าที่บริหาร, ไบโอเฟรช รีเทล",
    quoteEn: "Coach Pitchaya's SME blueprint is highly actionable. The templates for standard operating procedures saved us hundreds of hours of trial and error.",
    quoteTh: "พิมพ์เขียว SME ของโค้ชพิชญะใช้งานได้จริงมาก เทมเพลตสำหรับ SOP ช่วยประหยัดเวลาการลองผิดลองถูกให้เราได้นับร้อยชั่วโมง",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
  },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";

  let promotions = MOCK_PROMOTIONS;
  let courses = MOCK_COURSES;

  try {
    // Attempt database fetching
    const dbPromotions = await db.promotionBanner.findMany({
      where: { status: "ACTIVE" },
      orderBy: { priority: "desc" },
    });
    if (dbPromotions.length > 0) {
      promotions = dbPromotions.map((p) => ({
        id: p.id,
        headlineEn: p.headlineEn,
        headlineTh: p.headlineTh,
        ctaTextEn: p.ctaTextEn,
        ctaTextTh: p.ctaTextTh,
        ctaLink: p.ctaLink,
        image: p.image,
      }));
    }

    const dbCourses = await db.course.findMany({
      where: { status: "PUBLISHED" },
      take: 3,
    });
    if (dbCourses.length > 0) {
      courses = dbCourses.map((c) => ({
        id: c.id,
        slug: c.slug,
        titleEn: c.titleEn,
        titleTh: c.titleTh,
        shortDescEn: c.shortDescEn,
        shortDescTh: c.shortDescTh,
        price: c.price,
        thumbnail: c.thumbnail,
        category: c.category,
        courseType: c.courseType,
      }));
    }
  } catch (error) {
    console.warn("Database connection unavailable, rendering with seed fallbacks:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-950 text-white py-24 md:py-36 overflow-hidden dark-premium-gradient">
        {/* Background Decorative Gradient Rings */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl -mr-64 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -ml-48 -mb-32 border border-gold-500/5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-gold-500 uppercase">
                <Award className="h-3.5 w-3.5 mr-1" />
                {isEn ? "Elite Executive Education" : "สถาบันการศึกษาผู้บริหารระดับสูง"}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {isEn ? "Empowering Leaders to" : "เสริมพลังความเป็นผู้นำ"} <br />
                <span className="gold-text-gradient">
                  {isEn ? "Scale New Heights" : "ขับเคลื่อนธุรกิจสู่ความสำเร็จสูงสุด"}
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {isEn
                  ? "Premium executive education, masterclasses, and networking designed for CEOs, SMEs, and business partners globally."
                  : "หลักสูตรระดับผู้บริหารพรีเมียม มาสเตอร์คลาส และคอนเนกชันพันธมิตรที่ออกแบบมาเพื่อเจ้าของกิจการ ซีอีโอ และผู้นำธุรกิจ"}
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <Link
                  href="/courses"
                  className="bg-gold-500 hover:bg-gold-600 text-primary font-bold px-8 py-4 rounded-full text-sm tracking-wide uppercase transition-all shadow-lg hover:shadow-gold-500/30 text-center premium-btn"
                >
                  {isEn ? "Explore Courses" : "สำรวจหลักสูตร"}
                </Link>
                <Link
                  href="/about"
                  className="border border-slate-700 hover:border-gold-500 text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all text-center"
                >
                  {isEn ? "Learn More" : "เรียนรู้เพิ่มเติม"}
                </Link>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border border-gold-500/20 group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
                  alt="Executive Education"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gold-500 rounded-full text-primary shadow-md">
                      <PlayCircle className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-xs text-gold-500 font-semibold tracking-wider uppercase">
                        {isEn ? "Watch Overview" : "รับชมวิดีโอแนะนำสถาบัน"}
                      </p>
                      <p className="text-sm font-bold text-white">
                        {isEn ? "Ultimate Success Partners" : "อัลติเมท ซัคเซส พาร์ทเนอร์"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Monthly Promoted Course / Campaigns */}
      {promotions.length > 0 && (
        <section className="py-12 bg-gold-50/50 border-b border-gold-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-gold-500/20 shadow-xl relative dark-premium-gradient">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="p-8 md:p-12 space-y-4">
                  <div className="inline-block bg-gold-500 text-primary text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded">
                    {isEn ? "Featured Monthly Promotion" : "โปรโมชันเด่นประจำเดือน"}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {isEn ? promotions[0].headlineEn : promotions[0].headlineTh}
                  </h2>
                  <div className="pt-4">
                    <Link
                      href={promotions[0].ctaLink}
                      className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-primary font-bold px-6 py-3 rounded-full text-xs tracking-wider uppercase transition-all shadow-md"
                    >
                      <span>{isEn ? promotions[0].ctaTextEn : promotions[0].ctaTextTh}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="h-64 md:h-full min-h-[300px] relative overflow-hidden">
                  <img
                    src={promotions[0].image}
                    alt="Promotion Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Courses Section */}
      <section className="py-20 bg-slate-950 border-t border-b border-gold-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {isEn ? "Featured Programs" : "หลักสูตรระดับสูงแนะนำ"}
            </h2>
            <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
            <p className="text-slate-400 font-light">
              {isEn
                ? "Invest in world-class management skills. Our practical systems guarantee direct business impacts."
                : "ลงทุนในทักษะการบริหารระดับโลก เพื่อเปลี่ยนแนวทางยุทธศาสตร์ของธุรกิจและขยายตัวอย่างมั่นคง"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-gold-500/10 shadow-xl flex flex-col premium-card-hover"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={isEn ? course.titleEn : course.titleTh}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/90 text-gold-500 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-500/20">
                    {course.courseType}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-gold-500 tracking-widest uppercase">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {isEn ? course.titleEn : course.titleTh}
                    </h3>
                    <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {isEn ? course.shortDescEn : course.shortDescTh}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {isEn ? "Tuition Fee" : "ค่าลงทะเบียนเรียน"}
                      </p>
                      <p className="text-lg font-bold text-white">
                        ฿{course.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="text-xs font-bold text-gold-500 hover:text-gold-650 flex items-center space-x-1"
                    >
                      <span>{isEn ? "Learn More" : "ดูข้อมูลเพิ่มเติม"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden dark-premium-gradient border-t border-b border-gold-500/10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl -ml-64 -mt-32"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isEn ? "What Our Partners Say" : "เสียงตอบรับจากพันธมิตรและนักศึกษา"}
            </h2>
            <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
            <p className="text-slate-350 font-light">
              {isEn
                ? "Hear directly from CEOs and business owners who have scaled their operations using our formulas."
                : "รับฟังความคิดเห็นจากเจ้าของธุรกิจและซีอีโอที่ขยายธุรกิจสำเร็จผ่านกรอบยุทธศาสตร์ของเรา"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_TESTIMONIALS.map((test, index) => (
              <div
                key={index}
                className="bg-slate-900/40 border border-gold-500/10 p-8 rounded-2xl space-y-6 backdrop-blur-md relative"
              >
                <div className="flex items-center space-x-1 text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <blockquote className="text-slate-300 italic font-light leading-relaxed">
                  "{isEn ? test.quoteEn : test.quoteTh}"
                </blockquote>

                <div className="flex items-center space-x-4">
                  <img
                    src={test.avatar}
                    alt={test.nameEn}
                    className="w-12 h-12 rounded-full object-cover border border-gold-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-white">{isEn ? test.nameEn : test.nameTh}</h4>
                    <p className="text-xs text-gold-500">{isEn ? test.roleEn : test.roleTh}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust & Metrics Banner */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-gold-500">500+</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                {isEn ? "CEOs Coached" : "ซีอีโอและผู้บริหารที่เข้าร่วม"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-gold-500">฿10B+</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                {isEn ? "Combined Revenue Scale" : "มูลค่าธุรกิจรวมที่ขยายตัว"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-gold-500">12+</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                {isEn ? "Core Programs" : "หลักสูตรเฉพาะทาง"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-gold-500">98%</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                {isEn ? "Satisfaction Rate" : "อัตราความพึงพอใจการโค้ช"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
