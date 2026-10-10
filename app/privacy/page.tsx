export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="space-y-2 border-b border-[#E2E8F0] pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#65A88A]">
              EduNexus Trust & Governance
            </span>
            <h1 className="text-3xl font-extrabold text-[#163B32] tracking-tight">
              Privacy Policy & Teacher Data Protection
            </h1>
            <p className="text-xs text-[#475569]">
              Last updated: October 2026 • Compliant with Indian Digital Personal Data Protection Act (DPDP)
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">1. Introduction</h2>
              <p>
                EduNexus (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) operates an educational recruitment network and institutional asset marketplace. We treat educator privacy as a fundamental cornerstone of our architecture.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">2. Teacher Contact Privacy Guarantees</h2>
              <p>
                Unlike generic resume search engines, EduNexus implements strict server-side redaction of personal contact vectors:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>
                  <strong>Phone Number Visibility:</strong> When an educator toggles their phone visibility off, the phone number is stripped on the server and is never transmitted in API responses or HTML markup to public visitors.
                </li>
                <li>
                  <strong>Resume Protection:</strong> Uploaded CVs and degrees are stored in encrypted cloud storage and are only accessible by verified educational institutions to which the teacher has applied, or when the teacher has explicitly granted access.
                </li>
                <li>
                  <strong>Open to Work Control:</strong> Teachers can deactivate their discovery status at any time, instantly removing their profile from all recruitment search indices.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">3. Institution Verification Data</h2>
              <p>
                Educational institutions submit proof of accreditation (CBSE / ICSE / State Board / UGC / AICTE recognition). This verification data is reviewed solely by authorized platform administrators and is not shared with third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#163B32]">4. Data Retention & Deletion Rights</h2>
              <p>
                You hold the absolute right to request account deactivation and permanent data erasure. Upon request, all associated sessions, applications, and uploaded files are irreversibly deleted from our primary databases and Cloudflare R2 object stores.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
