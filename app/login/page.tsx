"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validation using Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const formatted = validation.error.format();
      setFieldErrors({
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
      return;
    }

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
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#163B32] flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5 text-[#65A88A]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#163B32]">
              Edu<span className="text-[#65A88A]">Nexus</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#163B32] tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-[#475569]">
            Access your recruitment pipeline or educator profile
          </p>
        </div>

        {/* Main Form Card */}
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="name@institution.edu or teacher@gmail.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                    fieldErrors.email ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
              )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-[#1F2937] placeholder:text-slate-400 bg-white transition ${
                    fieldErrors.password ? "border-red-400 ring-1 ring-red-400" : "border-[#E2E8F0] hover:border-[#65A88A]"
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
              )}
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
