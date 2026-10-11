"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Building2,
  User,
  ArrowRight,
  Lock,
  Mail,
  MapPin,
  Phone,
  AlertCircle,
  Compass,
} from "lucide-react";
import { pincodeRegex } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"teacher" | "institute_admin">("teacher");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Address fields
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [mandal, setMandal] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Institute specific
  const [instituteName, setInstituteName] = useState("");
  const [instituteType, setInstituteType] = useState<
    "School" | "College" | "Junior College" | "Coaching Centre" | "Other"
  >("School");
  const [contactPhone, setContactPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.length < 2) {
      errs.name = "Full name must be at least 2 characters";
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!password || password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (!state.trim()) {
      errs.state = "State is required";
    }
    if (!district.trim()) {
      errs.district = "District is required to surface relevant local searches";
    }
    if (!city.trim()) {
      errs.city = "City or Village name is required";
    }
    if (pincode && !pincodeRegex.test(pincode)) {
      errs.pincode = "Enter a valid 6-digit Indian PIN code";
    }

    if (role === "institute_admin") {
      if (!instituteName.trim()) {
        errs.instituteName = "Institution official name is required";
      }
      if (!contactPhone.trim()) {
        errs.contactPhone = "Official contact phone number is required";
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, string> = {
        name,
        email,
        password,
        role,
        state,
        district,
        mandal,
        city,
        pincode,
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
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAF7]">
      <div className="max-w-xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#163B32] shadow-md shadow-[#163B32]/10">
            <GraduationCap className="w-7 h-7 text-[#65A88A]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
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
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
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
                      onChange={(e) => {
                        setInstituteName(e.target.value);
                        setFieldErrors((p) => ({ ...p, instituteName: "" }));
                      }}
                      placeholder="e.g. Oxford Cambridge Public School"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                        fieldErrors.instituteName ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                      }`}
                    />
                  </div>
                  {fieldErrors.instituteName && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.instituteName}</p>
                  )}
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
                      onChange={(e) => {
                        setName(e.target.value);
                        setFieldErrors((p) => ({ ...p, name: "" }));
                      }}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                        fieldErrors.name ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                  )}
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
                      onChange={(e) => {
                        setContactPhone(e.target.value);
                        setFieldErrors((p) => ({ ...p, contactPhone: "" }));
                      }}
                      placeholder="9876543210"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                        fieldErrors.contactPhone ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                      }`}
                    />
                  </div>
                  {fieldErrors.contactPhone && (
                    <p className="text-xs text-red-600 mt-1">{fieldErrors.contactPhone}</p>
                  )}
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
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldErrors((p) => ({ ...p, name: "" }));
                    }}
                    placeholder="e.g. Anjali Sharma"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                      fieldErrors.name ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>
                )}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder={role === "institute_admin" ? "admin@school.edu.in" : "teacher@example.com"}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                    fieldErrors.email ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Address Notice / Callout */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs flex items-start gap-2.5">
              <Compass className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" />
              <span>
                <strong>Hyper-Local Discovery:</strong> Providing granular address details (State, District, Mandal, Village/City, Pincode) helps candidates and institutions discover hyper-local relevant results.
              </span>
            </div>

            {/* Address Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setFieldErrors((p) => ({ ...p, state: "" }));
                  }}
                  placeholder="e.g. Andhra Pradesh / Telangana"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                    fieldErrors.state ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                  }`}
                />
                {fieldErrors.state && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setFieldErrors((p) => ({ ...p, district: "" }));
                  }}
                  placeholder="e.g. Guntur / Visakhapatnam / Hyderabad"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                    fieldErrors.district ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                  }`}
                />
                {fieldErrors.district && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.district}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Mandal / Tehsil
                </label>
                <input
                  type="text"
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                  placeholder="e.g. Tenali / Serilingampally"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  City / Village *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setFieldErrors((p) => ({ ...p, city: "" }));
                    }}
                    placeholder="e.g. Vijayawada"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                      fieldErrors.city ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                    }`}
                  />
                </div>
                {fieldErrors.city && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    setFieldErrors((p) => ({ ...p, pincode: "" }));
                  }}
                  placeholder="e.g. 522001"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                    fieldErrors.pincode ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                  }`}
                />
                {fieldErrors.pincode && (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.pincode}</p>
                )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                    fieldErrors.password ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
              )}
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
