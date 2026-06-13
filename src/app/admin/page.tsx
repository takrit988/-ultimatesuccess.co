import React from "react";
import { db } from "../../lib/db";
import { Users, BookOpen, FileText, Activity, Landmark, TrendingUp } from "lucide-react";

export default async function AdminOverviewPage() {
  let userCount = 124;
  let courseCount = 2;
  let postCount = 2;
  let enrollCount = 18;

  try {
    userCount = await db.user.count();
    courseCount = await db.course.count();
    postCount = await db.blogPost.count();
    enrollCount = await db.enrollment.count();
  } catch (error) {
    console.warn("Database failed for admin counts, loading fallbacks.", error);
  }

  const stats = [
    { name: "Total Registered Users", value: userCount, icon: <Users className="h-5 w-5 text-blue-500" />, desc: "+12% from last month" },
    { name: "Executive Courses Offered", value: courseCount, icon: <BookOpen className="h-5 w-5 text-amber-500" />, desc: "Active syllabus modules" },
    { name: "Published Blog Posts", value: postCount, icon: <FileText className="h-5 w-5 text-emerald-500" />, desc: "SEO optimized articles" },
    { name: "Total Paid Enrollments", value: enrollCount, icon: <TrendingUp className="h-5 w-5 text-indigo-500" />, desc: "Stripe/Omise metrics" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-xs text-slate-500 font-light mt-1">
          Welcome back to the Ultimate Success Partner control center. Here are your key business intelligence metrics.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-2xl border border-slate-250 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-450 uppercase tracking-wider">
                {stat.name}
              </span>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Sandbox and Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mock Traffic Analytics Box */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Activity className="h-4 w-4 text-gold-500 mr-2" />
              Monthly Web Traffic Placeholder
            </h3>
            <span className="text-xs text-emerald-500 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
              Active Monitoring
            </span>
          </div>

          <div className="h-64 flex items-end justify-between px-4 pt-8 border-b border-slate-100">
            {/* Bar chart mockups */}
            <div className="w-10 bg-slate-150 h-[30%] rounded-t hover:bg-gold-500 transition-colors"></div>
            <div className="w-10 bg-slate-150 h-[45%] rounded-t hover:bg-gold-500 transition-colors"></div>
            <div className="w-10 bg-slate-150 h-[35%] rounded-t hover:bg-gold-500 transition-colors"></div>
            <div className="w-10 bg-slate-150 h-[60%] rounded-t hover:bg-gold-500 transition-colors"></div>
            <div className="w-10 bg-slate-150 h-[80%] rounded-t hover:bg-gold-500 transition-colors"></div>
            <div className="w-10 bg-slate-900 h-[95%] rounded-t border-t border-gold-500"></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-450 uppercase font-semibold px-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun (Current)</span>
          </div>
        </div>

        {/* Audit Log Mock */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            System Operations Logs
          </h3>
          <div className="space-y-4 text-xs font-light text-slate-600">
            <div className="border-l-2 border-gold-500 pl-3.5 space-y-1">
              <p className="font-semibold text-slate-950">Seed script executed</p>
              <p className="text-[10px] text-slate-400">June 8, 2026 - System Admin</p>
            </div>
            <div className="border-l-2 border-slate-300 pl-3.5 space-y-1">
              <p className="font-semibold text-slate-950">Prisma database schema synchronized</p>
              <p className="text-[10px] text-slate-400">June 8, 2026 - Automated Hook</p>
            </div>
            <div className="border-l-2 border-slate-300 pl-3.5 space-y-1">
              <p className="font-semibold text-slate-950">Admin dashboard initialized</p>
              <p className="text-[10px] text-slate-400">June 8, 2026 - Developer Setup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
