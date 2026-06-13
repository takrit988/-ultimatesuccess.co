"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { Lock, Mail, Building, Briefcase, Phone, AlertTriangle, Loader2, Eye, EyeOff } from "lucide-react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const MetaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      fill="#0668E1"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, company, position, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("Registration failed", "เกิดข้อผิดพลาดในการลงทะเบียน"));
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      console.error(err);
      setError(t("An unexpected error occurred", "เกิดข้อผิดพลาดที่ไม่คาดคิด"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-[90vh] flex items-center justify-center py-16 px-4 dark-premium-gradient relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl border border-gold-500/5"></div>

      <div className="max-w-md w-full bg-slate-950/80 border border-gold-500/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("Create Partner Account", "สมัครสมาชิกพอร์ทเนอร์")}
          </h1>
          <p className="text-xs text-slate-400 font-light">
            {t("Join Ultimate Success elite learning tier.", "เข้าร่วมระดับการเรียนรู้ชั้นยอดกับเรา")}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/35 rounded-xl p-3.5 flex items-start space-x-2.5 text-red-250 text-xs leading-relaxed">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {t("Email Address", "อีเมลผู้ใช้งาน *")}
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

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {t("Password", "รหัสผ่าน *")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-white pl-10 pr-10"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-gold-500 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {t("Company Name", "ชื่อบริษัท / กิจการ")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Zenith Logistics"
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-white pl-10"
              />
              <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {t("Position", "ตำแหน่งงาน")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="CEO"
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-white pl-10"
                />
                <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {t("Phone Number", "เบอร์โทรศัพท์")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812345678"
                  className="w-full bg-slate-900/50 border border-slate-800 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-white pl-10"
                />
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-primary font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <span>{t("Register", "สมัครสมาชิก")}</span>
            )}
          </button>
        </form>

        {/* Google & Meta Sign In Divider & Buttons */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative px-3 bg-slate-950 text-[10px] text-slate-500 uppercase tracking-widest">
              {t("Or continue with", "หรือสมัครสมาชิกด้วย")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 hover:border-gold-500/30 text-xs font-semibold py-2.5 rounded-lg text-slate-200 transition-all cursor-pointer"
            >
              <GoogleIcon className="h-4 w-4 shrink-0" />
              <span>Google</span>
            </button>
            <button
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
              className="flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 hover:border-gold-500/30 text-xs font-semibold py-2.5 rounded-lg text-slate-200 transition-all cursor-pointer"
            >
              <MetaIcon className="h-4 w-4 shrink-0" />
              <span>Meta</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-400">
          <span>{t("Already have an account?", "มีบัญชีผู้ใช้งานแล้ว?")} </span>
          <Link href="/login" className="text-gold-500 hover:text-gold-600 font-semibold transition-colors">
            {t("Login here", "เข้าสู่ระบบที่นี่")}
          </Link>
        </div>
      </div>
    </div>
  );
}
