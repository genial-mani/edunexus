import { requireTeacher } from "@/lib/auth/rbac";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import TeacherProfileForm from "@/components/teachers/TeacherProfileForm";

export const dynamic = "force-dynamic";

export default async function TeacherProfilePage() {
  const user = await requireTeacher();

  const profileRows = await db
    .select()
    .from(schema.teacherProfiles)
    .where(eq(schema.teacherProfiles.userId, user.id));

  const profile = profileRows[0];

  const initialProfile = {
    fullName: profile?.fullName || user.name,
    headline: profile?.headline || null,
    bio: profile?.bio || null,
    phone: profile?.phone || null,
    isPhoneVisible: profile?.isPhoneVisible ?? 0,
    city: profile?.city || null,
    state: profile?.state || null,
    highestQualification: profile?.highestQualification || null,
    subjects: profile ? JSON.parse(profile.subjects || "[]") : [],
    gradeLevels: profile ? JSON.parse(profile.gradeLevels || "[]") : [],
    yearsOfExperience: profile?.yearsOfExperience || 0,
    employmentTypePref: profile?.employmentTypePref || "Full-time",
    expectedSalaryMin: profile?.expectedSalaryMin || null,
    expectedSalaryMax: profile?.expectedSalaryMax || null,
    availableFrom: profile?.availableFrom || null,
    isOpenToWork: profile?.isOpenToWork ?? 1,
    isPublic: profile?.isPublic ?? 1,
    resumeUrl: profile?.resumeUrl || null,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Teacher Profile & Recruitment Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Keep your educational credentials, subjects, expected salary, and privacy options up to date.
        </p>
      </div>

      <TeacherProfileForm initialProfile={initialProfile} />
    </div>
  );
}
