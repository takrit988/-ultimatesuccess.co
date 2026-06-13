import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { auth } from "../../../auth";

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
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
      contentEn, contentTh, 
      excerptEn, excerptTh, 
      slug, categoryId, featuredImage, status, isFeatured 
    } = body;

    if (!titleEn || !titleTh || !slug || !contentEn || !contentTh || !categoryId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPost = await db.blogPost.create({
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
        isFeatured: isFeatured || false,
        authorId: session.user.id
      }
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json({ error: error.message || "Failed to create blog post" }, { status: 500 });
  }
}
