import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to apply for this vacancy." }, { status: 401 });
    }

    if (user.role !== "teacher") {
      return NextResponse.json({ error: "Only registered teacher accounts can submit job applications." }, { status: 403 });
    }

    // Get teacher profile
    const profileRows = await db
      .select()
      .from(schema.teacherProfiles)
      .where(eq(schema.teacherProfiles.userId, user.id));

    const profile = profileRows[0];
    if (!profile) {
      return NextResponse.json({ error: "Please complete your teacher profile first." }, { status: 400 });
    }

    const { vacancyId, coverLetter } = await request.json();
    if (!vacancyId) {
      return NextResponse.json({ error: "Vacancy ID is required." }, { status: 400 });
    }

    // Check vacancy status
    const vacancyRows = await db
      .select()
      .from(schema.jobVacancies)
      .where(eq(schema.jobVacancies.id, vacancyId));

    const vacancy = vacancyRows[0];
    if (!vacancy || vacancy.status !== "published") {
      return NextResponse.json({ error: "This vacancy is no longer accepting applications." }, { status: 400 });
    }

    // Check for duplicate application
    const existingApps = await db
      .select()
      .from(schema.jobApplications)
      .where(
        and(
          eq(schema.jobApplications.vacancyId, vacancyId),
          eq(schema.jobApplications.teacherId, profile.id)
        )
      );

    if (existingApps.length > 0) {
      return NextResponse.json(
        { error: "You have already submitted an application for this position." },
        { status: 409 }
      );
    }

    const appId = crypto.randomUUID();
    const now = Date.now();

    await db.insert(schema.jobApplications).values({
      id: appId,
      vacancyId,
      teacherId: profile.id,
      coverLetter: coverLetter || null,
      resumeSnapshotUrl: profile.resumeUrl || null,
      status: "submitted",
      employerNotes: null,
      createdAt: now,
      updatedAt: now,
    });

    // Notify the institute administrator
    const memberRows = await db
      .select()
      .from(schema.instituteMembers)
      .where(eq(schema.instituteMembers.instituteId, vacancy.instituteId));

    if (memberRows.length > 0) {
      for (const member of memberRows) {
        await db.insert(schema.notifications).values({
          id: crypto.randomUUID(),
          userId: member.userId,
          title: "New Application Received",
          message: `${profile.fullName} applied for ${vacancy.title}.`,
          link: `/dashboard/institute/vacancies`,
          isRead: 0,
          createdAt: now,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully! The institution has been notified.",
      applicationId: appId,
    });
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
