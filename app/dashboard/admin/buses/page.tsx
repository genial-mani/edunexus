import { requirePlatformAdmin } from "@/lib/auth/rbac";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { Bus, ExternalLink } from "lucide-react";
import { formatCurrency, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBusesPage() {
  const user = await requirePlatformAdmin();

  const buses = await db
    .select({
      id: schema.busListings.id,
      title: schema.busListings.title,
      manufacturer: schema.busListings.manufacturer,
      manufacturingYear: schema.busListings.manufacturingYear,
      seatingCapacity: schema.busListings.seatingCapacity,
      askingPrice: schema.busListings.askingPrice,
      status: schema.busListings.status,
      createdAt: schema.busListings.createdAt,
      instituteName: schema.institutes.name,
      locationCity: schema.busListings.locationCity,
      locationState: schema.busListings.locationState,
    })
    .from(schema.busListings)
    .innerJoin(schema.institutes, eq(schema.busListings.instituteId, schema.institutes.id))
    .orderBy(desc(schema.busListings.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
          School Bus Marketplace Moderation
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Review vehicle listings, pricing credibility, and seller institution associations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
        {buses.map((bus) => (
          <div key={bus.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {bus.status}
                </span>
                <span className="text-xs text-[#475569] font-medium">{bus.instituteName}</span>
                <span>•</span>
                <span className="text-xs text-[#475569]">{bus.locationCity}, {bus.locationState}</span>
              </div>
              <h3 className="font-bold text-base text-[#163B32]">{bus.title}</h3>
              <p className="text-xs text-slate-400">
                {bus.manufacturer} • {bus.manufacturingYear} Model • {bus.seatingCapacity} Seats • Asking: {formatCurrency(bus.askingPrice)}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/buses/${bus.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#163B32] bg-[#F7F5EF] hover:bg-[#efebe0] border border-[#E2E8F0]"
              >
                <span>View Public</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
