import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { MembershipTier } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, tier } = body;

    if (!userId || !tier) {
      return NextResponse.json(
        { error: "UserId and membership tier are required fields" },
        { status: 400 }
      );
    }

    const membershipTier = tier as MembershipTier;

    // Calculate annual expiration date
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Upsert subscription plan
    await db.subscription.upsert({
      where: { userId },
      update: {
        tier: membershipTier,
        status: "ACTIVE",
        expiresAt,
      },
      create: {
        userId,
        tier: membershipTier,
        status: "ACTIVE",
        expiresAt,
      },
    });

    return NextResponse.json(
      { message: "Subscription processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing subscription" },
      { status: 500 }
    );
  }
}
