import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const instituteProfileSchema = z.object({
  name: z.string().min(2, "Name required"),
  type: z.enum(["School", "College", "Junior College", "Coaching Centre", "Other"]),
  description: z.string().optional().nullable(),
  establishedYear: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  postalCode: z.string().optional().nullable(),
  contactPhone: z.string().min(6, "Phone required"),
  websiteUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  educationLevels: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "institute_admin" || !user.instituteId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = instituteProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues?.[0]?.message || "Invalid fields" }, { status: 400 });
    }

    const data = parsed.data;
    const now = Date.now();

    await db
      .update(schema.institutes)
      .set({
        name: data.name,
        type: data.type,
        description: data.description || null,
        establishedYear: data.establishedYear || null,
        address: data.address || null,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode || null,
        contactPhone: data.contactPhone,
        websiteUrl: data.websiteUrl || null,
        logoUrl: data.logoUrl || null,
        coverUrl: data.coverUrl || null,
        educationLevels: JSON.stringify(data.educationLevels || []),
        specializations: JSON.stringify(data.specializations || []),
        updatedAt: now,
      })
      .where(eq(schema.institutes.id, user.instituteId));

    return NextResponse.json({
      success: true,
      message: "Institution profile updated successfully!",
    });
  } catch (error) {
    console.error("Institute update error:", error);
    return NextResponse.json({ error: "Failed to update institute profile" }, { status: 500 });
  }
}
