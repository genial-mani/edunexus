import { requireTeacher } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { FileCheck, Building2, MapPin, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherApplicationsPage() {
  const user = await requireTeacher();

  const profileRows = await db
    .select()
    .from(schema.teacherProfiles)
    .where(eq(schema.teacherProfiles.userId, user.id));

  const profile = profileRows[0];

  const applications = profile
    ? await db
        .select({
          id: schema.jobApplications.id,
          status: schema.jobApplications.status,
          coverLetter: schema.jobApplications.coverLetter,
          resumeUrl: schema.jobApplications.resumeSnapshotUrl,
          createdAt: schema.jobApplications.createdAt,
          updatedAt: schema.jobApplications.updatedAt,
          vacancyId: schema.jobVacancies.id,
          vacancyTitle: schema.jobVacancies.title,
          employmentType: schema.jobVacancies.employmentType,
          instituteName: schema.institutes.name,
          instituteCity: schema.institutes.city,
          instituteState: schema.institutes.state,
          instituteSlug: schema.institutes.slug,
        })
        .from(schema.jobApplications)
        .innerJoin(schema.jobVacancies, eq(schema.jobApplications.vacancyId, schema.jobVacancies.id))
        .innerJoin(schema.institutes, eq(schema.jobVacancies.instituteId, schema.institutes.id))
        .where(eq(schema.jobApplications.teacherId, profile.id))
        .orderBy(desc(schema.jobApplications.createdAt))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
            My Job Applications
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Track real-time candidate review status across educational institutions.
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] transition self-start sm:self-auto"
        >
          <span>Explore More Vacancies</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#65A88A]" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-[#163B32]">No applications submitted yet</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Browse current school and college vacancies and apply with your verified credentials.
          </p>
          <Link
            href="/jobs"
            className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32]"
          >
            Browse Openings
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
          {applications.map((app) => (
            <div key={app.id} className="p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/institutes/${app.instituteSlug}`}
                      className="text-xs font-semibold text-[#475569] hover:text-[#163B32] flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#65A88A]" />
                      <span>{app.instituteName}</span>
                    </Link>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-[#475569]">{app.instituteCity}, {app.instituteState}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#163B32]">
                    <Link href={`/jobs/${app.vacancyId}`} className="hover:text-[#65A88A] transition">
                      {app.vacancyTitle}
                    </Link>
                  </h3>
                </div>

                <div className="flex items-center gap-3 self-start">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
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

              {app.coverLetter && (
                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-xs text-[#475569]">
                  <strong className="text-[#163B32] block mb-0.5">Your Application Note:</strong>
                  <p className="line-clamp-2">{app.coverLetter}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#E2E8F0]">
                <span>Submitted on {formatDate(app.createdAt)} ({timeAgo(app.createdAt)})</span>
                <Link
                  href={`/jobs/${app.vacancyId}`}
                  className="font-semibold text-[#163B32] hover:text-[#65A88A] flex items-center gap-1"
                >
                  <span>View Vacancy</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
