import { requireInstituteAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import {
  Building2,
  Briefcase,
  FileCheck,
  Bus,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Users,
  MessageSquare,
  Clock,
} from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InstituteDashboardOverview() {
  const user = await requireInstituteAdmin();

  const instRows = await db
    .select()
    .from(schema.institutes)
    .where(eq(schema.institutes.id, user.instituteId!));

  const institute = instRows[0];

  // Fetch vacancies
  const vacancies = await db
    .select()
    .from(schema.jobVacancies)
    .where(eq(schema.jobVacancies.instituteId, institute.id))
    .orderBy(desc(schema.jobVacancies.createdAt));

  // Fetch applications for all vacancies of this institute
  const applications = await db
    .select({
      id: schema.jobApplications.id,
      status: schema.jobApplications.status,
      createdAt: schema.jobApplications.createdAt,
      teacherName: schema.teacherProfiles.fullName,
      teacherQualification: schema.teacherProfiles.highestQualification,
      teacherExperience: schema.teacherProfiles.yearsOfExperience,
      teacherId: schema.teacherProfiles.id,
      vacancyTitle: schema.jobVacancies.title,
    })
    .from(schema.jobApplications)
    .innerJoin(schema.jobVacancies, eq(schema.jobApplications.vacancyId, schema.jobVacancies.id))
    .innerJoin(schema.teacherProfiles, eq(schema.jobApplications.teacherId, schema.teacherProfiles.id))
    .where(eq(schema.jobVacancies.instituteId, institute.id))
    .orderBy(desc(schema.jobApplications.createdAt));

  // Fetch buses
  const buses = await db
    .select()
    .from(schema.busListings)
    .where(eq(schema.busListings.instituteId, institute.id))
    .orderBy(desc(schema.busListings.createdAt));

  // Fetch inquiries
  const inquiries = await db
    .select({
      id: schema.busInquiries.id,
      senderName: schema.busInquiries.senderName,
      senderOrganization: schema.busInquiries.senderOrganization,
      senderPhone: schema.busInquiries.senderPhone,
      message: schema.busInquiries.message,
      createdAt: schema.busInquiries.createdAt,
      busTitle: schema.busListings.title,
    })
    .from(schema.busInquiries)
    .innerJoin(schema.busListings, eq(schema.busInquiries.busId, schema.busListings.id))
    .where(eq(schema.busListings.instituteId, institute.id))
    .orderBy(desc(schema.busInquiries.createdAt));

  const pendingReviewCount = applications.filter((a) => a.status === "submitted" || a.status === "under_review").length;

  return (
    <div className="space-y-8">
      {/* Header with Verification Status */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
              {institute.name}
            </h1>
            {institute.verificationStatus === "approved" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Verified Institute</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending Verification</span>
              </span>
            )}
          </div>
          <p className="text-sm text-[#475569]">
            {institute.city}, {institute.state} • {institute.type} Administration Portal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/institute/vacancies/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4 text-[#65A88A]" />
            <span>Post Vacancy</span>
          </Link>
          <Link
            href="/dashboard/institute/buses/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-[#163B32] bg-[#F7F5EF] border border-[#E2E8F0] hover:bg-[#efebe0] transition"
          >
            <Bus className="w-4 h-4 text-[#65A88A]" />
            <span>List School Bus</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{vacancies.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">Published Vacancies</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{applications.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">Applications Received</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <Bus className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{buses.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">Buses on Marketplace</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{inquiries.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">Bus Inquiries Received</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Applications Board */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#163B32]">Recent Teacher Applications</h2>
            <Link
              href="/dashboard/institute/applications"
              className="text-xs font-semibold text-[#163B32] hover:text-[#65A88A] flex items-center gap-1"
            >
              <span>Manage Candidates Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
              <FileCheck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-[#163B32]">No candidate applications yet</p>
              <p className="text-xs text-[#475569]">
                When educators apply for your vacancies, they will appear here with one-click status transitions.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <Link
                      href={`/teachers/${app.teacherId}`}
                      className="font-bold text-sm text-[#163B32] hover:text-[#65A88A] truncate block transition"
                    >
                      {app.teacherName}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#475569]">
                      <span className="font-medium text-[#163B32]">{app.vacancyTitle}</span>
                      <span>•</span>
                      <span>{app.teacherQualification}</span>
                      <span>•</span>
                      <span>{app.teacherExperience} yrs exp</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                        app.status === "shortlisted"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "interview"
                          ? "bg-purple-100 text-purple-800"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Bus Inquiries Stream */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-[#163B32]">Buyer Inquiries for Buses</h2>

          {inquiries.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
              <Bus className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-[#475569]">No buyer inquiries on your bus listings yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
              {inquiries.slice(0, 3).map((inq) => (
                <div key={inq.id} className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#163B32]">{inq.senderName}</strong>
                    <span className="text-[10px] text-slate-400">{timeAgo(inq.createdAt)}</span>
                  </div>
                  <p className="text-[#475569] font-medium">{inq.senderOrganization}</p>
                  <p className="text-[11px] text-[#475569] italic bg-white p-2 rounded-lg border border-[#E2E8F0]">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#163B32] font-semibold">
                    <span>Re: {inq.busTitle}</span>
                    <span>Ph: {inq.senderPhone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
