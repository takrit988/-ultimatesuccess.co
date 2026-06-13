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
      contentEn, contentTh, 
      excerptEn, excerptTh, 
      slug, categoryId, featuredImage, status, isFeatured 
    } = body;

    if (!titleEn || !titleTh || !slug || !contentEn || !contentTh || !categoryId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedPost = await db.blogPost.update({
      where: { id },
      data: {
        slug,
        titleEn,
        titleTh,
        contentEn,
        contentTh,
        excerptEn: excerptEn || "",
        excerptTh: excerptTh || "",
        categoryId,
        featuredImage: featuredImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        status,
        isFeatured: isFeatured || false
      }
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json({ error: error.message || "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    await db.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json({ error: error.message || "Failed to delete blog post" }, { status: 500 });
  }
}
