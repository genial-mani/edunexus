import { notFound } from "next/navigation";
import Link from "next/link";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import {
  Bus,
  Building2,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Wrench,
  FileCheck,
  Info,
} from "lucide-react";
import BusInquiryForm from "@/components/buses/BusInquiryForm";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function BusDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const busRows = await db
    .select({
      id: schema.busListings.id,
      title: schema.busListings.title,
      manufacturer: schema.busListings.manufacturer,
      model: schema.busListings.model,
      manufacturingYear: schema.busListings.manufacturingYear,
      registrationYear: schema.busListings.registrationYear,
      registrationState: schema.busListings.registrationState,
      askingPrice: schema.busListings.askingPrice,
      isNegotiable: schema.busListings.isNegotiable,
      seatingCapacity: schema.busListings.seatingCapacity,
      fuelType: schema.busListings.fuelType,
      odometerKms: schema.busListings.odometerKms,
      vehicleCondition: schema.busListings.vehicleCondition,
      previousOwners: schema.busListings.previousOwners,
      locationCity: schema.busListings.locationCity,
      locationState: schema.busListings.locationState,
      description: schema.busListings.description,
      maintenanceInfo: schema.busListings.maintenanceInfo,
      primaryImageUrl: schema.busListings.primaryImageUrl,
      status: schema.busListings.status,
      createdAt: schema.busListings.createdAt,
      instituteId: schema.institutes.id,
      instituteName: schema.institutes.name,
      instituteSlug: schema.institutes.slug,
      instituteLogo: schema.institutes.logoUrl,
      instituteVerified: schema.institutes.verificationStatus,
      instituteEmail: schema.institutes.officialEmail,
      institutePhone: schema.institutes.contactPhone,
      instituteCity: schema.institutes.city,
      instituteState: schema.institutes.state,
    })
    .from(schema.busListings)
    .innerJoin(schema.institutes, eq(schema.busListings.instituteId, schema.institutes.id))
    .where(eq(schema.busListings.id, id));

  const bus = busRows[0];
  if (!bus) {
    notFound();
  }

  // Fetch gallery images
  const images = await db
    .select()
    .from(schema.busListingImages)
    .where(eq(schema.busListingImages.busId, id));

  const allImages = images.length > 0 ? images.map((i) => i.imageUrl) : [bus.primaryImageUrl || "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"];

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/buses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#163B32] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Bus Marketplace</span>
        </Link>

        {/* Title Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/institutes/${bus.instituteSlug}`}
                  className="text-xs font-semibold text-[#475569] hover:text-[#163B32] flex items-center gap-1"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#65A88A]" />
                  <span>{bus.instituteName}</span>
                  {bus.instituteVerified === "approved" && (
                    <span title="Verified Institute">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    </span>
                  )}
                </Link>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-[#65A88A] font-semibold">{bus.manufacturer}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163B32] tracking-tight">
                {bus.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#475569] pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#65A88A]" />
                  {bus.locationCity}, {bus.locationState}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#65A88A]" />
                  {bus.manufacturingYear} Model
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#65A88A]" />
                  {bus.odometerKms.toLocaleString("en-IN")} Kms
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-2xl sm:text-3xl font-black text-[#163B32]">
                {formatCurrency(bus.askingPrice)}
              </div>
              <span className="text-xs text-[#65A88A] font-semibold">
                {bus.isNegotiable === 1 ? "Price Negotiable" : "Fixed Asking Price"}
              </span>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-[#E2E8F0]">
              <img
                src={allImages[0]}
                alt={bus.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 h-72 sm:h-96">
              {allImages.slice(1, 3).map((img, idx) => (
                <div key={idx} className="h-full rounded-2xl overflow-hidden bg-slate-100 border border-[#E2E8F0]">
                  <img src={img} alt={`${bus.title} photo ${idx + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications & Inquiry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Specifications */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tech Specs Table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5">
              <h3 className="font-bold text-lg text-[#163B32]">Technical Specifications</h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Manufacturer</span>
                  <span className="font-bold text-sm text-[#163B32]">{bus.manufacturer}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Model</span>
                  <span className="font-bold text-sm text-[#163B32]">{bus.model}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Manufacturing Year</span>
                  <span className="font-bold text-sm text-[#163B32]">{bus.manufacturingYear}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Registration State</span>
                  <span className="font-bold text-sm text-[#163B32]">{bus.registrationState}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Passenger Seating</span>
                  <span className="font-bold text-sm text-[#163B32]">{bus.seatingCapacity} Passenger Seats</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fuel Type</span>
                  <span className="font-bold text-sm text-[#163B32]">{bus.fuelType}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Odometer Reading</span>
                  <span className="font-bold text-sm text-[#163B32]">{bus.odometerKms.toLocaleString("en-IN")} Kms</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8F0]">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Vehicle Condition</span>
                  <span className="font-bold text-sm text-emerald-800">{bus.vehicleCondition}</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                <h4 className="font-bold text-sm text-[#163B32]">Vehicle Overview & Condition Note</h4>
                <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-line">
                  {bus.description}
                </p>
              </div>

              {/* Maintenance Information */}
              {bus.maintenanceInfo && (
                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  <h4 className="font-bold text-sm text-[#163B32] flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-[#65A88A]" />
                    <span>Maintenance & Compliance History</span>
                  </h4>
                  <p className="text-xs text-[#475569] leading-relaxed bg-[#F7F5EF] p-3.5 rounded-xl border border-[#E2E8F0]">
                    {bus.maintenanceInfo}
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  EduNexus is an institutional listing and lead marketplace. Buyer and seller institutions are responsible for physical inspection, RTO fitness verification, and legal transfer procedures.
                </span>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form & Seller Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Seller Info Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F8FAF7] border border-[#E2E8F0] overflow-hidden flex items-center justify-center shrink-0">
                  {bus.instituteLogo ? (
                    <img src={bus.instituteLogo} alt={bus.instituteName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#163B32]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#163B32] flex items-center gap-1.5">
                    <span>{bus.instituteName}</span>
                    {bus.instituteVerified === "approved" && (
                      <span title="Verified Institute">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-[#65A88A] font-medium">{bus.instituteCity}, {bus.instituteState}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0]">
                <h4 className="font-bold text-sm text-[#163B32] mb-3">
                  Send Inquiry to Seller Institution
                </h4>
                <BusInquiryForm
                  busId={bus.id}
                  busTitle={bus.title}
                  sellerInstituteName={bus.instituteName}
                  currentUser={user}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
