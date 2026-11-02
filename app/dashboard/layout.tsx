import { requireAuth } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import {
  GraduationCap,
  LayoutDashboard,
  User,
  Briefcase,
  FileCheck,
  Bookmark,
  Bell,
  Settings,
  Building2,
  PlusCircle,
  Bus,
  ShieldCheck,
  LogOut,
  Users,
  Search,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  // Query unread notifications count for any authenticated user (safely guarded)
  let unreadNotificationCount = 0;
  try {
    const unreadNotifications = await db
      .select({ id: schema.notifications.id })
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.userId, user.id),
          eq(schema.notifications.isRead, 0)
        )
      );
    unreadNotificationCount = unreadNotifications.length;
  } catch (err) {
    console.warn("Could not query unread notifications count:", err);
  }

  // Query unread applications for institute admin (safely guarded)
  let unreadApplicationsCount = 0;
  if (user.role === "institute_admin" && user.instituteId) {
    try {
      const unreadApps = await db
        .select({ id: schema.jobApplications.id })
        .from(schema.jobApplications)
        .innerJoin(schema.jobVacancies, eq(schema.jobApplications.vacancyId, schema.jobVacancies.id))
        .where(
          and(
            eq(schema.jobVacancies.instituteId, user.instituteId),
            eq(schema.jobApplications.isRead, 0)
          )
        );
      unreadApplicationsCount = unreadApps.length;
    } catch (err) {
      console.warn("Could not query unread applications count:", err);
    }
  }

  interface NavItem {
    label: string;
    href: string;
    icon: any;
    badge?: number;
  }

  const teacherNav: NavItem[] = [
    { label: "Overview", href: "/dashboard/teacher", icon: LayoutDashboard },
    { label: "My Profile", href: "/dashboard/teacher/profile", icon: User },
    { label: "Browse Jobs", href: "/jobs", icon: Search },
    { label: "My Applications", href: "/dashboard/teacher/applications", icon: FileCheck },
    { label: "Saved Jobs", href: "/dashboard/teacher/saved-jobs", icon: Bookmark },
    { label: "Notifications", href: "/dashboard/teacher/notifications", icon: Bell, badge: unreadNotificationCount },
    { label: "Settings", href: "/dashboard/teacher/settings", icon: Settings },
  ];

  const instituteNav: NavItem[] = [
    { label: "Overview", href: "/dashboard/institute", icon: LayoutDashboard },
    { label: "Institute Profile", href: "/dashboard/institute/profile", icon: Building2 },
    { label: "Post a Vacancy", href: "/dashboard/institute/vacancies/new", icon: PlusCircle },
    { label: "Manage Vacancies", href: "/dashboard/institute/vacancies", icon: Briefcase },
    { label: "Applications Received", href: "/dashboard/institute/applications", icon: FileCheck, badge: unreadApplicationsCount },
    { label: "Discover Teachers", href: "/teachers", icon: Users },
    { label: "School Buses", href: "/dashboard/institute/buses", icon: Bus },
    { label: "Post Bus for Sale", href: "/dashboard/institute/buses/new", icon: PlusCircle },
    { label: "Notifications", href: "/dashboard/institute/notifications", icon: Bell, badge: unreadNotificationCount },
    { label: "Settings", href: "/dashboard/institute/settings", icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { label: "Platform Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Verify Institutes", href: "/dashboard/admin/institutes", icon: Building2 },
    { label: "Moderate Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
    { label: "Moderate Buses", href: "/dashboard/admin/buses", icon: Bus },
    { label: "Teacher Directory", href: "/dashboard/admin/teachers", icon: Users },
    { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: ShieldCheck },
    { label: "Platform Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  const activeNav =
    user.role === "teacher"
      ? teacherNav
      : user.role === "institute_admin"
      ? instituteNav
      : adminNav;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#F8FAF7]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E2E8F0] p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* User profile card in sidebar */}
          <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#163B32] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user.name[0]}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-[#163B32] truncate block">
                  {user.name}
                </span>
                <span className="text-[10px] font-semibold text-[#65A88A] uppercase tracking-wider block">
                  {user.role === "institute_admin"
                    ? "Institute Admin"
                    : user.role === "platform_admin"
                    ? "Platform Admin"
                    : "Teacher"}
                </span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {activeNav.map((item) => {
              const Icon = item.icon;
              const hasBadge = Boolean(item.badge && item.badge > 0);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#163B32] hover:bg-[#F7F5EF] transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-[#65A88A] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {hasBadge && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-[#D97706] rounded-full shadow-xs ring-1 ring-[#FDE68A]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Return to Public Site */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#163B32] hover:bg-[#F8FAF7] rounded-xl transition"
          >
            <span>← Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
