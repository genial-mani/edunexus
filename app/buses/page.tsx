import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq, desc, and, like, or } from "drizzle-orm";
import {
  Bus,
  Search,
  MapPin,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building2,
  X,
  Gauge,
  Fuel,
  Calendar,
} from "lucide-react";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    maker?: string;
    fuel?: string;
    condition?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function BusesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const location = params.location?.trim() || "";
  const maker = params.maker?.trim() || "";
  const fuel = params.fuel?.trim() || "";
  const condition = params.condition?.trim() || "";

  const buses = await db
    .select({
      id: schema.busListings.id,
      title: schema.busListings.title,
      manufacturer: schema.busListings.manufacturer,
      model: schema.busListings.model,
      manufacturingYear: schema.busListings.manufacturingYear,
      registrationState: schema.busListings.registrationState,
      askingPrice: schema.busListings.askingPrice,
      isNegotiable: schema.busListings.isNegotiable,
      seatingCapacity: schema.busListings.seatingCapacity,
      fuelType: schema.busListings.fuelType,
      odometerKms: schema.busListings.odometerKms,
      vehicleCondition: schema.busListings.vehicleCondition,
      locationCity: schema.busListings.locationCity,
      locationState: schema.busListings.locationState,
      primaryImageUrl: schema.busListings.primaryImageUrl,
      createdAt: schema.busListings.createdAt,
      instituteName: schema.institutes.name,
      instituteSlug: schema.institutes.slug,
      instituteVerified: schema.institutes.verificationStatus,
    })
    .from(schema.busListings)
    .innerJoin(schema.institutes, eq(schema.busListings.instituteId, schema.institutes.id))
    .where(
      and(
        eq(schema.busListings.status, "published"),
        q
          ? or(
              like(schema.busListings.title, `%${q}%`),
              like(schema.busListings.manufacturer, `%${q}%`),
              like(schema.busListings.model, `%${q}%`)
            )
          : undefined,
        location
          ? or(
              like(schema.busListings.locationCity, `%${location}%`),
              like(schema.busListings.locationState, `%${location}%`),
              like(schema.busListings.registrationState, `%${location}%`)
            )
          : undefined,
        maker ? eq(schema.busListings.manufacturer, maker) : undefined,
        fuel ? eq(schema.busListings.fuelType, fuel as any) : undefined,
        condition ? eq(schema.busListings.vehicleCondition, condition as any) : undefined
      )
    )
    .orderBy(desc(schema.busListings.createdAt));

  const hasFilters = Boolean(q || location || maker || fuel || condition);

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163B32]/5 text-[#163B32] text-xs font-semibold">
              <Bus className="w-3.5 h-3.5 text-[#65A88A]" />
              <span>Institute-to-Institute Transport Fleet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163B32] tracking-tight">
              School Buses for Sale by Educational Institutions
            </h1>
            <p className="text-sm sm:text-base text-[#475569]">
              Buy or sell school transport equipment directly between verified schools and colleges. Tata, Eicher, Ashok Leyland, and Force Traveller buses with full maintenance records.
            </p>
          </div>

          {/* Search Form */}
          <form method="GET" action="/buses" className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Bus model or manufacturer (e.g. Tata Starbus, 40-seater)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="location"
                defaultValue={location}
                placeholder="City, State, or RTO Registration"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] placeholder:text-slate-400 bg-white hover:border-[#65A88A] transition"
              />
            </div>

            <div className="sm:col-span-3 flex gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-[#163B32] hover:bg-[#122f28] transition shadow-sm cursor-pointer"
              >
                Find Buses
              </button>
              {hasFilters && (
                <Link
                  href="/buses"
                  className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#475569] hover:bg-slate-100 transition shrink-0"
                  title="Clear filters"
                >
                  <X className="w-5 h-5" />
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filters */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="font-bold text-sm text-[#163B32] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#65A88A]" />
                  <span>Filter Vehicles</span>
                </h3>
                {hasFilters && (
                  <Link href="/buses" className="text-xs text-[#65A88A] hover:underline">
                    Reset
                  </Link>
                )}
              </div>

              {/* Manufacturer */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block">
                  Manufacturer
                </span>
                <div className="space-y-1.5 text-xs">
                  {["Tata", "Eicher", "Ashok Leyland", "Force Motors"].map((m) => (
                    <Link
                      key={m}
                      href={`/buses?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(location ? { location } : {}),
                        ...(fuel ? { fuel } : {}),
                        ...(condition ? { condition } : {}),
                        ...(maker === m ? {} : { maker: m }),
                      }).toString()}`}
                      className={`block px-3 py-2 rounded-lg transition ${
                        maker === m
                          ? "bg-[#163B32] text-white font-medium"
                          : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
                      }`}
                    >
                      {m}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block">
                  Fuel Type
                </span>
                <div className="space-y-1.5 text-xs">
                  {["Diesel", "CNG", "Electric"].map((f) => (
                    <Link
                      key={f}
                      href={`/buses?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(location ? { location } : {}),
                        ...(maker ? { maker } : {}),
                        ...(condition ? { condition } : {}),
                        ...(fuel === f ? {} : { fuel: f }),
                      }).toString()}`}
                      className={`block px-3 py-2 rounded-lg transition ${
                        fuel === f
                          ? "bg-[#163B32] text-white font-medium"
                          : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
                      }`}
                    >
                      {f}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] block">
                  Condition
                </span>
                <div className="space-y-1.5 text-xs">
                  {["Excellent", "Good", "Fair"].map((c) => (
                    <Link
                      key={c}
                      href={`/buses?${new URLSearchParams({
                        ...(q ? { q } : {}),
                        ...(location ? { location } : {}),
                        ...(maker ? { maker } : {}),
                        ...(fuel ? { fuel } : {}),
                        ...(condition === c ? {} : { condition: c }),
                      }).toString()}`}
                      className={`block px-3 py-2 rounded-lg transition ${
                        condition === c
                          ? "bg-[#163B32] text-white font-medium"
                          : "text-[#475569] hover:bg-[#F7F5EF] hover:text-[#163B32]"
                      }`}
                    >
                      {c} Condition
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#475569] px-1">
              <span>
                Found <strong className="text-[#163B32]">{buses.length}</strong> school buses listed for sale
              </span>
            </div>

            {buses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F7F5EF] text-[#163B32] flex items-center justify-center mx-auto">
                  <Bus className="w-6 h-6 text-[#65A88A]" />
                </div>
                <h3 className="font-bold text-lg text-[#163B32]">No school buses matching criteria</h3>
                <p className="text-sm text-[#475569] max-w-sm mx-auto">
                  Try adjusting fuel type or manufacturer filters.
                </p>
                <Link
                  href="/buses"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#163B32] hover:bg-[#122f28] transition"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map((bus) => (
                  <Link
                    key={bus.id}
                    href={`/buses/${bus.id}`}
                    className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md hover:border-[#65A88A] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={bus.primaryImageUrl || "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"}
                          alt={bus.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#163B32]/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-xs font-semibold">
                          {bus.manufacturingYear}
                        </div>
                        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-[#163B32] px-2.5 py-0.5 rounded text-xs font-bold shadow-sm">
                          {formatCurrency(bus.askingPrice)}
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <h2 className="font-bold text-sm text-[#163B32] group-hover:text-[#65A88A] transition-colors line-clamp-2">
                          {bus.title}
                        </h2>

                        <div className="grid grid-cols-3 gap-1.5 py-1 text-center bg-[#F7F5EF] p-2 rounded-xl text-xs text-[#163B32]">
                          <div>
                            <span className="text-[10px] text-[#475569] block">Seats</span>
                            <span className="font-bold">{bus.seatingCapacity}</span>
                          </div>
                          <div className="border-x border-[#E2E8F0]">
                            <span className="text-[10px] text-[#475569] block">Fuel</span>
                            <span className="font-bold">{bus.fuelType}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#475569] block">Status</span>
                            <span className="font-bold">{bus.vehicleCondition}</span>
                          </div>
                        </div>

                        <div className="text-xs text-[#475569] space-y-1 pt-1">
                          <p className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-[#65A88A]" />
                            {bus.odometerKms.toLocaleString("en-IN")} Kms on Odometer
                          </p>
                          <p className="flex items-center gap-1 truncate">
                            <Building2 className="w-3.5 h-3.5 text-[#65A88A] shrink-0" />
                            <span>{bus.instituteName}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAF7] flex items-center justify-between text-xs text-[#475569]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                        {bus.locationCity}, {bus.locationState}
                      </span>
                      <span className="font-semibold text-[#163B32] group-hover:text-[#65A88A] flex items-center">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
