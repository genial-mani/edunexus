import { requirePlatformAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { Users, ExternalLink } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTeachersPage() {
  const user = await requirePlatformAdmin();

  const teachers = await db
    .select()
    .from(schema.teacherProfiles)
    .orderBy(desc(schema.teacherProfiles.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Registered Educators Directory
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Complete master directory of educators, qualifications, and discovery toggles.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
        {teachers.map((t) => (
          <div key={t.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#163B32]">{t.fullName}</h3>
                {t.isOpenToWork === 1 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Open to Work
                  </span>
                )}
                {t.isPublic === 1 ? (
                  <span className="text-[10px] text-slate-400">Public Profile</span>
                ) : (
                  <span className="text-[10px] text-amber-600 font-semibold">Private</span>
                )}
              </div>
              <p className="text-xs text-[#475569]">
                {t.highestQualification} • {t.yearsOfExperience} Yrs Exp • {t.city}, {t.state}
              </p>
              <p className="text-xs text-slate-400">
                Email: {t.email} • Phone: {t.phone || "Not set"} (Visible: {t.isPhoneVisible === 1 ? "Yes" : "No"})
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/teachers/${t.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#163B32] bg-[#F7F5EF] hover:bg-[#efebe0] border border-[#E2E8F0]"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
