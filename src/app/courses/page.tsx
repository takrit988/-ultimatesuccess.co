import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "../../lib/db";
import { Search, ArrowRight, Filter, BookOpen } from "lucide-react";

// Mock Fallbacks
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

import { getFeatureToggle } from "../../lib/features";
import { FeatureDisabled } from "../../components/layout/FeatureDisabled";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
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


  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "";
  const activeSearch = resolvedParams.search || "";

  let courses = MOCK_COURSES;

  try {
    const whereClause: any = {
      status: "PUBLISHED",
    };

    if (activeCategory) {
      whereClause.category = {
        equals: activeCategory,
        mode: "insensitive",
      };
    }

    if (activeSearch) {
      whereClause.OR = [
        { titleEn: { contains: activeSearch, mode: "insensitive" } },
        { titleTh: { contains: activeSearch, mode: "insensitive" } },
        { shortDescEn: { contains: activeSearch, mode: "insensitive" } },
        { shortDescTh: { contains: activeSearch, mode: "insensitive" } },
      ];
    }

    const dbCourses = await db.course.findMany({
      where: whereClause,
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
    } else if (activeCategory || activeSearch) {
      // If user filtered but nothing found, we don't return initial full list
      courses = [];
    }
  } catch (error) {
    console.warn("Prisma query failed on CoursesPage, rendering fallbacks.", error);
    // Apply filters to mock data locally in case database fails
    if (activeCategory) {
      courses = courses.filter((c) => c.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.titleEn.toLowerCase().includes(q) ||
          c.titleTh.toLowerCase().includes(q) ||
          c.shortDescEn.toLowerCase().includes(q) ||
          c.shortDescTh.toLowerCase().includes(q)
      );
    }
  }

  const categories = [
    { name: isEn ? "All" : "ทั้งหมด", val: "" },
    { name: isEn ? "Leadership" : "ภาวะผู้นำ", val: "Leadership" },
    { name: isEn ? "Management" : "การจัดการ", val: "Management" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 dark-premium-gradient border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isEn ? "Executive Course Catalog" : "คลังหลักสูตรระดับผู้บริหาร"}
          </h1>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          <p className="max-w-2xl mx-auto text-slate-300 font-light text-sm leading-relaxed">
            {isEn
              ? "Gain world-class scaling strategies, practical leadership models, and corporate operational standards."
              : "รับกลยุทธ์การขยายขนาดระดับโลก แบบจำลองผู้นำที่ใช้ได้จริง และมาตรฐานการปฏิบัติการขององค์กรชั้นนำ"}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Categories Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.val;
              return (
                <Link
                  key={cat.val}
                  href={`/courses?category=${cat.val}&search=${activeSearch}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                    isSelected
                      ? "bg-slate-950 text-gold-500 border border-slate-900"
                      : "bg-slate-800 text-slate-300 border border-transparent hover:bg-slate-700"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Search Form */}
          <form method="GET" action="/courses" className="flex items-center space-x-2 relative w-full md:max-w-xs">
            <input type="hidden" name="category" value={activeCategory} />
            <input
              type="text"
              name="search"
              placeholder={isEn ? "Search courses..." : "ค้นหาหลักสูตร..."}
              defaultValue={activeSearch}
              className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-full px-4 py-2.5 text-xs text-slate-800 pr-10"
            />
            <button type="submit" className="absolute right-3.5 top-3.5 text-slate-400 hover:text-gold-500 cursor-pointer">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? "No Courses Found" : "ไม่พบหลักสูตรที่ค้นหา"}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
              {isEn
                ? "Try adjusting your search keywords or clearing the category filters."
                : "กรุณาลองปรับคำสำคัญในการค้นหา หรือล้างตัวกรองหมวดหมู่และลองใหม่อีกครั้ง"}
            </p>
            <Link
              href="/courses"
              className="inline-block bg-slate-950 text-gold-500 font-semibold px-6 py-2.5 rounded-full text-xs"
            >
              {isEn ? "Clear All Filters" : "ล้างตัวกรองทั้งหมด"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col premium-card-hover"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={isEn ? course.titleEn : course.titleTh}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/90 text-gold-500 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-500/20">
                    {course.courseType}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-gold-600 tracking-widest uppercase">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                      {isEn ? course.titleEn : course.titleTh}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {isEn ? course.shortDescEn : course.shortDescTh}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {isEn ? "Tuition Fee" : "ค่าลงทะเบียนเรียน"}
                      </p>
                      <p className="text-lg font-bold text-slate-950">
                        ฿{course.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center space-x-1"
                    >
                      <span>{isEn ? "Learn More" : "ดูข้อมูลเพิ่มเติม"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
