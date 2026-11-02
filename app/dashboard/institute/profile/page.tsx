import { requireInstituteAdmin } from "@/lib/auth/rbac";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import InstituteProfileForm from "@/components/institutes/InstituteProfileForm";

export const dynamic = "force-dynamic";

export default async function InstituteProfilePage() {
  const user = await requireInstituteAdmin();

  let inst: any = null;

  if (user.instituteId) {
    try {
      const instRows = await db
        .select()
        .from(schema.institutes)
        .where(eq(schema.institutes.id, user.instituteId));
      inst = instRows[0];
    } catch (err) {
      console.warn("Could not fetch institute by user.instituteId:", err);
    }
  }

  // Fallback: check membership table directly
  if (!inst) {
    try {
      const memberRows = await db
        .select()
        .from(schema.instituteMembers)
        .where(eq(schema.instituteMembers.userId, user.id));
      if (memberRows[0]?.instituteId) {
        const instRows = await db
          .select()
          .from(schema.institutes)
          .where(eq(schema.institutes.id, memberRows[0].instituteId));
        inst = instRows[0];
      }
    } catch (err) {
      console.warn("Could not fetch institute via membership:", err);
    }
  }

  const initialData = {
    name: inst?.name || `${user.name}'s Educational Institution`,
    type: (inst?.type || "School") as "School" | "College" | "Junior College" | "Coaching Centre" | "Other",
    description: inst?.description || null,
    establishedYear: inst?.establishedYear || null,
    address: inst?.address || null,
    city: inst?.city || "Bengaluru",
    state: inst?.state || "Karnataka",
    district: inst?.district || null,
    mandal: inst?.mandal || null,
    postalCode: inst?.postalCode || null,
    contactPhone: inst?.contactPhone || "+91 00000 00000",
    officialEmail: inst?.officialEmail || user.email,
    websiteUrl: inst?.websiteUrl || null,
    logoUrl: inst?.logoUrl || null,
    coverUrl: inst?.coverUrl || null,
    verificationStatus: inst?.verificationStatus || "pending",
    verificationNotes: inst?.verificationNotes || null,
    educationLevels: (() => {
      try {
        return typeof inst?.educationLevels === "string" ? JSON.parse(inst.educationLevels) : (inst?.educationLevels || []);
      } catch {
        return [];
      }
    })(),
    specializations: (() => {
      try {
        return typeof inst?.specializations === "string" ? JSON.parse(inst.specializations) : (inst?.specializations || []);
      } catch {
        return [];
      }
    })(),
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
