"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFilePresigned } from "@/lib/storage/client";
import {
  Building2,
  ShieldCheck,
  AlertCircle,
  Save,
  CheckCircle2,
  UploadCloud,
  Globe,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface InstituteProfileFormProps {
  initialData: {
    name: string;
    type: "School" | "College" | "Junior College" | "Coaching Centre" | "Other";
    description: string | null;
    establishedYear: number | null;
    address: string | null;
    city: string;
    state: string;
    postalCode: string | null;
    contactPhone: string;
    officialEmail: string;
    websiteUrl: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    verificationStatus: string;
    verificationNotes: string | null;
    educationLevels: string[];
    specializations: string[];
  };
}

const AVAILABLE_LEVELS = [
  "Primary (Grades 1-5)",
  "Middle (Grades 6-8)",
  "Secondary (Grades 9-10)",
  "Senior Secondary (Grades 11-12)",
  "Junior College (+2)",
  "Undergraduate (Degree)",
  "Postgraduate (Master's)",
];

const AVAILABLE_SPECIALIZATIONS = [
  "CBSE Board",
  "ICSE / ISC Board",
  "State Board",
  "International Baccalaureate (IB)",
  "STEM / Robotics Focus",
  "IIT-JEE & NEET Coaching",
  "Sports Academy & Athletics",
  "NAAC Accredited",
];

export default function InstituteProfileForm({ initialData }: InstituteProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData.name);
  const [type, setType] = useState(initialData.type);
  const [description, setDescription] = useState(initialData.description || "");
  const [establishedYear, setEstablishedYear] = useState(initialData.establishedYear || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city);
  const [state, setState] = useState(initialData.state);
  const [postalCode, setPostalCode] = useState(initialData.postalCode || "");
  const [contactPhone, setContactPhone] = useState(initialData.contactPhone);
  const [websiteUrl, setWebsiteUrl] = useState(initialData.websiteUrl || "");
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || "");
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl || "");
  const [educationLevels, setEducationLevels] = useState<string[]>(initialData.educationLevels);
  const [specializations, setSpecializations] = useState<string[]>(initialData.specializations);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLevel = (l: string) => {
    if (educationLevels.includes(l)) {
      setEducationLevels(educationLevels.filter((item) => item !== l));
    } else {
      setEducationLevels([...educationLevels, l]);
    }
  };

  const toggleSpecialization = (s: string) => {
    if (specializations.includes(s)) {
      setSpecializations(specializations.filter((item) => item !== s));
    } else {
      setSpecializations([...specializations, s]);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const result = await uploadFilePresigned(file, "logos");
      setLogoUrl(result.url);
    } catch (err: any) {
      console.error("Logo upload error:", err);
      setError(err?.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name,
        type,
        description,
        establishedYear: establishedYear ? Number(establishedYear) : null,
        address,
        city,
        state,
        postalCode,
        contactPhone,
        websiteUrl,
        logoUrl,
        coverUrl,
        educationLevels,
        specializations,
      };

      const res = await fetch("/api/institute/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("An unexpected network error occurred.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Institution profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Status Banner */}
      <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#475569]">
            Official Accreditation Status
          </span>
          <div className="flex items-center gap-2">
            {initialData.verificationStatus === "approved" ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified Educational Institution</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Under Platform Administrator Review (Pending)</span>
              </span>
            )}
          </div>
          {initialData.verificationNotes && (
            <p className="text-xs text-[#475569] pt-1">
              Admin Remarks: {initialData.verificationNotes}
            </p>
          )}
        </div>
      </div>

      {/* Core Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
        <h3 className="font-bold text-base text-[#163B32] pb-2 border-b border-[#E2E8F0]">
          Institution Profile Details
        </h3>

        {/* Logo Upload */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-[#163B32]" />
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0] text-xs font-semibold text-[#163B32] hover:bg-[#efebe0] cursor-pointer transition">
              <UploadCloud className="w-4 h-4 text-[#65A88A]" />
              <span>{uploadingLogo ? "Uploading..." : "Upload Campus Logo"}</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">Recommended: 200x200 square PNG or JPG.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Institution Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Institution Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            >
              <option value="School">School (K-12)</option>
              <option value="College">Senior Degree College</option>
              <option value="Junior College">Junior College (+2)</option>
              <option value="Coaching Centre">Coaching / Academy</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Campus Description & Vision
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Established Year
            </label>
            <input
              type="number"
              value={establishedYear}
              onChange={(e) => setEstablishedYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Contact Phone *
            </label>
            <input
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Official Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://myschool.edu.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Campus Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>
        </div>
      </div>

      {/* Levels & Accreditations Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
        <h3 className="font-bold text-base text-[#163B32] pb-2 border-b border-[#E2E8F0]">
          Levels Offered & Boards / Accreditations
        </h3>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
            Education Levels
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {AVAILABLE_LEVELS.map((lvl) => (
              <label
                key={lvl}
                onClick={() => toggleLevel(lvl)}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 cursor-pointer transition ${
                  educationLevels.includes(lvl)
                    ? "bg-[#F7F5EF] border-[#65A88A] text-[#163B32]"
                    : "bg-white border-[#E2E8F0] text-[#475569]"
                }`}
              >
                <input type="checkbox" checked={educationLevels.includes(lvl)} onChange={() => {}} />
                <span>{lvl}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
            Affiliations & Specializations
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {AVAILABLE_SPECIALIZATIONS.map((sp) => (
              <label
                key={sp}
                onClick={() => toggleSpecialization(sp)}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 cursor-pointer transition ${
                  specializations.includes(sp)
                    ? "bg-[#F7F5EF] border-[#65A88A] text-[#163B32]"
                    : "bg-white border-[#E2E8F0] text-[#475569]"
                }`}
              >
                <input type="checkbox" checked={specializations.includes(sp)} onChange={() => {}} />
                <span>{sp}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-lg">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#65A88A]" />
          <span>{saving ? "Saving..." : "Save Institution Profile"}</span>
        </button>
      </div>
    </form>
  );
}
