import React from "react";
import { cookies } from "next/headers";
import { Shield, Target, Users, Mail, Award, BookOpen, Volume2 } from "lucide-react";
import { LinkedinIcon } from "../../components/ui/SocialIcons";
import { getInstructors } from "../../lib/instructors_store";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";

  const instructors = await getInstructors();

  const executives = instructors.filter((inst) => inst.roleType === "EXECUTIVE");
  const coaches = instructors.filter((inst) => inst.roleType === "COACH");
  const speakers = instructors.filter((inst) => inst.roleType === "SPEAKER");

  const renderCard = (inst: typeof instructors[0]) => (
    <div
      key={inst.id}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center space-y-4 premium-card-hover"
    >
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gold-500/30">
        <img
          src={inst.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
          alt={isEn ? inst.nameEn : inst.nameTh}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900">
          {isEn ? inst.nameEn : inst.nameTh}
        </h3>
        <p className="text-xs text-gold-600 font-medium tracking-wide">
          {isEn ? inst.titleEn : inst.titleTh}
        </p>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed font-light px-2 flex-grow">
        {isEn ? inst.bioEn : inst.bioTh}
      </p>

      <div className="flex space-x-3 pt-2">
        {inst.linkedin && (
          <a
            href={inst.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full border border-slate-200 hover:border-gold-500 hover:text-gold-500 text-slate-400 transition-all"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        )}
        <a
          href={`mailto:info@ultimatesuccess.co`}
          className="p-1.5 rounded-full border border-slate-200 hover:border-gold-500 hover:text-gold-500 text-slate-400 transition-all"
        >
          <Mail className="h-4 w-4" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 dark-premium-gradient relative border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isEn ? "About Ultimate Success Partners" : "เกี่ยวกับ อัลติเมท ซัคเซส พาร์ทเนอร์"}
          </h1>
          <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          <p className="max-w-2xl mx-auto text-slate-300 font-light text-sm sm:text-base leading-relaxed">
            {isEn
              ? "We build the structures, engines, and leadership mindset required for modern business scalability and investor-grade efficiency."
              : "เราสร้างระบบ โครงสร้างการปฏิบัติการ และทัศนคติความเป็นผู้นำที่จำเป็นสำหรับการขยายธุรกิจยุคใหม่"}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-950 flex items-center">
              <Target className="h-6 w-6 text-gold-500 mr-2" />
              {isEn ? "Our Core Mission" : "พันธกิจของเรา"}
            </h2>
            <p className="text-slate-600 leading-relaxed font-light text-base">
              {isEn
                ? "To provide world-class, practical executive education and operational frameworks that drive sustainable corporate scaling and strategic growth for SMEs and enterprises in Thailand and Southeast Asia."
                : "เพื่อส่งมอบองค์ความรู้ในการบริหารจัดการระดับโลกและโครงสร้างการปฏิบัติงานจริง ที่จะช่วยขับเคลื่อนการขยายตัวทางธุรกิจอย่างยั่งยืนสำหรับเอสเอ็มอีและองค์กรในไทยและภูมิภาคเอเชียตะวันออกเฉียงใต้"}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2 border-l-2 border-gold-500 pl-4">
                <h4 className="font-bold text-slate-900">{isEn ? "Practical" : "เน้นปฏิบัติจริง"}</h4>
                <p className="text-xs text-slate-500">
                  {isEn ? "No pure theories. Actionable blueprints only." : "ไม่ใช่แค่ทฤษฎี แต่เป็นแผนงานที่นำไปลงมือทำได้ทันที"}
                </p>
              </div>
              <div className="space-y-2 border-l-2 border-gold-500 pl-4">
                <h4 className="font-bold text-slate-900">{isEn ? "Investor-Grade" : "ระดับผู้ลงทุนเชื่อมั่น"}</h4>
                <p className="text-xs text-slate-500">
                  {isEn ? "Structure businesses to attract capital." : "วางโครงสร้างธุรกิจให้เป็นระบบระเบียบพร้อมรับพันธมิตร"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-10 dark-premium-gradient border border-gold-500/10 space-y-6">
            <h3 className="text-xl font-bold gold-text-gradient">{isEn ? "Our Vision" : "วิสัยทัศน์ของเรา"}</h3>
            <p className="text-slate-350 leading-relaxed font-light text-sm">
              {isEn
                ? "To become the premier platform for executive education, media insights, and corporate coaching in the ASEAN region, bridging local business talent with international growth systems."
                : "เพื่อเป็นแพลตฟอร์มชั้นนำในระดับภูมิภาคอาเซียนสำหรับหลักสูตรผู้บริหาร สื่อวิเคราะห์ธุรกิจ และการโค้ชองค์กร เชื่อมโยงบุคลากรธุรกิจท้องถิ่นเข้ากับระบบการเติบโตที่เป็นสากล"}
            </p>
            <hr className="border-slate-800" />
            <div className="flex items-center space-x-3 text-gold-500">
              <Shield className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isEn ? "Certified Scalability Methods" : "กรอบการขยายธุรกิจที่ได้รับการรับรอง"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Executives Section */}
      {executives.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center space-x-2">
              <Award className="h-6 w-6 text-gold-500" />
              <span>{isEn ? "Executive Board" : "คณะผู้บริหาร"}</span>
            </h2>
            <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center">
            {executives.map(renderCard)}
          </div>
        </section>
      )}

      {/* Coaches Section */}
      {coaches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center space-x-2">
              <BookOpen className="h-6 w-6 text-gold-500" />
              <span>{isEn ? "Specialist Coaches" : "โค้ชและที่ปรึกษาผู้เชี่ยวชาญ"}</span>
            </h2>
            <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center">
            {coaches.map(renderCard)}
          </div>
        </section>
      )}

      {/* Speakers Section */}
      {speakers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center space-x-2">
              <Volume2 className="h-6 w-6 text-gold-500" />
              <span>{isEn ? "Keynote Speakers" : "วิทยากรผู้ทรงคุณวุฒิ"}</span>
            </h2>
            <div className="h-1 w-20 bg-gold-500 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center">
            {speakers.map(renderCard)}
          </div>
        </section>
      )}
    </div>
  );
}
