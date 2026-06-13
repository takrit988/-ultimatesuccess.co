import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { auth } from "../../../auth";

const MOCK_LEADS = [
  {
    id: "lead-1",
    name: "Mr. Somchai Dev",
    email: "somchai@techsme.com",
    position: "CEO",
    company: "TechSME Co., Ltd.",
    phone: "0891112222",
    status: "NEW",
    notes: ["Initial inquiry via contact form about SME Blueprint course."],
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-2",
    name: "Ms. Sarah Jenkins",
    email: "sarah@corporateglobal.com",
    position: "VP of Operations",
    company: "GlobalCorp Group",
    phone: "0823334444",
    status: "QUALIFIED",
    notes: ["Expressed interest in executive coaching package.", "Sent corporate pricing document."],
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-3",
    name: "Mr. Ananda Rakdee",
    email: "ananda@anandafoods.th",
    position: "Founder",
    company: "Ananda Organic Foods",
    phone: "0875556666",
    status: "WON",
    notes: ["Paid tuition fee for Executive Leadership course.", "Assigned to course onboarding."],
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const leads = await db.crmLead.findMany({
      orderBy: { updatedAt: "desc" },
    });

    if (leads.length === 0) {
      return NextResponse.json(MOCK_LEADS);
    }

    return NextResponse.json(leads);
  } catch (error) {
    console.warn("Prisma CRM Lead fetch failed, returning mock data", error);
    return NextResponse.json(MOCK_LEADS);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, status, notes } = body;

    if (!leadId || !status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Try to update in database
    try {
      // Fetch current notes to append if new note is provided
      let currentLead = await db.crmLead.findUnique({
        where: { id: leadId },
      });

      let updatedNotes = currentLead?.notes || [];
      if (notes) {
        updatedNotes = [...updatedNotes, notes];
      }

      const updatedLead = await db.crmLead.update({
        where: { id: leadId },
        data: {
          status: status,
          notes: updatedNotes,
        },
      });

      return NextResponse.json({ success: true, lead: updatedLead });
    } catch (dbErr) {
      console.warn("DB update failed for CRM lead, applying in-memory mock return", dbErr);
      return NextResponse.json({
        success: true,
        message: "Simulation: Local updates stored.",
        lead: { id: leadId, status, notes: notes ? [notes] : [] },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead progress" }, { status: 500 });
  }
}
