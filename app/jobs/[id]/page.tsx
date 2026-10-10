import { notFound } from "next/navigation";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Users,
  GraduationCap,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import ApplyJobButton from "@/components/jobs/ApplyJobButton";
import { formatDate, timeAgo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const jobRows = await db
    .select({
      id: schema.jobVacancies.id,
      title: schema.jobVacancies.title,
      description: schema.jobVacancies.description,
      requiredQualifications: schema.jobVacancies.requiredQualifications,
      requiredSubjects: schema.jobVacancies.requiredSubjects,
      gradeLevels: schema.jobVacancies.gradeLevels,
      yearsOfExperienceMin: schema.jobVacancies.yearsOfExperienceMin,
      openingsCount: schema.jobVacancies.openingsCount,
      employmentType: schema.jobVacancies.employmentType,
      salaryMin: schema.jobVacancies.salaryMin,
      salaryMax: schema.jobVacancies.salaryMax,
      salaryNegotiable: schema.jobVacancies.salaryNegotiable,
      locationCity: schema.jobVacancies.locationCity,
      locationState: schema.jobVacancies.locationState,
      applicationDeadline: schema.jobVacancies.applicationDeadline,
      expectedJoiningDate: schema.jobVacancies.expectedJoiningDate,
      benefits: schema.jobVacancies.benefits,
      contactInstructions: schema.jobVacancies.contactInstructions,
      status: schema.jobVacancies.status,
      createdAt: schema.jobVacancies.createdAt,
      instituteId: schema.institutes.id,
      instituteName: schema.institutes.name,
      instituteSlug: schema.institutes.slug,
      instituteType: schema.institutes.type,
      instituteLogo: schema.institutes.logoUrl,
      instituteCover: schema.institutes.coverUrl,
      instituteDescription: schema.institutes.description,
      instituteCity: schema.institutes.city,
      instituteState: schema.institutes.state,
      instituteVerified: schema.institutes.verificationStatus,
      instituteWebsite: schema.institutes.websiteUrl,
      instituteEmail: schema.institutes.officialEmail,
      institutePhone: schema.institutes.contactPhone,
    })
    .from(schema.jobVacancies)
    .innerJoin(schema.institutes, eq(schema.jobVacancies.instituteId, schema.institutes.id))
    .where(eq(schema.jobVacancies.id, id));

  const job = jobRows[0];
  if (!job) {
    notFound();
  }

  // Check application status if user is teacher
  let hasApplied = false;
  let applicationStatus: string | null = null;
  let hasSaved = false;

  if (user && user.role === "teacher" && user.teacherProfileId) {
    const existingApp = await db
      .select()
      .from(schema.jobApplications)
      .where(
        and(
          eq(schema.jobApplications.vacancyId, id),
          eq(schema.jobApplications.teacherId, user.teacherProfileId)
        )
      );

    if (existingApp.length > 0) {
      hasApplied = true;
      applicationStatus = existingApp[0].status;
    }

    const savedRecord = await db
      .select()
      .from(schema.savedJobs)
      .where(
        and(
          eq(schema.savedJobs.vacancyId, id),
          eq(schema.savedJobs.teacherId, user.teacherProfileId)
        )
      );
    hasSaved = savedRecord.length > 0;
  }

  const subjects = JSON.parse(job.requiredSubjects || "[]");
  const grades = JSON.parse(job.gradeLevels || "[]");
  const benefits = JSON.parse(job.benefits || "[]");

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#163B32] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vacancies</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
                {job.instituteLogo ? (
                  <img src={job.instituteLogo} alt={job.instituteName} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-[#163B32]" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/institutes/${job.instituteSlug}`}
                    className="text-sm font-semibold text-[#475569] hover:text-[#163B32] flex items-center gap-1"
                  >
                    <span>{job.instituteName}</span>
                    {job.instituteVerified === "approved" && (
                      <span title="Verified Institute">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      </span>
                    )}
                  </Link>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-[#65A88A] font-medium">{job.instituteType}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                    {job.locationCity}, {job.locationState}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {timeAgo(job.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <ApplyJobButton
              vacancyId={job.id}
              vacancyTitle={job.title}
              instituteName={job.instituteName}
              currentUser={user}
              hasApplied={hasApplied}
              applicationStatus={applicationStatus}
              hasSaved={hasSaved}
            />
          </div>

          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E2E8F0]">
            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0]">
              <span className="text-[11px] font-semibold text-[#475569] block">Expected Compensation</span>
              <span className="font-bold text-sm text-[#163B32]">
                {job.salaryMin && job.salaryMax
                  ? `₹${job.salaryMin.toLocaleString("en-IN")} - ₹${job.salaryMax.toLocaleString("en-IN")}/mo`
                  : "Competitive Scale"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0]">
              <span className="text-[11px] font-semibold text-[#475569] block">Experience Required</span>
              <span className="font-bold text-sm text-[#163B32]">
                Min {job.yearsOfExperienceMin}+ Years
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0]">
              <span className="text-[11px] font-semibold text-[#475569] block">Open Positions</span>
              <span className="font-bold text-sm text-[#163B32]">
                {job.openingsCount} {job.openingsCount === 1 ? "Opening" : "Openings"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0]">
              <span className="text-[11px] font-semibold text-[#475569] block">Expected Joining</span>
              <span className="font-bold text-sm text-[#163B32]">
                {job.expectedJoiningDate || "Immediate"}
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Body Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Description Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Job Description Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-lg text-[#163B32] mb-3">Job Description & Scope</h3>
                <div className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Required Qualifications */}
              <div className="pt-6 border-t border-[#E2E8F0]">
                <h3 className="font-bold text-lg text-[#163B32] mb-3">Required Academic Qualifications</h3>
                <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-sm text-[#163B32] font-medium flex items-start gap-2.5">
                  <GraduationCap className="w-5 h-5 text-[#65A88A] shrink-0 mt-0.5" />
                  <span>{job.requiredQualifications}</span>
                </div>
              </div>

              {/* Subjects & Grade Levels */}
              <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
                <h3 className="font-bold text-lg text-[#163B32]">Target Subjects & Classes</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block mb-2">
                      Subjects Handled
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((sub: string) => (
                        <span key={sub} className="px-3 py-1 rounded-lg bg-[#F7F5EF] text-xs font-medium text-[#163B32]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block mb-2">
                      Grade / Class Levels
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {grades.map((gr: string) => (
                        <span key={gr} className="px-3 py-1 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569]">
                          {gr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Institutional Benefits */}
              {benefits.length > 0 && (
                <div className="pt-6 border-t border-[#E2E8F0]">
                  <h3 className="font-bold text-lg text-[#163B32] mb-3">Perks & Benefits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {benefits.map((b: string) => (
                      <div key={b} className="flex items-center gap-2 text-xs font-medium text-[#163B32]">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {job.contactInstructions && (
                <div className="pt-6 border-t border-[#E2E8F0]">
                  <h3 className="font-bold text-lg text-[#163B32] mb-2">Selection & Application Process</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {job.contactInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Institution Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
                  {job.instituteLogo ? (
                    <img src={job.instituteLogo} alt={job.instituteName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-7 h-7 text-[#163B32]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#163B32] flex items-center gap-1.5">
                    <span>{job.instituteName}</span>
                    {job.instituteVerified === "approved" && (
                      <span title="Verified Institute">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-[#65A88A] font-medium">{job.instituteType}</p>
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed line-clamp-4">
                {job.instituteDescription}
              </p>

              <div className="space-y-2.5 pt-2 border-t border-[#E2E8F0] text-xs text-[#475569]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#65A88A] shrink-0" />
                  <span>{job.instituteCity}, {job.instituteState}</span>
                </div>
                {job.instituteWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#65A88A] shrink-0" />
                    <a href={job.instituteWebsite} target="_blank" rel="noopener noreferrer" className="text-[#163B32] hover:underline">
                      Official Website
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={`/institutes/${job.instituteSlug}`}
                  className="w-full py-2.5 px-4 rounded-xl text-center font-semibold text-xs text-[#163B32] bg-[#F7F5EF] hover:bg-[#efebe0] border border-[#E2E8F0] block transition"
                >
                  View Institution Profile & Other Openings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
