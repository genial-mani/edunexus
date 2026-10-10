"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Lock,
} from "lucide-react";

interface ApplyButtonProps {
  vacancyId: string;
  vacancyTitle: string;
  instituteName: string;
  currentUser: {
    id: string;
    role: string;
    teacherProfileId?: string;
  } | null;
  hasApplied: boolean;
  applicationStatus?: string | null;
  hasSaved: boolean;
}

export default function ApplyJobButton({
  vacancyId,
  vacancyTitle,
  instituteName,
  currentUser,
  hasApplied: initialHasApplied,
  applicationStatus: initialStatus,
  hasSaved: initialHasSaved,
}: ApplyButtonProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [status, setStatus] = useState(initialStatus || "submitted");
  const [isSaved, setIsSaved] = useState(initialHasSaved);

  const handleApplyClick = () => {
    if (!currentUser) {
      router.push(`/login?callbackUrl=/jobs/${vacancyId}`);
      return;
    }
    if (currentUser.role !== "teacher") {
      alert("Only registered teacher accounts can submit applications. Please log in with a teacher account.");
      return;
    }
    setModalOpen(true);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vacancyId, coverLetter }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit application");
        setLoading(false);
        return;
      }

      setHasApplied(true);
      setStatus("submitted");
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const toggleSave = async () => {
    if (!currentUser) {
      router.push(`/login?callbackUrl=/jobs/${vacancyId}`);
      return;
    }
    setIsSaved(!isSaved);
  };

  return (
    <>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {hasApplied ? (
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Applied (Status: {status})</span>
          </div>
        ) : (
          <button
            onClick={handleApplyClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#163B32] hover:bg-[#122f28] shadow-md transition cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#65A88A]" />
            <span>Apply Now</span>
          </button>
        )}

        <button
          onClick={toggleSave}
          className={`p-3 rounded-xl border transition ${
            isSaved
              ? "bg-[#F7F5EF] text-[#163B32] border-[#65A88A]"
              : "bg-white text-[#475569] border-[#E2E8F0] hover:text-[#163B32]"
          }`}
          title={isSaved ? "Saved" : "Save Job"}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-[#163B32] text-[#163B32]" : ""}`} />
        </button>
      </div>

      {/* Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#65A88A]">
                  Job Application
                </span>
                <h3 className="text-xl font-bold text-[#163B32] mt-0.5">{vacancyTitle}</h3>
                <p className="text-xs text-[#475569]">{instituteName}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0] text-xs text-[#163B32] flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-[#65A88A] mt-0.5 shrink-0" />
              <span>
                Your verified EduNexus profile qualifications, experience, and uploaded resume snapshot will be forwarded directly to {instituteName}.
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Cover Letter / Note to Principal (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, your teaching philosophy, or notable academic achievements..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#65A88A]" />
                      <span>Confirm & Submit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
