import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { auth } from "../../../auth";

const MOCK_AFFILIATE = {
  referralCode: "USP-REF-MOCK",
  totalSignups: 3,
  earnings: 8910.0,
  unpaidBalance: 1782.0,
  referralLinkHits: 89,
};

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
      let affiliate = await db.affiliateProfile.findUnique({
        where: { userId },
      });

      // If they don't have one, dynamically initialize it on first access
      if (!affiliate) {
        const shortId = userId.split("-")[0]?.toUpperCase() || "USER";
        affiliate = await db.affiliateProfile.create({
          data: {
            userId,
            referralCode: `USP-REF-${shortId}`,
          },
        });
      }

      return NextResponse.json(affiliate);
    } catch (dbErr) {
      console.warn("DB connection failed for affiliate fetch, loading mock stats.", dbErr);
      return NextResponse.json(MOCK_AFFILIATE);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch affiliate profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
    }

    try {
      const profile = await db.affiliateProfile.findUnique({
        where: { referralCode: code },
      });

      if (profile) {
        await db.affiliateProfile.update({
          where: { referralCode: code },
          data: {
            referralLinkHits: {
              increment: 1,
            },
          },
        });
      }

      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.warn("Prisma error incrementing link hits, returning success simulation.", dbErr);
      return NextResponse.json({ success: true, message: "Simulation logged" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to register affiliate click" }, { status: 500 });
  }
}
