"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFilePresigned } from "@/lib/storage/client";
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  X,
} from "lucide-react";

interface TeacherProfileFormProps {
  initialProfile: {
    fullName: string;
    headline: string | null;
    bio: string | null;
    phone: string | null;
    isPhoneVisible: number;
    city: string | null;
    state: string | null;
    highestQualification: string | null;
    subjects: string[];
    gradeLevels: string[];
    yearsOfExperience: number;
    employmentTypePref: string | null;
    expectedSalaryMin: number | null;
    expectedSalaryMax: number | null;
    availableFrom: string | null;
    isOpenToWork: number;
    isPublic: number;
    resumeUrl: string | null;
  };
}

const AVAILABLE_GRADES = [
  "Primary (Grades 1-5)",
  "Middle (Grades 6-8)",
  "Secondary (Grades 9-10)",
  "Senior Secondary (Grades 11-12)",
  "Junior College (Grades 11-12)",
  "Undergraduate (Degree)",
];

export default function TeacherProfileForm({ initialProfile }: TeacherProfileFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [headline, setHeadline] = useState(initialProfile.headline || "");
  const [bio, setBio] = useState(initialProfile.bio || "");
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [isPhoneVisible, setIsPhoneVisible] = useState(initialProfile.isPhoneVisible);
  const [city, setCity] = useState(initialProfile.city || "");
  const [state, setState] = useState(initialProfile.state || "");
  const [highestQualification, setHighestQualification] = useState(initialProfile.highestQualification || "");
  const [yearsOfExperience, setYearsOfExperience] = useState(initialProfile.yearsOfExperience || 0);
  const [employmentTypePref, setEmploymentTypePref] = useState(initialProfile.employmentTypePref || "Full-time");
  const [expectedSalaryMin, setExpectedSalaryMin] = useState(initialProfile.expectedSalaryMin || "");
  const [expectedSalaryMax, setExpectedSalaryMax] = useState(initialProfile.expectedSalaryMax || "");
  const [availableFrom, setAvailableFrom] = useState(initialProfile.availableFrom || "");
  const [isOpenToWork, setIsOpenToWork] = useState(initialProfile.isOpenToWork);
  const [isPublic, setIsPublic] = useState(initialProfile.isPublic);
  const [resumeUrl, setResumeUrl] = useState(initialProfile.resumeUrl || "");

  // Subjects state
  const [subjects, setSubjects] = useState<string[]>(initialProfile.subjects);
  const [newSubject, setNewSubject] = useState("");

  // Grade levels
  const [gradeLevels, setGradeLevels] = useState<string[]>(initialProfile.gradeLevels);

  const [uploadingResume, setUploadingResume] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const toggleGrade = (grade: string) => {
    if (gradeLevels.includes(grade)) {
      setGradeLevels(gradeLevels.filter((g) => g !== grade));
    } else {
      setGradeLevels([...gradeLevels, grade]);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError(null);

    try {
      const result = await uploadFilePresigned(file, "resumes");
      setResumeUrl(result.url);
      setUploadingResume(false);
    } catch (err: any) {
      setError(err?.message || "Resume upload failed");
      setUploadingResume(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        fullName,
        headline,
        bio,
        phone,
        isPhoneVisible,
        city,
        state,
        highestQualification,
        subjects,
        gradeLevels,
        yearsOfExperience: Number(yearsOfExperience),
        employmentTypePref,
        expectedSalaryMin: expectedSalaryMin ? Number(expectedSalaryMin) : null,
        expectedSalaryMax: expectedSalaryMax ? Number(expectedSalaryMax) : null,
        availableFrom,
        isOpenToWork,
        isPublic,
        resumeUrl,
      };

      const res = await fetch("/api/teacher/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save profile");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("An unexpected error occurred while saving.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes and recruitment discovery settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Open to Work & Privacy Master Toggles Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <Sparkles className="w-5 h-5 text-[#65A88A]" />
          <h3 className="font-bold text-base text-[#163B32]">Recruitment Discovery & Privacy Controls</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Open to Work Toggle */}
          <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E2E8F0] flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-bold text-sm text-[#163B32] block">Open to Work Indicator</span>
              <p className="text-xs text-[#475569]">
                Enable to appear in teacher search results for verified institutions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpenToWork(isOpenToWork === 1 ? 0 : 1)}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                isOpenToWork === 1 ? "bg-[#10B981]" : "bg-slate-300"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${
                  isOpenToWork === 1 ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Phone Visibility Toggle */}
          <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E2E8F0] flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-bold text-sm text-[#163B32] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#65A88A]" />
                <span>Phone Number Privacy</span>
              </span>
              <p className="text-xs text-[#475569]">
                {isPhoneVisible === 1
                  ? "Phone visible to verified hiring institutions."
                  : "Phone strictly hidden & sanitized server-side from DOM."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPhoneVisible(isPhoneVisible === 1 ? 0 : 1)}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                isPhoneVisible === 1 ? "bg-[#163B32]" : "bg-slate-300"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${
                  isPhoneVisible === 1 ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Basic Information Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <h3 className="font-bold text-base text-[#163B32] pb-3 border-b border-[#E2E8F0]">
          Personal & Professional Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Professional Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Senior PGT Mathematics Teacher | CBSE Specialist | 8+ Years Experience"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Teaching Philosophy & Biography
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Summarize your pedagogy, major board exam student milestones, and instructional strengths..."
            className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Current City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Bengaluru"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Karnataka"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
            />
          </div>
        </div>
      </div>

      {/* 3. Subjects & Grades Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <h3 className="font-bold text-base text-[#163B32] pb-3 border-b border-[#E2E8F0]">
          Academic Specializations
        </h3>

        {/* Subjects tags */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
            Subjects You Can Teach
          </label>
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F5EF] text-xs font-semibold text-[#163B32] border border-[#E2E8F0]"
              >
                <span>{sub}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(sub)}
                  className="hover:text-red-500 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add subject (e.g. Chemistry)"
              className="flex-1 px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs text-[#1F2937] bg-white"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="px-3 py-1.5 rounded-xl bg-[#163B32] text-white text-xs font-semibold hover:bg-[#122f28]"
            >
              Add
            </button>
          </div>
        </div>

        {/* Grade levels checkboxes */}
        <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
            Target Grade Levels
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {AVAILABLE_GRADES.map((g) => (
              <label
                key={g}
                onClick={() => toggleGrade(g)}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 cursor-pointer transition ${
                  gradeLevels.includes(g)
                    ? "bg-[#F7F5EF] border-[#65A88A] text-[#163B32]"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={gradeLevels.includes(g)}
                  onChange={() => {}}
                  className="rounded text-[#163B32]"
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Experience & Compensation Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <h3 className="font-bold text-base text-[#163B32] pb-3 border-b border-[#E2E8F0]">
          Experience, Qualifications & Compensation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Highest Academic Qualification
            </label>
            <input
              type="text"
              value={highestQualification}
              onChange={(e) => setHighestQualification(e.target.value)}
              placeholder="e.g. M.Sc (Mathematics), B.Ed"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Total Teaching Experience (Years)
            </label>
            <input
              type="number"
              min={0}
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Expected Salary Range (₹ / Month)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={expectedSalaryMin}
                onChange={(e) => setExpectedSalaryMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={expectedSalaryMax}
                onChange={(e) => setExpectedSalaryMax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Available to Join From
            </label>
            <input
              type="text"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              placeholder="e.g. Immediate / Next Academic Session"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
            Verified Resume Document (PDF / DOCX)
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0] hover:bg-[#efebe0] text-xs font-semibold text-[#163B32] cursor-pointer transition">
              <UploadCloud className="w-4 h-4 text-[#65A88A]" />
              <span>{uploadingResume ? "Uploading file..." : "Upload New Resume"}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-[#163B32] underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-[#65A88A]" />
                <span>View currently uploaded resume</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-lg">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#65A88A]" />
          <span>{saving ? "Saving Changes..." : "Save Profile & Settings"}</span>
        </button>
      </div>
    </form>
  );
}
