import React from "react";
import { db } from "../../../lib/db";
import { Shield, Mail, Calendar, Key, UserCheck } from "lucide-react";

// Mock Fallbacks
const MOCK_USERS = [
  {
    id: "user-1",
    email: "admin@ultimatesuccess.co",
    role: "SUPER_ADMIN",
    createdAt: new Date("2026-06-01"),
    profile: { company: "Ultimate Success Partners", position: "CEO" },
  },
  {
    id: "user-2",
    email: "member@partner.co",
    role: "MEMBER",
    createdAt: new Date("2026-06-05"),
    profile: { company: "SME Alpha", position: "Director" },
  },
];

import { getFeatureToggle } from "../../../lib/features";
import { FeatureDisabled } from "../../../components/layout/FeatureDisabled";

export default async function AdminUsersPage() {
  const isEnabled = await getFeatureToggle("users");
  if (!isEnabled) {
    return <FeatureDisabled moduleNameEn="User Directory" moduleNameTh="ระบบจัดการผู้ใช้งาน" isAdminPage={true} />;
  }

  let users: Array<{
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    profile: { company: string; position: string } | null;
  }> = MOCK_USERS;

  try {

    const dbUsers = await db.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbUsers.length > 0) {
      users = dbUsers.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        profile: u.profile ? { company: u.profile.company || "", position: u.profile.position || "" } : null,
      }));
    }
  } catch (error) {
    console.warn("Prisma users fetch failed in AdminUsersPage, using fallbacks.", error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">User Directory</h1>
        <p className="text-xs text-slate-500 font-light mt-0.5">
          View registered partners, SMEs, and assign role-based access control (RBAC) privileges.
        </p>
      </div>

      {/* Users List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase tracking-wider font-semibold">
                <th className="p-4">Partner Details</th>
                <th className="p-4">Company & Position</th>
                <th className="p-4">Registered At</th>
                <th className="p-4">Security Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 flex items-center space-x-3 font-medium">
                    <div className="p-2 bg-slate-50 border border-slate-150 rounded-lg text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-slate-950 font-bold text-sm">{user.email}</div>
                      <div className="text-[10px] text-slate-400 font-normal">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="p-4 space-y-1">
                    {user.profile ? (
                      <>
                        <div className="font-bold text-slate-900">{user.profile.company || "N/A"}</div>
                        <div className="text-slate-450 text-[10px] uppercase font-semibold">{user.profile.position || "N/A"}</div>
                      </>
                    ) : (
                      <span className="text-slate-400">No Profile Data</span>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-slate-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        user.role.includes("ADMIN")
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}
                    >
                      <Shield className="h-3 w-3 mr-0.5" />
                      <span>{user.role}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 border border-slate-200 hover:border-gold-500 hover:text-gold-500 rounded text-slate-450 transition-all cursor-not-allowed">
                      <Key className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
