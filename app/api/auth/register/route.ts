import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/passwords";
import { createSession } from "@/lib/auth/session";
import { authRateLimiter, getClientIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Full name or representative name is required"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["teacher", "institute_admin"]),
  // Extra fields if role is institute_admin
  instituteName: z.string().optional(),
  instituteType: z.enum(["School", "College", "Junior College", "Coaching Centre", "Other"]).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  mandal: z.string().optional(),
  pincode: z.string().optional(),
  contactPhone: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = authRateLimiter.check(`register:${clientIp}`);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please wait a moment and try again.",
          retryAfter: rateCheck.reset,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.reset),
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues?.[0]?.message || "Invalid registration data" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      role,
      instituteName,
      instituteType,
      city,
      state,
      district,
      mandal,
      pincode,
      contactPhone,
    } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existingUsers = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, cleanEmail));

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 409 }
      );
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const now = Date.now();

    // Create user
    await db.insert(schema.users).values({
      id: userId,
      email: cleanEmail,
      passwordHash,
      role,
      name: name.trim(),
      isEmailVerified: 1,
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    });

    let redirectUrl = "/dashboard";

    if (role === "teacher") {
      const profileId = crypto.randomUUID();
      await db.insert(schema.teacherProfiles).values({
        id: profileId,
        userId,
        fullName: name.trim(),
        email: cleanEmail,
        city: city?.trim() || null,
        state: state?.trim() || null,
        district: district?.trim() || null,
        mandal: mandal?.trim() || null,
        pincode: pincode?.trim() || null,
        isOpenToWork: 1,
        isPublic: 1,
        isPhoneVisible: 0,
        subjects: "[]",
        gradeLevels: "[]",
        languages: "[]",
        yearsOfExperience: 0,
        createdAt: now,
        updatedAt: now,
      });

      redirectUrl = "/dashboard/teacher/profile";
    } else if (role === "institute_admin") {
      const instId = crypto.randomUUID();
      const rawInstName = instituteName?.trim() || `${name}'s Educational Institution`;
      const baseSlug = slugify(rawInstName);
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

      await db.insert(schema.institutes).values({
        id: instId,
        name: rawInstName,
        slug: uniqueSlug,
        type: instituteType || "School",
        city: city?.trim() || "Bengaluru",
        state: state?.trim() || "Karnataka",
        district: district?.trim() || null,
        mandal: mandal?.trim() || null,
        postalCode: pincode?.trim() || null,
        officialEmail: cleanEmail,
        contactPhone: contactPhone?.trim() || "+91 00000 00000",
        verificationStatus: "pending",
        educationLevels: "[]",
        specializations: "[]",
        createdAt: now,
        updatedAt: now,
      });

      // Link user as admin of the institute
      await db.insert(schema.instituteMembers).values({
        id: crypto.randomUUID(),
        instituteId: instId,
        userId,
        role: "admin",
        createdAt: now,
      });

      redirectUrl = "/dashboard/institute/profile";
    }

    // Automatically log in user by creating session
    await createSession(userId);

    return NextResponse.json({
      success: true,
      message: "Account created successfully! Logging you in...",
      user: {
        id: userId,
        email: cleanEmail,
        name,
        role,
      },
      redirectUrl,
    });
  } catch (error) {
    console.error("Register route error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
