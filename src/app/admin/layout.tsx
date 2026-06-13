import React from "react";
import Link from "next/link";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { Shield, LayoutDashboard, BookOpen, FileText, Users, ArrowLeft, LogOut, TrendingUp, Ticket, Award, Settings } from "lucide-react";
import { getAllFeatureToggles } from "../../lib/features";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // double check security in SSR layout
  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;
  const isAuthorized = ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR", "COURSE_MANAGER"].includes(role);
  if (!isAuthorized) {
    redirect("/");
  }

  const features = await getAllFeatureToggles();

  const navItems = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    ...(features.bi ? [{ name: "BI Analytics", href: "/admin/bi", icon: <TrendingUp className="h-4 w-4" /> }] : []),
    ...(features.crm ? [{ name: "CRM Pipelines", href: "/admin/crm", icon: <Users className="h-4 w-4" /> }] : []),
    ...(features.courses ? [{ name: "Courses", href: "/admin/courses", icon: <BookOpen className="h-4 w-4" /> }] : []),
    ...(features.blog ? [{ name: "Blog Posts", href: "/admin/blog", icon: <FileText className="h-4 w-4" /> }] : []),
    ...(features.instructors ? [{ name: "Team & Speakers", href: "/admin/instructors", icon: <Award className="h-4 w-4" /> }] : []),
    ...(features.users ? [{ name: "User Directory", href: "/admin/users", icon: <Users className="h-4 w-4" /> }] : []),
    ...(role === "SUPER_ADMIN" || role === "ADMIN" ? [{ name: "System Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> }] : []),
  ];


  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-gold-500" />
            <span className="font-extrabold tracking-tight text-white text-sm">
              SUCCESS<span className="text-gold-500 ml-1">ADMIN</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-xs font-semibold rounded-lg hover:bg-slate-800 hover:text-white transition-all"
              >
                <span className="text-gold-500">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-4 py-2 text-[10px] text-slate-500 truncate">
            {session.user.email}
          </div>
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-2.5 text-xs font-medium rounded-lg hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            <span>Main Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top bar header info */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Control Center / Dashboard
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-gold-500/10 text-gold-500 text-[10px] font-bold px-2.5 py-1 rounded border border-gold-500/20">
              {role}
            </span>
          </div>
        </header>

        {/* Dash Children page container */}
        <main className="p-8 flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
