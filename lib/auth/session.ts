import { cookies } from "next/headers";
import { db, schema } from "../db";
import { eq, and, gt } from "drizzle-orm";

const SESSION_COOKIE_NAME = "schoolmarket_session";
const LEGACY_COOKIE_NAME = "edunexus_session";
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "teacher" | "institute_admin" | "platform_admin";
  name: string;
  isActive: number;
  instituteId?: string;
  instituteSlug?: string;
  instituteVerificationStatus?: string;
  teacherProfileId?: string;
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const now = Date.now();

  await db.insert(schema.sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: now,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return sessionId;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value || cookieStore.get(LEGACY_COOKIE_NAME)?.value;

  if (sessionId) {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(LEGACY_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value || cookieStore.get(LEGACY_COOKIE_NAME)?.value;

    if (!sessionId) return null;

    const now = Date.now();
    const sessionRows = await db
      .select()
      .from(schema.sessions)
      .where(and(eq(schema.sessions.id, sessionId), gt(schema.sessions.expiresAt, now)));

    const session = sessionRows[0];
    if (!session) return null;

    const userRows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));

    const user = userRows[0];
    if (!user || user.isActive === 0) return null;

    let instituteId: string | undefined;
    let instituteSlug: string | undefined;
    let instituteVerificationStatus: string | undefined;
    let teacherProfileId: string | undefined;

    if (user.role === "institute_admin") {
      const membershipRows = await db
        .select()
        .from(schema.instituteMembers)
        .where(eq(schema.instituteMembers.userId, user.id));

      let membership = membershipRows[0];
      if (membership) {
        const instRows = await db
          .select()
          .from(schema.institutes)
          .where(eq(schema.institutes.id, membership.instituteId));
        const inst = instRows[0];
        if (inst) {
          instituteId = inst.id;
          instituteSlug = inst.slug;
          instituteVerificationStatus = inst.verificationStatus;
        }
      }

      // Self-healing: if membership or institute missing, link by email or create default
      if (!instituteId) {
        const matchingInsts = await db
          .select()
          .from(schema.institutes)
          .where(eq(schema.institutes.officialEmail, user.email));
        
        if (matchingInsts[0]) {
          const matched = matchingInsts[0];
          instituteId = matched.id;
          instituteSlug = matched.slug;
          instituteVerificationStatus = matched.verificationStatus;
          if (!membership) {
            await db.insert(schema.instituteMembers).values({
              id: crypto.randomUUID(),
              instituteId: matched.id,
              userId: user.id,
              role: "admin",
              createdAt: Date.now(),
            });
          }
        } else {
          // Create default institute
          const newInstId = crypto.randomUUID();
          const slugBase = (user.name || "school").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          const newSlug = `${slugBase || "school"}-${Math.random().toString(36).substring(2, 6)}`;
          const now = Date.now();

          await db.insert(schema.institutes).values({
            id: newInstId,
            name: `${user.name}'s Educational Institution`,
            slug: newSlug,
            type: "School",
            city: "Bengaluru",
            state: "Karnataka",
            officialEmail: user.email,
            contactPhone: "+91 00000 00000",
            verificationStatus: "pending",
            educationLevels: "[]",
            specializations: "[]",
            createdAt: now,
            updatedAt: now,
          });

          await db.insert(schema.instituteMembers).values({
            id: crypto.randomUUID(),
            instituteId: newInstId,
            userId: user.id,
            role: "admin",
            createdAt: now,
          });

          instituteId = newInstId;
          instituteSlug = newSlug;
          instituteVerificationStatus = "pending";
        }
      }
    } else if (user.role === "teacher") {
      const profileRows = await db
        .select()
        .from(schema.teacherProfiles)
        .where(eq(schema.teacherProfiles.userId, user.id));
      let profile = profileRows[0];
      if (!profile) {
        // Self-healing: create initial teacher profile if missing
        const newProfId = crypto.randomUUID();
        const now = Date.now();
        await db.insert(schema.teacherProfiles).values({
          id: newProfId,
          userId: user.id,
          fullName: user.name,
          email: user.email,
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
        teacherProfileId = newProfId;
      } else {
        teacherProfileId = profile.id;
      }
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isActive: user.isActive,
      instituteId,
      instituteSlug,
      instituteVerificationStatus,
      teacherProfileId,
    };
  } catch (err) {
    console.error("Error getting current user:", err);
    return null;
  }
}
