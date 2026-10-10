import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const busListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  manufacturer: z.string().min(2, "Manufacturer required"),
  model: z.string().min(2, "Model required"),
  manufacturingYear: z.number().min(1990).max(2028),
  registrationYear: z.number().optional().nullable(),
  registrationState: z.string().min(2, "State registration code required (e.g. KA, MH, DL)"),
  askingPrice: z.number().min(10000, "Valid price required"),
  isNegotiable: z.number().min(0).max(1).default(1),
  seatingCapacity: z.number().min(5),
  fuelType: z.enum(["Diesel", "CNG", "Electric", "Petrol"]),
  odometerKms: z.number().min(0),
  vehicleCondition: z.enum(["Excellent", "Good", "Fair", "Needs Repair"]),
  previousOwners: z.number().default(1),
  locationCity: z.string().min(2),
  locationState: z.string().min(2),
  description: z.string().min(10),
  maintenanceInfo: z.string().optional().nullable(),
  primaryImageUrl: z.string().optional().nullable(),
  status: z.enum(["draft", "pending_review", "published", "reserved", "sold", "removed"]).default("published"),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "institute_admin" || !user.instituteId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = busListingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues?.[0]?.message || "Invalid vehicle specs" }, { status: 400 });
    }

    const data = parsed.data;
    const busId = crypto.randomUUID();
    const now = Date.now();

    await db.insert(schema.busListings).values({
      id: busId,
      instituteId: user.instituteId,
      title: data.title,
      manufacturer: data.manufacturer,
      model: data.model,
      manufacturingYear: data.manufacturingYear,
      registrationYear: data.registrationYear || data.manufacturingYear,
      registrationState: data.registrationState,
      askingPrice: data.askingPrice,
      isNegotiable: data.isNegotiable,
      seatingCapacity: data.seatingCapacity,
      fuelType: data.fuelType,
      odometerKms: data.odometerKms,
      vehicleCondition: data.vehicleCondition,
      previousOwners: data.previousOwners,
      locationCity: data.locationCity,
      locationState: data.locationState,
      description: data.description,
      maintenanceInfo: data.maintenanceInfo || null,
      primaryImageUrl: data.primaryImageUrl || "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800",
      status: data.status,
      viewsCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    if (data.primaryImageUrl) {
      await db.insert(schema.busListingImages).values({
        id: crypto.randomUUID(),
        busId,
        imageUrl: data.primaryImageUrl,
        isPrimary: 1,
        createdAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: "School bus listed successfully in marketplace!",
      busId,
    });
  } catch (error) {
    console.error("Bus creation error:", error);
    return NextResponse.json({ error: "Failed to create bus listing" }, { status: 500 });
  }
}
