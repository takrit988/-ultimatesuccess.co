import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, courseId, lessonId, isCompleted } = body;

    if (!userId || !courseId || !lessonId) {
      return NextResponse.json(
        { error: "UserId, courseId, and lessonId are required fields" },
        { status: 400 }
      );
    }

    // Upsert the lesson completion progress state
    await db.lessonProgress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId,
          courseId,
          lessonId,
        },
      },
      update: {
        isCompleted: !!isCompleted,
      },
      create: {
        userId,
        courseId,
        lessonId,
        isCompleted: !!isCompleted,
      },
    });

    return NextResponse.json(
      { message: "Progress updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("LMS progress API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating progress" },
      { status: 500 }
    );
  }
}
