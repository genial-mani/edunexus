import { requireTeacher } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import {
  User,
  Briefcase,
  FileCheck,
  Bookmark,
  Bell,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building2,
  AlertCircle,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardOverview() {
  const user = await requireTeacher();

  // Fetch teacher profile
  const profileRows = await db
    .select()
    .from(schema.teacherProfiles)
    .where(eq(schema.teacherProfiles.userId, user.id));

  const profile = profileRows[0];

  // Fetch applications
  const applications = profile
    ? await db
        .select({
          id: schema.jobApplications.id,
          status: schema.jobApplications.status,
          createdAt: schema.jobApplications.createdAt,
          vacancyId: schema.jobVacancies.id,
          vacancyTitle: schema.jobVacancies.title,
          instituteName: schema.institutes.name,
          locationCity: schema.jobVacancies.locationCity,
        })
        .from(schema.jobApplications)
        .innerJoin(schema.jobVacancies, eq(schema.jobApplications.vacancyId, schema.jobVacancies.id))
        .innerJoin(schema.institutes, eq(schema.jobVacancies.instituteId, schema.institutes.id))
        .where(eq(schema.jobApplications.teacherId, profile.id))
        .orderBy(desc(schema.jobApplications.createdAt))
    : [];

  // Fetch saved jobs count
  const savedJobs = profile
    ? await db
        .select()
        .from(schema.savedJobs)
        .where(eq(schema.savedJobs.teacherId, profile.id))
    : [];

  // Fetch unread notifications
  const notifications = await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, user.id))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(5);

  const shortlistedCount = applications.filter((a) => a.status === "shortlisted" || a.status === "interview").length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
              Welcome back, {user.name}
            </h1>
            {profile?.isOpenToWork === 1 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Open to Work
              </span>
            )}
          </div>
          <p className="text-sm text-[#475569]">
            Manage your teaching career, applications, and visibility to accredited institutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/teacher/profile"
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition"
          >
            Edit Profile & Visibility
          </Link>
          <Link
            href="/jobs"
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-[#163B32] bg-[#F7F5EF] border border-[#E2E8F0] hover:bg-[#efebe0] transition"
          >
            Browse Vacancies
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{applications.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">Applications Submitted</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{shortlistedCount}</div>
          <span className="text-xs font-semibold text-[#475569] block">Shortlisted / Interviews</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">{savedJobs.length}</div>
          <span className="text-xs font-semibold text-[#475569] block">Saved Vacancies</span>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#65A88A]" />
          </div>
          <div className="text-2xl font-black text-[#163B32]">
            {profile?.yearsOfExperience || 0} Yrs
          </div>
          <span className="text-xs font-semibold text-[#475569] block">Teaching Experience</span>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Applications History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#163B32]">Recent Job Applications</h2>
            <Link
              href="/dashboard/teacher/applications"
              className="text-xs font-semibold text-[#163B32] hover:text-[#65A88A] flex items-center gap-1"
            >
              <span>View all ({applications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-[#163B32]">No job applications yet</p>
              <p className="text-xs text-[#475569]">
                Browse accredited school openings and apply with your verified profile.
              </p>
              <Link
                href="/jobs"
                className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32]"
              >
                Find Teaching Jobs
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
              {applications.slice(0, 4).map((app) => (
                <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <Link
                      href={`/jobs/${app.vacancyId}`}
                      className="font-bold text-sm text-[#163B32] hover:text-[#65A88A] truncate block transition"
                    >
                      {app.vacancyTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-[#475569]">
                      <span className="font-medium text-[#163B32]">{app.instituteName}</span>
                      <span>•</span>
                      <span>{app.locationCity}</span>
                      <span>•</span>
                      <span>Applied {timeAgo(app.createdAt)}</span>
                    </div>
                  </div>

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
              ))}
            </div>
          )}
        </div>

        {/* Right Notifications & Profile Checklist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#163B32] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#65A88A]" />
              <span>Recent Updates</span>
            </h3>

            {notifications.length === 0 ? (
              <p className="text-xs text-[#475569]">No new notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs space-y-1">
                    <div className="font-semibold text-[#163B32] flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-[#475569]">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
