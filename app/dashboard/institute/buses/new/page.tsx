import { requireInstituteAdmin } from "@/lib/auth/rbac";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import BusListingForm from "@/components/institutes/BusListingForm";

export const dynamic = "force-dynamic";

export default async function NewBusPage() {
  const user = await requireInstituteAdmin();

  const instRows = await db
    .select()
    .from(schema.institutes)
    .where(eq(schema.institutes.id, user.instituteId!));

  const inst = instRows[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          List a School Bus for Sale
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Publish your institutional vehicle for discovery by other schools and colleges across India.
        </p>
      </div>

      <BusListingForm
        defaultCity={inst?.city || "Bengaluru"}
        defaultState={inst?.state || "Karnataka"}
      />
    </div>
  );
}
