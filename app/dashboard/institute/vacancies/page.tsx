import { requireInstituteAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc, count } from "drizzle-orm";
import {
  Briefcase,
  PlusCircle,
  Eye,
  FileCheck,
  MapPin,
  IndianRupee,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ManageVacanciesPage() {
  const user = await requireInstituteAdmin();

  const vacancies = await db
    .select({
      id: schema.jobVacancies.id,
      title: schema.jobVacancies.title,
      employmentType: schema.jobVacancies.employmentType,
      openingsCount: schema.jobVacancies.openingsCount,
      salaryMin: schema.jobVacancies.salaryMin,
      salaryMax: schema.jobVacancies.salaryMax,
      status: schema.jobVacancies.status,
      viewsCount: schema.jobVacancies.viewsCount,
      createdAt: schema.jobVacancies.createdAt,
    })
    .from(schema.jobVacancies)
    .where(eq(schema.jobVacancies.instituteId, user.instituteId!))
    .orderBy(desc(schema.jobVacancies.createdAt));

  // Fetch applications count for each vacancy
  const allApplications = await db
    .select({
      id: schema.jobApplications.id,
      vacancyId: schema.jobApplications.vacancyId,
    })
    .from(schema.jobApplications);

  const appCounts: Record<string, number> = {};
  for (const app of allApplications) {
    appCounts[app.vacancyId] = (appCounts[app.vacancyId] || 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
            Manage Vacancies
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Review your active job openings, applicant flow, and vacancy statuses.
          </p>
        </div>

        <Link
          href="/dashboard/institute/vacancies/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#65A88A]" />
          <span>Post New Vacancy</span>
        </Link>
      </div>

      {vacancies.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-[#163B32]">No vacancies published yet</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Create your first vacancy to start receiving verified teacher applications.
          </p>
          <Link
            href="/dashboard/institute/vacancies/new"
            className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32]"
          >
            Post a Vacancy
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
          {vacancies.map((v) => {
            const apps = appCounts[v.id] || 0;

            return (
              <div key={v.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        v.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {v.status}
                    </span>
                    <span className="text-xs text-[#475569] font-medium">{v.employmentType}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-[#475569]">{v.openingsCount} Openings</span>
                  </div>

                  <h3 className="font-bold text-base text-[#163B32]">
                    <Link href={`/jobs/${v.id}`} className="hover:text-[#65A88A] transition">
                      {v.title}
                    </Link>
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-[#475569]">
                    {v.salaryMin && v.salaryMax && (
                      <span className="font-medium text-[#163B32]">
                        ₹{v.salaryMin.toLocaleString("en-IN")} - ₹{v.salaryMax.toLocaleString("en-IN")}/mo
                      </span>
                    )}
                    <span>Published {timeAgo(v.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <Link
                    href="/dashboard/institute/applications"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F5EF] text-[#163B32] hover:bg-[#efebe0] border border-[#E2E8F0] text-xs font-semibold transition"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#65A88A]" />
                    <span>{apps} Applications</span>
                  </Link>

                  <Link
                    href={`/jobs/${v.id}`}
                    target="_blank"
                    className="p-2 rounded-xl text-[#475569] hover:text-[#163B32] hover:bg-[#F8FAF7] transition border border-[#E2E8F0]"
                    title="View Public Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
