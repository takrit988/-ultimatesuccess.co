import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../../lib/db";
import { updateFeatureToggle, DEFAULT_FEATURES, initializeFeaturesIfNeeded } from "../../../../lib/features";

// Helper to check authorization
async function checkAdminAuth() {
  const session = await auth();
  if (!session) {
    return { authorized: false, status: 419, message: "Unauthenticated" };
  }
  const role = session.user.role;
  const isAuthorized = ["SUPER_ADMIN", "ADMIN"].includes(role); // Only full admins can toggle features
  if (!isAuthorized) {
    return { authorized: false, status: 403, message: "Forbidden" };
  }
  return { authorized: true };
}

export async function GET() {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, error: authCheck.message }, { status: authCheck.status });
  }

  try {
    await initializeFeaturesIfNeeded();
    const toggles = await db.featureToggle.findMany({
      orderBy: { key: "asc" }
    });
    
    // Merge database toggles with defaults in case some are not in DB
    const list = DEFAULT_FEATURES.map(def => {
      const match = toggles.find(t => t.key === def.key);
      return {
        key: def.key,
        nameEn: def.nameEn,
        nameTh: def.nameTh,
        isEnabled: match ? match.isEnabled : true
      };
    });

    return NextResponse.json({ success: true, features: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch feature toggles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return NextResponse.json({ success: false, error: authCheck.message }, { status: authCheck.status });
  }

  try {
    const body = await req.json();
    const { key, isEnabled } = body;

    if (!key || typeof isEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid payload. 'key' and 'isEnabled' (boolean) are required." },
        { status: 400 }
      );
    }

    const updated = await updateFeatureToggle(key, isEnabled);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update feature toggle" },
      { status: 500 }
    );
  }
}
