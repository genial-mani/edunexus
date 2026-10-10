import { requireTeacher } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { Bookmark, Building2, MapPin, ArrowRight } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SavedJobsPage() {
  const user = await requireTeacher();

  const profileRows = await db
    .select()
    .from(schema.teacherProfiles)
    .where(eq(schema.teacherProfiles.userId, user.id));

  const profile = profileRows[0];

  const savedJobs = profile
    ? await db
        .select({
          savedId: schema.savedJobs.id,
          savedAt: schema.savedJobs.createdAt,
          vacancyId: schema.jobVacancies.id,
          title: schema.jobVacancies.title,
          employmentType: schema.jobVacancies.employmentType,
          locationCity: schema.jobVacancies.locationCity,
          locationState: schema.jobVacancies.locationState,
          instituteName: schema.institutes.name,
          instituteSlug: schema.institutes.slug,
        })
        .from(schema.savedJobs)
        .innerJoin(schema.jobVacancies, eq(schema.savedJobs.vacancyId, schema.jobVacancies.id))
        .innerJoin(schema.institutes, eq(schema.jobVacancies.instituteId, schema.institutes.id))
        .where(eq(schema.savedJobs.teacherId, profile.id))
        .orderBy(desc(schema.savedJobs.createdAt))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Saved Job Vacancies
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Positions you have bookmarked to review or apply for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-[#163B32]">No saved vacancies</h3>
          <p className="text-xs text-[#475569]">
            While browsing job vacancies, click the bookmark icon to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.savedId}
              className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-xs text-[#475569] font-medium">{job.instituteName}</span>
                <h3 className="font-bold text-base text-[#163B32] mt-0.5">
                  <Link href={`/jobs/${job.vacancyId}`} className="hover:text-[#65A88A]">
                    {job.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#475569] pt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                    {job.locationCity}, {job.locationState}
                  </span>
                  <span>•</span>
                  <span>{job.employmentType}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Saved {timeAgo(job.savedAt)}</span>
                <Link
                  href={`/jobs/${job.vacancyId}`}
                  className="px-3 py-1.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] flex items-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3 text-[#65A88A]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
