import { requireInstituteAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { FileCheck, Users, Briefcase } from "lucide-react";
import ApplicationReviewCard from "@/components/institutes/ApplicationReviewCard";

export const dynamic = "force-dynamic";

export default async function InstituteApplicationsPage() {
  const user = await requireInstituteAdmin();

  const applications = await db
    .select({
      id: schema.jobApplications.id,
      status: schema.jobApplications.status,
      coverLetter: schema.jobApplications.coverLetter,
      resumeUrl: schema.jobApplications.resumeSnapshotUrl,
      employerNotes: schema.jobApplications.employerNotes,
      createdAt: schema.jobApplications.createdAt,
      vacancyId: schema.jobVacancies.id,
      vacancyTitle: schema.jobVacancies.title,
      teacherId: schema.teacherProfiles.id,
      teacherName: schema.teacherProfiles.fullName,
      teacherHeadline: schema.teacherProfiles.headline,
      teacherQualification: schema.teacherProfiles.highestQualification,
      teacherExperience: schema.teacherProfiles.yearsOfExperience,
      teacherCity: schema.teacherProfiles.city,
      teacherState: schema.teacherProfiles.state,
      teacherSubjectsRaw: schema.teacherProfiles.subjects,
    })
    .from(schema.jobApplications)
    .innerJoin(schema.jobVacancies, eq(schema.jobApplications.vacancyId, schema.jobVacancies.id))
    .innerJoin(schema.teacherProfiles, eq(schema.jobApplications.teacherId, schema.teacherProfiles.id))
    .where(eq(schema.jobVacancies.instituteId, user.instituteId!))
    .orderBy(desc(schema.jobApplications.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Candidate Applications Received
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Review educator credentials, shortlisting stages, resumes, and private hiring notes.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-[#163B32]">No candidate applications yet</h3>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            Applications submitted for your published vacancies will appear here.
          </p>
          <Link
            href="/dashboard/institute/vacancies/new"
            className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32]"
          >
            Post a Vacancy
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationReviewCard
              key={app.id}
              app={{
                ...app,
                teacherSubjects: JSON.parse(app.teacherSubjectsRaw || "[]"),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
