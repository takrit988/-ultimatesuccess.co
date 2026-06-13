"use client";

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useSession } from "next-auth/react";
import { Check, ShieldCheck, Loader2, CreditCard } from "lucide-react";

export default function MembershipPage() {
  const { t, language } = useLanguage();
  const { data: session } = useSession();
  const isEn = language === "en";

  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [activeCheckoutTier, setActiveCheckoutTier] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubscribe = async (tier: string) => {
    if (!session) {
      // Redirect to login if not logged in
      window.location.href = `/login?callbackUrl=/membership`;
      return;
    }
    setActiveCheckoutTier(tier);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCheckoutTier || !session) return;

    setLoadingTier(activeCheckoutTier);
    try {
      const response = await fetch("/api/stripe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          tier: activeCheckoutTier,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(t("Subscription processed successfully!", "เปิดใช้งานสถานะสมาชิกเรียบร้อยแล้ว!"));
        setTimeout(() => {
          setActiveCheckoutTier(null);
          setSuccessMessage("");
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTier(null);
    }
  };

  const tiers = [
    {
      name: "Free Partner",
      price: "฿0",
      period: isEn ? "/ lifetime" : "/ ตลอดชีพ",
      desc: isEn ? "Browse public resources and free masterclasses." : "เข้าถึงแหล่งข้อมูลทั่วไปและบทเรียนฟรีบางส่วน",
      features: [
        isEn ? "Access to public blog posts" : "เข้าถึงบทความทั่วไปบนบล็อก",
        isEn ? "Introductory course syllabus views" : "เข้าดูสารบัญหลักสูตรแนะนำ",
        isEn ? "Basic student community access" : "สิทธิ์การคอมเมนต์กระดานข่าวสารทั่วไป",
      ],
      cta: isEn ? "Get Started" : "เริ่มต้นใช้งาน",
      premium: false,
    },
    {
      name: "Gold Executive",
      price: "฿19,500",
      period: isEn ? "/ year" : "/ ปี",
      desc: isEn ? "Best for small business owners scaling operations." : "เหมาะสำหรับผู้ประกอบการขยายกิจการขนาดกลาง",
      features: [
        isEn ? "All Free Partner benefits" : "สิทธิ์ประโยชน์ทั้งหมดจาก Free Partner",
        isEn ? "Access to Gold-exclusive blogs" : "เข้าถึงบทความเฉพาะทางระดับ Gold",
        isEn ? "15% discount on physical workshops" : "ส่วนลด 15% สำหรับบัตรเวิร์กชอปเรียนสด",
        isEn ? "Access to online LMS course catalog" : "เรียนหลักสูตรออนไลน์ทั้งหมดในคลังระบบ LMS",
      ],
      cta: isEn ? "Upgrade to Gold" : "สมัครสมาชิกระดับ Gold",
      premium: true,
    },
    {
      name: "Platinum Leader",
      price: "฿45,000",
      period: isEn ? "/ year" : "/ ปี",
      desc: isEn ? "Elite access for enterprise executives and CEOs." : "สิทธิ์การเข้าถึงสูงสุดสำหรับผู้บริหารระดับสูงและซีอีโอ",
      features: [
        isEn ? "All Gold Executive benefits" : "สิทธิ์ประโยชน์ทั้งหมดจาก Gold Executive",
        isEn ? "Access to Platinum-exclusive resources" : "เข้าถึงรายงานและบทวิเคราะห์ระดับความลับสูง",
        isEn ? "One-on-one executive coaching logs" : "รับสิทธิ์ดูบันทึกรายงานการโค้ชชิ่งเดี่ยว",
        isEn ? "Complimentary check-in tickets to workshops" : "บัตรผ่านเข้าเรียนสดเวิร์กชอปฟรีแบบ VIP",
      ],
      cta: isEn ? "Acquire Platinum" : "สมัครสมาชิกระดับ Platinum",
      premium: true,
      popular: true,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 dark-premium-gradient border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t("Bespoke Executive Memberships", "ระดับสมาชิกความสำเร็จสำหรับพันธมิตร")}
          </h1>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          <p className="max-w-2xl mx-auto text-slate-300 font-light text-sm leading-relaxed">
            {t(
              "Subscribe to a tiered membership to unlock proprietary operational blueprints, student classroom catalogs, and VIP ticketing allocations.",
              "สมัครสมาชิกระดับที่เหมาะสมเพื่อปลดล็อกพิมพ์เขียวธุรกิจ คลังหลักสูตรระบบ LMS และบัตรผ่าน VIP ในเวิร์กชอปของเรา"
            )}
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-3xl border p-8 flex flex-col justify-between relative transition-all duration-300 ${
                tier.popular
                  ? "border-gold-500 shadow-xl scale-102 z-10"
                  : "border-slate-200 shadow-sm hover:border-gold-500/30"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-primary text-[9px] font-extrabold uppercase px-3.5 py-1 rounded-full tracking-wider shadow">
                  {t("Recommended", "แนะนำสำหรับผู้บริหาร")}
                </span>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{tier.name}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">{tier.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{tier.period}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{tier.desc}</p>
                </div>

                <hr className="border-slate-100" />

                <ul className="space-y-3.5">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-650 font-light leading-relaxed">
                      <Check className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-50">
                <button
                  onClick={() => handleSubscribe(tier.name.toUpperCase().replace(" ", "_"))}
                  className={`w-full font-bold py-3.5 rounded-full text-xs tracking-wider uppercase transition-all shadow-sm text-center cursor-pointer ${
                    tier.popular
                      ? "bg-gold-500 hover:bg-gold-600 text-primary"
                      : "bg-slate-950 hover:bg-slate-900 text-gold-500"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Checkout Modal Mock */}
      {activeCheckoutTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 md:p-8 max-w-md w-full space-y-6 relative">
            <button
              onClick={() => setActiveCheckoutTier(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>

            {successMessage ? (
              <div className="text-center py-10 space-y-4">
                <ShieldCheck className="h-16 w-16 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-950">{successMessage}</h3>
                <p className="text-xs text-slate-500">
                  {t("Updating your privileges context...", "กำลังอัปเดตสิทธิ์การใช้งานพอร์ทเนอร์ของคุณ...")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {t("Membership Billing Checkout", "การยืนยันสมัครสมาชิก")}
                  </h3>
                  <p className="text-xs text-slate-500">Tier: {activeCheckoutTier.replace("_", " ")}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex justify-between text-xs text-slate-650">
                    <span>{t("Billing Period", "ระยะเวลารอบบิล")}</span>
                    <span>{t("Annual (12 Months)", "รายปี (12 เดือน)")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-950">
                    <span>{t("Payable Amount", "ยอดชำระ")}</span>
                    <span>
                      {activeCheckoutTier.includes("GOLD") ? "฿19,500" : "฿45,000"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                    {t("Select Gateway", "เลือกผู้ให้บริการการชำระเงิน")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border border-slate-200 rounded-lg p-2.5 flex flex-col items-center hover:border-gold-500 cursor-pointer transition-colors bg-slate-50/50">
                      <span className="text-[10px] font-extrabold text-blue-600">Stripe</span>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-2.5 flex flex-col items-center hover:border-gold-500 cursor-pointer transition-colors bg-slate-50/50">
                      <span className="text-[10px] font-extrabold text-indigo-700">Omise</span>
                    </div>
                    <div className="border border-slate-200 rounded-lg p-2.5 flex flex-col items-center hover:border-gold-500 cursor-pointer transition-colors bg-slate-50/50">
                      <span className="text-[10px] font-extrabold text-red-500">2C2P</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 block">{isEn ? "Cardholder Name" : "ชื่อบนบัตร"}</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-600 block">{isEn ? "Card Number" : "หมายเลขบัตรเครดิต"}</label>
                    <input
                      type="text"
                      required
                      placeholder="•••• •••• •••• ••••"
                      className="w-full border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingTier !== null}
                  className="w-full bg-slate-950 text-gold-500 hover:bg-slate-900 font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  {loadingTier ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gold-500" />
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>{t("Process Membership", "ยืนยันการชำระเงิน")}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
