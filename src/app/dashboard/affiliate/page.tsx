"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Ticket, Award, Shield, Sparkles, Copy, Check, Users, DollarSign, MousePointerClick } from "lucide-react";

import FeatureDisabled from "../../../components/layout/FeatureDisabled";

export default function AffiliatePage() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [session, setSession] = useState<any>(null);
  const [affiliate, setAffiliate] = useState<any>({
    referralCode: "USP-REF-LOADING",
    totalSignups: 0,
    earnings: 0,
    unpaidBalance: 0,
    referralLinkHits: 0,
  });
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState("en");
  const isEn = lang === "en";

  useEffect(() => {
    // Check feature toggle
    fetch("/api/features")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.features) {
          setIsEnabled(data.features.affiliate !== false);
        } else {
          setIsEnabled(true);
        }
      })
      .catch(() => setIsEnabled(true));

    // Get language preference from cookies
    const match = document.cookie.match(new RegExp("(^| )lang=([^;]+)"));
    if (match) {
      setLang(match[2] || "en");
    }

    // Fetch auth session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setSession(data);
        } else {
          // If no session, redirect to login
          window.location.href = "/login";
        }
      })
      .catch((err) => console.error(err));

    // Fetch affiliate profile
    fetch("/api/affiliate")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setAffiliate(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (isEnabled === false) {
    return (
      <div className="pt-28 pb-12 max-w-7xl mx-auto px-4">
        <FeatureDisabled moduleNameEn="Affiliate Referral Portal" moduleNameTh="ระบบลิงก์แนะนำพันธมิตร (Affiliate)" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  const userEmail = session.user.email;
  const membershipTier = "GOLD"; // default simulation

  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/?ref=${affiliate.referralCode}`
    : `https://ultimatesuccess.co/?ref=${affiliate.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <span>{isEn ? "My Courses" : "หลักสูตรของฉัน"}</span>
            </Link>
            <Link
              href="/dashboard/tickets"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-650 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Ticket className="h-4 w-4 text-gold-500" />
              <span>{isEn ? "Workshop Tickets" : "บัตรเวิร์กช็อป"}</span>
            </Link>
            <Link
              href="/membership"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-650 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Award className="h-4 w-4 text-gold-500" />
              <span>{isEn ? "Billing Membership" : "สมาชิกรายเดือน"}</span>
            </Link>
            <Link
              href="/dashboard/affiliate"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-50 text-gold-600 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Sparkles className="h-4 w-4 text-gold-500" />
              <span>{isEn ? "Affiliate Partner" : "พันธมิตรแนะนำ"}</span>
            </Link>
          </div>
        </div>

        {/* Right Side Main Content Panel */}
        <div className="lg:col-span-9 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {isEn ? "Affiliate & Partner Portal" : "ศูนย์พันธมิตรแนะนำ (Affiliate)"}
            </h1>
            <p className="text-xs text-slate-500 font-light">
              {isEn
                ? "Share ultimate executive masterclasses with your network and earn 15% revenue share commissions."
                : "แบ่งปันหลักสูตรผู้บริหารระดับสูงในเครือข่ายของคุณ และรับส่วนแบ่งรายได้ค่าธรรมเนียม 15%"}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {isEn ? "Link Clicks" : "ยอดการคลิกศึกษา"}
                </span>
                <p className="text-2xl font-extrabold text-slate-900">{affiliate.referralLinkHits}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <MousePointerClick className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {isEn ? "Referred Signups" : "ยอดการสมัครเรียน"}
                </span>
                <p className="text-2xl font-extrabold text-slate-900">{affiliate.totalSignups}</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {isEn ? "Total Earnings" : "ค่าคอมมิชชั่นสะสม"}
                </span>
                <p className="text-2xl font-extrabold text-emerald-600">฿{affiliate.earnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Referral Link Generator Box */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 dark-premium-gradient border border-gold-500/20 shadow-lg space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gold-500 uppercase tracking-widest">
                {isEn ? "Your Unique Referral Link" : "ลิงก์แนะนำเฉพาะของคุณ"}
              </h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {isEn
                  ? "Distribute this custom link via email, newsletters, or social feeds. Incoming payments trigger payout balances."
                  : "คัดลอกและนำลิงก์เฉพาะนี้ไปแชร์ผ่านอีเมล โซเชียลมีเดีย หรือช่องทางต่างๆ เมื่อมีผู้สมัครเรียนสำเร็จ คุณจะได้รับคอมมิชชั่นทันที"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-slate-200 truncate select-all">
                {referralUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto shrink-0 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{isEn ? "Copied!" : "คัดลอกแล้ว!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>{isEn ? "Copy Link" : "คัดลอกลิงก์"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Information Rules block */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {isEn ? "Commission Breakdown & Terms" : "เงื่อนไขและรายละเอียดค่าคอมมิชชั่น"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-650 leading-relaxed font-light">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  {isEn
                    ? "Standard 15% revenue share paid on all successful course checkouts."
                    : "ส่วนแบ่งรายได้ 15% สำหรับทุกยอดค่าธรรมเนียมการสมัครเรียนสำเร็จ"}
                </li>
                <li>
                  {isEn
                    ? "30-day referral cookie duration logs incoming purchases properly."
                    : "ระบบบันทึกคุกกี้แนะนำไว้นาน 30 วันนับจากการเข้าสู่เว็บลิงก์ครั้งแรก"}
                </li>
              </ul>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  {isEn
                    ? "Payouts processed on the 1st and 15th of each month."
                    : "ยอดค้างชำระจะถูกโอนถอนทุกวันที่ 1 และ 15 ของรอบเดือน"}
                </li>
                <li>
                  {isEn
                    ? "Minimum payout balance: ฿1,000. Required bank book verification."
                    : "ขั้นต่ำในการโอนถอน: ฿1,000 พร้อมการยืนยันหน้าสมุดบัญชีธนาคาร"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
