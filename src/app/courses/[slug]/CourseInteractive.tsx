"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, CreditCard, ShieldCheck } from "lucide-react";

interface Lecture {
  titleEn: string;
  titleTh: string;
}

interface Section {
  sectionEn: string;
  sectionTh: string;
  lectures: Lecture[];
}

interface FAQItem {
  qEn: string;
  qTh: string;
  aEn: string;
  aTh: string;
}

interface CourseInteractiveProps {
  curriculum: Section[];
  faq: FAQItem[];
  learningOutcomes: string[];
  isEn: boolean;
  price: number;
  courseTitle: string;
}

export const CourseInteractive: React.FC<CourseInteractiveProps> = ({
  curriculum,
  faq,
  learningOutcomes,
  isEn,
  price,
  courseTitle,
}) => {
  const [activeCurriculumSection, setActiveCurriculumSection] = useState<number | null>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const toggleCurriculum = (index: number) => {
    setActiveCurriculumSection(activeCurriculumSection === index ? null : index);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutSuccess(true);
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setCheckoutSuccess(false);
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
      {/* Left Column: Curriculum, outcomes, FAQs */}
      <div className="lg:col-span-8 space-y-12">
        {/* Learning Outcomes */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isEn ? "What You Will Learn" : "สิ่งที่คุณจะได้เรียนรู้"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start space-x-2.5">
                <CheckCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-650 leading-relaxed">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isEn ? "Program Curriculum" : "โครงสร้างหลักสูตรและบทเรียน"}
          </h2>
          <div className="space-y-3.5">
            {curriculum.map((section, idx) => {
              const isExpanded = activeCurriculumSection === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleCurriculum(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-950 hover:bg-slate-50 transition-colors"
                  >
                    <span>{isEn ? section.sectionEn : section.sectionTh}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2">
                      {section.lectures.map((lecture, lIdx) => (
                        <div key={lIdx} className="text-xs sm:text-sm text-slate-600 flex items-center space-x-2 py-1.5 border-b border-slate-100 last:border-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0"></span>
                          <span>{isEn ? lecture.titleEn : lecture.titleTh}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isEn ? "Frequently Asked Questions" : "คำถามที่พบบ่อย"}
          </h2>
          <div className="space-y-3">
            {faq.map((item, idx) => {
              const isExpanded = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{isEn ? item.qEn : item.qTh}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-gold-500" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/30 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {isEn ? item.aEn : item.aTh}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Checkout Pricing Card */}
      <div className="lg:col-span-4">
        <div className="bg-primary text-white rounded-2xl border border-gold-500/20 p-6 md:p-8 shadow-xl space-y-6 sticky top-24 dark-premium-gradient">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gold-500 tracking-wider uppercase">
              {isEn ? "Premium Admission" : "การลงทะเบียนเรียนระดับพรีเมียม"}
            </span>
            <h3 className="text-2xl font-bold">฿{price.toLocaleString()}</h3>
            <p className="text-xs text-slate-400">
              {isEn ? "One-time enrollment fee. Includes certificate." : "ค่าลงทะเบียนสุทธิ (รวมใบประกาศนียบัตร)"}
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-350 border-t border-slate-800 pt-6">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="h-4 w-4 text-gold-500 shrink-0" />
              <span>{isEn ? "Full access to future session updates" : "สิทธิ์การเข้าถึงข้อมูลอัปเดตตลอดหลักสูตร"}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CreditCard className="h-4 w-4 text-gold-500 shrink-0" />
              <span>{isEn ? "Flexible payment methods available" : "รองรับช่องทางการชำระเงินที่หลากหลาย"}</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-gold-500 hover:bg-gold-600 text-primary font-bold py-3.5 rounded-full text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer text-center"
          >
            {isEn ? "Enroll In Course" : "ลงทะเบียนทันที"}
          </button>
        </div>
      </div>

      {/* Payment Sandbox Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 md:p-8 max-w-md w-full space-y-6 relative">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-950">
                  {isEn ? "Enrollment Successful!" : "ลงทะเบียนสำเร็จแล้ว!"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isEn ? "Redirecting to your student dashboard..." : "กำลังนำทางคุณไปยังหน้าเรียนของคุณ..."}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{isEn ? "Secure Checkout" : "ชำระเงินปลอดภัย"}</h3>
                  <p className="text-xs text-slate-500">{courseTitle}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex justify-between text-xs text-slate-650">
                    <span>{isEn ? "Subtotal" : "ราคาค่าเรียน"}</span>
                    <span>฿{price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-950">
                    <span>{isEn ? "Total Amount" : "ยอดรวมสุทธิ"}</span>
                    <span>฿{price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Gateway Mockups */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                    {isEn ? "Select Gateway" : "เลือกช่องทางการชำระเงิน"}
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
                  className="w-full bg-slate-950 text-gold-500 hover:bg-slate-900 font-bold py-3 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
                >
                  {isEn ? "Pay Securely" : "ชำระเงินทันที"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
