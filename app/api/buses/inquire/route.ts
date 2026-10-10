import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const inquirySchema = z.object({
  busId: z.string().min(1, "Bus ID required"),
  senderName: z.string().min(2, "Name required"),
  senderOrganization: z.string().min(2, "Institution/Organization required"),
  senderPhone: z.string().min(6, "Valid phone number required"),
  senderEmail: z.string().email("Valid email address required"),
  message: z.string().min(5, "Inquiry message required"),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues?.[0]?.message || "Invalid inquiry details" },
        { status: 400 }
      );
    }

    const { busId, senderName, senderOrganization, senderPhone, senderEmail, message } = parsed.data;

    const busRows = await db
      .select()
      .from(schema.busListings)
      .where(eq(schema.busListings.id, busId));

    const bus = busRows[0];
    if (!bus) {
      return NextResponse.json({ error: "Bus listing not found" }, { status: 404 });
    }

    const inquiryId = crypto.randomUUID();
    const now = Date.now();

    await db.insert(schema.busInquiries).values({
      id: inquiryId,
      busId,
      buyerUserId: user ? user.id : "guest_buyer",
      senderName,
      senderOrganization,
      senderPhone,
      senderEmail,
      message,
      status: "new",
      createdAt: now,
    });

    // Notify the selling institution administrators
    const memberRows = await db
      .select()
      .from(schema.instituteMembers)
      .where(eq(schema.instituteMembers.instituteId, bus.instituteId));

    for (const member of memberRows) {
      await db.insert(schema.notifications).values({
        id: crypto.randomUUID(),
        userId: member.userId,
        title: "New School Bus Inquiry",
        message: `${senderName} (${senderOrganization}) inquired about "${bus.title}".`,
        link: `/dashboard/institute/buses`,
        isRead: 0,
        createdAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry sent successfully! The seller has been notified and will contact you directly.",
      inquiryId,
    });
  } catch (error) {
    console.error("Bus inquiry error:", error);
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}
