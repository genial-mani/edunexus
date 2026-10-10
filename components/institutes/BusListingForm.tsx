"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFilePresigned } from "@/lib/storage/client";
import {
  Bus,
  Gauge,
  Fuel,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
} from "lucide-react";

export default function BusListingForm({
  defaultCity,
  defaultState,
}: {
  defaultCity: string;
  defaultState: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [manufacturer, setManufacturer] = useState("Tata");
  const [model, setModel] = useState("");
  const [manufacturingYear, setManufacturingYear] = useState(2021);
  const [registrationYear, setRegistrationYear] = useState(2021);
  const [registrationState, setRegistrationState] = useState("KA (Karnataka)");
  const [askingPrice, setAskingPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(1);
  const [seatingCapacity, setSeatingCapacity] = useState(34);
  const [fuelType, setFuelType] = useState<"Diesel" | "CNG" | "Electric" | "Petrol">("Diesel");
  const [odometerKms, setOdometerKms] = useState("");
  const [vehicleCondition, setVehicleCondition] = useState<"Excellent" | "Good" | "Fair" | "Needs Repair">("Good");
  const [previousOwners, setPreviousOwners] = useState(1);
  const [locationCity, setLocationCity] = useState(defaultCity);
  const [locationState, setLocationState] = useState(defaultState);
  const [description, setDescription] = useState("");
  const [maintenanceInfo, setMaintenanceInfo] = useState("");
  const [primaryImageUrl, setPrimaryImageUrl] = useState(
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadFilePresigned(file, "buses");
      setPrimaryImageUrl(result.url);
    } catch (err: any) {
      console.error("Bus image upload error:", err);
      setError(err?.message || "Failed to upload bus image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title,
        manufacturer,
        model,
        manufacturingYear: Number(manufacturingYear),
        registrationYear: Number(registrationYear),
        registrationState,
        askingPrice: Number(askingPrice),
        isNegotiable,
        seatingCapacity: Number(seatingCapacity),
        fuelType,
        odometerKms: Number(odometerKms),
        vehicleCondition,
        previousOwners: Number(previousOwners),
        locationCity,
        locationState,
        description,
        maintenanceInfo,
        primaryImageUrl,
        status: "published",
      };

      const res = await fetch("/api/institute/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to list school bus");
        setLoading(false);
        return;
      }

      router.push("/dashboard/institute/buses");
      router.refresh();
    } catch (err) {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Specs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
        <h3 className="font-bold text-base text-[#163B32] pb-2 border-b border-[#E2E8F0]">
          Vehicle Identity & Model
        </h3>

        {/* Primary Photo */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
            Vehicle Exterior Photo
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-40 w-64 rounded-2xl bg-slate-100 overflow-hidden border border-[#E2E8F0]">
              <img src={primaryImageUrl} alt="Bus thumbnail" className="w-full h-full object-cover" />
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0] text-xs font-semibold text-[#163B32] hover:bg-[#efebe0] cursor-pointer transition">
                <UploadCloud className="w-4 h-4 text-[#65A88A]" />
                <span>{uploadingImage ? "Uploading..." : "Upload Vehicle Photo"}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Listing Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tata Starbus Ultra 40-Seater AC School Bus (Single Owner)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Manufacturer *
            </label>
            <select
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            >
              <option value="Tata">Tata Motors</option>
              <option value="Eicher">Eicher Motors</option>
              <option value="Ashok Leyland">Ashok Leyland</option>
              <option value="Force Motors">Force Motors</option>
              <option value="BharatBenz">BharatBenz</option>
              <option value="Mahindra">Mahindra</option>
              <option value="SML Isuzu">SML Isuzu</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Model *
            </label>
            <input
              type="text"
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Starbus Ultra 40S"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Manufacturing Year *
            </label>
            <input
              type="number"
              required
              min={1995}
              max={2026}
              value={manufacturingYear}
              onChange={(e) => setManufacturingYear(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Registration State *
            </label>
            <input
              type="text"
              required
              value={registrationState}
              onChange={(e) => setRegistrationState(e.target.value)}
              placeholder="e.g. KA (Karnataka)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Seating Capacity (Seats) *
            </label>
            <input
              type="number"
              required
              min={5}
              value={seatingCapacity}
              onChange={(e) => setSeatingCapacity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Fuel Type *
            </label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            >
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
              <option value="Petrol">Petrol</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Condition Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
        <h3 className="font-bold text-base text-[#163B32] pb-2 border-b border-[#E2E8F0]">
          Pricing & Vehicle Condition
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Asking Price (₹) *
            </label>
            <input
              type="number"
              required
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              placeholder="e.g. 1650000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Odometer Reading (Kms) *
            </label>
            <input
              type="number"
              required
              value={odometerKms}
              onChange={(e) => setOdometerKms(e.target.value)}
              placeholder="e.g. 42000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Vehicle Condition *
            </label>
            <select
              value={vehicleCondition}
              onChange={(e) => setVehicleCondition(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
            >
              <option value="Excellent">Excellent (Like New)</option>
              <option value="Good">Good (Routine Wear)</option>
              <option value="Fair">Fair (Operational)</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Vehicle Description & Features *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe safety equipment (CCTV, AIS-140 GPS, speed governor), seating upholstery, tyres condition..."
            className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Maintenance History & Fitness Certificate
          </label>
          <input
            type="text"
            value={maintenanceInfo}
            onChange={(e) => setMaintenanceInfo(e.target.value)}
            placeholder="e.g. Authorized dealer serviced throughout, Fitness valid till March 2027"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#1F2937]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-lg">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#163B32] hover:bg-[#122f28] disabled:opacity-50 transition shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4 text-[#65A88A]" />
          <span>{loading ? "Publishing Listing..." : "Publish Bus Listing"}</span>
        </button>
      </div>
    </form>
  );
}
