"use client";

import React, { useState } from "react";
import { Search, Building2, User, Phone, Mail, History, Sparkles, Plus, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  position: string | null;
  phone: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "WON" | "LOST";
  notes: string[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface CrmClientProps {
  initialLeads: Lead[];
  isEn: boolean;
}

const STAGES = [
  { id: "NEW", labelEn: "New Leads", labelTh: "ผู้ติดต่อใหม่", color: "border-t-blue-500 bg-blue-500/5 text-blue-400" },
  { id: "CONTACTED", labelEn: "Contacted", labelTh: "ติดต่อแล้ว", color: "border-t-amber-500 bg-amber-500/5 text-amber-400" },
  { id: "QUALIFIED", labelEn: "Qualified", labelTh: "ผ่านเกณฑ์", color: "border-t-indigo-500 bg-indigo-500/5 text-indigo-400" },
  { id: "PROPOSAL", labelEn: "Proposal Sent", labelTh: "เสนอราคา", color: "border-t-purple-500 bg-purple-500/5 text-purple-400" },
  { id: "WON", labelEn: "Won / Converted", labelTh: "ปิดการขายได้", color: "border-t-emerald-500 bg-emerald-500/5 text-emerald-400" },
  { id: "LOST", labelEn: "Closed Lost", labelTh: "ปิดแพ้", color: "border-t-rose-500 bg-rose-500/5 text-rose-400" },
];

export const CrmClient: React.FC<CrmClientProps> = ({ initialLeads, isEn }) => {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtered leads based on search query
  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.company && lead.company.toLowerCase().includes(q)) ||
      (lead.position && lead.position.toLowerCase().includes(q))
    );
  });

  const handleStageChange = async (leadId: string, newStatus: Lead["status"]) => {
    setIsUpdating(true);
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const res = await fetch("/api/crm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Update overlay lead if currently focused
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
        }
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update lead stage", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    setIsUpdating(true);
    const updatedNoteContent = `${new Date().toLocaleDateString(isEn ? "en-US" : "th-TH")}: ${newNote}`;

    // Optimistic Update
    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id ? { ...l, notes: [...l.notes, updatedNoteContent] } : l
      )
    );
    setSelectedLead((prev) =>
      prev ? { ...prev, notes: [...prev.notes, updatedNoteContent] } : null
    );

    try {
      const res = await fetch("/api/crm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          status: selectedLead.status,
          notes: updatedNoteContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewNote("");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to add interaction note", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-gold-500" />
            <span>{isEn ? "Executive CRM Pipeline" : "ระบบจัดการลูกค้าสัมพันธ์ (CRM)"}</span>
          </h1>
          <p className="text-xs text-slate-500 font-light">
            {isEn
              ? "Track entrepreneur prospects, pipeline status, and executive client interactions."
              : "ติดตามลูกค้าเป้าหมาย สถานะการติดต่อ และประวัติบันทึกการดูแลลูกค้าระดับผู้บริหาร"}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <input
            type="text"
            placeholder={isEn ? "Search prospects..." : "ค้นหาลูกค้าเป้าหมาย..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-gold-500 focus:outline-none rounded-full px-4 py-2.5 text-xs text-slate-800 pr-10 shadow-sm"
          />
          <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
          return (
            <div
              key={stage.id}
              className={`rounded-2xl border-t-4 border border-slate-200 p-4 flex flex-col space-y-4 shrink-0 min-w-[200px] md:min-w-0 ${stage.color}`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-850">
                  {isEn ? stage.labelEn : stage.labelTh}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-950 text-white rounded-full">
                  {stageLeads.length}
                </span>
              </div>

              {/* Stage Leads Cards */}
              <div className="flex-grow flex flex-col space-y-3 min-h-[300px]">
                {stageLeads.length === 0 ? (
                  <div className="flex-grow border-2 border-dashed border-slate-200/50 rounded-xl flex items-center justify-center p-4">
                    <span className="text-[10px] text-slate-400 font-light italic">
                      {isEn ? "Empty" : "ไม่มีข้อมูล"}
                    </span>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow transition-all hover:border-gold-500/30 cursor-pointer text-left space-y-2"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{lead.name}</h4>
                        {lead.company && (
                          <p className="text-[10px] text-slate-500 font-light truncate flex items-center space-x-1">
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span>{lead.company}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="text-[9px] text-slate-400 font-light truncate max-w-[100px]">
                          {lead.email}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium capitalize">
                          {lead.position || "Lead"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Side Drawer Modal Overlay */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50 transition-all duration-300">
          <div className="w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-gold-600 uppercase tracking-widest bg-gold-500/10 px-2.5 py-0.5 rounded">
                    Prospect Profile
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedLead.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Lead Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">{isEn ? "Company:" : "บริษัท:"}</span>
                  <span className="col-span-2 font-bold text-slate-800">{selectedLead.company || "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">{isEn ? "Position:" : "ตำแหน่ง:"}</span>
                  <span className="col-span-2 font-bold text-slate-800">{selectedLead.position || "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">{isEn ? "Email:" : "อีเมล:"}</span>
                  <span className="col-span-2 font-bold text-slate-800 flex items-center space-x-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedLead.email}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">{isEn ? "Phone:" : "เบอร์โทร:"}</span>
                  <span className="col-span-2 font-bold text-slate-800 flex items-center space-x-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{selectedLead.phone || "-"}</span>
                  </span>
                </div>
              </div>

              {/* Pipeline Stage Transition selectors */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  {isEn ? "Transition Pipeline Stage:" : "เปลี่ยนสถานะสเตจหลัก:"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      disabled={isUpdating}
                      onClick={() => handleStageChange(selectedLead.id, s.id as any)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        selectedLead.status === s.id
                          ? "bg-slate-950 text-gold-500 border border-slate-900"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-transparent"
                      }`}
                    >
                      {isEn ? s.id : s.labelTh}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Activity Log History */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <History className="h-4 w-4 text-slate-400" />
                  <span>{isEn ? "Interaction Logs & Notes" : "บันทึกการติดตามดูแลลูกค้า"}</span>
                </h3>

                <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {selectedLead.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 font-light italic">
                      {isEn ? "No interaction history logged." : "ยังไม่มีบันทึกประวัติการติดต่อ"}
                    </p>
                  ) : (
                    selectedLead.notes.map((note, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-xs">
                        <p className="text-slate-750 leading-relaxed font-light">{note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="border-t border-slate-100 pt-4 space-y-2">
              <textarea
                placeholder={isEn ? "Add contact report or follow up note..." : "พิมพ์รายละเอียดบันทึกการคุยล่าสุด..."}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={isUpdating}
                className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-xl p-3 text-xs text-slate-800 h-16 resize-none"
              />
              <button
                type="submit"
                disabled={isUpdating || !newNote.trim()}
                className="w-full bg-slate-950 hover:bg-slate-900 text-gold-500 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
              >
                {isEn ? "Add Interaction Note" : "บันทึกข้อมูลติดต่อ"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
