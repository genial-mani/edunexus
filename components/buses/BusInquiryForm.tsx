"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, User, Building2 } from "lucide-react";

interface BusInquiryFormProps {
  busId: string;
  busTitle: string;
  sellerInstituteName: string;
  currentUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function BusInquiryForm({
  busId,
  busTitle,
  sellerInstituteName,
  currentUser,
}: BusInquiryFormProps) {
  const [senderName, setSenderName] = useState(currentUser?.name || "");
  const [senderEmail, setSenderEmail] = useState(currentUser?.email || "");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderOrganization, setSenderOrganization] = useState("");
  const [message, setMessage] = useState(
    `Hello, we are interested in inspecting the ${busTitle} listed by ${sellerInstituteName}. Please contact us regarding vehicle fitness records and physical inspection schedule.`
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/buses/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          busId,
          senderName,
          senderOrganization,
          senderPhone,
          senderEmail,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit inquiry");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-base text-emerald-900">Inquiry Dispatched</h4>
        <p className="text-xs text-emerald-800 leading-relaxed">
          Your inquiry has been received by <strong className="font-semibold">{sellerInstituteName}</strong>. Their administration office will reach out to you via your provided phone and email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
          Your Full Name *
        </label>
        <div className="relative">
          <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="e.g. Principal / Transport Incharge"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
          Your School / College / Organization *
        </label>
        <div className="relative">
          <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            required
            value={senderOrganization}
            onChange={(e) => setSenderOrganization(e.target.value)}
            placeholder="e.g. St. Jude High School"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
            Contact Phone *
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="tel"
              required
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
            Official Email *
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="office@school.edu"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
          Inquiry Note *
        </label>
        <textarea
          rows={3}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-xs text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <span>Sending Inquiry...</span>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 text-[#65A88A]" />
            <span>Send Direct Seller Inquiry</span>
          </>
        )}
      </button>
    </form>
  );
}
