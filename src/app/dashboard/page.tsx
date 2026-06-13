import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import { BookOpen, Ticket, Award, CheckCircle, ChevronRight, PlayCircle, Shield } from "lucide-react";

// Mock Fallbacks if database is empty/offline
const MOCK_ENROLLMENTS = [
  {
    id: "enroll-1",
    status: "ACTIVE",
    course: {
      id: "course-1",
      slug: "executive-leadership-mastery",
      titleEn: "Executive Leadership Mastery (ELM)",
      titleTh: "สุดยอดภาวะผู้นำผู้บริหารระดับสูง (ELM)",
      thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
      category: "Leadership",
      courseType: "HYBRID",
      curriculum: [
        {
          lectures: [
            { titleEn: "1.1 Establishing Corporate Alignment" },
            { titleEn: "1.2 Designing Growth Flywheels" },
          ],
        },
        {
          lectures: [
            { titleEn: "2.1 Building Trust and Accountability" },
            { titleEn: "2.2 Scaling Decision Protocols" },
          ],
        },
      ],
    },
    progressPercent: 25,
  },
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const isEn = lang === "en";

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  let enrollments: any[] = MOCK_ENROLLMENTS;
  let membershipTier = "PLATINUM";

  try {
    // 1. Fetch User Subscription
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });
    if (subscription) {
      membershipTier = subscription.tier;
    } else {
      membershipTier = "FREE";
    }

    // 2. Fetch User Enrollments
    const dbEnrollments = await db.enrollment.findMany({
      where: { userId, status: "ACTIVE" },
      include: { course: true },
    });

    if (dbEnrollments.length > 0) {
      const mappedEnrollments = [];
      for (const enroll of dbEnrollments) {
        // Calculate progress percentage
        const completedCount = await db.lessonProgress.count({
          where: { userId, courseId: enroll.courseId, isCompleted: true },
        });

        // Count total lectures in curriculum JSON
        let totalLectures = 4; // default fallback
        try {
          const curriculum = enroll.course.curriculum as any[];
          if (Array.isArray(curriculum)) {
            totalLectures = curriculum.reduce((acc, section) => {
              return acc + (Array.isArray(section.lectures) ? section.lectures.length : 0);
            }, 0);
          }
        } catch (e) {
          console.error("Error parsing course curriculum JSON:", e);
        }

        const progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

        mappedEnrollments.push({
          id: enroll.id,
          status: enroll.status,
          course: enroll.course,
          progressPercent,
        });
      }
      enrollments = mappedEnrollments;
    }
  } catch (error) {
    console.warn("Prisma fetch failed for DashboardPage, loading default fallbacks.", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Dashboard Nav links / Info Card */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl border border-gold-500/10 p-6 dark-premium-gradient shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-gold-500">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Partner</p>
                <p className="text-xs font-bold truncate max-w-[150px]">{userEmail}</p>
              </div>
            </div>
            <hr className="border-slate-800" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Membership Tier:</span>
              <span className="font-extrabold gold-text-gradient tracking-wide uppercase">
                {membershipTier}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-50 text-gold-600 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <BookOpen className="h-4 w-4 text-gold-500" />
              <span>My Courses</span>
            </Link>
            <Link
              href="/dashboard/tickets"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Ticket className="h-4 w-4 text-gold-500" />
              <span>Workshop Tickets</span>
            </Link>
            <Link
              href="/membership"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Award className="h-4 w-4 text-gold-500" />
              <span>Billing Membership</span>
            </Link>
          </div>
        </div>

        {/* Right Side Main Panel Content */}
        <div className="lg:col-span-9 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">My Learning Dashboard</h1>
            <p className="text-xs text-slate-500 font-light">
              Welcome to your executive learning portal. Access your curriculum modules and track check-in tickets.
            </p>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-4">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Enrolled Courses</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                You are not currently enrolled in any executive masterclasses. Browse our catalog to get started.
              </p>
              <Link
                href="/courses"
                className="inline-block bg-slate-950 text-gold-500 font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enrollments.map((enroll) => (
                <div
                  key={enroll.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden shrink-0">
                    <img
                      src={enroll.course.thumbnail}
                      alt={isEn ? enroll.course.titleEn : enroll.course.titleTh}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow w-full space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-gold-600 tracking-wider uppercase">
                        {enroll.course.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-950">
                        {isEn ? enroll.course.titleEn : enroll.course.titleTh}
                      </h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Course Progress</span>
                        <span className="text-gold-600 font-bold">{enroll.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gold-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${enroll.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Type: {enroll.course.courseType}
                      </span>
                      <Link
                        href={`/classroom/${enroll.course.slug}`}
                        className="inline-flex items-center space-x-1.5 bg-slate-950 hover:bg-slate-900 text-gold-500 font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Continue Learning</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
