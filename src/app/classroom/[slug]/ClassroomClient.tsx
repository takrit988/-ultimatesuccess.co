"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoPlayer } from "../../../components/lms/VideoPlayer";
import { CheckSquare, Square, ChevronLeft, ArrowRight, Play, CheckCircle, Sparkles, Send } from "lucide-react";
import Link from "next/link";

interface Lecture {
  titleEn: string;
  titleTh: string;
}

interface Section {
  sectionEn: string;
  sectionTh: string;
  lectures: Lecture[];
}

interface ClassroomClientProps {
  course: {
    id: string;
    slug: string;
    titleEn: string;
    titleTh: string;
    curriculum: Section[];
  };
  completedLessons: string[]; // List of completed lesson IDs (lecture titles)
  userId: string;
  isEn: boolean;
}

export const ClassroomClient: React.FC<ClassroomClientProps> = ({
  course,
  completedLessons: initialCompletedLessons,
  userId,
  isEn,
}) => {
  const router = useRouter();

  // Find all lectures flattened
  const allLectures: Lecture[] = [];
  course.curriculum.forEach((section) => {
    section.lectures.forEach((lec) => {
      allLectures.push(lec);
    });
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(initialCompletedLessons);
  const [activeLecture, setActiveLecture] = useState<Lecture>(allLectures[0] || { titleEn: "Default Lesson", titleTh: "บทเรียนเริ่มต้น" });
  const [savingProgress, setSavingProgress] = useState(false);

  // AI Tutor States
  const [showAiTutor, setShowAiTutor] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: isEn
        ? "Hello! I am your USP Executive Coaching Assistant. Ask me anything about this lecture's core concepts."
        : "สวัสดีครับผมคือผู้ช่วยอัจฉริยะคู่คิดผู้บริหาร สอบถามและปรึกษาแนวคิดการเรียนรู้ในบทเรียนนี้ได้เลยครับ",
    },
  ]);

  const activeLessonId = activeLecture.titleEn; // Using titleEn as identifier

  const handleLessonSelect = (lec: Lecture) => {
    setActiveLecture(lec);
    // Reset assistant greeting context based on new lecture selection
    setChatHistory([
      {
        sender: "ai",
        text: isEn
          ? `Hello! Let's study "${lec.titleEn}". Ask me anything about this topic.`
          : `สวัสดีครับ ยินดีต้อนรับเข้าสู่บทเรียน "${lec.titleTh}" สอบถามและปรึกษาเนื้อหาได้เลยครับ`,
      },
    ]);
  };

  const handleToggleProgress = async (lessonId: string) => {
    if (savingProgress) return;
    setSavingProgress(true);

    const isCompleted = completedLessons.includes(lessonId);
    const newCompletedState = !isCompleted;

    // Optimistically update client UI state
    if (newCompletedState) {
      setCompletedLessons([...completedLessons, lessonId]);
    } else {
      setCompletedLessons(completedLessons.filter((id) => id !== lessonId));
    }

    try {
      const response = await fetch("/api/lms/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseId: course.id,
          lessonId,
          isCompleted: newCompletedState,
        }),
      });

      if (!response.ok) {
        // Rollback on error
        if (isCompleted) {
          setCompletedLessons([...completedLessons, lessonId]);
        } else {
          setCompletedLessons(completedLessons.filter((id) => id !== lessonId));
        }
      } else {
        router.refresh(); // Refresh page to update other components/progress indicators
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userText = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          activeLesson: activeLecture.titleEn,
          isEn,
        }),
      });
      const data = await response.json();
      if (data.reply) {
        setChatHistory((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: isEn
              ? "I encountered an error analyzing that query. Please try again."
              : "ระบบการเรียนรู้ขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Calculate progress percentage
  const totalLecturesCount = allLectures.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLecturesCount > 0 ? Math.round((completedCount / totalLecturesCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      {/* Sidebar - Syllabus & Navigation */}
      <aside className="w-full lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Back Button */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-gold-500 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{isEn ? "Back to Dashboard" : "ย้อนกลับหน้าแดชบอร์ด"}</span>
            </Link>
          </div>

          {/* Progress header bar */}
          <div className="p-5 border-b border-slate-850 space-y-2">
            <h3 className="text-sm font-bold truncate">
              {isEn ? course.titleEn : course.titleTh}
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>{isEn ? "Overall Progress" : "ความคืบหน้าการเรียน"}</span>
                <span className="text-gold-500">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gold-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Curriculum Modules */}
          <nav className="p-4 overflow-y-auto space-y-4 max-h-[40vh] lg:max-h-[70vh]">
            {course.curriculum.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-gold-500 tracking-wider uppercase">
                  {isEn ? section.sectionEn : section.sectionTh}
                </h4>
                <div className="space-y-1">
                  {section.lectures.map((lec, lIdx) => {
                    const isSelected = activeLecture.titleEn === lec.titleEn;
                    const isCompleted = completedLessons.includes(lec.titleEn);

                    return (
                      <div
                        key={lIdx}
                        className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                          isSelected ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:bg-slate-850"
                        }`}
                        onClick={() => handleLessonSelect(lec)}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent selecting the lecture
                              handleToggleProgress(lec.titleEn);
                            }}
                            className="text-gold-500 hover:text-gold-600 focus:outline-none cursor-pointer"
                          >
                            {isCompleted ? (
                              <CheckSquare className="h-4 w-4 fill-current text-gold-500" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                          <span className="truncate">{isEn ? lec.titleEn : lec.titleTh}</span>
                        </div>
                        {isSelected && <Play className="h-3.5 w-3.5 text-gold-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Video & Content Viewer */}
      <main className="flex-grow flex flex-col p-6 sm:p-10 space-y-6 overflow-y-auto">
        {/* Video Container Box */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              {isEn ? activeLecture.titleEn : activeLecture.titleTh}
            </h1>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              {/* AI Tutor Toggle Button */}
              <button
                onClick={() => setShowAiTutor(!showAiTutor)}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  showAiTutor
                    ? "bg-gold-500 text-slate-950"
                    : "bg-slate-800 text-gold-500 border border-gold-500/10 hover:bg-slate-700"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isEn ? "AI Tutor" : "ผู้ช่วย AI"}</span>
              </button>

              <button
                onClick={() => handleToggleProgress(activeLessonId)}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  completedLessons.includes(activeLessonId)
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-gold-500 border border-gold-500/10 hover:bg-slate-700"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>
                  {completedLessons.includes(activeLessonId)
                    ? (isEn ? "Completed" : "เรียนเสร็จสิ้นแล้ว")
                    : (isEn ? "Mark Complete" : "ทำเครื่องหมายเรียนเสร็จ")}
                </span>
              </button>
            </div>
          </div>

          {/* Pluggable Video player wrapper (simulates YouTube embed if url is missing) */}
          <VideoPlayer
            videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            title={isEn ? activeLecture.titleEn : activeLecture.titleTh}
          />
        </div>

        {/* Lesson descriptions */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-gold-500 tracking-widest uppercase">
            {isEn ? "About this lecture" : "รายละเอียดประกอบบทเรียน"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-light">
            {isEn
              ? "Welcome to this module. In this lecture, we map out the core foundations. Make sure to download the worksheet attachments and complete tasks before moving to the next segment."
              : "ยินดีต้อนรับสู่บทเรียนการบรรยายในส่วนนี้ กรุณาทำความเข้าใจแนวคิดหลักและดาวน์โหลดใบงานเพื่อทำแบบฝึกหัดประกอบการเรียนรู้ให้ครบถ้วนก่อนเข้าสู่เนื้อหาตอนต่อไป"}
          </p>
        </div>
      </main>

      {/* Right AI Tutor Companion Panel */}
      {showAiTutor && (
        <aside className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between shrink-0 h-[450px] lg:h-auto">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-gold-500 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {isEn ? "USP Partner AI Tutor" : "บอทวิเคราะห์แผนธุรกิจ"}
              </span>
            </div>
            <button
              onClick={() => setShowAiTutor(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs">
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex flex-col space-y-1 ${
                  chat.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  {chat.sender === "user" ? (isEn ? "You" : "คุณ") : (isEn ? "AI Coach" : "โค้ช AI")}
                </span>
                <div
                  className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                    chat.sender === "user"
                      ? "bg-gold-500 text-slate-950 font-medium rounded-tr-none"
                      : "bg-slate-800 text-slate-200 font-light rounded-tl-none border border-slate-750"
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-[10px] italic">
                <span className="animate-bounce font-extrabold text-gold-500">.</span>
                <span className="animate-bounce delay-100 font-extrabold text-gold-500">.</span>
                <span className="animate-bounce delay-200 font-extrabold text-gold-500">.</span>
                <span>{isEn ? "Thinking..." : "กำลังประมวลผล..."}</span>
              </div>
            )}
          </div>

          {/* Message input Form */}
          <form onSubmit={handleSendAiMessage} className="p-4 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder={isEn ? "Ask a coaching question..." : "พิมพ์คำถามการเรียนรู้..."}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isAiLoading}
              className="flex-grow bg-slate-950 border border-slate-800 focus:border-gold-500 focus:outline-none rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-slate-950 rounded-full cursor-pointer transition-all shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </aside>
      )}
    </div>
  );
};
