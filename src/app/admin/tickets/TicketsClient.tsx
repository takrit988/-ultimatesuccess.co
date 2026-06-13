"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Search, Loader2, Calendar, User, ShieldAlert } from "lucide-react";

export const TicketsClient: React.FC = () => {
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: "success" | "already_used" | "invalid";
    message: string;
    student?: string;
    course?: string;
    date?: string;
  } | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/tickets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({
        status: "invalid",
        message: "An error occurred during ticket validation.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Workshop Ticket Scanner</h1>
        <p className="text-xs text-slate-500 font-light mt-0.5">
          Scan or input unique workshop ticket codes to authenticate executive student admissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left column: Scan form */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Validate Check-In Code
          </h3>

          <form onSubmit={handleValidate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-450 uppercase tracking-wider block">
                Enter Ticket Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. USP-ELM-9871A"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 focus:border-gold-500 focus:outline-none rounded-lg px-4 py-3 text-xs text-slate-900 uppercase font-mono tracking-widest pl-10"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-900 text-gold-500 font-bold py-3.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-gold-500" />
              ) : (
                <span>Validate Pass</span>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Results display */}
        <div className="md:col-span-7">
          {result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-full flex flex-col justify-between">
              {result.status === "success" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-emerald-600 bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                    <CheckCircle className="h-8 w-8 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-sm uppercase">Check-In Successful</h4>
                      <p className="text-[10px] text-emerald-600 font-medium">{result.message}</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-4 text-xs font-light text-slate-650">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gold-500" />
                      <span><strong>Student:</strong> {result.student}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gold-500" />
                      <span><strong>Course:</strong> {result.course}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.status === "already_used" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <ShieldAlert className="h-8 w-8 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-sm uppercase">Ticket Already Scanned</h4>
                      <p className="text-[10px] text-amber-600 font-medium">{result.message}</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-4 text-xs font-light text-slate-650">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gold-500" />
                      <span><strong>Student:</strong> {result.student}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gold-500" />
                      <span><strong>Course:</strong> {result.course}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gold-500" />
                      <span><strong>Scanned At:</strong> {result.date}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.status === "invalid" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-red-650 bg-red-50 border border-red-100 p-4 rounded-xl">
                    <AlertTriangle className="h-8 w-8 text-red-500 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-sm uppercase">Invalid Code</h4>
                      <p className="text-[10px] text-red-550 font-medium">{result.message}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                Admission Control Terminal
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-250 p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <Search className="h-10 w-10 text-slate-300" />
              <h4 className="font-bold text-slate-700 text-sm">Awaiting Scan</h4>
              <p className="text-xs text-slate-450 max-w-xs leading-relaxed font-light">
                Input or scan a partner's ticket ID to retrieve registration status and process check-in confirmation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
