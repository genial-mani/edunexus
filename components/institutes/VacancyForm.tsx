"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Plus,
  X,
  MapPin,
  Clock,
} from "lucide-react";

const STANDARD_SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science / AI",
  "Social Studies",
  "Hindi",
  "Physical Education",
  "Economics",
  "Commerce & Accountancy",
  "Fine Arts",
];

const STANDARD_GRADES = [
  "Primary (Grades 1-5)",
  "Middle (Grades 6-8)",
  "Secondary (Grades 9-10)",
  "Senior Secondary (Grades 11-12)",
  "Junior College (+2)",
  "Undergraduate (Degree)",
];

const STANDARD_BENEFITS = [
  "Health & Accident Insurance",
  "Free / Subsidized Campus Transport",
  "Subsidized Education for Staff Children",
  "Provident Fund (PF) & Gratuity",
  "Faculty Quarters / Housing Allowance",
  "Performance & Annual Retention Bonus",
  "Paid Research / Conference Sabbatical",
];

export default function VacancyForm({
  defaultCity,
  defaultState,
}: {
  defaultCity: string;
  defaultState: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredQualifications, setRequiredQualifications] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Mathematics"]);
  const [customSubject, setCustomSubject] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["Senior Secondary (Grades 11-12)"]);
  const [yearsOfExperienceMin, setYearsOfExperienceMin] = useState(2);
  const [openingsCount, setOpeningsCount] = useState(1);
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Part-time" | "Contract" | "Substitute">("Full-time");
  const [salaryMin, setSalaryMin] = useState<string>("");
  const [salaryMax, setSalaryMax] = useState<string>("");
  const [locationCity, setLocationCity] = useState(defaultCity);
  const [locationState, setLocationState] = useState(defaultState);
  const [expectedJoiningDate, setExpectedJoiningDate] = useState("Immediate");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([
    "Health & Accident Insurance",
    "Provident Fund (PF) & Gratuity",
  ]);
  const [contactInstructions, setContactInstructions] = useState(
    "Apply online through EduNexus with your updated resume and statement of teaching experience."
  );

  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSubject = (s: string) => {
    if (selectedSubjects.includes(s)) {
      setSelectedSubjects(selectedSubjects.filter((item) => item !== s));
    } else {
      setSelectedSubjects([...selectedSubjects, s]);
    }
  };

  const addCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects([...selectedSubjects, customSubject.trim()]);
      setCustomSubject("");
    }
  };

  const toggleGrade = (g: string) => {
    if (selectedGrades.includes(g)) {
      setSelectedGrades(selectedGrades.filter((item) => item !== g));
    } else {
      setSelectedGrades([...selectedGrades, g]);
    }
  };

  const toggleBenefit = (b: string) => {
    if (selectedBenefits.includes(b)) {
      setSelectedBenefits(selectedBenefits.filter((item) => item !== b));
    } else {
      setSelectedBenefits([...selectedBenefits, b]);
    }
  };

  const handleSubmit = async (status: "published" | "draft") => {
    setError(null);
    if (!title.trim() || !description.trim() || !requiredQualifications.trim()) {
      setError("Please complete all required fields (Job Title, Description, Qualifications).");
      return;
    }

    if (selectedSubjects.length === 0) {
      setError("Please select at least 1 subject.");
      return;
    }

    if (selectedGrades.length === 0) {
      setError("Please select at least 1 target grade level.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        requiredQualifications,
        requiredSubjects: selectedSubjects,
        gradeLevels: selectedGrades,
        yearsOfExperienceMin: Number(yearsOfExperienceMin),
        openingsCount: Number(openingsCount),
        employmentType,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        salaryNegotiable: 1,
        locationCity,
        locationState,
        expectedJoiningDate,
        benefits: selectedBenefits,
        contactInstructions,
        status,
      };

      const res = await fetch("/api/institute/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create vacancy");
        setLoading(false);
        return;
      }

      router.push("/dashboard/institute/vacancies");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher: Editor vs Live Preview */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              !previewMode
                ? "bg-[#163B32] text-white"
                : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
            }`}
          >
            Vacancy Form Editor
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              previewMode
                ? "bg-[#163B32] text-white"
                : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Candidate Preview</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit("published")}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#65A88A]" />
            <span>Publish Vacancy</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Preview Mode */}
      {previewMode ? (
        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="p-3 bg-[#F7F5EF] rounded-xl text-xs text-[#163B32] font-semibold">
            👁️ Candidate Preview Mode: This is how educators will view this vacancy on EduNexus.
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#163B32]/5 text-[#163B32] border border-[#163B32]/10">
              {employmentType}
            </span>
            <h2 className="text-2xl font-bold text-[#163B32]">{title || "Untitled Vacancy"}</h2>
            <div className="flex items-center gap-4 text-xs text-[#475569]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                {locationCity}, {locationState}
              </span>
              {salaryMin && salaryMax && (
                <span className="font-bold text-[#163B32]">
                  ₹{Number(salaryMin).toLocaleString("en-IN")} - ₹{Number(salaryMax).toLocaleString("en-IN")}/month
                </span>
              )}
              <span>Min {yearsOfExperienceMin}+ yrs exp</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
            <h3 className="font-bold text-sm text-[#163B32]">Scope of Work & Responsibilities</h3>
            <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line">
              {description || "No description provided yet."}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
            <h3 className="font-bold text-sm text-[#163B32]">Required Qualifications</h3>
            <p className="text-xs text-[#163B32] font-semibold bg-[#F8FAF7] p-3 rounded-xl border border-[#E2E8F0]">
              {requiredQualifications || "No qualification requirements specified yet."}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
            <h3 className="font-bold text-sm text-[#163B32]">Subjects & Target Classes</h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedSubjects.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] text-xs font-semibold text-[#163B32]">
                  {s}
                </span>
              ))}
              {selectedGrades.map((g) => (
                <span key={g} className="px-2.5 py-1 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569]">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Form Editor Mode */
        <div className="space-y-6">
          {/* Card 1: Core Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="font-bold text-base text-[#163B32] pb-2 border-b border-[#E2E8F0]">
              Position Details
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior PGT Mathematics Teacher (Grades 11-12)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Employment Type *
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contractual</option>
                  <option value="Substitute">Substitute / Guest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Min Experience (Years)
                </label>
                <input
                  type="number"
                  min={0}
                  value={yearsOfExperienceMin}
                  onChange={(e) => setYearsOfExperienceMin(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Openings Count
                </label>
                <input
                  type="number"
                  min={1}
                  value={openingsCount}
                  onChange={(e) => setOpeningsCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Job Description & Scope *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline the curriculum guidelines, pedagogical expectations, classroom hours, and extracurricular responsibilities..."
                className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Required Qualifications & Degrees *
              </label>
              <input
                type="text"
                required
                value={requiredQualifications}
                onChange={(e) => setRequiredQualifications(e.target.value)}
                placeholder="e.g. M.Sc in Mathematics with regular B.Ed degree"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] bg-white hover:border-[#65A88A] transition"
              />
            </div>
          </div>

          {/* Card 2: Subjects & Classes */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="font-bold text-base text-[#163B32] pb-2 border-b border-[#E2E8F0]">
              Subject & Grade Requirements
            </h3>

            {/* Subjects Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Subjects Needed *
              </label>
              <div className="flex flex-wrap gap-2">
                {STANDARD_SUBJECTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedSubjects.includes(s)
                        ? "bg-[#163B32] text-white"
                        : "bg-[#F7F5EF] text-[#475569] hover:bg-[#efebe0]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Grades */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Grade / Class Levels *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {STANDARD_GRADES.map((g) => (
                  <label
                    key={g}
                    onClick={() => toggleGrade(g)}
                    className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 cursor-pointer transition ${
                      selectedGrades.includes(g)
                        ? "bg-[#F7F5EF] border-[#65A88A] text-[#163B32]"
                        : "bg-white border-[#E2E8F0] text-[#475569]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGrades.includes(g)}
                      onChange={() => {}}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Salary, Location & Benefits */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
            <h3 className="font-bold text-base text-[#163B32] pb-2 border-b border-[#E2E8F0]">
              Compensation, Location & Benefits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Monthly Salary Range (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min (e.g. 45000)"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
                  />
                  <input
                    type="number"
                    placeholder="Max (e.g. 65000)"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Expected Joining Date
                </label>
                <input
                  type="text"
                  value={expectedJoiningDate}
                  onChange={(e) => setExpectedJoiningDate(e.target.value)}
                  placeholder="e.g. Immediate / Next Session"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Campus City *
                </label>
                <input
                  type="text"
                  required
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Campus State *
                </label>
                <input
                  type="text"
                  required
                  value={locationState}
                  onChange={(e) => setLocationState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
                />
              </div>
            </div>

            {/* Benefits checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Offered Benefits & Allowances
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STANDARD_BENEFITS.map((b) => (
                  <label
                    key={b}
                    onClick={() => toggleBenefit(b)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 cursor-pointer transition ${
                      selectedBenefits.includes(b)
                        ? "bg-[#F7F5EF] border-[#65A88A] text-[#163B32]"
                        : "bg-white border-[#E2E8F0] text-[#475569]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBenefits.includes(b)}
                      onChange={() => {}}
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-lg">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("draft")}
              className="px-5 py-2.5 rounded-xl font-medium text-xs text-[#475569] bg-white border border-[#E2E8F0] hover:bg-slate-50 transition cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("published")}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#65A88A]" />
              <span>{loading ? "Publishing..." : "Publish Job Vacancy"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
