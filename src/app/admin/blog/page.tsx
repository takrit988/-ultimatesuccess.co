import React from "react";
import { db } from "../../../lib/db";
import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";
import BlogClient from "./BlogClient";

// Mock Fallbacks
const MOCK_CATEGORIES = [
  { id: "cat-1", slug: "business-insights", nameEn: "Business Insights", nameTh: "วิเคราะห์ธุรกิจ" },
  { id: "cat-2", slug: "leadership", nameEn: "Leadership", nameTh: "พัฒนาผู้นำ" },
];

const MOCK_POSTS = [
  {
    id: "post-1",
    slug: "5-keys-to-scaling-business-2026",
    titleEn: "5 Critical Keys to Scaling Your Business in 2026",
    titleTh: "5 กุญแจสำคัญในการขยายธุรกิจของคุณในปี 2026",
    contentEn: "Scaling a business requires shift from doing to leading. In this article, we outline the top 5 operational systems you must build: 1. Strategic Delegation, 2. Financial Buffers, 3. Automatic Acquisition pipelines, 4. Scalable Tech Stack, 5. High-trust corporate culture.",
    contentTh: "การขยายธุรกิจจำเป็นต้องเปลี่ยนผ่านจากการ 'ลงมือทำ' สู่การ 'นำทัพ' ในบทความนี้เราสรุป 5 ระบบปฏิบัติการที่คุณต้องสร้าง ได้แก่: 1. การกระจายงานเชิงกลยุทธ์, 2. การสร้างเงินทุนสำรอง, 3. ช่องทางจัดหาลูกค้าอัตโนมัติ, 4. เทคโนโลยีที่ยืดหยุ่น, 5. วัฒนธรรมองค์กรที่มีความเชื่อมั่นสูง",
    excerptEn: "Discover the core operational frameworks needed to scale business safely this year.",
    excerptTh: "ค้นพบโครงสร้างการปฏิบัติการหลักที่จำเป็นในการขยายธุรกิจของคุณอย่างมั่นคงในปีนี้",
    categoryId: "cat-1",
    category: { nameEn: "Business Insights", nameTh: "วิเคราะห์ธุรกิจ" },
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    status: "PUBLISHED",
    isFeatured: true,
    createdAt: new Date("2026-05-10"),
  },
  {
    id: "post-2",
    slug: "executive-decision-making",
    titleEn: "The Art of Executive Decision Making Under Uncertainty",
    titleTh: "ศิลปะการตัดสินใจของผู้บริหารภายใต้ความไม่แน่นอน",
    contentEn: "Executive leadership faces high ambiguity. Learn how to implement mental models like inversion, second-order thinking, and probabilistic models to decrease error margin.",
    contentTh: "ผู้นำเผชิญความคลุมเครือสูง เรียนรู้วิธีการใช้โมเดลทางความคิด เช่น การมองย้อนกลับ (Inversion), การคิดสองชั้น (Second-order thinking) เพื่อลดโอกาสการผิดพลาดในระดับบริหาร",
    excerptEn: "Unlock decision mental models used by global executives.",
    excerptTh: "ปลดล็อกวิธีคิดการตัดสินใจระดับเดียวกับผู้บริหารระดับโลก",
    categoryId: "cat-2",
    category: { nameEn: "Leadership", nameTh: "พัฒนาผู้นำ" },
    featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    status: "PUBLISHED",
    isFeatured: false,
    createdAt: new Date("2026-05-28"),
  },
];

export default async function AdminBlogPage() {
  const isEnabled = await getFeatureToggle("blog");
  if (!isEnabled) {
    return <FeatureDisabled moduleNameEn="Blog & Media Section" moduleNameTh="ระบบบล็อกและสื่อ" isAdminPage={true} />;
  }

  let posts: any[] = MOCK_POSTS;
  let categories: any[] = MOCK_CATEGORIES;

  try {
    // 1. Fetch live categories
    const dbCategories = await db.blogCategory.findMany({
      orderBy: { nameEn: "asc" },
    });
    if (dbCategories.length > 0) {
      categories = dbCategories.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        nameEn: c.nameEn,
        nameTh: c.nameTh,
      }));
    }

    // 2. Fetch live blog posts
    const dbPosts = await db.blogPost.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbPosts.length > 0) {
      posts = dbPosts.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        titleEn: p.titleEn,
        titleTh: p.titleTh,
        contentEn: p.contentEn,
        contentTh: p.contentTh,
        excerptEn: p.excerptEn || "",
        excerptTh: p.excerptTh || "",
        categoryId: p.categoryId,
        category: {
          nameEn: p.category.nameEn,
          nameTh: p.category.nameTh,
        },
        featuredImage: p.featuredImage,
        status: p.status,
        isFeatured: p.isFeatured,
        createdAt: p.createdAt,
      }));
    }
  } catch (error) {
    console.warn("Prisma blog posts fetch failed in AdminBlogPage, using fallbacks.", error);
  }

  return (
    <BlogClient 
      initialPosts={posts} 
      categories={categories} 
    />
  );
}
