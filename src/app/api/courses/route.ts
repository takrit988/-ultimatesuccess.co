import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { auth } from "../../../auth";

export async function GET() {
  try {
    const courses = await db.course.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      titleEn, titleTh, 
      shortDescEn, shortDescTh, 
      descriptionEn, descriptionTh, 
      slug, category, courseType, status, 
      price, thumbnail, instructorId 
    } = body;

    if (!titleEn || !titleTh || !slug || !category || !courseType || !status || !price || !instructorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCourse = await db.course.create({
      data: {
        slug,
        titleEn,
        titleTh,
        shortDescEn: shortDescEn || "",
        shortDescTh: shortDescTh || "",
        descriptionEn: descriptionEn || "",
        descriptionTh: descriptionTh || "",
        category,
        courseType,
        status,
        price: parseFloat(price),
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
        instructorId,
        curriculum: [], 
        faq: [], 
        learningOutcomes: [],
        gallery: []
      }
    });

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error: any) {
    console.error("Failed to create course:", error);
    return NextResponse.json({ error: error.message || "Failed to create course" }, { status: 500 });
  }
}
