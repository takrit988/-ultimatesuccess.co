import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "../../lib/db";
import { Calendar, User, ArrowRight, MessageSquare, BookOpen } from "lucide-react";

// Mock Fallbacks
const MOCK_POSTS = [
  {
    id: "post-1",
    slug: "5-keys-to-scaling-business-2026",
    titleEn: "5 Critical Keys to Scaling Your Business in 2026",
    titleTh: "5 กุญแจสำคัญในการขยายธุรกิจของคุณในปี 2026",
    excerptEn: "Discover the core operational frameworks needed to scale business safely this year.",
    excerptTh: "ค้นพบโครงสร้างการปฏิบัติการหลักที่จำเป็นในการขยายธุรกิจของคุณอย่างมั่นคงในปีนี้",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    category: { slug: "business-insights", nameEn: "Business Insights", nameTh: "วิเคราะห์ธุรกิจ" },
    isFeatured: true,
    createdAt: new Date("2026-05-10"),
    author: { email: "admin@ultimatesuccess.co" },
  },
  {
    id: "post-2",
    slug: "executive-decision-making",
    titleEn: "The Art of Executive Decision Making Under Uncertainty",
    titleTh: "ศิลปะการตัดสินใจของผู้บริหารภายใต้ความไม่แน่นอน",
    excerptEn: "Unlock decision mental models used by global executives.",
    excerptTh: "ปลดล็อกวิธีคิดการตัดสินใจระดับเดียวกับผู้บริหารระดับโลก",
    featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    category: { slug: "leadership-development", nameEn: "Leadership", nameTh: "พัฒนาผู้นำ" },
    isFeatured: false,
    createdAt: new Date("2026-05-28"),
    author: { email: "admin@ultimatesuccess.co" },
  },
];

import { getFeatureToggle } from "../../lib/features";
import { FeatureDisabled } from "../../components/layout/FeatureDisabled";

interface PageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const isEnabled = await getFeatureToggle("blog");
  if (!isEnabled) {
    return (
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
        <FeatureDisabled moduleNameEn="Blog & Media Section" moduleNameTh="ส่วนบล็อกและบทความข่าวสาร" />
      </div>
    );
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";


  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "";

  let posts = MOCK_POSTS;

  try {
    const whereClause: any = {
      status: "PUBLISHED",
    };

    if (activeCategory) {
      whereClause.category = {
        slug: activeCategory,
      };
    }

    const dbPosts = await db.blogPost.findMany({
      where: whereClause,
      include: {
        category: true,
        author: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbPosts.length > 0) {
      posts = dbPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        titleEn: p.titleEn,
        titleTh: p.titleTh,
        excerptEn: p.excerptEn || "",
        excerptTh: p.excerptTh || "",
        featuredImage: p.featuredImage,
        category: p.category,
        isFeatured: p.isFeatured,
        createdAt: p.createdAt,
        author: { email: p.author.email },
      }));
    } else if (activeCategory) {
      posts = [];
    }
  } catch (error) {
    console.warn("Prisma fetch failed for BlogPage, rendering fallbacks.", error);
    if (activeCategory) {
      posts = posts.filter((p) => p.category.slug === activeCategory);
    }
  }

  // Find Featured Post
  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const regularPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  const categories = [
    { name: isEn ? "All" : "ทั้งหมด", slug: "" },
    { name: isEn ? "Business Insights" : "วิเคราะห์ธุรกิจ", slug: "business-insights" },
    { name: isEn ? "Leadership" : "พัฒนาผู้นำ", slug: "leadership-development" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 dark-premium-gradient border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isEn ? "Ultimate Success Insights" : "บทความและวิเคราะห์ธุรกิจ"}
          </h1>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          <p className="max-w-2xl mx-auto text-slate-300 font-light text-sm leading-relaxed">
            {isEn
              ? "Intellectual resources, scaling blueprints, and leadership guides curated for modern executives."
              : "แหล่งข้อมูลทางปัญญา พิมพ์เขียวการขยายธุรกิจ และแนวทางการนำทางผู้บริหารที่คัดสรรมาเป็นพิเศษ"}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
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
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Featured Post Banner */}
        {featuredPost && !activeCategory && (
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative grid grid-cols-1 lg:grid-cols-12 gap-0 group">
            <div className="lg:col-span-7 h-64 sm:h-96 relative overflow-hidden">
              <img
                src={featuredPost.featuredImage}
                alt={isEn ? featuredPost.titleEn : featuredPost.titleTh}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-101"
              />
            </div>
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-gold-600 tracking-widest uppercase bg-gold-50 border border-gold-200/50 px-2.5 py-1 rounded-full">
                  {isEn ? featuredPost.category.nameEn : featuredPost.category.nameTh}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
                  {isEn ? featuredPost.titleEn : featuredPost.titleTh}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed font-light line-clamp-3">
                  {isEn ? featuredPost.excerptEn : featuredPost.excerptTh}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-3 text-xs text-slate-450">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="text-xs font-bold text-slate-950 hover:text-gold-600 flex items-center space-x-1"
                >
                  <span>{isEn ? "Read Article" : "อ่านบทความ"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {isEn ? "No Articles Found" : "ไม่พบการวิเคราะห์บทความ"}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              {isEn
                ? "Try clearing filters to see our full article backlog."
                : "กรุณาลองล้างตัวกรองหมวดหมู่เพื่อดูบทความทั้งหมด"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col premium-card-hover"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={isEn ? post.titleEn : post.titleTh}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/90 text-gold-500 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold-500/20">
                    {isEn ? post.category.nameEn : post.category.nameTh}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                      {isEn ? post.titleEn : post.titleTh}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {isEn ? post.excerptEn : post.excerptTh}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center space-x-1"
                    >
                      <span>{isEn ? "Read" : "อ่านต่อ"}</span>
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
