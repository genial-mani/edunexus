"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { formatDate, timeAgo } from "@/lib/utils";

interface ApplicationProps {
  app: {
    id: string;
    status: string;
    coverLetter: string | null;
    resumeUrl: string | null;
    employerNotes: string | null;
    createdAt: number;
    vacancyId: string;
    vacancyTitle: string;
    teacherId: string;
    teacherName: string;
    teacherHeadline: string | null;
    teacherQualification: string | null;
    teacherExperience: number;
    teacherCity: string | null;
    teacherState: string | null;
    teacherSubjects: string[];
  };
}

const STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "hired", label: "Hired / Offered" },
  { value: "rejected", label: "Rejected" },
];

export default function ApplicationReviewCard({ app }: ApplicationProps) {
  const [currentStatus, setCurrentStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.employerNotes || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    await updateStatusAndNotes(newStatus, notes);
  };

  const handleSaveNotes = async () => {
    await updateStatusAndNotes(currentStatus, notes);
  };

  const updateStatusAndNotes = async (statusToSet: string, notesToSet: string) => {
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/institute/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: app.id,
          status: statusToSet,
          employerNotes: notesToSet,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update candidate status");
        setSaving(false);
        return;
      }

      setSavedSuccess(true);
      setSaving(false);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError("Network error while updating");
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/teachers/${app.teacherId}`}
              className="font-bold text-lg text-[#163B32] hover:text-[#65A88A] flex items-center gap-1.5 transition"
            >
              <span>{app.teacherName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-[#65A88A] font-semibold">
              {app.teacherExperience} Years Teaching Exp
            </span>
          </div>

          <p className="text-xs text-[#475569]">
            Applied for <strong className="text-[#163B32] font-semibold">{app.vacancyTitle}</strong> on {formatDate(app.createdAt)}
          </p>

          <p className="text-xs text-[#475569]">
            Qualification: <span className="font-medium text-[#163B32]">{app.teacherQualification}</span> • {app.teacherCity}, {app.teacherState}
          </p>
        </div>

        {/* Status Selector */}
        <div className="flex flex-col sm:items-end gap-1.5 self-start">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#475569]">
            Application Status
          </label>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={saving}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer transition ${
              currentStatus === "shortlisted"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : currentStatus === "interview"
                ? "bg-purple-50 text-purple-800 border-purple-300"
                : currentStatus === "hired"
                ? "bg-green-100 text-green-900 border-green-400"
                : currentStatus === "rejected"
                ? "bg-red-50 text-red-800 border-red-300"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Badges */}
      {app.teacherSubjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {app.teacherSubjects.map((s) => (
            <span key={s} className="px-2.5 py-0.5 rounded-md bg-[#F7F5EF] text-[11px] font-medium text-[#163B32]">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Cover Letter */}
      {app.coverLetter && (
        <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569] space-y-1">
          <strong className="text-[#163B32] block">Candidate Note:</strong>
          <p className="leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
        </div>
      )}

      {/* Resume Link & Notes Row */}
      <div className="pt-2 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          {app.resumeUrl ? (
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#163B32] hover:text-[#65A88A] underline"
            >
              <FileText className="w-4 h-4 text-[#65A88A]" />
              <span>Download Candidate Resume (PDF)</span>
            </a>
          ) : (
            <span className="text-slate-400 italic">No resume file attached</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>

      {/* Private Employer Notes */}
      <div className="pt-2 flex gap-2">
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add private internal notes (e.g. 'Classroom demo scheduled for Friday')..."
          className="flex-1 px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs text-[#1F2937] bg-white placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={handleSaveNotes}
          disabled={saving}
          className="px-3 py-1.5 rounded-xl font-semibold text-xs text-[#163B32] bg-[#F7F5EF] border border-[#E2E8F0] hover:bg-[#efebe0] transition"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
