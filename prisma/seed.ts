import { db as prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // 1. Create Super Admin User
  const passwordHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ultimatesuccess.co" },
    update: {},
    create: {
      email: "admin@ultimatesuccess.co",
      passwordHash,
      role: "SUPER_ADMIN",
      profile: {
        create: {
          company: "Ultimate Success Partners",
          position: "CEO",
          phone: "0812345678",
          bio: "Founder and Chief Mentor",
        },
      },
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // 2. Create Instructors
  const instructor1 = await prisma.instructor.create({
    data: {
      nameEn: "Dr. Walter Peterson",
      nameTh: "ดร. วอลเตอร์ พีเตอร์สัน",
      titleEn: "Executive Leadership Coach & Strategist",
      titleTh: "โค้ชและนักยุทธศาสตร์การนำทางผู้บริหาร",
      bioEn: "Over 20 years of experience coaching Fortune 500 CEOs and enterprise executives globally in scale-up strategy.",
      bioTh: "ประสบการณ์กว่า 20 ปีในการโค้ชซีอีโอ Fortune 500 และผู้บริหารองค์กรทั่วโลกในการวางกลยุทธ์การเติบโต",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      website: "https://ultimatesuccess.co",
      linkedin: "https://linkedin.com",
    },
  });

  const instructor2 = await prisma.instructor.create({
    data: {
      nameEn: "Coach Pitchaya S.",
      nameTh: "โค้ชพิชญะ เอส.",
      titleEn: "SME Scaling Specialist & Marketing Architect",
      titleTh: "ผู้เชี่ยวชาญการขยายขนาด SME และสถาปนิกการตลาด",
      bioEn: "Helping retail and services businesses scale through digital transformation and automated customer acquisition pipelines.",
      bioTh: "ช่วยธุรกิจค้าปลีกและบริการเติบโตอย่างมั่นคงผ่านการเปลี่ยนผ่านดิจิทัลและการตลาดอัตโนมัติ",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      website: "https://ultimatesuccess.co",
      linkedin: "https://linkedin.com",
    },
  });
  console.log("Created instructors.");

  // 3. Create Courses
  const course1 = await prisma.course.create({
    data: {
      slug: "executive-leadership-mastery",
      titleEn: "Executive Leadership Mastery (ELM)",
      titleTh: "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)",
      shortDescEn: "Learn to build high-performance executive teams and scale your enterprise strategically.",
      shortDescTh: "เรียนรู้วิธีการสร้างทีมผู้บริหารประสิทธิภาพสูงและขยายขนาดองค์กรของคุณอย่างมียุทธศาสตร์",
      descriptionEn: "This program is designed specifically for business owners, CEOs, and corporate executives who want to break through growth ceilings. Under the guidance of Dr. Walter Peterson, you will map out a 12-month scaling strategy and align your leadership team.",
      descriptionTh: "หลักสูตรนี้ออกแบบมาโดยเฉพาะสำหรับเจ้าของธุรกิจ ซีอีโอ และผู้บริหารองค์กรที่ต้องการก้าวข้ามขีดจำกัดการเติบโต ภายใต้การนำของ ดร. วอลเตอร์ พีเตอร์สัน คุณจะร่วมวางแผนกลยุทธ์การเติบโตแบบทวีคูณภายใน 12 เดือน",
      category: "Leadership",
      tags: ["Leadership", "Executive", "Strategy"],
      instructorId: instructor1.id,
      courseType: "HYBRID",
      status: "PUBLISHED",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-07-30"),
      price: 45000.0,
      thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
      gallery: [
        "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
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
      learningOutcomes: [
        "Formulate a scalable corporate strategy",
        "Develop executive communication and command",
        "Optimize operations and delegate effectively",
        "สร้างแผนกลยุทธ์ธุรกิจที่เติบโตได้",
        "พัฒนาการสื่อสารและสั่งการระดับผู้บริหาร",
      ],
    },
  });

  const course2 = await prisma.course.create({
    data: {
      slug: "sme-scaleup-blueprint",
      titleEn: "SME Scale-Up Blueprint",
      titleTh: "พิมพ์เขียวการขยายธุรกิจ SME",
      shortDescEn: "Systemize your sales, marketing, and operations to grow your business without burning out.",
      shortDescTh: "จัดระบบการขาย การตลาด และปฏิบัติการเพื่อขยายธุรกิจโดยไม่ต้องทำงานจนหมดไฟ",
      descriptionEn: "SME Scale-Up Blueprint provides practical templates, growth engines, and structural formulas to turn your small business into an automated, self-sustaining enterprise.",
      descriptionTh: "พิมพ์เขียวการขยายธุรกิจ SME มอบชุดเครื่องมือ เทมเพลต และโครงสร้างการทำงานจริงเพื่อช่วยเปลี่ยนธุรกิจขนาดเล็กของคุณเป็นระบบที่ขับเคลื่อนตัวเองได้อย่างสมบูรณ์",
      category: "Management",
      tags: ["SME", "Marketing", "Systems"],
      instructorId: instructor2.id,
      courseType: "ONLINE",
      status: "PUBLISHED",
      startDate: new Date("2026-08-15"),
      endDate: new Date("2026-09-15"),
      price: 19500.0,
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      gallery: [],
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
      learningOutcomes: [
        "Create standard operating procedures (SOPs)",
        "Build automated client acquisition pipelines",
        "Manage small teams using transparent KPIs",
        "จัดทำคู่มือ SOP ที่พร้อมใช้งาน",
        "สร้างช่องทางหาลูกค้าใหม่อัตโนมัติ",
      ],
    },
  });
  console.log("Created courses.");

  // 4. Create Blog Categories
  const cat1 = await prisma.blogCategory.create({
    data: { slug: "business-insights", nameEn: "Business Insights", nameTh: "วิเคราะห์ธุรกิจ" },
  });
  const cat2 = await prisma.blogCategory.create({
    data: { slug: "leadership-development", nameEn: "Leadership", nameTh: "พัฒนาผู้นำ" },
  });

  // 5. Create Blog Posts
  await prisma.blogPost.create({
    data: {
      slug: "5-keys-to-scaling-business-2026",
      titleEn: "5 Critical Keys to Scaling Your Business in 2026",
      titleTh: "5 กุญแจสำคัญในการขยายธุรกิจของคุณในปี 2026",
      contentEn: "Scaling a business requires shift from doing to leading. In this article, we outline the top 5 operational systems you must build: 1. Strategic Delegation, 2. Financial Buffers, 3. Automatic Acquisition pipelines, 4. Scalable Tech Stack, 5. High-trust corporate culture.",
      contentTh: "การขยายธุรกิจจำเป็นต้องเปลี่ยนผ่านจากการ 'ลงมือทำ' สู่การ 'นำทัพ' ในบทความนี้เราสรุป 5 ระบบปฏิบัติการที่คุณต้องสร้าง ได้แก่: 1. การกระจายงานเชิงกลยุทธ์, 2. การสร้างเงินทุนสำรอง, 3. ช่องทางจัดหาลูกค้าอัตโนมัติ, 4. เทคโนโลยีที่ยืดหยุ่น, 5. วัฒนธรรมองค์กรที่มีความเชื่อมั่นสูง",
      excerptEn: "Discover the core operational frameworks needed to scale business safely this year.",
      excerptTh: "ค้นพบโครงสร้างการปฏิบัติการหลักที่จำเป็นในการขยายธุรกิจของคุณอย่างมั่นคงในปีนี้",
      categoryId: cat1.id,
      tags: ["Scaleup", "Business", "Operational Excellence"],
      featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      status: "PUBLISHED",
      isFeatured: true,
      authorId: admin.id,
      seoTitleEn: "How to Scale Business in 2026 | Ultimate Success",
      seoTitleTh: "วิธีขยายขนาดธุรกิจปี 2026 | Ultimate Success",
    },
  });

  await prisma.blogPost.create({
    data: {
      slug: "executive-decision-making",
      titleEn: "The Art of Executive Decision Making Under Uncertainty",
      titleTh: "ศิลปะการตัดสินใจของผู้บริหารภายใต้ความไม่แน่นอน",
      contentEn: "Executive leadership faces high ambiguity. Learn how to implement mental models like inversion, second-order thinking, and probabilistic models to decrease error margin.",
      contentTh: "ผู้นำเผชิญความคลุมเครือสูง เรียนรู้วิธีการใช้โมเดลทางความคิด เช่น การมองย้อนกลับ (Inversion), การคิดสองชั้น (Second-order thinking) เพื่อลดโอกาสการผิดพลาดในระดับบริหาร",
      excerptEn: "Unlock decision mental models used by global executives.",
      excerptTh: "ปลดล็อกวิธีคิดการตัดสินใจระดับเดียวกับผู้บริหารระดับโลก",
      categoryId: cat2.id,
      tags: ["Leadership", "Management", "Mental Models"],
      featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      status: "PUBLISHED",
      isFeatured: false,
      authorId: admin.id,
    },
  });
  console.log("Created blog posts.");

  // 6. Create Promotion Banner
  await prisma.promotionBanner.create({
    data: {
      courseId: course1.id,
      headlineEn: "Ignite Your Growth with Executive Leadership Mastery",
      headlineTh: "ยกระดับภาวะผู้นำสู่ความสำเร็จขั้นสูงสุดกับ ELM",
      ctaTextEn: "Apply for Intake 2026",
      ctaTextTh: "สมัครเข้าเรียนรุ่นปี 2026",
      ctaLink: "/courses/executive-leadership-mastery",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
      priority: 1,
      status: "ACTIVE",
    },
  });
  console.log("Created promotion banners.");

  // 7. Create Subscriptions
  await prisma.subscription.create({
    data: {
      userId: admin.id,
      tier: "PLATINUM",
      status: "ACTIVE",
      expiresAt: new Date("2027-06-08"),
    },
  });
  console.log("Created admin subscription.");

  // 8. Create Enrollment
  await prisma.enrollment.create({
    data: {
      userId: admin.id,
      courseId: course1.id,
      status: "ACTIVE",
      pricePaid: 45000.0,
      paymentStatus: "PAID",
      paymentId: "ch_mock_12345",
    },
  });
  console.log("Created admin course enrollment.");

  // 9. Create Lesson Progress
  await prisma.lessonProgress.create({
    data: {
      userId: admin.id,
      courseId: course1.id,
      lessonId: "1.1 Establishing Corporate Alignment",
      isCompleted: true,
    },
  });
  console.log("Created admin lesson progress.");

  // 10. Create Ticket
  await prisma.ticket.create({
    data: {
      userId: admin.id,
      courseId: course1.id,
      ticketCode: "USP-ELM-9871A",
      status: "UNUSED",
    },
  });
  console.log("Created admin workshop ticket.");

  // 11. Create CRM Leads
  await prisma.crmLead.create({
    data: {
      name: "Mr. Somchai Dev",
      email: "somchai@techsme.com",
      position: "CEO",
      company: "TechSME Co., Ltd.",
      phone: "0891112222",
      status: "NEW",
      notes: ["Initial inquiry via contact form about SME Blueprint course."],
      assignedToId: admin.id,
    },
  });
  await prisma.crmLead.create({
    data: {
      name: "Ms. Sarah Jenkins",
      email: "sarah@corporateglobal.com",
      position: "VP of Operations",
      company: "GlobalCorp Group",
      phone: "0823334444",
      status: "QUALIFIED",
      notes: ["Expressed interest in executive coaching package.", "Sent corporate pricing document."],
      assignedToId: admin.id,
    },
  });
  await prisma.crmLead.create({
    data: {
      name: "Mr. Ananda Rakdee",
      email: "ananda@anandafoods.th",
      position: "Founder",
      company: "Ananda Organic Foods",
      phone: "0875556666",
      status: "WON",
      notes: ["Paid tuition fee for Executive Leadership course.", "Assigned to course onboarding."],
      assignedToId: admin.id,
    },
  });
  console.log("Created CRM leads.");

  // 12. Create Affiliate Profile
  await prisma.affiliateProfile.create({
    data: {
      userId: admin.id,
      referralCode: "USP-REF-ADMIN",
      totalSignups: 5,
      earnings: 14850.0,
      unpaidBalance: 2970.0,
      referralLinkHits: 152,
    },
  });
  console.log("Created affiliate profile.");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
