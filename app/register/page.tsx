"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Building2, User, ArrowRight, Lock, Mail, MapPin, Phone, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"teacher" | "institute_admin">("teacher");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Institute specific
  const [instituteName, setInstituteName] = useState("");
  const [instituteType, setInstituteType] = useState<"School" | "College" | "Junior College" | "Coaching Centre" | "Other">("School");
  const [contactPhone, setContactPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, string> = {
        name,
        email,
        password,
        role,
        city,
        state,
      };

      if (role === "institute_admin") {
        payload.instituteName = instituteName;
        payload.instituteType = instituteType;
        payload.contactPhone = contactPhone;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register account");
        setLoading(false);
        return;
      }

      // Automatically logged in -> redirect to dashboard
      router.push(data.redirectUrl || "/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAF7]">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#163B32] shadow-md shadow-[#163B32]/10">
            <GraduationCap className="w-7 h-7 text-[#65A88A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#163B32] tracking-tight">
            Join the EduNexus Network
          </h1>
          <p className="text-sm text-[#475569]">
            Create your account to start hiring, finding teaching opportunities, or listing school buses
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#F7F5EF] border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition cursor-pointer ${
              role === "teacher"
                ? "bg-[#163B32] text-white shadow-sm"
                : "text-[#475569] hover:text-[#163B32] hover:bg-white/60"
            }`}
          >
            <User className={`w-4 h-4 ${role === "teacher" ? "text-[#65A88A]" : ""}`} />
            <span>I am a Teacher</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("institute_admin")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition cursor-pointer ${
              role === "institute_admin"
                ? "bg-[#163B32] text-white shadow-sm"
                : "text-[#475569] hover:text-[#163B32] hover:bg-white/60"
            }`}
          >
            <Building2 className={`w-4 h-4 ${role === "institute_admin" ? "text-[#65A88A]" : ""}`} />
            <span>Educational Institute</span>
          </button>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === "institute_admin" ? (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Institution Official Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      placeholder="e.g. Oxford Cambridge Public School"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Institution Type *
                  </label>
                  <select
                    value={instituteType}
                    onChange={(e) => setInstituteType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
                  >
                    <option value="School">K-12 School (CBSE / ICSE / State)</option>
                    <option value="College">Degree College / University Wing</option>
                    <option value="Junior College">Junior College (+2 / Intermediate)</option>
                    <option value="Coaching Centre">Coaching / Test Prep Academy</option>
                    <option value="Other">Other Educational Organization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Representative / Principal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                    Official Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anjali Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Official Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "institute_admin" ? "admin@school.edu.in" : "teacher@example.com"}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Set Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Creating your account & logging in...</span>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#65A88A]" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E2E8F0]">
            <p className="text-sm text-[#475569]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#163B32] hover:text-[#65A88A] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
