import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { TicketsClient } from "./TicketsClient";

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

export default async function AdminTicketsPage() {
  const isEnabled = await getFeatureToggle("tickets");
  if (!isEnabled) {
    return <FeatureDisabled moduleNameEn="Ticket Scanner" moduleNameTh="ระบบบัตรและตั๋วผ่านประตู" isAdminPage={true} />;
  }

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;
  const isAuthorized = ["SUPER_ADMIN", "ADMIN", "COURSE_MANAGER"].includes(role);
  if (!isAuthorized) {
    redirect("/");
  }


  return <TicketsClient />;
}
