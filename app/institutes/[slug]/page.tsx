import { notFound } from "next/navigation";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc, and } from "drizzle-orm";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  Briefcase,
  Bus,
  ArrowLeft,
  ArrowRight,
  IndianRupee,
  Calendar,
  Sparkles,
} from "lucide-react";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function InstituteDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const instRows = await db
    .select()
    .from(schema.institutes)
    .where(eq(schema.institutes.slug, slug));

  const inst = instRows[0];
  if (!inst) {
    notFound();
  }

  // Fetch active vacancies
  const vacancies = await db
    .select()
    .from(schema.jobVacancies)
    .where(
      and(
        eq(schema.jobVacancies.instituteId, inst.id),
        eq(schema.jobVacancies.status, "published")
      )
    )
    .orderBy(desc(schema.jobVacancies.createdAt));

  // Fetch active buses
  const buses = await db
    .select()
    .from(schema.busListings)
    .where(
      and(
        eq(schema.busListings.instituteId, inst.id),
        eq(schema.busListings.status, "published")
      )
    )
    .orderBy(desc(schema.busListings.createdAt));

  const educationLevels = JSON.parse(inst.educationLevels || "[]");
  const specializations = JSON.parse(inst.specializations || "[]");

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/institutes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#163B32] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Institutions Directory</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          {/* Cover Banner */}
          <div className="h-44 sm:h-56 w-full bg-slate-100 relative">
            {inst.coverUrl ? (
              <img src={inst.coverUrl} alt={inst.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#163B32] to-[#1f4f43]" />
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#163B32] flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="capitalize">{inst.verificationStatus} Institution</span>
            </div>
          </div>

          {/* Profile Details Header */}
          <div className="p-6 sm:p-8 pt-0 relative space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12 sm:-mt-16">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
                  {inst.logoUrl ? (
                    <img src={inst.logoUrl} alt={inst.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12 text-[#163B32]" />
                  )}
                </div>
                <div className="space-y-1 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
                    {inst.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                    <span className="font-semibold text-[#65A88A]">{inst.type}</span>
                    {inst.establishedYear && (
                      <>
                        <span>•</span>
                        <span>Established {inst.establishedYear}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {inst.websiteUrl && (
                <a
                  href={inst.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#163B32] bg-[#F7F5EF] border border-[#E2E8F0] hover:bg-[#efebe0] transition self-start sm:self-auto"
                >
                  <Globe className="w-3.5 h-3.5 text-[#65A88A]" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>

            <p className="text-sm text-[#475569] leading-relaxed max-w-4xl">
              {inst.description}
            </p>

            {/* Quick Contact & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#475569]">
              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#65A88A] shrink-0" />
                <span className="truncate">{inst.address || `${inst.city}, ${inst.state}`}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#65A88A] shrink-0" />
                <span className="truncate">{inst.officialEmail}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#65A88A] shrink-0" />
                <span>{inst.contactPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Education Levels & Specializations */}
        {(educationLevels.length > 0 || specializations.length > 0) && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-[#163B32]">Educational Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationLevels.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block mb-2">
                    Levels Offered
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {educationLevels.map((lvl: string) => (
                      <span key={lvl} className="px-3 py-1 rounded-lg bg-[#F7F5EF] text-xs font-medium text-[#163B32]">
                        {lvl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {specializations.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block mb-2">
                    Accreditation & Specializations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((sp: string) => (
                      <span key={sp} className="px-3 py-1 rounded-lg bg-[#F8FAF7] border border-[#E2E8F0] text-xs font-medium text-[#163B32]">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Vacancies Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#163B32] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#65A88A]" />
              <span>Active Teaching Openings ({vacancies.length})</span>
            </h2>
          </div>

          {vacancies.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E2E8F0] text-xs text-[#475569]">
              No active vacancies currently open at this institution.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vacancies.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#65A88A] shadow-sm transition group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-[#163B32] group-hover:text-[#65A88A] transition-colors">
                        {job.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#163B32]/5 text-[#163B32] shrink-0">
                        {job.employmentType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#475569]">
                      {job.salaryMin && job.salaryMax && (
                        <span className="font-semibold text-[#163B32]">
                          ₹{job.salaryMin.toLocaleString("en-IN")} - ₹{job.salaryMax.toLocaleString("en-IN")}/mo
                        </span>
                      )}
                      <span>Min {job.yearsOfExperienceMin}+ yrs exp</span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#163B32] font-semibold group-hover:text-[#65A88A]">
                    <span>View Requirements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Listed Buses Section */}
        {buses.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-[#163B32] flex items-center gap-2">
              <Bus className="w-5 h-5 text-[#65A88A]" />
              <span>School Buses Listed by This Institution ({buses.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {buses.map((bus) => (
                <Link
                  key={bus.id}
                  href={`/buses/${bus.id}`}
                  className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm hover:border-[#65A88A] transition group flex flex-col justify-between"
                >
                  <div className="relative h-40 w-full bg-slate-100">
                    <img
                      src={bus.primaryImageUrl || "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"}
                      alt={bus.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold text-[#163B32]">
                      {formatCurrency(bus.askingPrice)}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-sm text-[#163B32] group-hover:text-[#65A88A] line-clamp-1">
                      {bus.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#475569]">
                      <span>{bus.seatingCapacity} Seats</span>
                      <span>{bus.fuelType}</span>
                      <span>{bus.vehicleCondition}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
