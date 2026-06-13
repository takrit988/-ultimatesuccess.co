import { NextResponse } from "next/server";
import { saveInstructor, deleteInstructor } from "../../../../lib/instructors_store";
import { auth } from "../../../../auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nameEn, nameTh, titleEn, titleTh, bioEn, bioTh, avatar, website, linkedin, roleType } = body;

    if (!nameEn || !nameTh || !titleEn || !titleTh || !bioEn || !bioTh) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedInstructor = await saveInstructor({
      id,
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

    return NextResponse.json({ success: true, instructor: updatedInstructor });
  } catch (error) {
    console.error("Failed to update instructor:", error);
    return NextResponse.json({ error: "Failed to update instructor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    await deleteInstructor(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete instructor:", error);
    return NextResponse.json({ error: "Failed to delete instructor" }, { status: 500 });
  }
}
