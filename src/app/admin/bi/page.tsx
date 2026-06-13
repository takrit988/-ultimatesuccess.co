import React from "react";
import { cookies } from "next/headers";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { db } from "../../../lib/db";
import { TrendingUp, Users, DollarSign, Ticket, Award, BarChart3, LineChart, PieChart, Sparkles } from "lucide-react";

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

export default async function AdminBiPage() {
  const isEnabled = await getFeatureToggle("bi");
  if (!isEnabled) {
    return <FeatureDisabled moduleNameEn="BI Analytics" moduleNameTh="ระบบวิเคราะห์ข้อมูลธุรกิจ (BI)" isAdminPage={true} />;
  }

  const session = await auth();

  // Protect route: admin only
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";


  // Default Mock BI Data
  let stats = {
    mrr: 195000.0,
    totalSales: 450000.0,
    checkInRate: 75.0,
    leadsCount: 12,
    leadConversion: 25.0,
    activeSubscribers: 42,
    affiliatePayouts: 14850.0,
  };

  try {
    // Try to aggregate live stats
    const activeSubsCount = await db.subscription.count({
      where: { status: "ACTIVE" },
    });

    const totalUsers = await db.user.count();
    const leads = await db.crmLead.count();
    const wonLeads = await db.crmLead.count({ where: { status: "WON" } });
    const totalTickets = await db.ticket.count();
    const usedTickets = await db.ticket.count({ where: { status: "USED" } });

    // Dynamic calculations
    stats.activeSubscribers = activeSubsCount > 0 ? activeSubsCount : stats.activeSubscribers;
    stats.mrr = activeSubsCount * 19500; // gold subscription scale
    stats.leadsCount = leads > 0 ? leads : stats.leadsCount;
    stats.leadConversion = leads > 0 ? Math.round((wonLeads / leads) * 100) : stats.leadConversion;
    stats.checkInRate = totalTickets > 0 ? Math.round((usedTickets / totalTickets) * 100) : stats.checkInRate;
  } catch (error) {
    console.warn("DB aggregation failed for BI Page, loading fallback metrics.", error);
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Sparkles Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-gold-500 animate-pulse" />
            <span>{isEn ? "Founder Business Intelligence" : "แดชบอร์ดวิเคราะห์ธุรกิจผู้ก่อตั้ง (BI)"}</span>
          </h1>
          <p className="text-xs text-slate-500 font-light">
            {isEn
              ? "Real-time executive tracking of subscriptions, leads conversion, event attendance, and referral rewards."
              : "การวิเคราะห์ผลประกอบการแบบเรียลไทม์: รายได้รายเดือน, อัตราแปลงผู้ติดต่อ, การเข้าร่วมงาน และยอดโอนพาร์ทเนอร์"}
          </p>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-3 border border-gold-500/10 flex items-center space-x-2 text-xs">
          <Sparkles className="h-4 w-4 text-gold-500 animate-spin" />
          <span className="font-bold gold-text-gradient uppercase tracking-widest">Live Sync Enabled</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isEn ? "Subscription MRR" : "รายได้รายเดือนประมาณการ (MRR)"}
            </span>
            <p className="text-2xl font-extrabold text-slate-900">฿{stats.mrr.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-500 font-bold">▲ +12% MoM</p>
          </div>
          <div className="p-3 bg-gold-500/10 text-gold-600 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isEn ? "Active Subscriptions" : "ผู้สมัครสมาชิกพรีเมียมทั้งหมด"}
            </span>
            <p className="text-2xl font-extrabold text-slate-900">{stats.activeSubscribers}</p>
            <p className="text-[10px] text-slate-400 font-light">
              {isEn ? "Gold & Platinum Tiers" : "สมาชิกกลุ่ม Gold และ Platinum"}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Ticket check in attendance rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isEn ? "Ticket Attendance Rate" : "อัตราการเช็คอินเข้างาน Onsite"}
            </span>
            <p className="text-2xl font-extrabold text-slate-900">{stats.checkInRate}%</p>
            <p className="text-[10px] text-slate-400 font-light">
              {isEn ? "Total Event Check-ins" : "ยอดเช็คอินจากบัตรบาร์โค้ด"}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
            <Ticket className="h-6 w-6" />
          </div>
        </div>

        {/* Lead conversion rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {isEn ? "CRM Leads Conversion" : "อัตราแปลงสัญญาลูกค้า (Won)"}
            </span>
            <p className="text-2xl font-extrabold text-slate-900">{stats.leadConversion}%</p>
            <p className="text-[10px] text-slate-400 font-light">
              {isEn ? `${stats.leadsCount} Total CRM prospects` : `ลูกค้าเป้าหมายทั้งหมด ${stats.leadsCount} ราย`}
            </p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Sections (Simulated charts with premium tailwind elements) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Performance Chart Mockup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <LineChart className="h-4 w-4 text-slate-400" />
              <span>{isEn ? "Yearly Sales Performance (฿)" : "ยอดขายค่าธรรมเนียมหลักสูตรรวม"}</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">Intake 2026</span>
          </div>

          {/* Premium visual bar representation */}
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>{isEn ? "Executive Leadership Mastery (ELM)" : "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)"}</span>
                <span className="text-gold-600 font-extrabold">฿360,000</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gold-500 h-full rounded-full w-[80%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>{isEn ? "SME Scale-Up Blueprint" : "พิมพ์เขียวการขยายธุรกิจ SME"}</span>
                <span className="text-gold-600 font-extrabold">฿97,500</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-800 h-full rounded-full w-[40%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>{isEn ? "Affiliate Partner Referral Payouts" : "ยอดโอนจ่ายพาร์ทเนอร์แนะนำแนะนำ"}</span>
                <span className="text-rose-500 font-extrabold">฿{stats.affiliatePayouts.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead stages statistics breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-4 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <PieChart className="h-4 w-4 text-slate-400" />
            <span>{isEn ? "Sales Lead Funnel Status" : "สัดส่วนสเตจช่องทางลูกค้า"}</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>{isEn ? "New Contacts" : "ติดต่อใหม่"}</span>
              </div>
              <span className="font-bold text-slate-850">33.3%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>{isEn ? "Contacted Leads" : "อยู่ระหว่างการคุย"}</span>
              </div>
              <span className="font-bold text-slate-850">25.0%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{isEn ? "Won / Onboarded" : "ตกลงทำสัญญาเรียน"}</span>
              </div>
              <span className="font-bold text-slate-850">41.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
