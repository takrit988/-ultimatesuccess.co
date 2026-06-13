import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { auth } from "../../../../auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
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

    const updatedCourse = await db.course.update({
      where: { id },
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
        instructorId
      }
    });

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error: any) {
    console.error("Failed to update course:", error);
    return NextResponse.json({ error: error.message || "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    await db.course.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete course:", error);
    return NextResponse.json({ error: error.message || "Failed to delete course" }, { status: 500 });
  }
}
