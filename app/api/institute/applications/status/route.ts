import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const statusSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(["submitted", "under_review", "shortlisted", "interview", "rejected", "hired", "withdrawn"]),
  employerNotes: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "institute_admin" || !user.instituteId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status payload" }, { status: 400 });
    }

    const { applicationId, status, employerNotes } = parsed.data;

    // Fetch application and verify vacancy belongs to this institute
    const appRows = await db
      .select({
        appId: schema.jobApplications.id,
        vacancyId: schema.jobVacancies.id,
        vacancyTitle: schema.jobVacancies.title,
        teacherId: schema.teacherProfiles.id,
        teacherUserId: schema.teacherProfiles.userId,
        instituteId: schema.jobVacancies.instituteId,
      })
      .from(schema.jobApplications)
      .innerJoin(schema.jobVacancies, eq(schema.jobApplications.vacancyId, schema.jobVacancies.id))
      .innerJoin(schema.teacherProfiles, eq(schema.jobApplications.teacherId, schema.teacherProfiles.id))
      .where(eq(schema.jobApplications.id, applicationId));

    const app = appRows[0];
    if (!app || app.instituteId !== user.instituteId) {
      return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 403 });
    }

    const now = Date.now();

    await db
      .update(schema.jobApplications)
      .set({
        status,
        employerNotes: employerNotes !== undefined ? employerNotes : undefined,
        updatedAt: now,
      })
      .where(eq(schema.jobApplications.id, applicationId));

    // Notify teacher
    const statusLabels: Record<string, string> = {
      under_review: "Your application is now Under Review.",
      shortlisted: "Congratulations! You have been Shortlisted for an interview.",
      interview: "An Interview has been requested for your application.",
      rejected: "Update on your application status.",
      hired: "Congratulations! You have been marked as Selected / Hired.",
    };

    if (statusLabels[status]) {
      await db.insert(schema.notifications).values({
        id: crypto.randomUUID(),
        userId: app.teacherUserId,
        title: `Application Status Updated: ${status.replace("_", " ").toUpperCase()}`,
        message: `${statusLabels[status]} for position: "${app.vacancyTitle}".`,
        link: "/dashboard/teacher/applications",
        isRead: 0,
        createdAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Candidate application status updated to ${status}.`,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
