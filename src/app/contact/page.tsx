"use client";

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 dark-premium-gradient border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t("Contact Us", "ติดต่อเรา")}
          </h1>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          <p className="max-w-2xl mx-auto text-slate-300 font-light text-sm leading-relaxed">
            {t(
              "Connect with our executive coordination team to request bespoke corporate training, coaching schedules, or platform admission enquiries.",
              "ติดต่อคณะผู้ทำงานประสานงานผู้บริหารของเราเพื่อขอข้อมูลการอบรมองค์กร จัดตารางการโค้ช หรือสมัครใช้งานแพลตฟอร์ม"
            )}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              {t("Get In Touch", "ส่งข้อความถึงเรา")}
            </h2>
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start space-x-3 text-emerald-800">
                <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold">{t("Message Sent Successfully!", "ส่งข้อความเรียบร้อยแล้ว!")}</h4>
                  <p className="text-xs text-emerald-650 leading-relaxed">
                    {t(
                      "Thank you for contacting us! We will assign an executive coach coordinator to respond within 24 business hours.",
                      "ขอบคุณสำหรับการติดต่อ! เราจะมอบหมายเจ้าหน้าที่ประสานงานด้านการโค้ชผู้บริหารเพื่อตอบกลับท่านภายใน 24 ชั่วโมงทำการ"
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-650 block">
                    {t("Full Name", "ชื่อ-นามสกุล")}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-650 block">
                    {t("Email Address", "อีเมลติดต่อ")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-650 block">
                    {t("Message", "ข้อความติดต่อ")}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("Details about your enquiry...", "รายละเอียดในการติดต่อสอบถาม...")}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-950 text-gold-500 hover:bg-slate-900 font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{loading ? t("Sending...", "กำลังส่ง...") : t("Send Message", "ส่งข้อความ")}</span>
                  {!loading && <Send className="h-3.5 w-3.5" />}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information Details panel */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-8 md:p-10 dark-premium-gradient border border-gold-500/10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold gold-text-gradient uppercase tracking-wide">
                {t("Headquarters Office", "สำนักงานใหญ่")}
              </h3>
              <p className="text-slate-300 font-light text-xs sm:text-sm leading-relaxed">
                {t(
                  "We coordinate local events and international mentorship structures from our central office in Bangkok.",
                  "เราประสานงานกิจกรรมในพื้นที่และโครงการโค้ชชิ่งพี่เลี้ยงต่างประเทศจากสำนักงานหลักในกรุงเทพมหานคร"
                )}
              </p>

              <hr className="border-slate-800" />

              <ul className="space-y-5 text-slate-300 text-xs sm:text-sm">
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
                  <span>+66 81 234 5678</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gold-500 shrink-0" />
                  <span>info@ultimatesuccess.co</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-slate-450 text-[10px] sm:text-xs">
              <p className="font-semibold text-slate-300 mb-1">
                {t("Looking for Corporate Partnerships?", "สนใจเป็นพันธมิตรระดับองค์กรหรือไม่?")}
              </p>
              <p className="leading-relaxed font-light">
                {t(
                  "Please email partner@ultimatesuccess.co with your business brief.",
                  "กรุณาส่งอีเมลถึง partner@ultimatesuccess.co พร้อมข้อมูลเบื้องต้นของบริษัทคุณ"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
