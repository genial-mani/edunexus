import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc, and } from "drizzle-orm";
import {
  Briefcase,
  Users,
  Building2,
  Bus,
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Calendar,
  GraduationCap,
  Award,
  ChevronRight,
  Handshake,
  Tag,
  Gauge,
  PhoneOff,
} from "lucide-react";
import { formatCurrency, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Fetch latest published vacancies with their institutes
  const vacanciesData = await db
    .select({
      id: schema.jobVacancies.id,
      title: schema.jobVacancies.title,
      employmentType: schema.jobVacancies.employmentType,
      locationCity: schema.jobVacancies.locationCity,
      locationState: schema.jobVacancies.locationState,
      district: schema.jobVacancies.district,
      salaryMin: schema.jobVacancies.salaryMin,
      salaryMax: schema.jobVacancies.salaryMax,
      experienceMin: schema.jobVacancies.yearsOfExperienceMin,
      requiredSubjects: schema.jobVacancies.requiredSubjects,
      createdAt: schema.jobVacancies.createdAt,
      instituteName: schema.institutes.name,
      instituteLogo: schema.institutes.logoUrl,
      instituteSlug: schema.institutes.slug,
      instituteVerified: schema.institutes.verificationStatus,
    })
    .from(schema.jobVacancies)
    .innerJoin(schema.institutes, eq(schema.jobVacancies.instituteId, schema.institutes.id))
    .where(eq(schema.jobVacancies.status, "published"))
    .orderBy(desc(schema.jobVacancies.createdAt))
    .limit(4);

  // 2. Fetch featured approved institutes
  const institutesData = await db
    .select()
    .from(schema.institutes)
    .where(eq(schema.institutes.verificationStatus, "approved"))
    .orderBy(desc(schema.institutes.establishedYear))
    .limit(4);

  // 3. Fetch teachers currently open to work
  const teachersData = await db
    .select()
    .from(schema.teacherProfiles)
    .where(and(eq(schema.teacherProfiles.isOpenToWork, 1), eq(schema.teacherProfiles.isPublic, 1)))
    .orderBy(desc(schema.teacherProfiles.yearsOfExperience))
    .limit(3);

  // 4. Fetch recently listed buses with isNegotiable
  const busesData = await db
    .select({
      id: schema.busListings.id,
      title: schema.busListings.title,
      manufacturer: schema.busListings.manufacturer,
      manufacturingYear: schema.busListings.manufacturingYear,
      seatingCapacity: schema.busListings.seatingCapacity,
      askingPrice: schema.busListings.askingPrice,
      isNegotiable: schema.busListings.isNegotiable,
      locationCity: schema.busListings.locationCity,
      locationState: schema.busListings.locationState,
      vehicleCondition: schema.busListings.vehicleCondition,
      fuelType: schema.busListings.fuelType,
      odometerKms: schema.busListings.odometerKms,
      primaryImageUrl: schema.busListings.primaryImageUrl,
      createdAt: schema.busListings.createdAt,
      instituteName: schema.institutes.name,
    })
    .from(schema.busListings)
    .innerJoin(schema.institutes, eq(schema.busListings.instituteId, schema.institutes.id))
    .where(eq(schema.busListings.status, "published"))
    .orderBy(desc(schema.busListings.createdAt))
    .limit(3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#F7F5EF] via-[#FAF9F5] to-[#F8FAF7] pt-12 pb-20 border-b border-[#E2E8F0]/60 overflow-hidden">
        {/* Subtle Decorative Golden/Amber Glow in background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FEF3C7]/40 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#92400E] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>India&apos;s Trusted Education & Faculty Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#163B32] tracking-tight leading-[1.12]">
                Where Schools Discover Exceptional <span className="underline decoration-[#65A88A] decoration-wavy">Teachers</span> & Assets
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl">
                <strong>School Market</strong> connects accredited educational institutions and certified teachers in one synchronized network. Recruit top teachers, discover educators open to work, and trade verified institutional school buses.
              </p>

              {/* Multi-Faceted Unified Search Box */}
              <div className="p-3 bg-white rounded-2xl shadow-xl shadow-[#163B32]/5 border border-[#E2E8F0] space-y-3">
                <form action="/jobs" method="GET" className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Subject, role (e.g. Mathematics PGT, Physics, Principal)"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 focus:border-[#65A88A]"
                    />
                  </div>

                  <div className="w-full sm:w-48 relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="location"
                      placeholder="City or State"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 focus:border-[#65A88A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition active:scale-[0.98] shrink-0"
                  >
                    <span>Search Jobs</span>
                    <ArrowRight className="w-4 h-4 text-[#65A88A]" />
                  </button>
                </form>

                {/* Quick Category Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#475569]">
                  <span className="font-semibold text-[#163B32]">Popular:</span>
                  <Link href="/jobs?q=Mathematics" className="px-2.5 py-1 rounded-md bg-[#F7F5EF] hover:bg-[#efebe0] transition">
                    PGT Mathematics
                  </Link>
                  <Link href="/teachers" className="px-2.5 py-1 rounded-md bg-[#FEF3C7] text-[#92400E] font-medium hover:bg-[#FDE68A] transition border border-[#FDE68A]">
                    Discover Teachers
                  </Link>
                  <Link href="/jobs?q=Computer+Science" className="px-2.5 py-1 rounded-md bg-[#F7F5EF] hover:bg-[#efebe0] transition">
                    Computer Science / AI
                  </Link>
                  <Link href="/buses" className="px-2.5 py-1 rounded-md bg-[#F7F5EF] text-[#163B32] font-medium hover:bg-[#efebe0] transition">
                    School Buses
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80"
                  alt="Modern classroom education"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163B32]/95 via-[#163B32]/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium w-fit mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>100% Verified Institutions</span>
                  </div>
                  <h3 className="text-xl font-bold">Empowering Educators & Schools</h3>
                  <p className="text-xs text-slate-200 mt-1">
                    Direct hiring, verified credentials, location discovery, and institutional bus transfers.
                  </p>
                </div>
              </div>

              {/* Floating Stat Pill 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#E2E8F0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-[#D97706]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#475569]">Open to Work</div>
                  <div className="text-base font-bold text-[#163B32]">Verified Faculty</div>
                </div>
              </div>

              {/* Floating Stat Pill 2 */}
              <div className="absolute -top-6 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E2E8F0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center font-bold">
                  <Bus className="w-5 h-5 text-[#65A88A]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#475569]">Transport Fleet</div>
                  <div className="text-sm font-bold text-[#163B32]">School Buses Listed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO PROMOTIONAL PANELS */}
      <section className="py-12 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher Panel */}
            <div className="p-8 rounded-3xl bg-[#F7F5EF] border border-[#E2E8F0] flex flex-col justify-between group hover:border-[#65A88A] transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#163B32] text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-6 h-6 text-[#65A88A]" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#D97706]">For Educators & Teachers</span>
                  <h3 className="text-2xl font-bold text-[#163B32] mt-1">
                    Looking for Your Next Teaching Opportunity?
                  </h3>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Build a distinguished teacher profile, upload your resume, and enable the &quot;Open to Work&quot; indicator. Let top schools and degree colleges invite you directly with complete privacy over your contact information.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] transition shadow-sm"
                >
                  <span>Create Teacher Profile</span>
                  <ArrowRight className="w-4 h-4 text-[#65A88A]" />
                </Link>
              </div>
            </div>

            {/* Institution Panel */}
            <div className="p-8 rounded-3xl bg-[#163B32] text-white flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                  <Building2 className="w-6 h-6 text-[#65A88A]" />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#65A88A]">For Educational Institutions</span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Recruit Top Faculty & Manage Institutional Assets
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Publish vacancies with custom requirements, review verified teacher applications, discover active faculty, and buy or sell institutional school buses to other certified schools.
                </p>
              </div>
              <div className="pt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-[#163B32] bg-[#F7F5EF] hover:bg-white transition shadow-sm"
                >
                  <span>Register Institution</span>
                  <ArrowRight className="w-4 h-4 text-[#163B32]" />
                </Link>
                <Link
                  href="/buses"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-200 hover:text-white border border-white/20 hover:border-white transition"
                >
                  <span>Explore Buses</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE 4 PILLARS */}
      <section className="py-16 bg-[#F8FAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#163B32] tracking-tight">
              Centralized Education Ecosystem
            </h2>
            <p className="text-sm text-[#475569] mt-2">
              Everything educational institutions and teachers need in one synchronized marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/jobs"
              className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center group-hover:bg-[#163B32] group-hover:text-white transition-colors">
                  <Briefcase className="w-6 h-6 text-[#65A88A]" />
                </div>
                <h3 className="font-bold text-lg text-[#163B32]">Teaching Jobs</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Browse vacancies across primary, middle, secondary, and college levels. Localized to your area first.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#163B32] group-hover:text-[#65A88A]">
                <span>Browse Vacancies</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/teachers"
              className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#D97706] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center group-hover:bg-[#D97706] group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#163B32]">Find Teachers</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E]">Smart Local</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Discover experienced teachers actively open to work. Filtered and prioritized by city, village, and district.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#D97706] group-hover:text-[#92400E]">
                <span>Discover Faculty</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/institutes"
              className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center group-hover:bg-[#163B32] group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6 text-[#65A88A]" />
                </div>
                <h3 className="font-bold text-lg text-[#163B32]">Institutes</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Explore verified schools and colleges. View active faculty vacancies, campus details, and contact points.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#163B32] group-hover:text-[#65A88A]">
                <span>View Institutes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/buses"
              className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center group-hover:bg-[#163B32] group-hover:text-white transition-colors">
                  <Bus className="w-6 h-6 text-[#65A88A]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-[#163B32]">School Buses</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Negotiable</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Direct institute-to-institute marketplace for school buses. Tata, Eicher, Ashok Leyland with verified fitness.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#163B32] group-hover:text-[#65A88A]">
                <span>Browse Buses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. LATEST JOB OPENINGS */}
      <section className="py-16 bg-white border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#65A88A]">Featured Openings</span>
              <h2 className="text-3xl font-extrabold text-[#163B32] tracking-tight mt-1">
                Latest Teaching Vacancies
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#163B32] hover:text-[#65A88A]"
            >
              <span>View all vacancies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vacanciesData.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] hover:border-[#65A88A] hover:bg-white shadow-sm transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
                        {job.instituteLogo ? (
                          <img src={job.instituteLogo} alt={job.instituteName} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-[#163B32]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#475569]">{job.instituteName}</span>
                          {job.instituteVerified === "approved" && (
                            <span title="Verified Institution">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-[#163B32] group-hover:text-[#65A88A] transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F7F5EF] text-[#163B32] shrink-0">
                      {job.employmentType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                      {job.locationCity}, {job.district ? `${job.district}, ` : ""}{job.locationState}
                    </span>
                    {job.salaryMin && job.salaryMax && (
                      <span className="font-semibold text-[#163B32]">
                        {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)} /mo
                      </span>
                    )}
                    <span>• {job.experienceMin}+ yrs exp</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                  <span>Posted {timeAgo(job.createdAt)}</span>
                  <span className="font-semibold text-[#163B32] group-hover:text-[#65A88A] flex items-center gap-0.5">
                    View & Apply <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VERIFIED TEACHERS OPEN TO WORK SHOWCASE */}
      <section className="py-16 bg-[#F8FAF7] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#D97706]">Verified Educator Pool</span>
              <h2 className="text-3xl font-extrabold text-[#163B32] tracking-tight mt-1">
                Educators Open to Work
              </h2>
            </div>
            <Link
              href="/teachers"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D97706] hover:text-[#92400E]"
            >
              <span>Explore all teachers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachersData.map((teacher) => {
              const subjects = JSON.parse(teacher.subjects || "[]");
              return (
                <Link
                  key={teacher.id}
                  href={`/teachers/${teacher.id}`}
                  className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#D97706] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg text-[#D97706]">
                        {teacher.avatarUrl ? (
                          <img src={teacher.avatarUrl} alt={teacher.fullName} className="w-full h-full object-cover" />
                        ) : (
                          teacher.fullName[0]
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-base text-[#163B32] group-hover:text-[#D97706] transition-colors truncate">
                            {teacher.fullName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                            Open to Work
                          </span>
                        </div>
                        <p className="text-xs text-[#475569] mt-0.5 line-clamp-1">{teacher.highestQualification}</p>
                        <p className="text-xs text-[#65A88A] font-medium">{teacher.yearsOfExperience} Years Experience</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                      {teacher.headline || teacher.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {subjects.slice(0, 3).map((sub: string) => (
                        <span key={sub} className="px-2 py-0.5 rounded-md bg-[#F7F5EF] text-[11px] font-medium text-[#163B32]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                      {teacher.city}, {teacher.state}
                    </span>
                    <span className="font-semibold text-[#163B32] group-hover:text-[#D97706] flex items-center gap-1">
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FEATURED INSTITUTIONS */}
      <section className="py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#65A88A]">Accredited Partners</span>
              <h2 className="text-3xl font-extrabold text-[#163B32] tracking-tight mt-1">
                Featured Educational Institutions
              </h2>
            </div>
            <Link
              href="/institutes"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#163B32] hover:text-[#65A88A]"
            >
              <span>View all institutes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutesData.map((inst) => (
              <Link
                key={inst.id}
                href={`/institutes/${inst.slug}`}
                className="p-6 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] hover:border-[#65A88A] hover:bg-white transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] p-1 flex items-center justify-center">
                    {inst.logoUrl ? (
                      <img src={inst.logoUrl} alt={inst.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Building2 className="w-8 h-8 text-[#163B32]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-[#163B32] group-hover:text-[#65A88A] transition-colors line-clamp-1">
                        {inst.name}
                      </h3>
                      <span title="Verified">
                        <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#65A88A]">{inst.type}</span>
                  </div>

                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {inst.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                    {inst.city}, {inst.state}
                  </span>
                  <span className="font-semibold text-[#163B32] group-hover:text-[#65A88A] flex items-center gap-0.5">
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RECENTLY LISTED BUSES - WITH NEGOTIABLE BADGE */}
      <section className="py-16 bg-[#F8FAF7] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-[#65A88A]">Institutional Fleet</span>
              <h2 className="text-3xl font-extrabold text-[#163B32] tracking-tight mt-1">
                School Buses for Sale
              </h2>
            </div>
            <Link
              href="/buses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#163B32] hover:text-[#65A88A]"
            >
              <span>Explore all school buses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {busesData.map((bus) => (
              <Link
                key={bus.id}
                href={`/buses/${bus.id}`}
                className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={bus.primaryImageUrl || "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"}
                      alt={bus.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#163B32]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                      {bus.manufacturingYear} Model
                    </div>
                    {/* Price and Negotiable indicator pill */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                      <div className="bg-white/95 backdrop-blur-sm text-[#163B32] px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                        {formatCurrency(bus.askingPrice)}
                      </div>
                      {bus.isNegotiable === 1 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7]/95 text-[#92400E] border border-[#FDE68A] shadow-2xs backdrop-blur-sm">
                          Price Negotiable
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-[#163B32] group-hover:text-[#65A88A] transition-colors line-clamp-1">
                      {bus.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 py-1 text-center bg-[#F7F5EF] p-2.5 rounded-xl text-xs text-[#163B32]">
                      <div>
                        <span className="text-[10px] text-[#475569] block">Capacity</span>
                        <span className="font-bold">{bus.seatingCapacity} Seats</span>
                      </div>
                      <div className="border-x border-[#E2E8F0]">
                        <span className="text-[10px] text-[#475569] block">Fuel</span>
                        <span className="font-bold">{bus.fuelType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#475569] block">Condition</span>
                        <span className="font-bold">{bus.vehicleCondition}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#475569] flex items-center gap-1 pt-1">
                      <Building2 className="w-3.5 h-3.5 text-[#65A88A]" />
                      Sold by <span className="font-medium text-[#163B32]">{bus.instituteName}</span>
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAF7] flex items-center justify-between text-xs text-[#475569]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                    {bus.locationCity}, {bus.locationState}
                  </span>
                  <span className="font-semibold text-[#163B32] group-hover:text-[#65A88A] flex items-center gap-0.5">
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TRUST & BENEFITS STRIP */}
      <section className="py-16 bg-[#163B32] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="font-bold text-lg">Verified Institutions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schools and colleges undergo platform administrator verification to guarantee genuine employment opportunities.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Users className="w-6 h-6 text-[#65A88A]" />
              </div>
              <h3 className="font-bold text-lg">Strict Privacy Controls</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Teachers control whether their phone numbers, resumes, or profiles are publicly visible or restricted only to hiring institutes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Bus className="w-6 h-6 text-[#65A88A]" />
              </div>
              <h3 className="font-bold text-lg">Negotiable Fleet Deals</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Institutions communicate directly for bus inspections, ownership transfer, and negotiable pricing without middleman commission.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Award className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="font-bold text-lg">Fast Hiring Workflow</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Streamlined application tracking from submission to shortlisting, demo interviews, and direct offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#F7F5EF] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-xs font-semibold text-[#92400E] border border-[#FDE68A]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Join India&apos;s Leading School Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163B32] tracking-tight">
            Ready to Accelerate Your Institution or Teaching Career?
          </h2>
          <p className="text-base text-[#475569] max-w-2xl mx-auto">
            Join hundreds of educators and recognized educational institutions across India on School Market today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#163B32] hover:bg-[#122f28] shadow-md transition"
            >
              Create Free Teacher Profile
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-[#163B32] bg-white hover:bg-[#F7F5EF] border border-[#E2E8F0] shadow-sm transition"
            >
              Register Your Institution
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
