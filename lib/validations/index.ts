import { z } from "zod";

// Indian Pincode: 6 digits, doesn't start with 0
export const pincodeRegex = /^[1-9][0-9]{5}$/;

// Indian Mobile Number: 10 digits, starts with 6-9
export const phoneRegex = /^[6-9]\d{9}$/;

// Common Address Sub-Schema with informative messaging
export const addressFieldsSchema = z.object({
  state: z.string().min(2, "State is required (min 2 characters)"),
  district: z.string().min(2, "District is required to surface relevant local searches"),
  mandal: z.string().min(2, "Mandal / Tehsil is required for granular radius filtering"),
  city: z.string().min(2, "City or Village name is required"),
  pincode: z
    .string()
    .regex(pincodeRegex, "Please enter a valid 6-digit Indian PIN code (e.g. 500001, 520001)"),
});

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  role: z.enum(["teacher", "institute"], {
    error: "Role must be either 'teacher' or 'institute'",
  }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Please enter a valid 10-digit Indian phone number (e.g. 9876543210)",
    }),
});

// Job Vacancy Schema
export const jobVacancySchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters").max(120),
  employmentType: z.enum(["Full-time", "Part-time", "Contract", "Substitute"]),
  requiredQualifications: z.string().min(2, "Required qualifications are mandatory (e.g. B.Ed, M.Sc, CTET)"),
  requiredSubjects: z.array(z.string()).min(1, "Please specify at least one subject"),
  gradeLevels: z.array(z.string()).default([]),
  yearsOfExperienceMin: z.coerce.number().min(0, "Experience cannot be negative").max(40),
  openingsCount: z.coerce.number().min(1, "At least 1 opening is required").default(1),
  salaryMin: z.coerce.number().optional().nullable(),
  salaryMax: z.coerce.number().optional().nullable(),
  salaryNegotiable: z.coerce.number().default(1),
  locationCity: z.string().min(2, "City/Village is required"),
  locationState: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required to help nearby educators discover your opening"),
  mandal: z.string().optional().nullable(),
  pincode: z.string().optional().refine((val) => !val || pincodeRegex.test(val), {
    message: "PIN code must be exactly 6 digits",
  }),
  description: z.string().min(20, "Job description must be at least 20 characters"),
  applicationDeadline: z.string().optional().nullable(),
});

// Teacher Profile Schema
export const teacherProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  headline: z.string().max(150, "Headline too long").optional().nullable(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional().nullable(),
  phone: z.string().optional().refine((val) => !val || phoneRegex.test(val), {
    message: "Please enter a valid 10-digit phone number",
  }),
  isPhoneVisible: z.coerce.number().default(0),
  city: z.string().min(2, "City / Village is required"),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required to match nearby school vacancies"),
  mandal: z.string().optional().nullable(),
  pincode: z.string().optional().refine((val) => !val || pincodeRegex.test(val), {
    message: "PIN code must be 6 digits",
  }),
  highestQualification: z.string().min(2, "Highest qualification is required"),
  subjects: z.array(z.string()).min(1, "Specify at least one subject you teach"),
  gradeLevels: z.array(z.string()).default([]),
  yearsOfExperience: z.coerce.number().min(0, "Experience cannot be negative").max(50),
  employmentTypePref: z.string().optional().nullable(),
  expectedSalaryMin: z.coerce.number().optional().nullable(),
  expectedSalaryMax: z.coerce.number().optional().nullable(),
  isOpenToWork: z.coerce.number().default(1),
});

// Bus Listing Schema
export const busListingSchema = z.object({
  title: z.string().min(5, "Listing title must be at least 5 characters").max(150),
  manufacturer: z.string().min(2, "Manufacturer is required (e.g. Tata, Ashok Leyland, Eicher)"),
  model: z.string().min(1, "Model is required (e.g. Starbus, Viking, Skyline Pro)"),
  manufacturingYear: z.coerce.number().min(1995).max(new Date().getFullYear() + 1),
  registrationState: z.string().min(2, "Registration State is required"),
  askingPrice: z.coerce.number().min(10000, "Asking price must be at least ₹10,000"),
  isNegotiable: z.coerce.number().default(1),
  seatingCapacity: z.coerce.number().min(5, "Seating capacity must be at least 5 seats"),
  fuelType: z.enum(["Diesel", "CNG", "Electric", "Petrol"]),
  odometerKms: z.coerce.number().min(0, "Odometer kilometers cannot be negative"),
  vehicleCondition: z.enum(["Excellent", "Good", "Fair", "Needs Repair"]),
  locationCity: z.string().min(2, "City / Village location is required"),
  locationState: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required to help institutions find nearby buses"),
  mandal: z.string().optional().nullable(),
  pincode: z.string().optional().refine((val) => !val || pincodeRegex.test(val), {
    message: "PIN code must be 6 digits",
  }),
  description: z.string().min(20, "Listing description must be at least 20 characters"),
});
