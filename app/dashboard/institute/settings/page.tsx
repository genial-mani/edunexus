import { requireInstituteAdmin } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export default async function InstituteSettingsPage() {
  const user = await requireInstituteAdmin();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Institute Administrator Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Manage administrator credentials and account security.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
        <h3 className="font-bold text-base text-[#163B32] pb-3 border-b border-[#E2E8F0]">
          Administrator Account
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#475569] block mb-1">Admin Email</label>
            <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-[#163B32] font-medium">
              {user.email}
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#475569] block mb-1">Representative Name</label>
            <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0] text-[#163B32] font-medium">
              {user.name}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
            <h4 className="font-bold text-sm text-[#163B32]">Change Password</h4>
            <div>
              <label className="font-semibold text-[#475569] block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#475569] block mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
              />
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] transition"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
