export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="space-y-2 border-b border-[#E2E8F0] pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#65A88A]">
              EduNexus Terms of Service
            </span>
            <h1 className="text-3xl font-extrabold text-[#163B32] tracking-tight">
              Terms & Conditions of Platform Use
            </h1>
            <p className="text-xs text-[#475569]">
              Effective: October 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">1. Acceptance of Terms</h2>
              <p>
                By accessing or registering with EduNexus, you agree to comply with these terms, governing teacher recruitment profiles, institutional vacancy postings, and school bus marketplace inquiries.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">2. Institutional Responsibilities</h2>
              <p>
                Educational institutions must provide accurate, accredited representations of their establishment. False claims of affiliation or posting unbacked job openings will result in immediate suspension and forfeiture of platform access.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">3. School Bus Marketplace Disclaimer</h2>
              <p>
                EduNexus acts strictly as a listing discovery and communication conduit between certified educational entities. EduNexus does not hold ownership of listed vehicles, does not process escrow or payment for motor vehicles, and makes no representations regarding engine fitness or mechanical durability. Buyers and sellers are required to execute independent technical inspections and complete RTO legal ownership transfers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">4. Code of Conduct</h2>
              <p>
                Harassment, submission of forged credentials, spamming applicants, or unauthorized harvesting of teacher information is strictly prohibited and subject to legal action under the Indian Information Technology Act.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
