"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings, 
  TrendingUp, 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  Ticket, 
  Share2, 
  ShieldAlert, 
  Loader2, 
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

interface FeatureToggle {
  key: string;
  nameEn: string;
  nameTh: string;
  isEnabled: boolean;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Fetch current toggles on mount
  useEffect(() => {
    async function fetchFeatures() {
      try {
        const res = await fetch("/api/admin/features");
        const data = await res.json();
        if (data.success) {
          setFeatures(data.features);
        } else {
          showNotification("Failed to load settings: " + data.error, "error");
        }
      } catch (err) {
        showNotification("Failed to connect to administration API.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchFeatures();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleToggle = async (key: string, currentStatus: boolean) => {
    setUpdatingKey(key);
    try {
      const nextStatus = !currentStatus;
      const res = await fetch("/api/admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, isEnabled: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeatures(prev => 
          prev.map(f => f.key === key ? { ...f, isEnabled: nextStatus } : f)
        );
        showNotification(`Module "${key.toUpperCase()}" updated successfully.`, "success");
        // Force Next.js to re-render Server Components (like Sidebar in Layout)
        router.refresh();
      } else {
        showNotification(`Failed to toggle: ${data.error}`, "error");
      }
    } catch (err) {
      showNotification("Network error occurred while toggling module.", "error");
    } finally {
      setUpdatingKey(null);
    }
  };

  const getIcon = (key: string) => {
    switch (key) {
      case "bi": return <TrendingUp className="h-5 w-5 text-indigo-500" />;
      case "crm": return <Users className="h-5 w-5 text-blue-500" />;
      case "courses": return <BookOpen className="h-5 w-5 text-amber-500" />;
      case "blog": return <FileText className="h-5 w-5 text-emerald-500" />;
      case "instructors": return <Award className="h-5 w-5 text-purple-500" />;
      case "users": return <Users className="h-5 w-5 text-cyan-500" />;
      case "tickets": return <Ticket className="h-5 w-5 text-rose-500" />;
      case "affiliate": return <Share2 className="h-5 w-5 text-gold-500" />;
      default: return <Settings className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Settings className="h-6 w-6 text-gold-500 mr-2 animate-spin-slow" />
            System Settings & Feature Control
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Configure system module visibility and restrict access to CRM, BI Analytics, LMS courses, and affiliate tools.
          </p>
        </div>
      </div>

      {/* Notifications Toast */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 text-xs border ${
          notification.type === "success" 
            ? "bg-emerald-50 border-emerald-250 text-emerald-800" 
            : "bg-rose-50 border-rose-250 text-rose-800"
        } transition-all duration-300 animate-slide-in shadow-sm`}>
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Main Settings Panel */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading platform configuration...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Available Platform Components
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">
              Total Modules: {features.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {features.map((feature) => (
              <div 
                key={feature.key} 
                className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-800/40 transition-colors"
              >
                {/* Module description */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-150 shrink-0">
                    {getIcon(feature.key)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{feature.nameEn}</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-medium text-slate-650 text-xs">{feature.nameTh}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-light font-mono uppercase">
                      Module Key: <span className="font-semibold text-slate-500">{feature.key}</span>
                    </p>
                    {/* Status hint badge */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      {feature.isEnabled ? (
                        <>
                          <Eye className="h-3 w-3 text-emerald-500" />
                          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">
                            Active & Public / เปิดใช้งานปกติ
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-rose-500" />
                          <span className="text-[9px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded">
                            Hidden & Deactivated / ปิดการใช้งาน
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Toggle control switch */}
                <div className="mt-4 sm:mt-0 flex items-center space-x-3 self-end sm:self-center">
                  {updatingKey === feature.key && (
                    <Loader2 className="h-4 w-4 text-gold-500 animate-spin" />
                  )}
                  <button
                    onClick={() => handleToggle(feature.key, feature.isEnabled)}
                    disabled={updatingKey === feature.key}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      feature.isEnabled ? "bg-gold-500" : "bg-slate-200"
                    } ${updatingKey === feature.key ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        feature.isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info notice box */}
      <div className="p-4 bg-amber-50/50 border border-amber-500/10 rounded-2xl flex items-start space-x-3 text-xs text-amber-800">
        <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">System Administration Notice</p>
          <p className="font-light leading-relaxed">
            Disabling any component here will immediately hide its corresponding links in the navigation bar and layout sidebars. If any user (including other admins) attempts to directly navigate to a disabled module, they will see a customized "Deactivated Module" notice. Toggles can be reactivated at any time without database loss.
          </p>
        </div>
      </div>
    </div>
  );
}
