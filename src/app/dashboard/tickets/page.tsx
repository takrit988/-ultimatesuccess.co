import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { Ticket, Calendar, MapPin, Printer, Shield, BookOpen, Award, Check } from "lucide-react";

// Mock Fallbacks
const MOCK_TICKETS = [
  {
    id: "ticket-1",
    ticketCode: "USP-ELM-9871A",
    status: "UNUSED",
    checkedInAt: null,
    course: {
      titleEn: "Executive Leadership Mastery (ELM)",
      titleTh: "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)",
      startDate: new Date("2026-07-01"),
      courseType: "HYBRID",
    },
  },
];

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

export default async function MemberTicketsPage() {
  const isEnabled = await getFeatureToggle("tickets");
  if (!isEnabled) {
    return (
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
        <FeatureDisabled moduleNameEn="Ticket Scanner & Passes" moduleNameTh="ระบบบัตรและตั๋วผ่านประตู" />
      </div>
    );
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";

  const session = await auth();


  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  let tickets: any[] = MOCK_TICKETS;
  let membershipTier = "PLATINUM";

  try {
    // 1. Fetch User Subscription
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });
    if (subscription) {
      membershipTier = subscription.tier;
    } else {
      membershipTier = "FREE";
    }

    // 2. Fetch Tickets
    const dbTickets = await db.ticket.findMany({
      where: { userId },
      include: { course: true },
    });

    if (dbTickets.length > 0) {
      tickets = dbTickets;
    }
  } catch (error) {
    console.warn("Prisma fetch failed for MemberTicketsPage, using fallbacks.", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Dashboard Nav links */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl border border-gold-500/10 p-6 dark-premium-gradient shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-gold-500">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Partner</p>
                <p className="text-xs font-bold truncate max-w-[150px]">{userEmail}</p>
              </div>
            </div>
            <hr className="border-slate-800" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Membership Tier:</span>
              <span className="font-extrabold gold-text-gradient tracking-wide uppercase">
                {membershipTier}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-650 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <BookOpen className="h-4 w-4 text-gold-500" />
              <span>My Courses</span>
            </Link>
            <Link
              href="/dashboard/tickets"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-50 text-gold-600 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Ticket className="h-4 w-4 text-gold-500" />
              <span>Workshop Tickets</span>
            </Link>
            <Link
              href="/membership"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-650 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Award className="h-4 w-4 text-gold-500" />
              <span>Billing Membership</span>
            </Link>
          </div>
        </div>

        {/* Right Side Main Content Panel */}
        <div className="lg:col-span-9 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">Workshop & Event Tickets</h1>
            <p className="text-xs text-slate-500 font-light">
              Print or showcase these check-in passes to the registration desk at our onsite workshops in Bangkok.
            </p>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-4">
              <Ticket className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">
                {isEn ? "No Workshop Passes" : "ไม่มีบัตรเข้าร่วมเวิร์กช็อป"}
              </h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                {isEn
                  ? "You have not registered for any onsite or hybrid courses that require physical admission passes."
                  : "คุณยังไม่ได้ลงทะเบียนเรียนในหลักสูตร Onsite หรือ Hybrid ใดๆ ที่ต้องใช้บัตรเข้าเรียน"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  {/* Pass Header */}
                  <div className="p-6 bg-slate-950 text-white dark-premium-gradient border-b border-gold-500/10 space-y-3">
                    <span className="bg-gold-500 text-primary text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-widest">
                      {isEn ? "Onsite Pass" : "บัตรเข้างาน Onsite"}
                    </span>
                    <h3 className="text-sm font-bold leading-snug line-clamp-1">
                      {isEn ? t.course.titleEn : t.course.titleTh}
                    </h3>
                    <div className="flex items-center space-x-4 text-[10px] text-slate-350 font-light">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gold-500 shrink-0" />
                        <span>{new Date(t.course.startDate).toLocaleDateString(isEn ? "en-US" : "th-TH")}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gold-500 shrink-0" />
                        <span>{isEn ? "Bangkok, TH" : "กรุงเทพฯ, ไทย"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Pass Body (Print Barcode mockup) */}
                  <div className="p-6 bg-slate-50 flex flex-col items-center space-y-4">
                    {/* Simulated CSS barcode */}
                    <div className="w-full max-w-[200px] h-12 flex items-center justify-between border-l-2 border-r-2 border-slate-800 px-1 bg-white border border-slate-200">
                      <div className="h-full w-1.5 bg-slate-900 mr-0.5"></div>
                      <div className="h-full w-0.5 bg-slate-900 mr-1"></div>
                      <div className="h-full w-2.5 bg-slate-900 mr-0.5"></div>
                      <div className="h-full w-0.5 bg-slate-900 mr-1.5"></div>
                      <div className="h-full w-1.5 bg-slate-900 mr-0.5"></div>
                      <div className="h-full w-0.5 bg-slate-900 mr-0.5"></div>
                      <div className="h-full w-2.5 bg-slate-900 mr-1"></div>
                      <div className="h-full w-1 bg-slate-900"></div>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-xs font-bold tracking-widest text-slate-800 font-mono">{t.ticketCode}</p>
                      <div className="flex items-center justify-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            t.status === "UNUSED" ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                        ></span>
                        <span className="text-[10px] uppercase font-bold text-slate-450">
                          {t.status === "UNUSED"
                            ? (isEn ? "Status: Unused Pass" : "สถานะ: บัตรยังไม่ได้ใช้")
                            : (isEn ? "Status: Checked In" : "สถานะ: เช็คอินแล้ว")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pass Footer */}
                  <div className="p-4 border-t border-slate-150 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>USP Admission System</span>
                    <button className="flex items-center space-x-1 hover:text-gold-500 cursor-not-allowed">
                      <Printer className="h-3.5 w-3.5" />
                      <span>{isEn ? "Print Ticket" : "พิมพ์บัตร"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
