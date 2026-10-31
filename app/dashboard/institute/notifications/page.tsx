import { requireInstituteAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc, and } from "drizzle-orm";
import { Bell, ArrowRight } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InstituteNotificationsPage() {
  const user = await requireInstituteAdmin();

  const notifications = await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, user.id))
    .orderBy(desc(schema.notifications.createdAt));

  // Mark all unread notifications for this user as read upon visiting
  const hasUnread = notifications.some((n) => n.isRead === 0);
  if (hasUnread) {
    await db
      .update(schema.notifications)
      .set({ isRead: 1 })
      .where(
        and(
          eq(schema.notifications.userId, user.id),
          eq(schema.notifications.isRead, 0)
        )
      );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          Notifications & Activity Alerts
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Candidate applications received, bus buyer inquiries, and verification updates.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto mb-2">
            <Bell className="w-6 h-6 text-[#D97706]" />
          </div>
          <h3 className="font-bold text-base text-[#163B32]">No notifications yet</h3>
          <p className="text-xs text-[#475569]">
            Updates about applicants and bus inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
          {notifications.map((n) => {
            const wasUnread = n.isRead === 0;
            return (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition-colors ${
                  wasUnread ? "bg-[#FFFBEB]/60" : "bg-white"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#163B32]">{n.title}</h3>
                      {wasUnread && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">{n.message}</p>
                  {n.link && (
                    <Link
                      href={n.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706] hover:text-[#92400E] pt-1"
                    >
                      <span>View action</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
