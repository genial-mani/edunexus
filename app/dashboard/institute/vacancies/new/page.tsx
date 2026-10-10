import { requireInstituteAdmin } from "@/lib/auth/rbac";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import VacancyForm from "@/components/institutes/VacancyForm";

export const dynamic = "force-dynamic";

export default async function NewVacancyPage() {
  const user = await requireInstituteAdmin();

  const instRows = await db
    .select()
    .from(schema.institutes)
    .where(eq(schema.institutes.id, user.instituteId!));

  const institute = instRows[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Publish a New Teaching Vacancy
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Specify candidate requirements, subject specializations, salary range, and benefits.
        </p>
      </div>

      <VacancyForm
        defaultCity={institute?.city || "Bengaluru"}
        defaultState={institute?.state || "Karnataka"}
      />
    </div>
  );
}
