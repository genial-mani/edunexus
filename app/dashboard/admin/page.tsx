import { requirePlatformAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import {
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  Bus,
  FileCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  const user = await requirePlatformAdmin();

  // Metric counts
  const allUsers = await db.select().from(schema.users);
  const teachers = await db.select().from(schema.teacherProfiles);
  const institutes = await db.select().from(schema.institutes);
  const vacancies = await db.select().from(schema.jobVacancies);
  const buses = await db.select().from(schema.busListings);
  const applications = await db.select().from(schema.jobApplications);

  const pendingInstitutes = institutes.filter((i) => i.verificationStatus === "pending");
  const approvedInstitutes = institutes.filter((i) => i.verificationStatus === "approved");

  // Recent audit logs
  const logs = await db
    .select()
    .from(schema.auditLogs)
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
              Platform Administration Console
            </h1>
          </div>
          <p className="text-sm text-[#475569]">
            System governance, institute verification review, and marketplace moderation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admin/institutes"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition"
          >
            <ShieldCheck className="w-4 h-4 text-[#65A88A]" />
            <span>Review Pending ({pendingInstitutes.length})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{institutes.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">
            Institutes ({approvedInstitutes.length} Approved, {pendingInstitutes.length} Pending)
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{teachers.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">Registered Educators</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{vacancies.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">
            Job Vacancies ({applications.length} Applications)
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <Bus className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{buses.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">School Buses Listed</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Institutions Verification Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#163B32] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>Institutes Awaiting Accreditation Approval ({pendingInstitutes.length})</span>
            </h2>
            <Link
              href="/dashboard/admin/institutes"
              className="text-xs font-semibold text-[#163B32] hover:text-[#65A88A] flex items-center gap-1"
            >
              <span>View full directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingInstitutes.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-[#163B32]">Verification Queue Clear</p>
              <p className="text-xs text-[#475569]">All registered educational organizations have been reviewed.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
              {pendingInstitutes.map((inst) => (
                <div key={inst.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#163B32]">{inst.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs text-[#475569]">
                      {inst.type} • {inst.city}, {inst.state} • Official: {inst.officialEmail}
                    </p>
                    <p className="text-xs text-slate-400">Registered {timeAgo(inst.createdAt)}</p>
                  </div>

                  <Link
                    href="/dashboard/admin/institutes"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] shrink-0"
                  >
                    Review & Decide
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Links & Audit Logs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#163B32] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#65A88A]" />
              <span>Recent Administrative Logs</span>
            </h3>

            {logs.length === 0 ? (
              <p className="text-xs text-[#475569]">No audit logs recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[#163B32]">
                      <span className="truncate">{log.action}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{timeAgo(log.createdAt)}</span>
                    </div>
                    <p className="text-[#475569]">{log.details}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-[#E2E8F0]">
              <Link
                href="/dashboard/admin/audit-logs"
                className="text-xs font-semibold text-[#163B32] hover:text-[#65A88A] flex items-center justify-between"
              >
                <span>View Full Audit Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
