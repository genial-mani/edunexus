import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Users
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["teacher", "institute_admin", "platform_admin"] }).notNull(),
  name: text("name").notNull(),
  isEmailVerified: integer("is_email_verified").notNull().default(1),
  isActive: integer("is_active").notNull().default(1),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// 2. Sessions (Session-based auth)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
});

// 3. Teacher Profiles
export const teacherProfiles = sqliteTable("teacher_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  headline: text("headline"),
  bio: text("bio"),
  email: text("email").notNull(),
  phone: text("phone"),
  isPhoneVisible: integer("is_phone_visible").notNull().default(0), // If 0, stripped completely before response
  city: text("city"),
  state: text("state"),
  preferredLocations: text("preferred_locations"), // JSON array
  highestQualification: text("highest_qualification"),
  degrees: text("degrees"), // JSON array of qualifications/certifications
  subjects: text("subjects").notNull().default("[]"), // JSON array
  gradeLevels: text("grade_levels").notNull().default("[]"), // JSON array
  yearsOfExperience: integer("years_of_experience").notNull().default(0),
  previousInstitutes: text("previous_institutes"), // JSON array
  languages: text("languages").default("[]"), // JSON array
  employmentTypePref: text("employment_type_pref"),
  expectedSalaryMin: integer("expected_salary_min"),
  expectedSalaryMax: integer("expected_salary_max"),
  resumeUrl: text("resume_url"),
  availableFrom: text("available_from"),
  isOpenToWork: integer("is_open_to_work").notNull().default(0),
  isPublic: integer("is_public").notNull().default(1),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// 4. Institutes
export const institutes = sqliteTable("institutes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["School", "College", "Junior College", "Coaching Centre", "Other"] }).notNull().default("School"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  description: text("description"),
  establishedYear: integer("established_year"),
  address: text("address"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code"),
  officialEmail: text("official_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  websiteUrl: text("website_url"),
  educationLevels: text("education_levels").notNull().default("[]"), // JSON array
  specializations: text("specializations").notNull().default("[]"), // JSON array
  verificationStatus: text("verification_status", { enum: ["pending", "approved", "rejected", "suspended"] }).notNull().default("pending"),
  verificationNotes: text("verification_notes"),
  verifiedAt: integer("verified_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// 5. Institute Members
export const instituteMembers = sqliteTable("institute_members", {
  id: text("id").primaryKey(),
  instituteId: text("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("admin"),
  createdAt: integer("created_at").notNull(),
});

// 6. Job Vacancies
export const jobVacancies = sqliteTable("job_vacancies", {
  id: text("id").primaryKey(),
  instituteId: text("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requiredQualifications: text("required_qualifications").notNull(),
  requiredSubjects: text("required_subjects").notNull().default("[]"), // JSON array
  gradeLevels: text("grade_levels").notNull().default("[]"), // JSON array
  yearsOfExperienceMin: integer("years_of_experience_min").notNull().default(0),
  openingsCount: integer("openings_count").notNull().default(1),
  employmentType: text("employment_type", { enum: ["Full-time", "Part-time", "Contract", "Substitute"] }).notNull().default("Full-time"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryNegotiable: integer("salary_negotiable").notNull().default(1),
  locationCity: text("location_city").notNull(),
  locationState: text("location_state").notNull(),
  applicationDeadline: integer("application_deadline"),
  expectedJoiningDate: text("expected_joining_date"),
  benefits: text("benefits").default("[]"), // JSON array
  contactInstructions: text("contact_instructions"),
  status: text("status", { enum: ["draft", "pending_review", "published", "paused", "closed", "expired"] }).notNull().default("published"),
  viewsCount: integer("views_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// 7. Job Applications
export const jobApplications = sqliteTable("job_applications", {
  id: text("id").primaryKey(),
  vacancyId: text("vacancy_id").notNull().references(() => jobVacancies.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id").notNull().references(() => teacherProfiles.id, { onDelete: "cascade" }),
  coverLetter: text("cover_letter"),
  resumeSnapshotUrl: text("resume_snapshot_url"),
  status: text("status", { enum: ["submitted", "under_review", "shortlisted", "interview", "rejected", "hired", "withdrawn"] }).notNull().default("submitted"),
  employerNotes: text("employer_notes"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// 8. Saved Jobs
export const savedJobs = sqliteTable("saved_jobs", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull().references(() => teacherProfiles.id, { onDelete: "cascade" }),
  vacancyId: text("vacancy_id").notNull().references(() => jobVacancies.id, { onDelete: "cascade" }),
  createdAt: integer("created_at").notNull(),
});

// 9. Bus Listings
export const busListings = sqliteTable("bus_listings", {
  id: text("id").primaryKey(),
  instituteId: text("institute_id").notNull().references(() => institutes.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  manufacturer: text("manufacturer").notNull(), // Tata, Ashok Leyland, Eicher, Force Motors, BharatBenz, etc.
  model: text("model").notNull(),
  manufacturingYear: integer("manufacturing_year").notNull(),
  registrationYear: integer("registration_year"),
  registrationState: text("registration_state").notNull(),
  askingPrice: integer("asking_price").notNull(),
  isNegotiable: integer("is_negotiable").notNull().default(1),
  seatingCapacity: integer("seating_capacity").notNull(),
  fuelType: text("fuel_type", { enum: ["Diesel", "CNG", "Electric", "Petrol"] }).notNull().default("Diesel"),
  odometerKms: integer("odometer_kms").notNull(),
  vehicleCondition: text("vehicle_condition", { enum: ["Excellent", "Good", "Fair", "Needs Repair"] }).notNull().default("Good"),
  previousOwners: integer("previous_owners").notNull().default(1),
  locationCity: text("location_city").notNull(),
  locationState: text("location_state").notNull(),
  description: text("description").notNull(),
  maintenanceInfo: text("maintenance_info"),
  primaryImageUrl: text("primary_image_url"),
  status: text("status", { enum: ["draft", "pending_review", "published", "reserved", "sold", "removed"] }).notNull().default("published"),
  viewsCount: integer("views_count").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// 10. Bus Listing Images
export const busListingImages = sqliteTable("bus_listing_images", {
  id: text("id").primaryKey(),
  busId: text("bus_id").notNull().references(() => busListings.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  isPrimary: integer("is_primary").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

// 11. Bus Inquiries
export const busInquiries = sqliteTable("bus_inquiries", {
  id: text("id").primaryKey(),
  busId: text("bus_id").notNull().references(() => busListings.id, { onDelete: "cascade" }),
  buyerUserId: text("buyer_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderName: text("sender_name").notNull(),
  senderOrganization: text("sender_organization").notNull(),
  senderPhone: text("sender_phone").notNull(),
  senderEmail: text("sender_email").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "contacted", "closed"] }).notNull().default("new"),
  createdAt: integer("created_at").notNull(),
});

// 12. Notifications
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  isRead: integer("is_read").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

// 13. Audit Logs
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at").notNull(),
});
