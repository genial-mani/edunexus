import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  headline: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  isPhoneVisible: z.number().min(0).max(1),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  highestQualification: z.string().optional().nullable(),
  subjects: z.array(z.string()),
  gradeLevels: z.array(z.string()),
  yearsOfExperience: z.number().min(0),
  employmentTypePref: z.string().optional().nullable(),
  expectedSalaryMin: z.number().optional().nullable(),
  expectedSalaryMax: z.number().optional().nullable(),
  availableFrom: z.string().optional().nullable(),
  isOpenToWork: z.number().min(0).max(1),
  isPublic: z.number().min(0).max(1),
  resumeUrl: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues?.[0]?.message || "Invalid profile data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const now = Date.now();

    // Check existing profile
    const existing = await db
      .select()
      .from(schema.teacherProfiles)
      .where(eq(schema.teacherProfiles.userId, user.id));

    if (existing.length === 0) {
      const profileId = crypto.randomUUID();
      await db.insert(schema.teacherProfiles).values({
        id: profileId,
        userId: user.id,
        fullName: data.fullName,
        email: user.email,
        headline: data.headline || null,
        bio: data.bio || null,
        phone: data.phone || null,
        isPhoneVisible: data.isPhoneVisible,
        city: data.city || null,
        state: data.state || null,
        highestQualification: data.highestQualification || null,
        subjects: JSON.stringify(data.subjects),
        gradeLevels: JSON.stringify(data.gradeLevels),
        yearsOfExperience: data.yearsOfExperience,
        employmentTypePref: data.employmentTypePref || null,
        expectedSalaryMin: data.expectedSalaryMin || null,
        expectedSalaryMax: data.expectedSalaryMax || null,
        availableFrom: data.availableFrom || null,
        isOpenToWork: data.isOpenToWork,
        isPublic: data.isPublic,
        resumeUrl: data.resumeUrl || null,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await db
        .update(schema.teacherProfiles)
        .set({
          fullName: data.fullName,
          headline: data.headline || null,
          bio: data.bio || null,
          phone: data.phone || null,
          isPhoneVisible: data.isPhoneVisible,
          city: data.city || null,
          state: data.state || null,
          highestQualification: data.highestQualification || null,
          subjects: JSON.stringify(data.subjects),
          gradeLevels: JSON.stringify(data.gradeLevels),
          yearsOfExperience: data.yearsOfExperience,
          employmentTypePref: data.employmentTypePref || null,
          expectedSalaryMin: data.expectedSalaryMin || null,
          expectedSalaryMax: data.expectedSalaryMax || null,
          availableFrom: data.availableFrom || null,
          isOpenToWork: data.isOpenToWork,
          isPublic: data.isPublic,
          resumeUrl: data.resumeUrl || null,
          updatedAt: now,
        })
        .where(eq(schema.teacherProfiles.userId, user.id));
    }

    return NextResponse.json({
      success: true,
      message: "Teacher profile and visibility settings updated successfully!",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
