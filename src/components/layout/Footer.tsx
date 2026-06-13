"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FacebookIcon, LinkedinIcon, YoutubeIcon } from "../ui/SocialIcons";

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="dark-premium-gradient border-t border-gold-500/10 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <img
                src="/logo_white.png"
                alt="Ultimate Success Partners Logo"
                className="h-20 md:h-28 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t(
                "Unlocking Ultimate Success for Partners Globally. We provide elite executive coaching, systems, and structures for modern business scalability.",
                "ปลดล็อกความสำเร็จขั้นสูงสุดเพื่อพันธมิตรทั่วโลก เรานำเสนอหลักสูตรและการโค้ชผู้บริหาร ระบบ และโครงสร้างเพื่อยกระดับความสามารถในการเติบโตของธุรกิจ"
              )}
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="hover:text-gold-500 transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gold-500 transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-gold-500 transition-colors">
                <YoutubeIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              {t("Quick Links", "ลิงก์ด่วน")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-500 transition-colors">
                  {t("Home", "หน้าแรก")}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-gold-500 transition-colors">
                  {t("Courses", "หลักสูตร")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold-500 transition-colors">
                  {t("Media / Blog", "สื่อ / บล็อก")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-500 transition-colors">
                  {t("About Us", "เกี่ยวกับเรา")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              {t("Contact Details", "ข้อมูลการติดต่อ")}
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <span>
                  {t(
                    "Ultimate Success Partners Co., Ltd. Bangkok, Thailand",
                    "บริษัท อัลติเมท ซัคเซส พาร์ทเนอร์ จำกัด กรุงเทพมหานคร ประเทศไทย"
                  )}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gold-500 shrink-0" />
                <span className="hover:text-gold-500 transition-colors">+66 81 234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                <span className="hover:text-gold-500 transition-colors">info@ultimatesuccess.co</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              {t("Subscribe to Insights", "สมัครรับข้อมูลข่าวสาร")}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                "Get our latest leadership frameworks and enterprise insights directly in your inbox.",
                "รับกรอบแนวคิดความเป็นผู้นำและการวิเคราะห์ธุรกิจล่าสุด ส่งตรงถึงกล่องจดหมายของคุณ"
              )}
            </p>
            {subscribed ? (
              <div className="text-xs text-gold-500 font-medium py-2">
                ✓ {t("Subscribed successfully!", "สมัครรับข้อมูลข่าวสารเรียบร้อยแล้ว!")}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2 mt-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder={t("Enter email address", "กรอกอีเมลของคุณ")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-sm text-white pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bg-gold-500 text-primary p-1.5 rounded-md hover:bg-gold-600 transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <hr className="border-slate-800/80 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} Ultimate Success Partners. {t("All rights reserved.", "สงวนลิขสิทธิ์ทั้งหมด")}
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-gold-500 transition-colors">
              {t("Privacy Policy", "นโยบายความเป็นส่วนตัว")}
            </Link>
            <Link href="#" className="hover:text-gold-500 transition-colors">
              {t("Terms of Service", "ข้อกำหนดการให้บริการ")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
