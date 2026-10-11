import Link from "next/link";
import type { Metadata } from "next";
import { db, schema } from "@/lib/db";
import { eq, desc, and, like, or } from "drizzle-orm";
import {
  Briefcase,
  Building2,
  MapPin,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
  Clock,
  Compass,
  X,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Find Teaching Jobs & Faculty Vacancies",
  description:
    "Browse verified teaching jobs, school faculty openings, principal and lecturer positions across India on EduNexus.",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    district?: string;
    state?: string;
    type?: string;
    subject?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const location = params.location?.trim() || "";
  const district = params.district?.trim() || "";
  const state = params.state?.trim() || "";
  const employmentType = params.type || "";
  const subject = params.subject || "";

  // Query jobs with institute info and address fields
  const jobs = await db
    .select({
      id: schema.jobVacancies.id,
      title: schema.jobVacancies.title,
      description: schema.jobVacancies.description,
      employmentType: schema.jobVacancies.employmentType,
      requiredQualifications: schema.jobVacancies.requiredQualifications,
      requiredSubjects: schema.jobVacancies.requiredSubjects,
      gradeLevels: schema.jobVacancies.gradeLevels,
      experienceMin: schema.jobVacancies.yearsOfExperienceMin,
      salaryMin: schema.jobVacancies.salaryMin,
      salaryMax: schema.jobVacancies.salaryMax,
      locationCity: schema.jobVacancies.locationCity,
      locationState: schema.jobVacancies.locationState,
      district: schema.jobVacancies.district,
      mandal: schema.jobVacancies.mandal,
      pincode: schema.jobVacancies.pincode,
      applicationDeadline: schema.jobVacancies.applicationDeadline,
      createdAt: schema.jobVacancies.createdAt,
      instituteName: schema.institutes.name,
      instituteLogo: schema.institutes.logoUrl,
      instituteSlug: schema.institutes.slug,
      instituteVerified: schema.institutes.verificationStatus,
    })
    .from(schema.jobVacancies)
    .innerJoin(schema.institutes, eq(schema.jobVacancies.instituteId, schema.institutes.id))
    .where(
      and(
        eq(schema.jobVacancies.status, "published"),
        q ? or(like(schema.jobVacancies.title, `%${q}%`), like(schema.jobVacancies.description, `%${q}%`)) : undefined,
        location
          ? or(
              like(schema.jobVacancies.locationCity, `%${location}%`),
              like(schema.jobVacancies.locationState, `%${location}%`),
              like(schema.jobVacancies.district, `%${location}%`),
              like(schema.jobVacancies.mandal, `%${location}%`),
              like(schema.jobVacancies.pincode, `%${location}%`)
            )
          : undefined,
        district ? like(schema.jobVacancies.district, `%${district}%`) : undefined,
        state ? like(schema.jobVacancies.locationState, `%${state}%`) : undefined,
        employmentType ? eq(schema.jobVacancies.employmentType, employmentType as any) : undefined,
        subject ? like(schema.jobVacancies.requiredSubjects, `%${subject}%`) : undefined
      )
    )
    .orderBy(desc(schema.jobVacancies.createdAt));

  const hasFilters = Boolean(q || location || district || state || employmentType || subject);

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163B32]/5 text-[#163B32] text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-[#65A88A]" />
              <span>Teaching Careers & Faculty Openings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163B32] tracking-tight">
              Explore Verified Teaching Vacancies
            </h1>
            <p className="text-sm sm:text-base text-[#475569]">
              Discover teaching opportunities in top CBSE, ICSE, and Degree colleges. Filter by location, district, subject, and employment preferences.
            </p>
          </div>

          {/* Search Bar Form */}
          <form method="GET" action="/jobs" className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Job title, subject, or keywords"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="location"
                defaultValue={location}
                placeholder="City, District, Mandal, or State"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-3 flex gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] transition shadow-sm cursor-pointer"
              >
                Find Vacancies
              </button>
              {hasFilters && (
                <Link
                  href="/jobs"
                  className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#475569] hover:bg-slate-100 transition shrink-0"
                  title="Clear filters"
                >
                  <X className="w-5 h-5" />
                </Link>
              )}
            </div>
          </form>

          {/* Hyper-Local Address Callout Notice */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Hyper-Local Discovery:</strong> Providing granular address details (State, District, Mandal, Village/City, Pincode) helps candidates discover hyper-local relevant results.
            </span>
          </div>
        </div>

        {/* Filters & Results Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-sm text-[#163B32] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#65A88A]" />
                  <span>Filter Vacancies</span>
                </h3>
                {hasFilters && (
                  <Link href="/jobs" className="text-xs text-[#65A88A] hover:underline">
                    Reset
                  </Link>
                )}
              </div>

              {/* District Filter Quick Search */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block">
                  District / Region
                </span>
                <form method="GET" action="/jobs" className="relative">
                  {q && <input type="hidden" name="q" value={q} />}
                  {employmentType && <input type="hidden" name="type" value={employmentType} />}
                  {subject && <input type="hidden" name="subject" value={subject} />}
                  <input
                    type="text"
                    name="district"
                    defaultValue={district}
                    placeholder="e.g. Guntur, Bengaluru..."
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                  />
                </form>
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block">
                  Employment Type
                </span>
                <div className="space-y-1.5 text-xs">
                  {["Full-time", "Part-time", "Contract", "Substitute"].map((t) => (
                    <Link
                      key={t}
                      href={`/jobs?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(location ? { location } : {}),
                        ...(district ? { district } : {}),
                        ...(subject ? { subject } : {}),
                        ...(employmentType === t ? {} : { type: t }),
                      }).toString()}`}
                      className={`block px-3 py-2 rounded-lg transition ${
                        employmentType === t
                          ? "bg-[#163B32] text-white font-medium"
                          : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
                      }`}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Subjects */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block">
                  Subject Focus
                </span>
                <div className="space-y-1.5 text-xs">
                  {["Mathematics", "Physics", "English", "Computer Science", "Chemistry", "Physical Education"].map((s) => (
                    <Link
                      key={s}
                      href={`/jobs?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(location ? { location } : {}),
                        ...(district ? { district } : {}),
                        ...(employmentType ? { type: employmentType } : {}),
                        ...(subject === s ? {} : { subject: s }),
                      }).toString()}`}
                      className={`block px-3 py-2 rounded-lg transition ${
                        subject === s
                          ? "bg-[#163B32] text-white font-medium"
                          : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
                      }`}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#475569] px-1">
              <span>
                Showing <strong className="text-[#163B32]">{jobs.length}</strong> active teaching {jobs.length === 1 ? "vacancy" : "vacancies"}
              </span>
            </div>

            {jobs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F7F5EF] text-[#163B32] flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6 text-[#65A88A]" />
                </div>
                <h3 className="font-bold text-lg text-[#163B32]">No matching vacancies found</h3>
                <p className="text-sm text-[#475569] max-w-sm mx-auto">
                  Try adjusting your search keywords, clearing location filters, or exploring other subjects.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] transition"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const subjects = JSON.parse(job.requiredSubjects || "[]");
                  const grades = JSON.parse(job.gradeLevels || "[]");
                  const locationParts = [
                    job.locationCity,
                    job.mandal,
                    job.district,
                    job.locationState,
                    job.pincode,
                  ].filter(Boolean);

                  return (
                    <div
                      key={job.id}
                      className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
                              {job.instituteLogo ? (
                                <img src={job.instituteLogo} alt={job.instituteName} className="w-full h-full object-cover" />
                              ) : (
                                <Building2 className="w-7 h-7 text-[#163B32]" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/institutes/${job.instituteSlug}`}
                                  className="text-xs font-semibold text-[#475569] hover:text-[#163B32] flex items-center gap-1"
                                >
                                  {job.instituteName}
                                  {job.instituteVerified === "approved" && (
                                    <span title="Verified Institute">
                                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                                    </span>
                                  )}
                                </Link>
                              </div>
                              <h2 className="font-bold text-lg text-[#163B32] group-hover:text-[#65A88A] transition-colors mt-0.5">
                                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                              </h2>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#163B32]/5 text-[#163B32] border border-[#163B32]/10">
                              {job.employmentType}
                            </span>
                          </div>
                        </div>

                        {/* Metadata row with Granular Address */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569]">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <MapPin className="w-4 h-4 text-[#65A88A]" />
                            {locationParts.join(", ")}
                          </span>
                          {job.salaryMin && job.salaryMax && (
                            <span className="flex items-center gap-1 font-bold text-[#163B32]">
                              <IndianRupee className="w-4 h-4 text-[#65A88A]" />
                              ₹{job.salaryMin.toLocaleString("en-IN")} - ₹{job.salaryMax.toLocaleString("en-IN")}/mo
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            Min {job.experienceMin}+ years exp
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-4 h-4" />
                            Posted {timeAgo(job.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>

                        {/* Subjects & Grade Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {subjects.map((sub: string) => (
                            <span key={sub} className="px-2.5 py-1 rounded-md bg-[#F7F5EF] text-[11px] font-medium text-[#163B32]">
                              {sub}
                            </span>
                          ))}
                          {grades.map((gr: string) => (
                            <span key={gr} className="px-2.5 py-1 rounded-md bg-[#F8FAF7] border border-[#E2E8F0] text-[11px] text-[#475569]">
                              {gr}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                        <span className="text-xs text-[#475569]">
                          Req: <span className="font-medium text-[#163B32]">{job.requiredQualifications}</span>
                        </span>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition"
                        >
                          <span>View & Apply</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#65A88A]" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
