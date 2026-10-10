"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  Users,
  Building2,
  Bus,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  UserCheck,
} from "lucide-react";

interface UserProp {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "institute_admin" | "platform_admin";
}

export default function Navbar({ initialUser }: { initialUser?: UserProp | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProp | null>(initialUser || null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { label: "Jobs", href: "/jobs", icon: Briefcase },
    { label: "Teachers", href: "/teachers", icon: Users },
    { label: "Institutes", href: "/institutes", icon: Building2 },
    { label: "School Buses", href: "/buses", icon: Bus },
  ];

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === "teacher") return "/dashboard/teacher";
    if (user.role === "institute_admin") return "/dashboard/institute";
    return "/dashboard/admin";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#163B32] text-white flex items-center justify-center shadow-sm group-hover:bg-[#122f28] transition-colors">
              <GraduationCap className="w-5 h-5 text-[#65A88A]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#163B32] flex items-center gap-1">
                EduNexus
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-[#65A88A] -mt-1">
                Education Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-[#163B32] bg-[#F7F5EF] font-semibold"
                      : "text-[#475569] hover:text-[#163B32] hover:bg-[#F8FAF7]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#163B32]" : "text-[#65A88A]"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getDashboardHref()}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#F7F5EF] text-[#163B32] hover:bg-[#efebe0] border border-[#E2E8F0] text-sm font-medium transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#65A88A]" />
                  <span>Dashboard</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#163B32] text-white font-mono text-[10px] capitalize">
                    {user.role === "institute_admin" ? "Institute" : user.role === "platform_admin" ? "Admin" : "Teacher"}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#475569] hover:text-red-600 hover:bg-red-50 border border-transparent transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#163B32] hover:bg-[#F7F5EF] transition border border-transparent"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition active:scale-[0.98]"
                >
                  <UserCheck className="w-4 h-4 text-[#65A88A]" />
                  <span>Join EduNexus</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#163B32] hover:bg-[#F7F5EF] transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? "bg-[#F7F5EF] text-[#163B32] font-semibold" : "text-[#475569] hover:bg-[#F8FAF7]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#65A88A]" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            {user ? (
              <>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#F7F5EF] text-[#163B32] font-medium text-sm"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-[#65A88A]" />
                    Dashboard ({user.name})
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#163B32] text-white capitalize">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 border border-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg text-sm font-medium text-[#163B32] border border-[#E2E8F0] hover:bg-[#F7F5EF]"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-lg text-sm font-medium text-white bg-[#163B32] hover:bg-[#122f28]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
