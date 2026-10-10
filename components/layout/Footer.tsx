import Link from "next/link";
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#163B32] text-white pt-16 pb-12 border-t border-[#122f28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1f4f43]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <GraduationCap className="w-5 h-5 text-[#65A88A]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">EduNexus</span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              India&apos;s premier professional recruitment network and institutional marketplace connecting qualified teachers, educational institutions, and school transport infrastructure.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1f4f43] text-xs text-[#65A88A] border border-[#65A88A]/30">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified Educational Marketplace</span>
              </div>
            </div>
          </div>

          {/* Opportunities Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#65A88A] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/jobs" className="hover:text-white transition">
                  Teaching Vacancies
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="hover:text-white transition">
                  Open-to-Work Teachers
                </Link>
              </li>
              <li>
                <Link href="/institutes" className="hover:text-white transition">
                  Verified Institutes
                </Link>
              </li>
              <li>
                <Link href="/buses" className="hover:text-white transition">
                  School Buses for Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* For Institutions Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#65A88A] mb-4">
              Institutions
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Register Your Institute
                </Link>
              </li>
              <li>
                <Link href="/dashboard/institute" className="hover:text-white transition">
                  Post a Job Vacancy
                </Link>
              </li>
              <li>
                <Link href="/dashboard/institute/buses" className="hover:text-white transition">
                  List a School Bus
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Institute Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#65A88A] mb-4">
              EduNexus
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EduNexus Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Built for Education with <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> in India
            </span>
            <Link href="/privacy" className="hover:text-white transition">
              Data Protection
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms & Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
