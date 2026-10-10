import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc, and, like, or } from "drizzle-orm";
import {
  Building2,
  Search,
  MapPin,
  ShieldCheck,
  Globe,
  Briefcase,
  Bus,
  ArrowRight,
  Filter,
  X,
  Sparkles,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function InstitutesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const location = params.location?.trim() || "";
  const type = params.type?.trim() || "";

  // Query institutes
  const institutes = await db
    .select()
    .from(schema.institutes)
    .where(
      and(
        q
          ? or(
              like(schema.institutes.name, `%${q}%`),
              like(schema.institutes.description, `%${q}%`)
            )
          : undefined,
        location
          ? or(
              like(schema.institutes.city, `%${location}%`),
              like(schema.institutes.state, `%${location}%`)
            )
          : undefined,
        type ? eq(schema.institutes.type, type as any) : undefined
      )
    )
    .orderBy(desc(schema.institutes.createdAt));

  const hasFilters = Boolean(q || location || type);

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163B32]/5 text-[#163B32] text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-[#65A88A]" />
              <span>Educational Institutions Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163B32] tracking-tight">
              Explore Verified Schools & Colleges
            </h1>
            <p className="text-sm sm:text-base text-[#475569]">
              Discover accredited schools, senior colleges, and coaching academies across India. Review their campuses, active faculty vacancies, and transport equipment.
            </p>
          </div>

          {/* Search Form */}
          <form method="GET" action="/institutes" className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Institution name or keyword"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="location"
                defaultValue={location}
                placeholder="City or State"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-3 flex gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] transition shadow-sm cursor-pointer"
              >
                Search Institutes
              </button>
              {hasFilters && (
                <Link
                  href="/institutes"
                  className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#475569] hover:bg-slate-100 transition shrink-0"
                  title="Clear filters"
                >
                  <X className="w-5 h-5" />
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Type Filter */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-sm text-[#163B32] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#65A88A]" />
                  <span>Institution Type</span>
                </h3>
                {hasFilters && (
                  <Link href="/institutes" className="text-xs text-[#65A88A] hover:underline">
                    Reset
                  </Link>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                {["School", "College", "Junior College", "Coaching Centre", "Other"].map((t) => (
                  <Link
                    key={t}
                    href={`/institutes?${new URLSearchParams({
                      ...(q ? { q } : {}),
                      ...(location ? { location } : {}),
                      ...(type === t ? {} : { type: t }),
                    }).toString()}`}
                    className={`block px-3 py-2 rounded-lg transition ${
                      type === t
                        ? "bg-[#163B32] text-white font-medium"
                        : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
                    }`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#475569] px-1">
              <span>
                Showing <strong className="text-[#163B32]">{institutes.length}</strong> institutions
              </span>
            </div>

            {institutes.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F7F5EF] text-[#163B32] flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6 text-[#65A88A]" />
                </div>
                <h3 className="font-bold text-lg text-[#163B32]">No institutions found</h3>
                <p className="text-sm text-[#475569] max-w-sm mx-auto">
                  Try adjusting search parameters or explore other locations.
                </p>
                <Link
                  href="/institutes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] transition"
                >
                  Reset filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institutes.map((inst) => {
                  const specializations = JSON.parse(inst.specializations || "[]");

                  return (
                    <div
                      key={inst.id}
                      className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
                            {inst.logoUrl ? (
                              <img src={inst.logoUrl} alt={inst.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-8 h-8 text-[#163B32]" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h2 className="font-bold text-base text-[#163B32] group-hover:text-[#65A88A] transition-colors line-clamp-1">
                                <Link href={`/institutes/${inst.slug}`}>{inst.name}</Link>
                              </h2>
                              {inst.verificationStatus === "approved" && (
                                <span title="Verified Institute">
                                  <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-[#65A88A]">{inst.type}</span>
                            {inst.establishedYear && (
                              <span className="text-xs text-slate-400 block mt-0.5">
                                Est. {inst.establishedYear}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                          {inst.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {specializations.map((spec: string) => (
                            <span key={spec} className="px-2.5 py-1 rounded-md bg-[#F7F5EF] text-[11px] font-medium text-[#163B32]">
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-[#475569] pt-2 border-t border-[#E2E8F0]">
                          <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                          <span>{inst.city}, {inst.state}</span>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Status: <strong className="text-emerald-700 capitalize">{inst.verificationStatus}</strong>
                        </span>
                        <Link
                          href={`/institutes/${inst.slug}`}
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
