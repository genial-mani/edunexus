import { NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/passwords";
import { createSession } from "@/lib/auth/session";
import { authRateLimiter, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = authRateLimiter.check(`login:${clientIp}`);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Please wait a minute and try again.",
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
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid credentials provided." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Generic error message to prevent account enumeration
    const genericAuthError = "Invalid email or password. Please try again.";

    const userRows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase().trim()));

    const user = userRows[0];
    if (!user || user.isActive === 0) {
      return NextResponse.json({ error: genericAuthError }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: genericAuthError }, { status: 401 });
    }

    // Create session & HTTP-only cookie
    await createSession(user.id);

    let redirectUrl = "/dashboard";
    if (user.role === "teacher") {
      redirectUrl = "/dashboard/teacher";
    } else if (user.role === "institute_admin") {
      redirectUrl = "/dashboard/institute";
    } else if (user.role === "platform_admin") {
      redirectUrl = "/dashboard/admin";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectUrl,
    });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
