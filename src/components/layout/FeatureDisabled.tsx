"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, MessageSquare } from "lucide-react";

interface FeatureDisabledProps {
  moduleNameEn?: string;
  moduleNameTh?: string;
  isAdminPage?: boolean;
}

export const FeatureDisabled: React.FC<FeatureDisabledProps> = ({
  moduleNameEn = "This module",
  moduleNameTh = "ส่วนนี้ของระบบ",
  isAdminPage = false,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-950 text-white rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl dark-premium-gradient">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 p-8 rounded-2xl bg-slate-900/40 border border-gold-500/10 backdrop-blur-xl shadow-xl">
        {/* Icon & Glow */}
        <div className="mx-auto w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-2xl flex items-center justify-center animate-pulse">
          <ShieldAlert className="h-8 w-8 text-gold-500" />
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase sm:text-3xl">
            Deactivated <span className="text-gold-500">/ ปิดใช้งาน</span>
          </h2>
          <div className="h-0.5 w-16 bg-gold-500 mx-auto rounded"></div>
        </div>

        {/* Message bilingual */}
        <div className="space-y-4 text-sm font-light text-slate-350 leading-relaxed">
          <div className="border-b border-slate-800 pb-3">
            <p className="font-semibold text-white mb-1">English</p>
            <p>
              <strong className="text-gold-500">{moduleNameEn}</strong> is currently deactivated by the system administrator.
            </p>
          </div>
          <div className="pt-1">
            <p className="font-semibold text-white mb-1">ภาษาไทย</p>
            <p>
              <strong className="text-gold-500">{moduleNameTh}</strong> ถูกปิดการใช้งานชั่วคราวโดยผู้ดูแลระบบ
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <Link
            href={isAdminPage ? "/admin" : "/"}
            className="flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-primary font-bold px-5 py-3 rounded-full text-xs tracking-wide uppercase transition-all shadow-md hover:shadow-gold-500/20"
          >
            <Home className="h-3.5 w-3.5" />
            <span>{isAdminPage ? "Admin Overview" : "Back to Home"}</span>
          </Link>
          {!isAdminPage && (
            <Link
              href="/contact"
              className="flex items-center justify-center space-x-2 border border-slate-700 hover:border-gold-500 text-white px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Contact Support</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default FeatureDisabled;
