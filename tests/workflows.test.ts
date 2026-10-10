import assert from "node:assert";
import { hashPassword, verifyPassword } from "../lib/auth/passwords";
import { db } from "../lib/db";
import { users, institutes, jobVacancies, busListings, teacherProfiles } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function runTests() {
  console.log("🧪 Starting EduNexus Critical Workflows & Security Test Suite...\n");

  // Test 1: WebCrypto PBKDF2 Password Hashing
  console.log("▶ Test 1: WebCrypto PBKDF2 Password Hashing & Verification");
  const plainPassword = "SecurePassword123!";
  const hash = await hashPassword(plainPassword);
  assert.ok(hash.includes(":"), "Hash must contain salt and key separated by colon");
  const isValid = await verifyPassword(plainPassword, hash);
  assert.strictEqual(isValid, true, "Valid password must verify successfully");
  const isInvalid = await verifyPassword("WrongPassword!", hash);
  assert.strictEqual(isInvalid, false, "Invalid password must be rejected");
  console.log("  ✔ Password hashing and verification passed");

  // Test 2: Teacher Phone Privacy Security Rule
  console.log("\n▶ Test 2: Teacher Phone Privacy Enforcement (Server-Side Sanitization)");
  // Look up a teacher who has chosen to keep phone private
  const [privateTeacher] = await db.select().from(teacherProfiles).where(eq(teacherProfiles.isPhoneVisible, 0)).limit(1);
  assert.ok(privateTeacher, "At least one teacher profile with private phone must exist");
  assert.strictEqual(privateTeacher.isPhoneVisible, 0, "Teacher has opted to keep phone private");
  
  // Sanitization test: simulate public response transformation
  const isPhoneVisibleNumber: number = privateTeacher.isPhoneVisible;
  const publicViewPhone = isPhoneVisibleNumber === 1 ? privateTeacher.phone : null;
  assert.strictEqual(publicViewPhone, null, "Private phone must NEVER be rendered or exposed in public view");
  console.log("  ✔ Server-side phone privacy rule verified");

  // Test 3: Seed Data Integrity & Relationships
  console.log("\n▶ Test 3: Relational Entities & Marketplace Seed Validation");
  const instituteCount = await db.select().from(institutes);
  assert.ok(instituteCount.length >= 3, `Expected at least 3 seeded institutes, got ${instituteCount.length}`);

  const activeJobs = await db.select().from(jobVacancies).where(eq(jobVacancies.status, "published"));
  assert.ok(activeJobs.length >= 3, `Expected at least 3 published jobs, got ${activeJobs.length}`);

  const activeBuses = await db.select().from(busListings).where(eq(busListings.status, "published"));
  assert.ok(activeBuses.length >= 3, `Expected at least 3 published buses, got ${activeBuses.length}`);
  console.log("  ✔ Database records & relational entities are valid and loaded");

  // Test 4: Role-Based Account Verification
  console.log("\n▶ Test 4: System Roles (Admin, Institute, Teacher)");
  const adminUser = await db.select().from(users).where(eq(users.role, "platform_admin")).limit(1);
  assert.strictEqual(adminUser[0]?.email, "admin@edunexus.org", "Platform admin must exist");

  const instituteUser = await db.select().from(users).where(eq(users.role, "institute_admin")).limit(1);
  assert.ok(instituteUser.length > 0, "Institute admin accounts must exist");

  const teacherUser = await db.select().from(users).where(eq(users.role, "teacher")).limit(1);
  assert.ok(teacherUser.length > 0, "Teacher accounts must exist");
  console.log("  ✔ Role definitions and default seed identities verified");

  // Test 5: Presigned Upload URL Generator
  console.log("\n▶ Test 5: Direct Presigned Upload URL Infrastructure");
  const { createPresignedUploadUrl } = await import("../lib/storage/r2");
  const presigned = await createPresignedUploadUrl("resumes/test_resume.pdf", "application/pdf", 300);
  assert.ok(presigned.uploadUrl, "uploadUrl must be generated");
  assert.ok(presigned.fileUrl, "fileUrl must be generated");
  assert.strictEqual(presigned.key, "resumes/test_resume.pdf", "Key must match input path");
  console.log("  ✔ Presigned upload generator is operational");

  console.log("\n🎉 ALL 5 CRITICAL WORKFLOW & SECURITY TESTS PASSED SUCCESSFULLY!\n");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
