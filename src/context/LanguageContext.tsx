"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (enText: string, thText: string) => string;
  dict: Record<string, { en: string; th: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DICTIONARY: Record<string, { en: string; th: string }> = {
  nav_home: { en: "Home", th: "หน้าแรก" },
  nav_courses: { en: "Courses", th: "หลักสูตร" },
  nav_blog: { en: "Media / Blog", th: "สื่อ / บล็อก" },
  nav_about: { en: "About Us", th: "เกี่ยวกับเรา" },
  nav_contact: { en: "Contact Us", th: "ติดต่อเรา" },
  nav_login: { en: "Login", th: "เข้าสู่ระบบ" },
  nav_register: { en: "Register", th: "สมัครสมาชิก" },
  nav_admin: { en: "Admin", th: "ผู้ดูแลระบบ" },
  nav_logout: { en: "Logout", th: "ออกจากระบบ" },
  footer_tagline: { en: "Unlocking Ultimate Success for Partners Globally.", th: "ปลดล็อกความสำเร็จขั้นสูงสุดเพื่อพันธมิตรทั่วโลก" },
  footer_links: { en: "Quick Links", th: "ลิงก์ด่วน" },
  footer_contact: { en: "Contact Details", th: "ข้อมูลการติดต่อ" },
  footer_rights: { en: "All rights reserved.", th: "สงวนลิขสิทธิ์ทั้งหมด" },
  hero_title_1: { en: "Empowering Executives & Entrepreneurs to", th: "เสริมศักยภาพผู้บริหารและผู้ประกอบการสู่" },
  hero_title_2: { en: "Scale New Heights", th: "การเติบโตขั้นสูงสุด" },
  hero_subtitle: { en: "Premium executive education, masterclasses, and networking designed for CEOs, SMEs, and business leaders.", th: "หลักสูตรผู้บริหารระดับพรีเมียม มาสเตอร์คลาส และคอนเนกชันที่ออกแบบมาสำหรับซีอีโอ เอสเอ็มอี และผู้นำธุรกิจ" },
  hero_cta_explore: { en: "Explore Courses", th: "สำรวจหลักสูตร" },
  hero_cta_about: { en: "Learn More", th: "เรียนรู้เพิ่มเติม" },
  featured_courses: { en: "Featured Programs", th: "หลักสูตรแนะนำ" },
  upcoming_courses: { en: "Upcoming Masterclasses", th: "มาสเตอร์คลาสที่กำลังมาถึง" },
  testimonials_title: { en: "What Our Partners Say", th: "เสียงตอบรับจากพันธมิตรของเรา" },
  about_mission: { en: "Our Mission", th: "พันธกิจของเรา" },
  about_mission_desc: { en: "To provide world-class, practical executive education and insights that drive sustainable corporate scaling and strategic growth for SMEs and enterprises in Thailand and beyond.", th: "เพื่อมอบหลักสูตรผู้บริหารระดับโลกและองค์ความรู้เชิงปฏิบัติการที่จะขับเคลื่อนการเติบโตอย่างยั่งยืนของธุรกิจเอสเอ็มอีและองค์กรในไทยและภูมิภาค" },
  contact_title: { en: "Get In Touch", th: "ติดต่อสอบถาม" },
  contact_name: { en: "Full Name", th: "ชื่อ-นามสกุล" },
  contact_email: { en: "Email Address", th: "อีเมล" },
  contact_message: { en: "Message", th: "ข้อความ" },
  contact_submit: { en: "Send Message", th: "ส่งข้อความ" },
  contact_success: { en: "Thank you for contacting us! We will get back to you shortly.", th: "ขอบคุณสำหรับการติดต่อ! เราจะติดต่อกลับโดยเร็วที่สุด" },
  newsletter_title: { en: "Subscribe to Insights", th: "สมัครรับข้อมูลข่าวสาร" },
  newsletter_btn: { en: "Subscribe", th: "ติดตาม" },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  // Load initial preference from cookie or document
  useEffect(() => {
    const match = document.cookie.match(new RegExp("(^| )lang=([^;]+)"));
    if (match && (match[2] === "en" || match[2] === "th")) {
      setLanguageState(match[2] as Language);
    } else {
      // Fallback to browser preference
      const browserLang = navigator.language.startsWith("th") ? "th" : "en";
      setLanguageState(browserLang);
      document.cookie = `lang=${browserLang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  // Helper to resolve translation based on active language
  const t = (enText: string, thText: string) => {
    return language === "en" ? enText : thText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dict: DICTIONARY }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
