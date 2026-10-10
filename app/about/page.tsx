import Link from "next/link";
import { GraduationCap, ShieldCheck, Users, Building2, Bus, Heart, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF7] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163B32]/5 text-[#163B32] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#65A88A]" />
            <span>About EduNexus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#163B32] tracking-tight">
            Bridging Excellence in Education & Institutional Infrastructure
          </h1>
          <p className="text-base text-[#475569] leading-relaxed">
            EduNexus was founded to solve two major friction points in Indian education: helping institutions recruit verified teachers transparently, and enabling certified institutions to trade school transport equipment with peace of mind.
          </p>
        </div>

        {/* Pillars Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#65A88A]" />
            </div>
            <h3 className="font-bold text-lg text-[#163B32]">Faculty Empowerment</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              We empower educators with complete control over their careers, verified professional profiles, and privacy toggles that safeguard personal phone numbers and contact details.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#65A88A]" />
            </div>
            <h3 className="font-bold text-lg text-[#163B32]">Institutional Trust</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Every school and college on EduNexus undergoes administrator verification before publishing public vacancies or school bus listings, eliminating spurious job advertisements.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F5EF] text-[#163B32] flex items-center justify-center">
              <Bus className="w-6 h-6 text-[#65A88A]" />
            </div>
            <h3 className="font-bold text-lg text-[#163B32]">Transport Marketplace</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Educational institutions can discover and negotiate high-quality, pre-owned school buses with maintenance logs directly from fellow educational institutions.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-[#163B32]">Our Vision & Values</h2>
          <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
            <p>
              Traditional job portals cater indiscriminately to generic corporate positions, failing to understand the specific accreditation needs of CBSE, ICSE, IB, and state education boards. EduNexus was architected from the ground up to recognize subject mastery, grade-level certifications (TGT, PGT, PRT), and educational pedagogy.
            </p>
            <p>
              Simultaneously, institutional capital expenditure on transport fleets is often burdened by excessive middleman fees. By connecting school boards directly with one another, we unlock efficiency and mutual growth.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition"
            >
              <span>Join EduNexus</span>
              <ArrowRight className="w-4 h-4 text-[#65A88A]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#163B32] bg-[#F7F5EF] hover:bg-[#efebe0] border border-[#E2E8F0] transition"
            >
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
