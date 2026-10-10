"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to log in");
        setLoading(false);
        return;
      }

      // Success -> navigate to dashboard
      router.push(data.redirectUrl || "/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const fillQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8FAF7]">
      <div className="max-w-md w-full space-y-8">
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#163B32] shadow-md shadow-[#163B32]/10">
            <GraduationCap className="w-7 h-7 text-[#65A88A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#163B32] tracking-tight">
            Sign in to EduNexus
          </h1>
          <p className="text-sm text-[#475569]">
            Access your teacher profile, vacancies, or institutional marketplace
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#163B32] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#65A88A]" />
            <span>1-Click Demo Accounts</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickLogin("anjali.sharma@gmail.com", "Password@123")}
              className="py-1.5 px-2 text-xs font-medium bg-white hover:bg-[#65A88A] hover:text-white rounded-lg border border-[#E2E8F0] transition text-center text-[#163B32]"
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("admin@greenwood.edu", "Password@123")}
              className="py-1.5 px-2 text-xs font-medium bg-white hover:bg-[#65A88A] hover:text-white rounded-lg border border-[#E2E8F0] transition text-center text-[#163B32]"
            >
              Institute
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("admin@edunexus.org", "Admin@12345")}
              className="py-1.5 px-2 text-xs font-medium bg-white hover:bg-[#65A88A] hover:text-white rounded-lg border border-[#E2E8F0] transition text-center text-[#163B32]"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu or teacher@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#163B32] hover:text-[#65A88A] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#65A88A]" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E2E8F0]">
            <p className="text-sm text-[#475569]">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-semibold text-[#163B32] hover:text-[#65A88A] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
