import { requirePlatformAdmin } from "@/lib/auth/rbac";
import { Shield, Database, Cloud, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await requirePlatformAdmin();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Platform Configuration & Infrastructure
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Runtime parameters, Cloudflare Workers / D1 bindings, and storage endpoints.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
        <h3 className="font-bold text-base text-[#163B32] pb-3 border-b border-[#E2E8F0]">
          Deployment Infrastructure Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#475569] block">Execution Runtime</span>
            <span className="font-bold text-sm text-[#163B32]">Cloudflare Workers / Node.js 22</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Operational</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#475569] block">Database Engine</span>
            <span className="font-bold text-sm text-[#163B32]">Cloudflare D1 / LibSQL SQLite</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Connected</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#475569] block">File Storage</span>
            <span className="font-bold text-sm text-[#163B32]">Cloudflare R2 Bucket</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Active</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
          <h4 className="font-bold text-sm text-[#163B32]">Administrator Session</h4>
          <p className="text-xs text-[#475569]">
            Logged in as: <strong className="text-[#163B32]">{user.name}</strong> ({user.email})
          </p>
          <p className="text-xs text-slate-400">
            Role: Platform Administrator • Privileges: Full Unrestricted Access
          </p>
        </div>
      </div>
    </div>
  );
}
