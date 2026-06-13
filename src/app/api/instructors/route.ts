import { NextResponse } from "next/server";
import { getInstructors, saveInstructor } from "../../../lib/instructors_store";
import { auth } from "../../../auth";

export async function GET() {
  try {
    const instructors = await getInstructors();
    return NextResponse.json(instructors);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { nameEn, nameTh, titleEn, titleTh, bioEn, bioTh, avatar, website, linkedin, roleType } = body;

    if (!nameEn || !nameTh || !titleEn || !titleTh || !bioEn || !bioTh) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newInstructor = await saveInstructor({
      nameEn,
      nameTh,
      titleEn,
      titleTh,
      bioEn,
      bioTh,
      avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      website: website || null,
      linkedin: linkedin || null,
      roleType: roleType || "COACH"
    });

    return NextResponse.json({ success: true, instructor: newInstructor });
  } catch (error) {
    console.error("Failed to create instructor:", error);
    return NextResponse.json({ error: "Failed to create instructor" }, { status: 500 });
  }
}
