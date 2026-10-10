import { requireInstituteAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import {
  Bus,
  PlusCircle,
  MessageSquare,
  Building2,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, timeAgo, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ManageBusesPage() {
  const user = await requireInstituteAdmin();

  const buses = await db
    .select()
    .from(schema.busListings)
    .where(eq(schema.busListings.instituteId, user.instituteId!))
    .orderBy(desc(schema.busListings.createdAt));

  const inquiries = await db
    .select({
      id: schema.busInquiries.id,
      senderName: schema.busInquiries.senderName,
      senderOrganization: schema.busInquiries.senderOrganization,
      senderPhone: schema.busInquiries.senderPhone,
      senderEmail: schema.busInquiries.senderEmail,
      message: schema.busInquiries.message,
      createdAt: schema.busInquiries.createdAt,
      busId: schema.busListings.id,
      busTitle: schema.busListings.title,
    })
    .from(schema.busInquiries)
    .innerJoin(schema.busListings, eq(schema.busInquiries.busId, schema.busListings.id))
    .where(eq(schema.busListings.instituteId, user.instituteId!))
    .orderBy(desc(schema.busInquiries.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
            Institutional School Buses
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Manage your listed school buses and direct buyer inquiries from other institutions.
          </p>
        </div>

        <Link
          href="/dashboard/institute/buses/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#163B32] hover:bg-[#122f28] shadow-sm transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#65A88A]" />
          <span>List Another Bus</span>
        </Link>
      </div>

      {/* Buses List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#163B32]">Active Vehicle Listings ({buses.length})</h2>

        {buses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
            <Bus className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-[#163B32]">No school buses listed yet</h3>
            <p className="text-xs text-[#475569] max-w-sm mx-auto">
              List decommissioned or surplus school buses for sale directly to other institutions.
            </p>
            <Link
              href="/dashboard/institute/buses/new"
              className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32]"
            >
              Post a Bus for Sale
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <img
                      src={bus.primaryImageUrl || "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"}
                      alt={bus.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#163B32]/90 text-white px-2 py-0.5 rounded text-xs font-semibold">
                      {bus.status}
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-white/90 text-[#163B32] px-2 py-0.5 rounded text-xs font-bold">
                      {formatCurrency(bus.askingPrice)}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-base text-[#163B32] line-clamp-1">{bus.title}</h3>
                    <div className="flex items-center justify-between text-xs text-[#475569]">
                      <span>{bus.seatingCapacity} Seats</span>
                      <span>{bus.fuelType}</span>
                      <span>{bus.vehicleCondition}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF7] flex items-center justify-between text-xs">
                  <span className="text-slate-400">Listed {timeAgo(bus.createdAt)}</span>
                  <Link
                    href={`/buses/${bus.id}`}
                    target="_blank"
                    className="font-semibold text-[#163B32] hover:text-[#65A88A] flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiries Received Section */}
      <div className="space-y-4 pt-6 border-t border-[#E2E8F0]">
        <h2 className="text-lg font-bold text-[#163B32] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#65A88A]" />
          <span>Buyer Inquiries ({inquiries.length})</span>
        </h2>

        {inquiries.length === 0 ? (
          <p className="text-xs text-[#475569]">No buyer inquiries received yet.</p>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-base text-[#163B32]">{inq.senderName}</strong>
                      <span className="text-xs text-[#65A88A] font-semibold">({inq.senderOrganization})</span>
                    </div>
                    <p className="text-xs text-[#475569]">
                      Inquiry for vehicle: <strong className="text-[#163B32]">{inq.busTitle}</strong>
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400">{timeAgo(inq.createdAt)}</span>
                </div>

                <p className="text-xs text-[#475569] leading-relaxed bg-[#F7F5EF] p-3.5 rounded-xl border border-[#E2E8F0]">
                  &ldquo;{inq.message}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#163B32] font-semibold pt-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#65A88A]" />
                    {inq.senderPhone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#65A88A]" />
                    {inq.senderEmail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
