import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const vacancySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Job description required"),
  requiredQualifications: z.string().min(2, "Required qualifications required"),
  requiredSubjects: z.array(z.string()).min(1, "Select at least 1 subject"),
  gradeLevels: z.array(z.string()).min(1, "Select at least 1 grade level"),
  yearsOfExperienceMin: z.number().min(0),
  openingsCount: z.number().min(1),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Substitute"]),
  salaryMin: z.number().optional().nullable(),
  salaryMax: z.number().optional().nullable(),
  salaryNegotiable: z.number().min(0).max(1).default(1),
  locationCity: z.string().min(2, "City required"),
  locationState: z.string().min(2, "State required"),
  applicationDeadline: z.number().optional().nullable(),
  expectedJoiningDate: z.string().optional().nullable(),
  benefits: z.array(z.string()).optional(),
  contactInstructions: z.string().optional().nullable(),
  status: z.enum(["draft", "pending_review", "published", "paused", "closed", "expired"]).default("published"),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "institute_admin" || !user.instituteId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = vacancySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues?.[0]?.message || "Invalid vacancy fields" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const vacancyId = crypto.randomUUID();
    const now = Date.now();

    await db.insert(schema.jobVacancies).values({
      id: vacancyId,
      instituteId: user.instituteId,
      title: data.title,
      description: data.description,
      requiredQualifications: data.requiredQualifications,
      requiredSubjects: JSON.stringify(data.requiredSubjects),
      gradeLevels: JSON.stringify(data.gradeLevels),
      yearsOfExperienceMin: data.yearsOfExperienceMin,
      openingsCount: data.openingsCount,
      employmentType: data.employmentType,
      salaryMin: data.salaryMin || null,
      salaryMax: data.salaryMax || null,
      salaryNegotiable: data.salaryNegotiable,
      locationCity: data.locationCity,
      locationState: data.locationState,
      applicationDeadline: data.applicationDeadline || null,
      expectedJoiningDate: data.expectedJoiningDate || null,
      benefits: JSON.stringify(data.benefits || []),
      contactInstructions: data.contactInstructions || null,
      status: data.status,
      viewsCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: "Job vacancy published successfully!",
      vacancyId,
    });
  } catch (error) {
    console.error("Create vacancy error:", error);
    return NextResponse.json({ error: "Failed to create vacancy" }, { status: 500 });
  }
}
