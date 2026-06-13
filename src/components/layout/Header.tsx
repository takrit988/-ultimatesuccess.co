"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import { Globe, Menu, X, User, LogOut, Shield, Award, BookOpen, MessageSquare } from "lucide-react";

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>({ courses: true, blog: true });

  const useDarkText = false;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch active features
    async function fetchFeatures() {
      try {
        const res = await fetch("/api/features");
        const data = await res.json();
        if (data.success && data.features) {
          setActiveFeatures(data.features);
        }
      } catch (err) {
        console.warn("Failed to load features in Header:", err);
      }
    }
    fetchFeatures();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
    router.refresh();
  };

  const menuItems = [
    { name: t("Home", "หน้าแรก"), href: "/" },
    ...(activeFeatures.courses !== false ? [{ name: t("Courses", "หลักสูตร"), href: "/courses" }] : []),
    ...(activeFeatures.blog !== false ? [{ name: t("Blog", "สื่อ / บล็อก"), href: "/blog" }] : []),
    { name: t("About Us", "เกี่ยวกับเรา"), href: "/about" },
    { name: t("Contact Us", "ติดต่อเรา"), href: "/contact" },
  ];


  const isAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN" || session?.user?.role === "CONTENT_EDITOR" || session?.user?.role === "COURSE_MANAGER";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary/95 backdrop-blur-md border-b border-gold-500/10 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src={useDarkText ? "/logo_black.png" : "/logo_white.png"}
              alt="Ultimate Success Partners Logo"
              className="h-20 md:h-24 w-auto object-contain transition-all"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                    isActive
                      ? "text-gold-500 font-semibold"
                      : useDarkText
                      ? "text-slate-800"
                      : "text-slate-300"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border transition-all text-xs font-medium cursor-pointer ${
                useDarkText
                  ? "border-slate-300 text-slate-700 hover:border-gold-500 hover:text-gold-500"
                  : "border-slate-700 text-slate-300 hover:border-gold-500 hover:text-gold-500"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === "en" ? "TH" : "EN"}</span>
            </button>

            {/* Auth Buttons */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-900 border border-gold-500/30 text-white px-4 py-2 rounded-full text-sm hover:border-gold-500 transition-all cursor-pointer"
                >
                  <User className="h-4 w-4 text-gold-500" />
                  <span className="max-w-[120px] truncate">{session.user.email}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-950 border border-gold-500/20 shadow-xl py-1 text-slate-200 z-50 backdrop-blur-lg">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-3 text-sm hover:bg-slate-900 hover:text-gold-500 transition-colors"
                      >
                        <Shield className="h-4 w-4 text-gold-500" />
                        <span>{t("Admin Dashboard", "แผงผู้ดูแลระบบ")}</span>
                      </Link>
                    )}
                    <Link
                      href="/courses"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 text-sm hover:bg-slate-900 hover:text-gold-500 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-gold-500" />
                      <span>{t("My Learning", "การเรียนของฉัน")}</span>
                    </Link>
                    <hr className="border-slate-800" />
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-900 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t("Logout", "ออกจากระบบ")}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors hover:text-gold-500 ${
                    useDarkText ? "text-slate-800" : "text-slate-300"
                  }`}
                >
                  {t("Login", "เข้าสู่ระบบ")}
                </Link>
                <Link
                  href="/register"
                  className="bg-gold-500 hover:bg-gold-600 text-primary font-bold px-5 py-2 rounded-full text-xs tracking-wide uppercase transition-all shadow-md hover:shadow-gold-500/20 cursor-pointer"
                >
                  {t("Register", "สมัครสมาชิก")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full border transition-all text-xs cursor-pointer ${
                useDarkText
                  ? "border-slate-300 text-slate-700 hover:border-gold-500 hover:text-gold-500"
                  : "border-slate-700 text-slate-300 hover:border-gold-500 hover:text-gold-500"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === "en" ? "TH" : "EN"}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 cursor-pointer transition-colors ${
                useDarkText ? "text-slate-800 hover:text-gold-500" : "text-slate-300 hover:text-gold-500"
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary/98 border-b border-slate-850 px-4 pt-2 pb-6 space-y-3 shadow-xl backdrop-blur-lg">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-900 hover:text-gold-500 transition-all"
            >
              {item.name}
            </Link>
          ))}
          <hr className="border-slate-800 my-2" />
          {session ? (
            <div className="space-y-2">
              <div className="px-3 py-1 text-xs text-slate-400 truncate">
                {session.user.email}
              </div>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-900 hover:text-gold-500 transition-all"
                >
                  {t("Admin Dashboard", "แผงผู้ดูแลระบบ")}
                </Link>
              )}
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-900 transition-all cursor-pointer"
              >
                {t("Logout", "ออกจากระบบ")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 px-3 pt-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-center py-2.5 rounded-full border border-slate-700 text-slate-200 hover:text-gold-500 transition-all"
              >
                {t("Login", "เข้าสู่ระบบ")}
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="text-center py-2.5 rounded-full bg-gold-500 text-primary font-bold transition-all"
              >
                {t("Register", "สมัครสมาชิก")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
