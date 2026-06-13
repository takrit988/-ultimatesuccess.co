import { NextResponse } from "next/server";
import { getAllFeatureToggles } from "../../../lib/features";

export async function GET() {
  try {
    const features = await getAllFeatureToggles();
    return NextResponse.json({ success: true, features });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load features" },
      { status: 500 }
    );
  }
}
