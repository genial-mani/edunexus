import { requirePlatformAdmin } from "@/lib/auth/rbac";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { ShieldCheck, Clock } from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const user = await requirePlatformAdmin();

  const logs = await db
    .select()
    .from(schema.auditLogs)
    .orderBy(desc(schema.auditLogs.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          System Audit Trail & Governance Logs
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Immutable audit records of administrator decisions, status changes, and moderation events.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-[#163B32]">No audit records yet</h3>
          <p className="text-xs text-[#475569]">
            Actions such as institute approvals and role modifications will be tracked here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
          {logs.map((log) => (
            <div key={log.id} className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#163B32] text-white">
                    {log.action}
                  </span>
                  <span className="text-xs text-[#475569]">
                    Entity: <strong className="text-[#163B32]">{log.entityType}</strong> ({log.entityId || "N/A"})
                  </span>
                </div>
                <p className="text-xs text-[#475569]">{log.details}</p>
                <span className="text-[10px] text-slate-400 block">
                  IP: {log.ipAddress || "Internal"} • Initiated by {log.userId || "System"}
                </span>
              </div>

              <span className="text-xs text-slate-400 shrink-0">
                {formatDate(log.createdAt)} ({timeAgo(log.createdAt)})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
