import { notFound } from "next/navigation";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import {
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  Languages,
  Calendar,
  IndianRupee,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  FileText,
  Lock,
  Building2,
  CheckCircle2,
  Award,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function TeacherProfilePage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const teacherRows = await db
    .select()
    .from(schema.teacherProfiles)
    .where(eq(schema.teacherProfiles.id, id));

  const teacher = teacherRows[0];
  if (!teacher) {
    notFound();
  }

  const isOwner = user?.id === teacher.userId;
  const isInstituteAdmin = user?.role === "institute_admin";
  const isPlatformAdmin = user?.role === "platform_admin";

  // If profile is not public, only owner and admin can view
  if (teacher.isPublic === 0 && !isOwner && !isPlatformAdmin) {
    notFound();
  }

  // Strict Phone Number Visibility Control:
  // If phone is marked invisible, phone number is nullified server-side for any non-owner.
  const displayPhone =
    isOwner || (teacher.isPhoneVisible === 1 && (isInstituteAdmin || isPlatformAdmin))
      ? teacher.phone
      : null;

  // Strict Resume visibility: only owner, institutes, or admin can download resume
  const canViewResume = (isOwner || isInstituteAdmin || isPlatformAdmin) && Boolean(teacher.resumeUrl);

  const subjects = JSON.parse(teacher.subjects || "[]");
  const grades = JSON.parse(teacher.gradeLevels || "[]");
  const degrees = JSON.parse(teacher.degrees || "[]");
  const previousInstitutes = JSON.parse(teacher.previousInstitutes || "[]");
  const languages = JSON.parse(teacher.languages || "[]");
  const preferredLocations = JSON.parse(teacher.preferredLocations || "[]");

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/teachers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#163B32] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Teachers Directory</span>
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#F8FAF7] border-2 border-[#E2E8F0] overflow-hidden shrink-0 shadow-xs">
                {teacher.avatarUrl ? (
                  <img src={teacher.avatarUrl} alt={teacher.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-[#163B32]">
                    {teacher.fullName[0]}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
                    {teacher.fullName}
                  </h1>
                  {teacher.isOpenToWork === 1 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Open to Work
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-[#475569]">
                  {teacher.highestQualification}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                    {teacher.city}, {teacher.state}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#163B32]">
                    <Briefcase className="w-3.5 h-3.5 text-[#65A88A]" />
                    {teacher.yearsOfExperience} Years Teaching Experience
                  </span>
                  {teacher.availableFrom && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Available: {teacher.availableFrom}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Resume / Contact Action */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              {canViewResume && teacher.resumeUrl && (
                <a
                  href={teacher.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition"
                >
                  <FileText className="w-4 h-4 text-[#65A88A]" />
                  <span>Download Verified Resume</span>
                </a>
              )}

              {isOwner && (
                <Link
                  href="/dashboard/teacher/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs text-[#163B32] bg-[#F7F5EF] border border-[#E2E8F0] hover:bg-[#efebe0] transition"
                >
                  Edit My Profile & Privacy Settings
                </Link>
              )}
            </div>
          </div>

          {/* Headline Banner */}
          {teacher.headline && (
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E2E8F0] text-xs sm:text-sm font-medium text-[#163B32]">
              &ldquo;{teacher.headline}&rdquo;
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-semibold text-[#475569] block">Expected Salary</span>
              <span className="font-bold text-xs sm:text-sm text-[#163B32]">
                {teacher.expectedSalaryMin
                  ? `₹${teacher.expectedSalaryMin.toLocaleString("en-IN")}+ / month`
                  : "Negotiable"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-semibold text-[#475569] block">Employment Preference</span>
              <span className="font-bold text-xs sm:text-sm text-[#163B32]">
                {teacher.employmentTypePref || "Full-time"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-semibold text-[#475569] block">Languages</span>
              <span className="font-bold text-xs sm:text-sm text-[#163B32] truncate block">
                {languages.join(", ") || "English"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
              <span className="text-[10px] uppercase font-semibold text-[#475569] block">Locations</span>
              <span className="font-bold text-xs sm:text-sm text-[#163B32] truncate block">
                {preferredLocations.join(", ") || teacher.city}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Biography */}
            {teacher.bio && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-3">
                <h3 className="font-bold text-lg text-[#163B32]">Professional Biography</h3>
                <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                  {teacher.bio}
                </p>
              </div>
            )}

            {/* Academic Qualifications & Degrees */}
            {degrees.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-[#163B32] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#65A88A]" />
                  <span>Degrees & Educational Qualifications</span>
                </h3>
                <div className="space-y-3">
                  {degrees.map((deg: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#163B32]">{deg.degree}</h4>
                        <p className="text-xs text-[#475569]">{deg.institute}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#163B32]">
                        {deg.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teaching Experience History */}
            {previousInstitutes.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-[#163B32] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#65A88A]" />
                  <span>Previous Institutional Experience</span>
                </h3>
                <div className="space-y-3">
                  {previousInstitutes.map((exp: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#163B32]">{exp.role}</h4>
                        <p className="text-xs text-[#475569]">{exp.instituteName}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#163B32]">
                        {exp.years}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Subjects & Contact Privacy */}
          <div className="lg:col-span-4 space-y-6">
            {/* Subjects & Grades Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
              <div>
                <h4 className="font-bold text-sm text-[#163B32] mb-2.5">Subjects Taught</h4>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((sub: string) => (
                    <span key={sub} className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] text-xs font-medium text-[#163B32]">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]">
                <h4 className="font-bold text-sm text-[#163B32] mb-2.5">Grades & Classes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {grades.map((gr: string) => (
                    <span key={gr} className="px-2.5 py-1 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569]">
                      {gr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy-Protected Contact Information */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-[#163B32] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Contact Details</span>
              </h4>

              {/* Phone Protection Display */}
              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs space-y-1">
                <span className="font-semibold text-[#475569] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#65A88A]" />
                  Phone Number
                </span>
                {displayPhone ? (
                  <span className="font-bold text-[#163B32] text-sm block">
                    {displayPhone}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-500 pt-0.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone hidden by educator (Privacy Protected)</span>
                  </div>
                )}
              </div>

              {/* Email Protection Display */}
              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs space-y-1">
                <span className="font-semibold text-[#475569] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#65A88A]" />
                  Official Email
                </span>
                {isInstituteAdmin || isOwner || isPlatformAdmin ? (
                  <span className="font-bold text-[#163B32] block">
                    {teacher.email}
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-500 pt-0.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Visible only to verified hiring institutes</span>
                  </div>
                )}
              </div>

              {!user && (
                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-[#163B32] hover:text-[#65A88A] hover:underline"
                  >
                    Log in as Institute to contact this teacher
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
