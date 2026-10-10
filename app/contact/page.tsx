"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163B32] tracking-tight">
            Contact Support & Institutional Partnerships
          </h1>
          <p className="text-sm text-[#475569]">
            Have a question about educator recruitment, institute verification, or school bus listings? Reach out to our dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-[#163B32]">Headquarters & Support</h3>

              <div className="space-y-4 text-xs text-[#475569]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F5EF] text-[#163B32] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#65A88A]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#163B32] block">National Office</span>
                    <span>Level 5, EduNexus Innovation Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F5EF] text-[#163B32] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#65A88A]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#163B32] block">Email Support</span>
                    <span>support@edunexus.org</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F5EF] text-[#163B32] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#65A88A]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#163B32] block">Institutional Desk</span>
                    <span>+91 80 4400 9900 (Mon - Sat, 9 AM - 6 PM IST)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-[#163B32]">Send Us a Message</h3>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base text-emerald-900">Message Received</h4>
                  <p className="text-xs text-emerald-800">
                    Thank you, <strong className="font-semibold">{name}</strong>. Our institutional support desk will respond to <span className="font-semibold">{email}</span> within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. S. K. Gupta"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@institution.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Institute Verification Inquiry or Recruitment Assistance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide details on how our team can assist you..."
                      className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#65A88A]" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
