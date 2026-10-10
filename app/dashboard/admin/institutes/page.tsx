import { requirePlatformAdmin } from "@/lib/auth/rbac";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import InstituteModerationRow from "@/components/admin/InstituteModerationRow";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInstitutesPage() {
  const user = await requirePlatformAdmin();

  const institutes = await db
    .select()
    .from(schema.institutes)
    .orderBy(desc(schema.institutes.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Institute Verification & Accreditation Moderation
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Review, approve, suspend, or reject educational organizations seeking to publish on EduNexus.
        </p>
      </div>

      <div className="space-y-4">
        {institutes.map((inst) => (
          <InstituteModerationRow key={inst.id} institute={inst} />
        ))}
      </div>
    </div>
  );
}
