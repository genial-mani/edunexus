import { requireInstituteAdmin } from "@/lib/auth/rbac";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import InstituteProfileForm from "@/components/institutes/InstituteProfileForm";

export const dynamic = "force-dynamic";

export default async function InstituteProfilePage() {
  const user = await requireInstituteAdmin();

  const instRows = await db
    .select()
    .from(schema.institutes)
    .where(eq(schema.institutes.id, user.instituteId!));

  const inst = instRows[0];

  const initialData = {
    name: inst.name,
    type: inst.type,
    description: inst.description || null,
    establishedYear: inst.establishedYear || null,
    address: inst.address || null,
    city: inst.city,
    state: inst.state,
    postalCode: inst.postalCode || null,
    contactPhone: inst.contactPhone,
    officialEmail: inst.officialEmail,
    websiteUrl: inst.websiteUrl || null,
    logoUrl: inst.logoUrl || null,
    coverUrl: inst.coverUrl || null,
    verificationStatus: inst.verificationStatus,
    verificationNotes: inst.verificationNotes || null,
    educationLevels: JSON.parse(inst.educationLevels || "[]"),
    specializations: JSON.parse(inst.specializations || "[]"),
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Institute Profile & Verification
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Manage your official branding, educational levels, campus location, and accreditation details.
        </p>
      </div>

      <InstituteProfileForm initialData={initialData} />
    </div>
  );
}
