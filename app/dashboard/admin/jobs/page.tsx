import { requirePlatformAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { Briefcase, Building2, ExternalLink } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const user = await requirePlatformAdmin();

  const jobs = await db
    .select({
      id: schema.jobVacancies.id,
      title: schema.jobVacancies.title,
      employmentType: schema.jobVacancies.employmentType,
      openingsCount: schema.jobVacancies.openingsCount,
      status: schema.jobVacancies.status,
      viewsCount: schema.jobVacancies.viewsCount,
      createdAt: schema.jobVacancies.createdAt,
      instituteName: schema.institutes.name,
      locationCity: schema.jobVacancies.locationCity,
      locationState: schema.jobVacancies.locationState,
    })
    .from(schema.jobVacancies)
    .innerJoin(schema.institutes, eq(schema.jobVacancies.instituteId, schema.institutes.id))
    .orderBy(desc(schema.jobVacancies.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Job Vacancies Moderation
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Review published faculty openings across all registered educational institutions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
        {jobs.map((job) => (
          <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {job.status}
                </span>
                <span className="text-xs text-[#475569] font-medium">{job.instituteName}</span>
                <span>•</span>
                <span className="text-xs text-[#475569]">{job.locationCity}, {job.locationState}</span>
              </div>
              <h3 className="font-bold text-base text-[#163B32]">{job.title}</h3>
              <p className="text-xs text-slate-400">
                {job.employmentType} • {job.openingsCount} Openings • Published {timeAgo(job.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/jobs/${job.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#163B32] bg-[#F7F5EF] hover:bg-[#efebe0] border border-[#E2E8F0]"
              >
                <span>View Public</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
