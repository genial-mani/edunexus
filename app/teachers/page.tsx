import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc, and, like, or, gte } from "drizzle-orm";
import {
  Users,
  Search,
  MapPin,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Languages,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    subject?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function TeachersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const location = params.location?.trim() || "";
  const subject = params.subject?.trim() || "";

  // Query teachers who are Open to Work and Public
  const teachers = await db
    .select()
    .from(schema.teacherProfiles)
    .where(
      and(
        eq(schema.teacherProfiles.isPublic, 1),
        eq(schema.teacherProfiles.isOpenToWork, 1),
        q
          ? or(
              like(schema.teacherProfiles.fullName, `%${q}%`),
              like(schema.teacherProfiles.headline, `%${q}%`),
              like(schema.teacherProfiles.subjects, `%${q}%`)
            )
          : undefined,
        location
          ? or(
              like(schema.teacherProfiles.city, `%${location}%`),
              like(schema.teacherProfiles.state, `%${location}%`),
              like(schema.teacherProfiles.preferredLocations, `%${location}%`)
            )
          : undefined,
        subject ? like(schema.teacherProfiles.subjects, `%${subject}%`) : undefined
      )
    )
    .orderBy(desc(schema.teacherProfiles.yearsOfExperience));

  const hasFilters = Boolean(q || location || subject);

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Educator Talent Pool</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163B32] tracking-tight">
              Discover Teachers Open to Work
            </h1>
            <p className="text-sm sm:text-base text-[#475569]">
              Connect directly with verified educators, subject matter experts, and curriculum specialists across India ready for immediate placement.
            </p>
          </div>

          {/* Search Form */}
          <form method="GET" action="/teachers" className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Name, subject (e.g. Mathematics, Robotics)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="location"
                defaultValue={location}
                placeholder="City, District, or State"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-3 flex gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] transition shadow-sm cursor-pointer"
              >
                Find Teachers
              </button>
              {hasFilters && (
                <Link
                  href="/teachers"
                  className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#475569] hover:bg-slate-100 transition shrink-0"
                  title="Clear filters"
                >
                  <X className="w-5 h-5" />
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Subject Shortcuts */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-sm text-[#163B32] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#65A88A]" />
                  <span>Subject Domains</span>
                </h3>
                {hasFilters && (
                  <Link href="/teachers" className="text-xs text-[#65A88A] hover:underline">
                    Reset
                  </Link>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                {["Mathematics", "Physics", "Chemistry", "Computer Science", "English", "Science"].map((s) => (
                  <Link
                    key={s}
                    href={`/teachers?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(location ? { location } : {}),
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

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#475569] px-1">
              <span>
                Found <strong className="text-[#163B32]">{teachers.length}</strong> active educators open to work
              </span>
            </div>

            {teachers.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F7F5EF] text-[#163B32] flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-[#65A88A]" />
                </div>
                <h3 className="font-bold text-lg text-[#163B32]">No teachers found matching criteria</h3>
                <p className="text-sm text-[#475569] max-w-sm mx-auto">
                  Try broadening your search term or exploring general locations.
                </p>
                <Link
                  href="/teachers"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] transition"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teachers.map((teacher) => {
                  const subjects = JSON.parse(teacher.subjects || "[]");
                  const grades = JSON.parse(teacher.gradeLevels || "[]");
                  const languages = JSON.parse(teacher.languages || "[]");

                  return (
                    <div
                      key={teacher.id}
                      className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] overflow-hidden shrink-0">
                            {teacher.avatarUrl ? (
                              <img src={teacher.avatarUrl} alt={teacher.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#163B32]">
                                {teacher.fullName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="font-bold text-base text-[#163B32] group-hover:text-[#65A88A] transition-colors">
                                <Link href={`/teachers/${teacher.id}`}>{teacher.fullName}</Link>
                              </h2>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Open to Work
                              </span>
                            </div>
                            <p className="text-xs text-[#475569] font-medium mt-0.5">{teacher.highestQualification}</p>
                            <p className="text-xs text-[#65A88A] font-semibold">{teacher.yearsOfExperience} Years Exp</p>
                          </div>
                        </div>

                        <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                          {teacher.headline || teacher.bio}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {subjects.map((s: string) => (
                            <span key={s} className="px-2.5 py-1 rounded-md bg-[#F7F5EF] text-[11px] font-medium text-[#163B32]">
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] pt-2 border-t border-[#E2E8F0]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                            {teacher.city}, {teacher.state}
                          </span>
                          {teacher.employmentTypePref && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                              {teacher.employmentTypePref}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {teacher.availableFrom ? `Available: ${teacher.availableFrom}` : "Available for interviews"}
                        </span>
                        <Link
                          href={`/teachers/${teacher.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition"
                        >
                          <span>View Profile</span>
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
