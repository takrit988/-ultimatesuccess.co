"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { Mail, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 text-white min-h-[85vh] flex items-center justify-center py-16 px-4 dark-premium-gradient relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl"></div>
      <div className="max-w-md w-full bg-slate-950/80 border border-gold-500/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("Recover Password", "กู้คืนรหัสผ่าน")}
          </h1>
          <p className="text-xs text-slate-400 font-light">
            {t("Enter email to reset your credential credentials.", "กรอกอีเมลของคุณเพื่อเปลี่ยนรหัสผ่าน")}
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 flex flex-col items-center space-y-3 text-gold-500 text-xs">
              <CheckCircle className="h-10 w-10 text-gold-500" />
              <div className="space-y-1">
                <h4 className="font-bold">{t("Recovery Email Sent", "ส่งอีเมลกู้คืนแล้ว")}</h4>
                <p className="text-slate-400 leading-relaxed">
                  {t(
                    "If the email exists in our records, we have sent instructions to reset password.",
                    "หากอีเมลของท่านอยู่ในระบบ เราได้จัดส่งขั้นตอนการเปลี่ยนรหัสผ่านไปยังกล่องจดหมายแล้ว"
                  )}
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-gold-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("Back to Login", "กลับหน้าเข้าสู่ระบบ")}</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {t("Email Address", "อีเมลผู้ใช้งาน")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@ultimatesuccess.co"
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-white pl-10"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-primary font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? t("Sending...", "กำลังดำเนินการ...") : t("Reset Password", "กู้คืนรหัสผ่าน")}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
