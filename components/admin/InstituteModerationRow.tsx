"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Building2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InstituteProps {
  institute: {
    id: string;
    name: string;
    slug: string;
    type: string;
    city: string;
    state: string;
    officialEmail: string;
    contactPhone: string;
    websiteUrl: string | null;
    verificationStatus: string;
    verificationNotes: string | null;
    createdAt: number;
  };
}

export default function InstituteModerationRow({ institute }: InstituteProps) {
  const [status, setStatus] = useState(institute.verificationStatus);
  const [notes, setNotes] = useState(institute.verificationNotes || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDecision = async (newStatus: "approved" | "rejected" | "suspended" | "pending") => {
    let reason = notes;
    if (newStatus === "rejected") {
      const input = prompt("Please provide reason for rejection / additional requirements:", notes || "Accreditation certificate pending");
      if (input === null) return;
      reason = input;
      setNotes(input);
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/institutes/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instituteId: institute.id,
          status: newStatus,
          notes: reason,
        }),
      });

      if (res.ok) {
        setStatus(newStatus);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-[#163B32]">
              <Link href={`/institutes/${institute.slug}`} target="_blank" className="hover:text-[#65A88A] inline-flex items-center gap-1.5">
                <span>{institute.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : status === "suspended"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569]">
            <span className="font-semibold text-[#65A88A]">{institute.type}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {institute.city}, {institute.state}
            </span>
            <span>•</span>
            <span>{institute.officialEmail}</span>
            <span>•</span>
            <span>{institute.contactPhone}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start">
          {status !== "approved" && (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDecision("approved")}
              className="px-3.5 py-1.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              Approve Institute
            </button>
          )}

          {status !== "rejected" && (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDecision("rejected")}
              className="px-3 py-1.5 rounded-xl font-semibold text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
            >
              Reject / Request Info
            </button>
          )}

          {status === "approved" && (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDecision("suspended")}
              className="px-3 py-1.5 rounded-xl font-semibold text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
            >
              Suspend
            </button>
          )}
        </div>
      </div>

      {notes && (
        <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569]">
          <strong className="text-[#163B32]">Admin Remarks:</strong> {notes}
        </div>
      )}

      {success && (
        <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verification decision committed and institution notified.
        </div>
      )}
    </div>
  );
}
