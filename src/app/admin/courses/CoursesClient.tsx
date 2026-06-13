"use client";

import React, { useState } from "react";
import { Plus, Edit, Eye, Trash2, Loader2, Save, X, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  slug: string;
  titleEn: string;
  titleTh: string;
  shortDescEn: string;
  shortDescTh: string;
  descriptionEn: string;
  descriptionTh: string;
  category: string;
  courseType: string;
  status: string;
  price: number;
  thumbnail: string;
  instructorId: string;
}

interface Instructor {
  id: string;
  nameEn: string;
  nameTh: string;
}

interface CoursesClientProps {
  initialCourses: Course[];
  instructors: Instructor[];
}

export default function CoursesClient({ initialCourses, instructors }: CoursesClientProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [titleEn, setTitleEn] = useState("");
  const [titleTh, setTitleTh] = useState("");
  const [shortDescEn, setShortDescEn] = useState("");
  const [shortDescTh, setShortDescTh] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionTh, setDescriptionTh] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Leadership");
  const [courseType, setCourseType] = useState("ONLINE");
  const [status, setStatus] = useState("PUBLISHED");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || "");

  const handleOpenCreate = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
    setEditId(null);
    
    setTitleEn("");
    setTitleTh("");
    setShortDescEn("");
    setShortDescTh("");
    setDescriptionEn("");
    setDescriptionTh("");
    setSlug("");
    setCategory("Leadership");
    setCourseType("ONLINE");
    setStatus("PUBLISHED");
    setPrice("");
    setThumbnail("");
    setInstructorId(instructors[0]?.id || "");
  };

  const handleOpenEdit = (course: Course) => {
    setError("");
    setSuccess("");
    setIsEditing(true);
    setEditId(course.id);
    
    setTitleEn(course.titleEn);
    setTitleTh(course.titleTh);
    setShortDescEn(course.shortDescEn);
    setShortDescTh(course.shortDescTh);
    setDescriptionEn(course.descriptionEn);
    setDescriptionTh(course.descriptionTh);
    setSlug(course.slug);
    setCategory(course.category);
    setCourseType(course.courseType);
    setStatus(course.status);
    setPrice(course.price.toString());
    setThumbnail(course.thumbnail);
    setInstructorId(course.instructorId);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error("Failed to refetch courses", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (!titleEn || !titleTh || !slug || !price || !instructorId) {
      setError("Please fill out all required fields.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        titleEn,
        titleTh,
        shortDescEn,
        shortDescTh,
        descriptionEn,
        descriptionTh,
        slug,
        category,
        courseType,
        status,
        price: parseFloat(price),
        thumbnail,
        instructorId
      };

      const url = editId ? `/api/courses/${editId}` : "/api/courses";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save course");
      }

      setSuccess(editId ? "Course updated successfully!" : "New course created successfully!");
      setIsEditing(false);
      setEditId(null);
      fetchCourses();
    } catch (err: any) {
      setError(err.message || "Failed to save course. Please check inputs.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course profile?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      setSuccess("Course deleted successfully!");
      fetchCourses();
    } catch (err: any) {
      setError(err.message || "Failed to delete course.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold animate-slide-in">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold animate-slide-in flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manage Executive Courses</h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Create, edit, publish, or archive your syllabus modules and monitor paid admissions.
          </p>
        </div>
        {!isEditing && (
          <div>
            <button
              onClick={handleOpenCreate}
              className="bg-slate-900 hover:bg-slate-800 text-gold-500 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Course</span>
            </button>
          </div>
        )}
      </div>

      {/* Creation / Editing Form */}
      {isEditing ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-6">
            {editId ? "Edit Course Profile / แก้ไขข้อมูลหลักสูตร" : "Create New Course / เพิ่มหลักสูตรใหม่"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Dual column: Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Course Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Executive Leadership Mastery"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  ชื่อหลักสูตร (ภาษาไทย) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleTh}
                  onChange={(e) => setTitleTh(e.target.value)}
                  placeholder="เช่น สุดยอดภาวะผู้นำผู้บริหารระดับสูง"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Dual column: Slug & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Course Slug (URL path) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. executive-leadership-mastery"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-850 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Price (THB) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Triple column: Category, Type, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Category / หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="Leadership">Leadership</option>
                  <option value="Management">Management</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Course Type / รูปแบบ <span className="text-red-500">*</span>
                </label>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="ONSITE">ONSITE</option>
                  <option value="HYBRID">HYBRID</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Publishing Status / สถานะ <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            {/* Instructor Selection & Thumbnail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Assigned Instructor / ผู้สอน <span className="text-red-500">*</span>
                </label>
                <select
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 cursor-pointer"
                >
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nameEn} ({inst.nameTh})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Thumbnail Image URL / ลิงก์รูปภาพประกอบ
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Dual column: Short Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Short Description (English)
                </label>
                <textarea
                  rows={2}
                  value={shortDescEn}
                  onChange={(e) => setShortDescEn(e.target.value)}
                  placeholder="Brief summary of the course content..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  คำอธิบายสั้นๆ (ภาษาไทย)
                </label>
                <textarea
                  rows={2}
                  value={shortDescTh}
                  onChange={(e) => setShortDescTh(e.target.value)}
                  placeholder="คำอธิบายเนื้อหาหลักสูตรสั้นๆ..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Dual column: Full Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Full Description (English)
                </label>
                <textarea
                  rows={4}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Comprehensive description of syllabus outline..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  รายละเอียดหลักสูตร (ภาษาไทย)
                </label>
                <textarea
                  rows={4}
                  value={descriptionTh}
                  onChange={(e) => setDescriptionTh(e.target.value)}
                  placeholder="รายละเอียดเนื้อหาหลักสูตรเต็มรูปแบบ..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
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
                <span>Save Course</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-slate-250 hover:border-slate-350 bg-white text-slate-600 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Courses List Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase tracking-wider font-semibold">
                  <th className="p-4 w-[40%]">English / Thai Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-400 italic">
                      No courses found in database directory. Click "Create Course" to add one.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 space-y-1.5 font-medium">
                        <div className="text-slate-950 text-sm font-bold">{course.titleEn}</div>
                        <div className="text-slate-400 text-xs font-normal">{course.titleTh}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-semibold text-[10px] uppercase">
                          {course.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{course.courseType}</td>
                      <td className="p-4 font-bold text-slate-900">
                        {new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(course.price)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            course.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/courses/${course.slug}`}
                            target="_blank"
                            className="p-1.5 border border-slate-200 hover:border-gold-500 hover:text-gold-500 rounded text-slate-450 transition-all"
                            title="Preview course"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(course)}
                            className="p-1.5 border border-slate-200 hover:border-gold-500 hover:text-gold-500 rounded text-slate-450 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="p-1.5 border border-slate-200 hover:border-red-500 hover:text-red-500 rounded text-slate-450 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
