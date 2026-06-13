"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Globe, ArrowLeft, Loader2, Award, BookOpen, Volume2, Save, X, Eye } from "lucide-react";
import Link from "next/link";

interface Instructor {
  id: string;
  nameEn: string;
  nameTh: string;
  titleEn: string;
  titleTh: string;
  bioEn: string;
  bioTh: string;
  avatar: string;
  website: string | null;
  linkedin: string | null;
  roleType: "EXECUTIVE" | "COACH" | "SPEAKER";
}

import FeatureDisabled from "../../../components/layout/FeatureDisabled";

export default function AdminInstructorsPage() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function checkFeature() {
      try {
        const res = await fetch("/api/features");
        const data = await res.json();
        if (data.success && data.features) {
          setIsEnabled(data.features.instructors !== false);
        } else {
          setIsEnabled(true);
        }
      } catch (err) {
        setIsEnabled(true);
      }
    }
    checkFeature();
  }, []);


  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameTh, setNameTh] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleTh, setTitleTh] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [bioTh, setBioTh] = useState("");
  const [avatar, setAvatar] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [roleType, setRoleType] = useState<"EXECUTIVE" | "COACH" | "SPEAKER">("COACH");

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/instructors");
      if (!res.ok) throw new Error("Failed to load instructors");
      const data = await res.json();
      setInstructors(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch instructors list.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(true);
    setEditId(null);
    setNameEn("");
    setNameTh("");
    setTitleEn("");
    setTitleTh("");
    setBioEn("");
    setBioTh("");
    setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200");
    setWebsite("");
    setLinkedin("");
    setRoleType("COACH");
    setError("");
    setSuccess("");
  };

  const handleOpenEdit = (inst: Instructor) => {
    setIsEditing(true);
    setEditId(inst.id);
    setNameEn(inst.nameEn);
    setNameTh(inst.nameTh);
    setTitleEn(inst.titleEn);
    setTitleTh(inst.titleTh);
    setBioEn(inst.bioEn);
    setBioTh(inst.bioTh);
    setAvatar(inst.avatar);
    setWebsite(inst.website || "");
    setLinkedin(inst.linkedin || "");
    setRoleType(inst.roleType);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      nameEn,
      nameTh,
      titleEn,
      titleTh,
      bioEn,
      bioTh,
      avatar,
      website: website || null,
      linkedin: linkedin || null,
      roleType
    };

    try {
      const url = editId ? `/api/instructors/${editId}` : "/api/instructors";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save instructor profile");

      setSuccess(editId ? "Profile updated successfully!" : "New profile created successfully!");
      setIsEditing(false);
      setEditId(null);
      fetchInstructors();
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/instructors/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete instructor");

      setSuccess("Profile deleted successfully!");
      fetchInstructors();
    } catch (err) {
      console.error(err);
      setError("Failed to delete profile.");
    }
  };

  const getRoleIcon = (type: string) => {
    switch (type) {
      case "EXECUTIVE":
        return <Award className="h-4 w-4 text-gold-500" />;
      case "COACH":
        return <BookOpen className="h-4 w-4 text-amber-500" />;
      case "SPEAKER":
        return <Volume2 className="h-4 w-4 text-indigo-500" />;
      default:
        return null;
    }
  };

  if (isEnabled === false) {
    return <FeatureDisabled moduleNameEn="Team & Speakers" moduleNameTh="ทีมงานและวิทยากร" isAdminPage={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manage Team, Coaches & Speakers</h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Add or edit details for executive board members, scaling coaches, and keynote speakers.
          </p>
        </div>
        {!isEditing && (
          <div>
            <button
              onClick={handleOpenCreate}
              className="bg-slate-900 hover:bg-slate-800 text-gold-500 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Team Member</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-205 text-red-700 px-4 py-3 rounded-xl text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs">
          {success}
        </div>
      )}

      {isEditing ? (
        /* Edit/Create Form Container */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100 flex items-center">
            {editId ? "Edit Profile Details" : "Create New Profile"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name (EN) */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Dr. Walter Peterson"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Name (TH) */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Name (Thai) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameTh}
                  onChange={(e) => setNameTh(e.target.value)}
                  placeholder="ดร. วอลเตอร์ พีเตอร์สัน"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Title (EN) */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Title / Position (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Executive Leadership Coach"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Title (TH) */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Title / Position (Thai) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleTh}
                  onChange={(e) => setTitleTh(e.target.value)}
                  placeholder="โค้ชภาวะผู้นำผู้บริหารระดับสูง"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Role Type */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Classification Group
                </label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="EXECUTIVE">Executive Board (ผู้บริหาร)</option>
                  <option value="COACH">Specialist Coach (โค้ช)</option>
                  <option value="SPEAKER">Keynote Speaker (วิทยากร)</option>
                </select>
              </div>

              {/* Avatar Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  required
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  LinkedIn URL (Optional)
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Bio (EN) */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Short Biography (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={bioEn}
                onChange={(e) => setBioEn(e.target.value)}
                placeholder="Walter has over 20 years of experience..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 leading-relaxed"
              />
            </div>

            {/* Bio (TH) */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Short Biography (Thai) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={bioTh}
                onChange={(e) => setBioTh(e.target.value)}
                placeholder="วอลเตอร์ มีประสบการณ์กว่า 20 ปีในการ..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 text-gold-500 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save Profile</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-slate-250 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Team Members List */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
              <p className="text-xs text-slate-450">Loading profile directories...</p>
            </div>
          ) : instructors.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Award className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Team Profiles Configured</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Add executives, specialist training coaches, or speakers to display on your corporate website.
              </p>
              <button
                onClick={handleOpenCreate}
                className="bg-slate-950 text-gold-500 font-semibold px-5 py-2 rounded-full text-xs cursor-pointer"
              >
                Add Member Now
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase tracking-wider font-semibold">
                    <th className="p-4 w-16">Avatar</th>
                    <th className="p-4">Name (EN / TH)</th>
                    <th className="p-4">Title / Position</th>
                    <th className="p-4">Classification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                  {instructors.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Avatar */}
                      <td className="p-4">
                        <img
                          src={inst.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                          alt={inst.nameEn}
                          className="w-10 h-10 rounded-full object-cover border border-gold-500/20"
                        />
                      </td>

                      {/* Name */}
                      <td className="p-4 space-y-1 font-medium">
                        <div className="text-slate-950 text-sm font-bold">{inst.nameEn}</div>
                        <div className="text-slate-450 text-xs font-normal">{inst.nameTh}</div>
                      </td>

                      {/* Title */}
                      <td className="p-4 space-y-1 font-medium">
                        <div className="text-slate-850 font-bold">{inst.titleEn}</div>
                        <div className="text-slate-500 text-xxs font-normal">{inst.titleTh}</div>
                      </td>

                      {/* Role Classification */}
                      <td className="p-4">
                        <span className="bg-slate-50 border border-slate-200 text-slate-800 px-2.5 py-1 rounded-full font-semibold text-[9px] uppercase tracking-wide inline-flex items-center space-x-1.5 shadow-sm">
                          {getRoleIcon(inst.roleType)}
                          <span>{inst.roleType}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href="/about"
                            target="_blank"
                            className="p-1.5 border border-slate-200 hover:border-gold-500 hover:text-gold-500 rounded text-slate-450 transition-all"
                            title="Preview on site"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(inst)}
                            className="p-1.5 border border-slate-200 hover:border-gold-500 hover:text-gold-500 rounded text-slate-450 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(inst.id)}
                            className="p-1.5 border border-slate-200 hover:border-red-500 hover:text-red-500 rounded text-slate-450 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
