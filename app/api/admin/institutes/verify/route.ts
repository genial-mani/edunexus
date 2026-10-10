import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const verifySchema = z.object({
  instituteId: z.string().min(1),
  status: z.enum(["approved", "rejected", "suspended", "pending"]),
  notes: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "platform_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid verification decision" }, { status: 400 });
    }

    const { instituteId, status, notes } = parsed.data;
    const now = Date.now();

    await db
      .update(schema.institutes)
      .set({
        verificationStatus: status,
        verificationNotes: notes || null,
        verifiedAt: status === "approved" ? now : null,
        updatedAt: now,
      })
      .where(eq(schema.institutes.id, instituteId));

    // Notify institute admin members
    const members = await db
      .select()
      .from(schema.instituteMembers)
      .where(eq(schema.instituteMembers.instituteId, instituteId));

    for (const m of members) {
      await db.insert(schema.notifications).values({
        id: crypto.randomUUID(),
        userId: m.userId,
        title: `Institute Verification Status: ${status.toUpperCase()}`,
        message:
          status === "approved"
            ? "Your educational institution has been verified and approved to publish public vacancies and school buses."
            : `Your verification application status is now ${status}. ${notes ? `Remarks: ${notes}` : ""}`,
        link: "/dashboard/institute/profile",
        isRead: 0,
        createdAt: now,
      });
    }

    // Add audit log
    await db.insert(schema.auditLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      action: `INSTITUTE_VERIFICATION_${status.toUpperCase()}`,
      entityType: "institute",
      entityId: instituteId,
      details: notes || `Verification set to ${status}`,
      ipAddress: "127.0.0.1",
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      message: `Institution verification status changed to ${status}.`,
    });
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json({ error: "Failed to update institute verification" }, { status: 500 });
  }
}
