import React from "react";
import { cookies } from "next/headers";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { CrmClient } from "./CrmClient";

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
    createdAt: new Date(),
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
    createdAt: new Date(),
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
    createdAt: new Date(),
  },
];

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

export default async function AdminCrmPage() {
  const isEnabled = await getFeatureToggle("crm");
  if (!isEnabled) {
    return <FeatureDisabled moduleNameEn="CRM Pipelines" moduleNameTh="ระบบบริหารงานขาย (CRM)" isAdminPage={true} />;
  }

  const session = await auth();

  // Route security: Admins only
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";


  let leads: any[] = MOCK_LEADS;

  try {
    const dbLeads = await db.crmLead.findMany({
      orderBy: { updatedAt: "desc" },
    });
    if (dbLeads.length > 0) {
      leads = dbLeads;
    }
  } catch (error) {
    console.warn("Failed to fetch CRM leads from Prisma, falling back to mocks.", error);
  }

  return (
    <CrmClient
      initialLeads={JSON.parse(JSON.stringify(leads))}
      isEn={isEn}
    />
  );
}
