import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "../../../lib/db";
import { auth } from "../../../auth";
import { Calendar, User, ArrowLeft, Tag, Lock, ShieldAlert } from "lucide-react";
import Link from "next/link";

// Mock Fallbacks
const MOCK_POSTS_MAP: Record<string, any> = {
  "5-keys-to-scaling-business-2026": {
    slug: "5-keys-to-scaling-business-2026",
    titleEn: "5 Critical Keys to Scaling Your Business in 2026",
    titleTh: "5 กุญแจสำคัญในการขยายธุรกิจของคุณในปี 2026",
    contentEn: `Scaling a business is not just about increasing sales; it is about building systems that allow operations to grow without collapsing. Many founders hit a revenue ceiling because they fail to transition from doing to leading. Here are the 5 critical keys to scale successfully this year:\n\n1. **Strategic Delegation**: Move from bottleneck to supervisor. Document processes and trust your team.\n2. **Financial Reserves**: Keep 6 months of operating expenses in reserve to handle market volatility.\n3. **Automated Client Acquisition**: Design marketing flywheels that generate leads on autopilot rather than relying on manual referrals.\n4. **Scalable Tech Stack**: Use tools like modern CRMs, ERPs, and cloud databases (like PostgreSQL) to track customer paths.\n5. **High-trust Corporate Culture**: Retain top executives by aligning company values with individual growth targets.`,
    contentTh: `การขยายธุรกิจไม่ใช่เพียงแค่การเพิ่มยอดขาย แต่คือการสร้างระบบที่รองรับการเติบโตโดยไม่พังทลาย ผู้ก่อตั้งหลายรายเผชิญกับ 'เพดานรายได้' เพราะไม่สามารถเปลี่ยนผ่านบทบาทจากการ 'ลงมือทำเอง' ไปสู่การ 'นำทางองค์กร' ได้ นี่คือ 5 กุญแจสำคัญที่จะช่วยให้คุณขยายธุรกิจได้อย่างมีประสิทธิภาพในปีนี้:\n\n1. **การกระจายงานเชิงกลยุทธ์**: ย้ายตัวเองออกจากการเป็นคอขวดของทุกอย่าง จดบันทึกกระบวนการทำงานและส่งมอบความไว้วางใจให้ทีมงาน\n2. **เงินสำรองสภาพคล่อง**: สำรองเงินปฏิบัติการไว้อย่างน้อย 6 เดือน เพื่อจัดการความผันผวนของตลาด\n3. **ช่องทางหาลูกค้าใหม่อัตโนมัติ**: ออกแบบระบบการตลาดที่สามารถจัดหาผู้สนใจอย่างต่อเนื่องแทนการใช้ระบบบอกต่อแบบเก่า\n4. **โครงสร้างเทคโนโลยีที่ยืดหยุ่น**: เลือกใช้เครื่องมือไอทีที่ขยายขนาดได้ เช่น CRM, ERP และระบบคลาวด์ดาต้าเบส ในการติดตามข้อมูลลูกค้า\n5. **วัฒนธรรมองค์กรที่มีความเชื่อมั่นสูง**: รักษาผู้บริหารมือดีผ่านการปรับทิศทางเป้าหมายบริษัทให้สอดคล้องกับความก้าวหน้าส่วนตัวของพนักงาน`,
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    category: { nameEn: "Business Insights", nameTh: "วิเคราะห์ธุรกิจ" },
    createdAt: new Date("2026-05-10"),
    author: { email: "admin@ultimatesuccess.co" },
    tags: ["Scaleup", "Business", "Operational Excellence"],
  },
  "executive-decision-making": {
    slug: "executive-decision-making",
    titleEn: "The Art of Executive Decision Making Under Uncertainty",
    titleTh: "ศิลปะการตัดสินใจของผู้บริหารภายใต้ความไม่แน่นอน",
    contentEn: `Executive leadership faces high ambiguity. Learn how to implement mental models like inversion, second-order thinking, and probabilistic models to decrease error margin. Decisions must be made quickly with imperfect data. By systemizing your thinking, you build resilience and structural robustness into your enterprise.`,
    contentTh: `ผู้นำเผชิญความคลุมเครือสูง เรียนรู้วิธีการใช้โมเดลทางความคิด เช่น การมองย้อนกลับ (Inversion), การคิดสองชั้น (Second-order thinking) เพื่อลดโอกาสการผิดพลาดในระดับบริหาร การตัดสินใจต้องทำอย่างรวดเร็วภายใต้ข้อมูลที่ไม่สมบูรณ์ การปรับวิธีคิดเป็นระบบจะช่วยเพิ่มความยืดหยุ่นให้กับองค์กรของคุณ`,
    featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    category: { nameEn: "Leadership", nameTh: "พัฒนาผู้นำ" },
    createdAt: new Date("2026-05-28"),
    author: { email: "admin@ultimatesuccess.co" },
    tags: ["Leadership", "Management", "Mental Models"],
  },
};

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const isEnabled = await getFeatureToggle("blog");
  if (!isEnabled) {
    return (
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
        <FeatureDisabled moduleNameEn="Blog & Media Section" moduleNameTh="ส่วนบล็อกและบทความข่าวสาร" />
      </div>
    );
  }

  const session = await auth();
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";


  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let post = MOCK_POSTS_MAP[slug];
  let userTier = "FREE";

  // Check user membership status
  if (session) {
    try {
      const subscription = await db.subscription.findUnique({
        where: { userId: session.user.id },
      });
      if (subscription) {
        userTier = subscription.tier;
      }
    } catch (error) {
      console.warn("DB subscription lookup failed for blog page, bailing out to FREE tier.", error);
    }
  }

  try {
    const dbPost = await db.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
      },
    });

    if (dbPost) {
      post = {
        slug: dbPost.slug,
        titleEn: dbPost.titleEn,
        titleTh: dbPost.titleTh,
        contentEn: dbPost.contentEn,
        contentTh: dbPost.contentTh,
        featuredImage: dbPost.featuredImage,
        category: dbPost.category,
        createdAt: dbPost.createdAt,
        author: { email: dbPost.author.email },
        tags: dbPost.tags,
      };
    }
  } catch (error) {
    console.warn("Prisma fetch failed for BlogPostDetailPage, using fallbacks.", error);
  }

  if (!post) {
    notFound();
  }

  // Define access criteria: All blog posts are open for everyone to read
  const hasAccess = true;

  return (
    <article className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-12 md:py-16 dark-premium-gradient border-b border-gold-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-1 text-xs text-gold-500 hover:text-gold-600 transition-colors uppercase font-bold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isEn ? "Back to Media" : "ย้อนกลับหน้าบล็อก"}</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            {isEn ? post.titleEn : post.titleTh}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-2">
            <span className="bg-gold-500/10 border border-gold-500/30 text-gold-500 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              {isEn ? post.category.nameEn : post.category.nameTh}
            </span>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{post.author.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Post Image & Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="aspect-video w-full rounded-xl overflow-hidden">
            <img
              src={post.featuredImage}
              alt={isEn ? post.titleEn : post.titleTh}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gated Access Validation */}
          {hasAccess ? (
            /* Article Rich Text Content */
            <div className="prose max-w-none text-slate-700 leading-relaxed font-light text-sm sm:text-base whitespace-pre-line space-y-4">
              {isEn ? post.contentEn : post.contentTh}
            </div>
          ) : (
            /* Gated Lock Screen UI card */
            <div className="bg-slate-950 text-white rounded-2xl p-8 border border-gold-500/20 text-center space-y-6 dark-premium-gradient py-12">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-full inline-flex items-center justify-center text-gold-500">
                <Lock className="h-10 w-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold gold-text-gradient uppercase tracking-wider">
                  {isEn ? "Premium Partner Analysis" : "บทความระดับผู้บริหารพรีเมียม"}
                </h3>
                <p className="text-xs text-slate-350 leading-relaxed font-light">
                  {isEn
                    ? "This strategic scale-up analysis is reserved exclusively for Gold Executive and Platinum Leader members. Upgrade your tier to unlock."
                    : "บทวิเคราะห์กลยุทธ์การเติบโตนี้ สงวนสิทธิ์สำหรับสมาชิกระดับ Gold Executive และ Platinum Leader เท่านั้น สมัครสมาชิกเพื่อเข้าอ่านบทความ"}
                </p>
              </div>
              <Link
                href="/membership"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-primary font-extrabold px-8 py-3 rounded-full text-xs tracking-wider uppercase transition-all shadow-md"
              >
                {isEn ? "Upgrade Membership" : "สมัครสมาชิกระดับสูง"}
              </Link>
            </div>
          )}

          {/* Tags */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 items-center">
            <Tag className="h-4 w-4 text-slate-400" />
            {post.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-650 text-xs px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
