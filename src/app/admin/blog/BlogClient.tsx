"use client";

import React, { useState } from "react";
import { Plus, Edit, Eye, Trash2, Loader2, Save, X, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleTh: string;
  contentEn: string;
  contentTh: string;
  excerptEn: string | null;
  excerptTh: string | null;
  categoryId: string;
  category: { nameEn: string; nameTh: string };
  featuredImage: string;
  status: string;
  isFeatured: boolean;
  createdAt: string | Date;
}

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameTh: string;
}

interface BlogClientProps {
  initialPosts: BlogPost[];
  categories: Category[];
}

export default function BlogClient({ initialPosts, categories }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [titleEn, setTitleEn] = useState("");
  const [titleTh, setTitleTh] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentTh, setContentTh] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [excerptTh, setExcerptTh] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [isFeatured, setIsFeatured] = useState(false);

  const handleOpenCreate = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
    setEditId(null);
    
    setTitleEn("");
    setTitleTh("");
    setContentEn("");
    setContentTh("");
    setExcerptEn("");
    setExcerptTh("");
    setSlug("");
    setCategoryId(categories[0]?.id || "");
    setFeaturedImage("");
    setStatus("PUBLISHED");
    setIsFeatured(false);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setError("");
    setSuccess("");
    setIsEditing(true);
    setEditId(post.id);
    
    setTitleEn(post.titleEn);
    setTitleTh(post.titleTh);
    setContentEn(post.contentEn);
    setContentTh(post.contentTh);
    setExcerptEn(post.excerptEn || "");
    setExcerptTh(post.excerptTh || "");
    setSlug(post.slug);
    setCategoryId(post.categoryId);
    setFeaturedImage(post.featuredImage);
    setStatus(post.status);
    setIsFeatured(post.isFeatured);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to refetch posts", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (!titleEn || !titleTh || !slug || !contentEn || !contentTh || !categoryId) {
      setError("Please fill out all required fields.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        titleEn,
        titleTh,
        contentEn,
        contentTh,
        excerptEn,
        excerptTh,
        slug,
        categoryId,
        featuredImage,
        status,
        isFeatured
      };

      const url = editId ? `/api/blog/${editId}` : "/api/blog";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      setSuccess(editId ? "Article updated successfully!" : "New article created successfully!");
      setIsEditing(false);
      setEditId(null);
      fetchPosts();
    } catch (err: any) {
      setError(err.message || "Failed to save post. Please check inputs.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }

      setSuccess("Post deleted successfully!");
      fetchPosts();
    } catch (err: any) {
      setError(err.message || "Failed to delete post.");
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
          <h1 className="text-xl font-bold text-slate-900">Manage Media & Blog Posts</h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Draft, publish, schedule, or organize articles with category flags and SEO tags.
          </p>
        </div>
        {!isEditing && (
          <div>
            <button
              onClick={handleOpenCreate}
              className="bg-slate-900 hover:bg-slate-800 text-gold-500 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </button>
          </div>
        )}
      </div>

      {/* Creation / Editing Form */}
      {isEditing ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-6">
            {editId ? "Edit Blog Post / แก้ไขบทความ" : "Create New Post / เพิ่มบทความใหม่"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Dual column: Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Article Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. 5 Keys to Scaling Business in 2026"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  หัวข้อบทความ (ภาษาไทย) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={titleTh}
                  onChange={(e) => setTitleTh(e.target.value)}
                  placeholder="เช่น 5 กุญแจสำคัญในการขยายธุรกิจในปี 2026"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Dual column: Slug & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Article Slug (URL path) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. 5-keys-to-scaling-business-2569"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-850 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Category / หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameEn} ({cat.nameTh})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Image & Status & Featured Checkbox */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Featured Image URL / ลิงก์รูปภาพปก
                </label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Status / สถานะ <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pb-3.5 pl-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 text-gold-500 bg-slate-50 border-slate-200 rounded focus:ring-gold-500 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold cursor-pointer">
                  Featured Post (แสดงเด่นหน้าแรก)
                </label>
              </div>
            </div>

            {/* Dual column: Excerpts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Short Excerpt (English)
                </label>
                <textarea
                  rows={2}
                  value={excerptEn}
                  onChange={(e) => setExcerptEn(e.target.value)}
                  placeholder="Brief summary of the article..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  บทคัดย่อสั้นๆ (ภาษาไทย)
                </label>
                <textarea
                  rows={2}
                  value={excerptTh}
                  onChange={(e) => setExcerptTh(e.target.value)}
                  placeholder="คำอธิบายเนื้อหาบทความแบบย่อ..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Dual column: Contents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Full Article Content (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  placeholder="Markdown or HTML content..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 font-sans leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  เนื้อหาบทความฉบับเต็ม (ภาษาไทย) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={contentTh}
                  onChange={(e) => setContentTh(e.target.value)}
                  placeholder="เนื้อหารายละเอียดภาษาไทย..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-gold-500 focus:outline-none rounded-lg px-3.5 py-2 text-xs text-slate-800 font-sans leading-relaxed"
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
                <span>Save Article</span>
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
        /* Blog List Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase tracking-wider font-semibold">
                  <th className="p-4 w-[45%]">Post Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Publish Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 italic">
                      No blog posts found in database directory. Click "Create Post" to write one.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 space-y-1 font-medium">
                        <div className="text-slate-950 text-sm font-bold">{post.titleEn}</div>
                        <div className="text-slate-400 text-xs font-normal">{post.titleTh}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-semibold text-[10px] uppercase">
                          {post.category?.nameEn || "General"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            post.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 border border-slate-200 hover:border-gold-500 hover:text-gold-500 rounded text-slate-450 transition-all"
                            title="Preview article"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(post)}
                            className="p-1.5 border border-slate-200 hover:border-gold-500 hover:text-gold-500 rounded text-slate-450 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
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
