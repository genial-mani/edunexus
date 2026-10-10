import { redirect } from "next/navigation";
import { getCurrentUser, AuthenticatedUser } from "./session";

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(
  allowedRoles: Array<"teacher" | "institute_admin" | "platform_admin">
): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect("/");
  }
  return user;
}

export async function requireTeacher(): Promise<AuthenticatedUser> {
  return requireRole(["teacher"]);
}

export async function requireInstituteAdmin(): Promise<AuthenticatedUser> {
  return requireRole(["institute_admin"]);
}

export async function requirePlatformAdmin(): Promise<AuthenticatedUser> {
  return requireRole(["platform_admin"]);
}
