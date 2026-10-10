import { requireTeacher } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { Bell, CheckCircle2, ArrowRight } from "lucide-react";
import { timeAgo, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherNotificationsPage() {
  const user = await requireTeacher();

  const notifications = await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, user.id))
    .orderBy(desc(schema.notifications.createdAt));

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Notifications & System Alerts
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Direct status updates on your applications, recruiter inquiries, and platform security.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-[#163B32]">No notifications yet</h3>
          <p className="text-xs text-[#475569]">
            When institutions review your profile or update your application status, alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
          {notifications.map((n) => (
            <div key={n.id} className="p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#163B32]">{n.title}</h3>
                  <span className="text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link
                    href={n.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#163B32] hover:text-[#65A88A] pt-1"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
