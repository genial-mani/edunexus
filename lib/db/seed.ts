import { initDatabase } from "./init";
import { db, schema, client } from "./index";
import { hashPassword } from "../auth/passwords";

async function runSeed() {
  console.log("🌱 Starting EduNexus database seed...");
  await initDatabase();

  // Clear existing records to ensure fresh idempotent seed
  await client.executeMultiple(`
    DELETE FROM audit_logs;
    DELETE FROM notifications;
    DELETE FROM bus_inquiries;
    DELETE FROM bus_listing_images;
    DELETE FROM bus_listings;
    DELETE FROM saved_jobs;
    DELETE FROM job_applications;
    DELETE FROM job_vacancies;
    DELETE FROM institute_members;
    DELETE FROM institutes;
    DELETE FROM teacher_profiles;
    DELETE FROM sessions;
    DELETE FROM users;
  `);

  const now = Date.now();
  const defaultPasswordHash = await hashPassword("Password@123");
  const adminPasswordHash = await hashPassword("Admin@12345");

  // 1. Create Users
  const adminId = "user_admin_001";
  const instAdmin1Id = "user_inst_001";
  const instAdmin2Id = "user_inst_002";
  const instAdmin3Id = "user_inst_003";
  const instAdmin4Id = "user_inst_004";

  const teacher1Id = "user_teach_001";
  const teacher2Id = "user_teach_002";
  const teacher3Id = "user_teach_003";
  const teacher4Id = "user_teach_004";
  const teacher5Id = "user_teach_005";

  await db.insert(schema.users).values([
    { id: adminId, email: "admin@edunexus.org", passwordHash: adminPasswordHash, role: "platform_admin", name: "EduNexus Platform Administrator", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: instAdmin1Id, email: "admin@greenwood.edu", passwordHash: defaultPasswordHash, role: "institute_admin", name: "Dr. Rajesh Rao (Principal)", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: instAdmin2Id, email: "admin@stxavier.edu", passwordHash: defaultPasswordHash, role: "institute_admin", name: "Sister Teresa Joseph (Director)", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: instAdmin3Id, email: "admin@delhipublic.edu", passwordHash: defaultPasswordHash, role: "institute_admin", name: "Prof. Arvind Mehta (Registrar)", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: instAdmin4Id, email: "admin@heritage.edu", passwordHash: defaultPasswordHash, role: "institute_admin", name: "Capt. S. K. Roy (Admin Officer)", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },

    { id: teacher1Id, email: "anjali.sharma@gmail.com", passwordHash: defaultPasswordHash, role: "teacher", name: "Anjali Sharma", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: teacher2Id, email: "rajesh.verma@gmail.com", passwordHash: defaultPasswordHash, role: "teacher", name: "Rajesh Verma", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: teacher3Id, email: "priya.nair@gmail.com", passwordHash: defaultPasswordHash, role: "teacher", name: "Priya Nair", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: teacher4Id, email: "vikram.singh@gmail.com", passwordHash: defaultPasswordHash, role: "teacher", name: "Vikram Singh", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
    { id: teacher5Id, email: "meenakshi.s@gmail.com", passwordHash: defaultPasswordHash, role: "teacher", name: "Meenakshi Sundaram", isEmailVerified: 1, isActive: 1, createdAt: now, updatedAt: now },
  ]);

  console.log("✓ Created 10 platform users (Platform Admin, 4 Institute Admins, 5 Teachers)");

  // 2. Institutes
  const inst1Id = "inst_001";
  const inst2Id = "inst_002";
  const inst3Id = "inst_003";
  const inst4Id = "inst_004";

  await db.insert(schema.institutes).values([
    {
      id: inst1Id,
      name: "Greenwood International School",
      slug: "greenwood-international-school",
      type: "School",
      logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
      description: "Premier CBSE-affiliated residential and day boarding school fostering holistic academic excellence, sports, and international robotics programs.",
      establishedYear: 2004,
      address: "No. 8-14, Sarjapur Main Road, Varthur Hobli",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560087",
      officialEmail: "info@greenwoodhigh.edu.in",
      contactPhone: "+91 80 2201 0500",
      websiteUrl: "https://greenwood.edu",
      educationLevels: JSON.stringify(["Primary (Grades 1-5)", "Middle (Grades 6-8)", "Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      specializations: JSON.stringify(["CBSE", "STEM Focus", "Sports Academy", "Robotics"]),
      verificationStatus: "approved",
      verifiedAt: now - 86400000 * 30,
      createdAt: now - 86400000 * 30,
      updatedAt: now,
    },
    {
      id: inst2Id,
      name: "St. Xavier's Senior College",
      slug: "st-xaviers-senior-college",
      type: "College",
      logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      description: "Autonomous college accredited 'A+' by NAAC, offering undergraduate & postgraduate degrees in Sciences, Humanities, Computer Applications, and Management.",
      establishedYear: 1869,
      address: "5, Mahapalika Marg, Dhobi Talao, Fort",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      officialEmail: "admissions@xaviers.edu",
      contactPhone: "+91 22 2262 0661",
      websiteUrl: "https://xaviers.edu",
      educationLevels: JSON.stringify(["Junior College (Grades 11-12)", "Undergraduate (Degree)", "Postgraduate (Master's)"]),
      specializations: JSON.stringify(["NAAC A+", "Autonomous", "Liberal Arts", "Computer Science"]),
      verificationStatus: "approved",
      verifiedAt: now - 86400000 * 45,
      createdAt: now - 86400000 * 45,
      updatedAt: now,
    },
    {
      id: inst3Id,
      name: "Delhi Academy of Sciences & Arts",
      slug: "delhi-academy-of-sciences",
      type: "School",
      logoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80",
      coverUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
      description: "Renowned institute known for top-tier competitive examination preparation, IIT-JEE/NEET foundation, and innovative pedagogy.",
      establishedYear: 1998,
      address: "Sector 4, R.K. Puram",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110022",
      officialEmail: "contact@delhiacademy.edu",
      contactPhone: "+91 11 2617 7300",
      websiteUrl: "https://delhiacademy.edu",
      educationLevels: JSON.stringify(["Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      specializations: JSON.stringify(["CBSE", "JEE Advanced Coaching", "NEET Medical Mentorship"]),
      verificationStatus: "approved",
      verifiedAt: now - 86400000 * 15,
      createdAt: now - 86400000 * 15,
      updatedAt: now,
    },
    {
      id: inst4Id,
      name: "Heritage Global Academy",
      slug: "heritage-global-academy",
      type: "School",
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80",
      coverUrl: null,
      description: "Progressive K-12 school in Financial District with experiential learning, smart classrooms, and international curriculum integration.",
      establishedYear: 2018,
      address: "Nanakramguda, Financial District, Gachibowli",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500032",
      officialEmail: "office@heritageglobal.ac.in",
      contactPhone: "+91 40 4455 6677",
      websiteUrl: "https://heritageglobal.ac.in",
      educationLevels: JSON.stringify(["Primary (Grades 1-5)", "Middle (Grades 6-8)", "Secondary (Grades 9-10)"]),
      specializations: JSON.stringify(["Experiential Learning", "Smart Campus"]),
      verificationStatus: "pending",
      verifiedAt: null,
      createdAt: now - 86400000 * 2,
      updatedAt: now,
    },
  ]);

  // Link Members
  await db.insert(schema.instituteMembers).values([
    { id: "mem_001", instituteId: inst1Id, userId: instAdmin1Id, role: "admin", createdAt: now },
    { id: "mem_002", instituteId: inst2Id, userId: instAdmin2Id, role: "admin", createdAt: now },
    { id: "mem_003", instituteId: inst3Id, userId: instAdmin3Id, role: "admin", createdAt: now },
    { id: "mem_004", instituteId: inst4Id, userId: instAdmin4Id, role: "admin", createdAt: now },
  ]);

  console.log("✓ Created 4 Institutions and linked administrator accounts");

  // 3. Teacher Profiles
  const tProf1Id = "tprof_001";
  const tProf2Id = "tprof_002";
  const tProf3Id = "tprof_003";
  const tProf4Id = "tprof_004";
  const tProf5Id = "tprof_005";

  await db.insert(schema.teacherProfiles).values([
    {
      id: tProf1Id,
      userId: teacher1Id,
      fullName: "Anjali Sharma",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      headline: "Senior PGT Mathematics Teacher | CBSE Class 11-12 Specialist | 8+ Years",
      bio: "Passionate educator with 8 years of distinguished classroom teaching. Specialized in Calculus, Vectors, and 3D Geometry. Consistent record of producing 95%+ scorers in CBSE Board exams.",
      email: "anjali.sharma@gmail.com",
      phone: "+91 98450 12345",
      isPhoneVisible: 0, // Server-side sanitized when invisible
      city: "Bengaluru",
      state: "Karnataka",
      preferredLocations: JSON.stringify(["Bengaluru", "Mysuru", "Remote / Hybrid"]),
      highestQualification: "M.Sc (Mathematics), B.Ed",
      degrees: JSON.stringify([
        { degree: "M.Sc Mathematics", institute: "Bangalore University", year: 2015 },
        { degree: "B.Ed", institute: "Regional Institute of Education (NCERT)", year: 2017 },
      ]),
      subjects: JSON.stringify(["Mathematics", "Applied Mathematics", "Vedic Math"]),
      gradeLevels: JSON.stringify(["Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      yearsOfExperience: 8,
      previousInstitutes: JSON.stringify([
        { instituteName: "National Public School, Indiranagar", role: "PGT Mathematics", years: "2019-2024" },
        { instituteName: "Delhi Public School, East", role: "TGT Mathematics", years: "2016-2019" },
      ]),
      languages: JSON.stringify(["English", "Hindi", "Kannada"]),
      employmentTypePref: "Full-time",
      expectedSalaryMin: 55000,
      expectedSalaryMax: 75000,
      resumeUrl: "/uploads/resumes/sample_anjali_sharma_resume.pdf",
      availableFrom: "Immediate (within 15 days)",
      isOpenToWork: 1,
      isPublic: 1,
      createdAt: now - 86400000 * 20,
      updatedAt: now,
    },
    {
      id: tProf2Id,
      userId: teacher2Id,
      fullName: "Rajesh Verma",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      headline: "PGT Physics & STEM/Robotics Mentor | Ex-Allen Faculty | 6 Years Experience",
      bio: "M.Tech with strong physics intuition and hands-on laboratory pedagogy. Proven ability to prepare students for both CBSE Board and competitive JEE Main & Advanced examinations.",
      email: "rajesh.verma@gmail.com",
      phone: "+91 98111 67890",
      isPhoneVisible: 1,
      city: "New Delhi",
      state: "Delhi",
      preferredLocations: JSON.stringify(["New Delhi", "Noida", "Gurugram"]),
      highestQualification: "M.Tech, B.Ed",
      degrees: JSON.stringify([
        { degree: "M.Tech Applied Physics", institute: "Delhi Technological University (DTU)", year: 2018 },
        { degree: "B.Ed", institute: "Guru Gobind Singh Indraprastha University", year: 2020 },
      ]),
      subjects: JSON.stringify(["Physics", "Robotics", "Applied Mechanics"]),
      gradeLevels: JSON.stringify(["Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      yearsOfExperience: 6,
      previousInstitutes: JSON.stringify([
        { instituteName: "Modern School, Barakhamba Road", role: "PGT Physics", years: "2021-Present" },
        { instituteName: "Allen Career Institute", role: "Associate Physics Faculty", years: "2018-2021" },
      ]),
      languages: JSON.stringify(["English", "Hindi"]),
      employmentTypePref: "Full-time",
      expectedSalaryMin: 60000,
      expectedSalaryMax: 85000,
      resumeUrl: "/uploads/resumes/sample_rajesh_verma_resume.pdf",
      availableFrom: "1 Month Notice",
      isOpenToWork: 1,
      isPublic: 1,
      createdAt: now - 86400000 * 12,
      updatedAt: now,
    },
    {
      id: tProf3Id,
      userId: teacher3Id,
      fullName: "Priya Nair",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      headline: "TGT English, Literature & Debate Coach | Trinity Guildhall Certified",
      bio: "Dynamic English educator skilled in interactive drama, creative writing, elocution, and comprehensive middle-school language acquisition.",
      email: "priya.nair@gmail.com",
      phone: "+91 97690 54321",
      isPhoneVisible: 0,
      city: "Mumbai",
      state: "Maharashtra",
      preferredLocations: JSON.stringify(["Mumbai", "Pune", "Thane"]),
      highestQualification: "M.A. English Literature, B.Ed",
      degrees: JSON.stringify([
        { degree: "M.A. English", institute: "University of Mumbai", year: 2020 },
        { degree: "B.Ed", institute: "St. Xavier's Institute of Education", year: 2022 },
      ]),
      subjects: JSON.stringify(["English Literature", "Creative Writing", "Public Speaking"]),
      gradeLevels: JSON.stringify(["Primary (Grades 1-5)", "Middle (Grades 6-8)"]),
      yearsOfExperience: 4,
      previousInstitutes: JSON.stringify([
        { instituteName: "Cathedral & John Connon School", role: "TGT English", years: "2022-Present" },
      ]),
      languages: JSON.stringify(["English", "Hindi", "Marathi", "Malayalam"]),
      employmentTypePref: "Full-time",
      expectedSalaryMin: 40000,
      expectedSalaryMax: 55000,
      resumeUrl: "/uploads/resumes/sample_priya_nair_resume.pdf",
      availableFrom: "Immediate",
      isOpenToWork: 1,
      isPublic: 1,
      createdAt: now - 86400000 * 5,
      updatedAt: now,
    },
    {
      id: tProf4Id,
      userId: teacher4Id,
      fullName: "Vikram Singh",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      headline: "HOD Computer Science & AI Curriculum Developer | 11+ Years Experience",
      bio: "Computer Science educator teaching Python, SQL, Web Development, and Artificial Intelligence foundations to senior secondary students.",
      email: "vikram.singh@gmail.com",
      phone: "+91 99220 88776",
      isPhoneVisible: 0,
      city: "Pune",
      state: "Maharashtra",
      preferredLocations: JSON.stringify(["Pune", "Mumbai"]),
      highestQualification: "MCA, B.Ed",
      degrees: JSON.stringify([
        { degree: "MCA", institute: "Savitribai Phule Pune University", year: 2013 },
      ]),
      subjects: JSON.stringify(["Computer Science", "Informatics Practices", "Python", "Artificial Intelligence"]),
      gradeLevels: JSON.stringify(["Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      yearsOfExperience: 11,
      previousInstitutes: JSON.stringify([
        { instituteName: "Army Public School, Pune", role: "HOD Computer Science", years: "2015-Present" },
      ]),
      languages: JSON.stringify(["English", "Hindi", "Marathi"]),
      employmentTypePref: "Full-time",
      expectedSalaryMin: 75000,
      expectedSalaryMax: 110000,
      resumeUrl: null,
      availableFrom: "3 Months Notice",
      isOpenToWork: 0,
      isPublic: 1,
      createdAt: now - 86400000 * 30,
      updatedAt: now,
    },
    {
      id: tProf5Id,
      userId: teacher5Id,
      fullName: "Meenakshi Sundaram",
      avatarUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80",
      headline: "PGT Chemistry & Organic Chemistry Specialist | 5 Years Experience",
      bio: "Engaging Chemistry teacher who simplifies organic reaction mechanisms and chemical kinetics with laboratory demos and modern visual models.",
      email: "meenakshi.s@gmail.com",
      phone: "+91 94440 22334",
      isPhoneVisible: 1,
      city: "Chennai",
      state: "Tamil Nadu",
      preferredLocations: JSON.stringify(["Chennai", "Bengaluru", "Coimbatore"]),
      highestQualification: "M.Sc Chemistry, B.Ed, CSIR-NET",
      degrees: JSON.stringify([
        { degree: "M.Sc Chemistry", institute: "Loyola College, Chennai", year: 2019 },
        { degree: "B.Ed", institute: "Tamil Nadu Teachers Education University", year: 2021 },
      ]),
      subjects: JSON.stringify(["Chemistry", "Science", "Environmental Studies"]),
      gradeLevels: JSON.stringify(["Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      yearsOfExperience: 5,
      previousInstitutes: JSON.stringify([
        { instituteName: "Chettinad Vidyashram", role: "PGT Chemistry", years: "2021-Present" },
      ]),
      languages: JSON.stringify(["English", "Tamil", "Hindi"]),
      employmentTypePref: "Full-time",
      expectedSalaryMin: 48000,
      expectedSalaryMax: 65000,
      resumeUrl: "/uploads/resumes/sample_meenakshi_resume.pdf",
      availableFrom: "Next Academic Session (1 Month)",
      isOpenToWork: 1,
      isPublic: 1,
      createdAt: now - 86400000 * 8,
      updatedAt: now,
    },
  ]);

  console.log("✓ Created 5 Teacher Profiles with qualifications and Open to Work indicators");

  // 4. Job Vacancies
  const job1Id = "job_001";
  const job2Id = "job_002";
  const job3Id = "job_003";
  const job4Id = "job_004";
  const job5Id = "job_005";
  const job6Id = "job_006";

  await db.insert(schema.jobVacancies).values([
    {
      id: job1Id,
      instituteId: inst1Id,
      title: "Senior PGT Mathematics Teacher (Grades 11-12)",
      description: `We are seeking a dedicated and experienced PGT Mathematics Teacher to join our senior secondary faculty at Greenwood International School.\n\nKey Responsibilities:\n- Instruct Class 11 & 12 students in CBSE curriculum Mathematics.\n- Prepare students thoroughly for board exams and Olympiads.\n- Conduct remedial sessions and periodic assessments.\n- Mentor students in higher-level quantitative problem solving.`,
      requiredQualifications: "M.Sc in Mathematics with regular B.Ed degree. Strong track record in teaching CBSE Grades 11-12.",
      requiredSubjects: JSON.stringify(["Mathematics", "Applied Mathematics"]),
      gradeLevels: JSON.stringify(["Senior Secondary (Grades 11-12)"]),
      yearsOfExperienceMin: 4,
      openingsCount: 2,
      employmentType: "Full-time",
      salaryMin: 50000,
      salaryMax: 70000,
      salaryNegotiable: 1,
      locationCity: "Bengaluru",
      locationState: "Karnataka",
      applicationDeadline: now + 86400000 * 25,
      expectedJoiningDate: "Immediate / May 2026",
      benefits: JSON.stringify(["Health Insurance", "Subsidized Child Education", "Free Campus Transport", "PF & Gratuity"]),
      contactInstructions: "Apply online via EduNexus with an updated CV and statement of teaching philosophy.",
      status: "published",
      viewsCount: 184,
      createdAt: now - 86400000 * 7,
      updatedAt: now,
    },
    {
      id: job2Id,
      instituteId: inst1Id,
      title: "Primary English & Social Studies Educator",
      description: `Greenwood International School invites applications from enthusiastic primary educators who can ignite curiosity and foundational language mastery in grades 1 through 5.\n\nResponsibilities:\n- Create joyful, activity-based lesson plans in English & Social Studies.\n- Foster speaking, reading, and phonics comprehension.\n- Participate in inter-house cultural events and parent-teacher dialogues.`,
      requiredQualifications: "B.A./M.A. English or Humanities with D.El.Ed / B.Ed. Excellent spoken English skills.",
      requiredSubjects: JSON.stringify(["English", "Social Studies"]),
      gradeLevels: JSON.stringify(["Primary (Grades 1-5)"]),
      yearsOfExperienceMin: 2,
      openingsCount: 3,
      employmentType: "Full-time",
      salaryMin: 32000,
      salaryMax: 45000,
      salaryNegotiable: 1,
      locationCity: "Bengaluru",
      locationState: "Karnataka",
      applicationDeadline: now + 86400000 * 30,
      expectedJoiningDate: "Beginning of Academic Session",
      benefits: JSON.stringify(["Campus Transport", "Annual Performance Bonus", "Mediclaim"]),
      contactInstructions: "Shortlisted candidates will be invited for a 20-minute classroom demo.",
      status: "published",
      viewsCount: 96,
      createdAt: now - 86400000 * 4,
      updatedAt: now,
    },
    {
      id: job3Id,
      instituteId: inst2Id,
      title: "Assistant Professor - Computer Science & Artificial Intelligence",
      description: `St. Xavier's Senior College invites applications for full-time faculty in our Department of Information Technology and Computer Science.\n\nResponsibilities:\n- Teach core CS courses: Data Structures, Machine Learning, Web Technologies.\n- Guide undergraduate final-year capstone projects.\n- Supervise laboratory practicals and mentor student hackathons.`,
      requiredQualifications: "M.C.A. / M.Tech in Computer Science / IT with NET/SET qualification. Ph.D preferred.",
      requiredSubjects: JSON.stringify(["Computer Science", "Artificial Intelligence", "Python"]),
      gradeLevels: JSON.stringify(["Junior College (Grades 11-12)"]),
      yearsOfExperienceMin: 3,
      openingsCount: 2,
      employmentType: "Full-time",
      salaryMin: 65000,
      salaryMax: 95000,
      salaryNegotiable: 0,
      locationCity: "Mumbai",
      locationState: "Maharashtra",
      applicationDeadline: now + 86400000 * 20,
      expectedJoiningDate: "July 2026",
      benefits: JSON.stringify(["UGC Scale Pay", "Research Grants", "Sabbatical Policy", "Health Coverage"]),
      contactInstructions: "Apply via EduNexus. Include your Google Scholar or GitHub portfolio link in cover letter.",
      status: "published",
      viewsCount: 342,
      createdAt: now - 86400000 * 10,
      updatedAt: now,
    },
    {
      id: job4Id,
      instituteId: inst3Id,
      title: "PGT Physics & JEE Foundation Faculty",
      description: `Delhi Academy of Sciences & Arts is expanding its senior academic wing. We need a top-tier Physics educator who can lead board preparation and competitive IIT-JEE / NEET foundation batches.\n\nRequirements:\n- Deep command of Mechanics, Electromagnetism, and Modern Physics.\n- Energetic classroom delivery with conceptual clarity.`,
      requiredQualifications: "M.Sc Physics (First Division) + B.Ed. Prior coaching or senior secondary school experience is essential.",
      requiredSubjects: JSON.stringify(["Physics", "Mechanics"]),
      gradeLevels: JSON.stringify(["Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      yearsOfExperienceMin: 5,
      openingsCount: 1,
      employmentType: "Full-time",
      salaryMin: 60000,
      salaryMax: 85000,
      salaryNegotiable: 1,
      locationCity: "New Delhi",
      locationState: "Delhi",
      applicationDeadline: now + 86400000 * 14,
      expectedJoiningDate: "Immediate",
      benefits: JSON.stringify(["Competitive Bonus", "Housing Allowance", "Annual Leave Travel"]),
      contactInstructions: "Direct interview and demonstration lecture will follow initial screening.",
      status: "published",
      viewsCount: 220,
      createdAt: now - 86400000 * 6,
      updatedAt: now,
    },
    {
      id: job5Id,
      instituteId: inst3Id,
      title: "Physical Education Director & Sports Coach",
      description: "Lead our academy's sports curriculum, annual athletic meets, and inter-school basketball and athletics tournaments.",
      requiredQualifications: "M.P.Ed / B.P.Ed from a recognized university. National/State level participation is an advantage.",
      requiredSubjects: JSON.stringify(["Physical Education", "Sports & Athletics"]),
      gradeLevels: JSON.stringify(["Middle (Grades 6-8)", "Secondary (Grades 9-10)", "Senior Secondary (Grades 11-12)"]),
      yearsOfExperienceMin: 3,
      openingsCount: 1,
      employmentType: "Full-time",
      salaryMin: 35000,
      salaryMax: 50000,
      salaryNegotiable: 1,
      locationCity: "New Delhi",
      locationState: "Delhi",
      applicationDeadline: now + 86400000 * 35,
      expectedJoiningDate: "June 2026",
      benefits: JSON.stringify(["Sports Equipment Allowance", "Health Insurance"]),
      contactInstructions: "Apply via EduNexus with sports credentials.",
      status: "published",
      viewsCount: 75,
      createdAt: now - 86400000 * 2,
      updatedAt: now,
    },
    {
      id: job6Id,
      instituteId: inst4Id,
      title: "Middle School Science & Robotics Mentor",
      description: "Exciting opportunity at Heritage Global Academy to build young learners' passion for STEM, hands-on science experiments, and LEGO robotics.",
      requiredQualifications: "B.Sc/B.Tech with strong passion for STEM teaching. Experience with Arduino or LEGO Mindstorms is a plus.",
      requiredSubjects: JSON.stringify(["Science", "Robotics", "Physics"]),
      gradeLevels: JSON.stringify(["Middle (Grades 6-8)"]),
      yearsOfExperienceMin: 1,
      openingsCount: 2,
      employmentType: "Full-time",
      salaryMin: 38000,
      salaryMax: 50000,
      salaryNegotiable: 1,
      locationCity: "Hyderabad",
      locationState: "Telangana",
      applicationDeadline: now + 86400000 * 28,
      expectedJoiningDate: "Next Session",
      benefits: JSON.stringify(["Staff Transport", "Medical Cover"]),
      contactInstructions: "Submit your profile through EduNexus.",
      status: "published",
      viewsCount: 115,
      createdAt: now - 86400000 * 3,
      updatedAt: now,
    },
  ]);

  console.log("✓ Created 6 Job Vacancies across institutions");

  // 5. School Bus Marketplace Listings
  const bus1Id = "bus_001";
  const bus2Id = "bus_002";
  const bus3Id = "bus_003";
  const bus4Id = "bus_004";

  await db.insert(schema.busListings).values([
    {
      id: bus1Id,
      instituteId: inst1Id,
      title: "Tata Starbus Ultra 40-Seater AC School Bus (Single Owner)",
      manufacturer: "Tata",
      model: "Starbus Ultra 40S",
      manufacturingYear: 2021,
      registrationYear: 2021,
      registrationState: "KA (Karnataka)",
      askingPrice: 1650000,
      isNegotiable: 1,
      seatingCapacity: 40,
      fuelType: "Diesel",
      odometerKms: 42500,
      vehicleCondition: "Excellent",
      previousOwners: 1,
      locationCity: "Bengaluru",
      locationState: "Karnataka",
      description: "Institutional yellow school bus in immaculate condition. Equipped with AIS-140 GPS tracker, internal CCTV cameras, speed governor (40 km/h limited), fire extinguisher, first aid kit, and emergency exit door as per Supreme Court school bus guidelines.",
      maintenanceInfo: "Authorized Tata Motors service record throughout. New radial tyres fitted in Nov 2025. Fitness Certificate valid up to March 2027.",
      primaryImageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80",
      status: "published",
      viewsCount: 215,
      createdAt: now - 86400000 * 9,
      updatedAt: now,
    },
    {
      id: bus2Id,
      instituteId: inst2Id,
      title: "Eicher Skyline Pro 34-Seater Non-AC School Bus",
      manufacturer: "Eicher",
      model: "Skyline Pro 3009 L",
      manufacturingYear: 2019,
      registrationYear: 2019,
      registrationState: "MH (Maharashtra)",
      askingPrice: 1120000,
      isNegotiable: 1,
      seatingCapacity: 34,
      fuelType: "Diesel",
      odometerKms: 68000,
      vehicleCondition: "Good",
      previousOwners: 1,
      locationCity: "Mumbai",
      locationState: "Maharashtra",
      description: "Well-maintained institutional bus used exclusively for South Mumbai college students route. High back comfortable rexine seats with rack. Heavy-duty chassis, clean interior, all lights and safety alarms functional.",
      maintenanceInfo: "Regular service at Eicher authorised dealership. Insurance comprehensively covered until December 2026. PUC and green tax up to date.",
      primaryImageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
      status: "published",
      viewsCount: 178,
      createdAt: now - 86400000 * 14,
      updatedAt: now,
    },
    {
      id: bus3Id,
      instituteId: inst3Id,
      title: "Ashok Leyland Sunshine 50-Seater Eco-Friendly CNG Bus",
      manufacturer: "Ashok Leyland",
      model: "Sunshine CNG 50S",
      manufacturingYear: 2022,
      registrationYear: 2022,
      registrationState: "DL (Delhi)",
      askingPrice: 2100000,
      isNegotiable: 1,
      seatingCapacity: 50,
      fuelType: "CNG",
      odometerKms: 29800,
      vehicleCondition: "Excellent",
      previousOwners: 1,
      locationCity: "New Delhi",
      locationState: "Delhi",
      description: "Low-emission BS6 factory-fitted CNG school bus ideal for NCR regulations. Extra low entry step for junior students, tooth-guard padded seats, anti-skid vinyl flooring, full HD surveillance system with 30-day backup.",
      maintenanceInfo: "Complete OEM service logbook. Dual CNG cylinder hydrostatic testing verified. Transfer of ownership support provided directly by institution trust.",
      primaryImageUrl: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&auto=format&fit=crop&q=80",
      status: "published",
      viewsCount: 312,
      createdAt: now - 86400000 * 5,
      updatedAt: now,
    },
    {
      id: bus4Id,
      instituteId: inst1Id,
      title: "Force Traveller 26-Seater Mini School Van",
      manufacturer: "Force Motors",
      model: "Traveller School 3700",
      manufacturingYear: 2020,
      registrationYear: 2020,
      registrationState: "KA (Karnataka)",
      askingPrice: 980000,
      isNegotiable: 1,
      seatingCapacity: 26,
      fuelType: "Diesel",
      odometerKms: 51200,
      vehicleCondition: "Good",
      previousOwners: 1,
      locationCity: "Bengaluru",
      locationState: "Karnataka",
      description: "Compact and maneuverable school bus ideal for inner-city colony routes. FM2.6 CR ED engine with smooth power steering. Clean seat covers and full safety railings.",
      maintenanceInfo: "Maintained under AMC. Battery replaced 3 months ago. Ready for immediate deployment.",
      primaryImageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      status: "published",
      viewsCount: 145,
      createdAt: now - 86400000 * 2,
      updatedAt: now,
    },
  ]);

  // Additional images
  await db.insert(schema.busListingImages).values([
    { id: "bimg_001", busId: bus1Id, imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80", isPrimary: 1, createdAt: now },
    { id: "bimg_002", busId: bus1Id, imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80", isPrimary: 0, createdAt: now },
    { id: "bimg_003", busId: bus2Id, imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80", isPrimary: 1, createdAt: now },
    { id: "bimg_004", busId: bus3Id, imageUrl: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&auto=format&fit=crop&q=80", isPrimary: 1, createdAt: now },
    { id: "bimg_005", busId: bus4Id, imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80", isPrimary: 1, createdAt: now },
  ]);

  console.log("✓ Created 4 School Bus Listings with specs and photos");

  // 6. Applications, Saved Jobs & Inquiries
  await db.insert(schema.jobApplications).values([
    {
      id: "app_001",
      vacancyId: job1Id,
      teacherId: tProf1Id,
      coverLetter: "Dear Principal, I have over 8 years of proven experience in senior secondary CBSE mathematics. Having reviewed Greenwood's stellar curriculum, I believe my methodology aligns with your values. I would welcome the opportunity to interview.",
      resumeSnapshotUrl: "/uploads/resumes/sample_anjali_sharma_resume.pdf",
      status: "shortlisted",
      employerNotes: "Strong candidate with excellent board exam results. Called for interview next Tuesday.",
      createdAt: now - 86400000 * 5,
      updatedAt: now - 86400000 * 2,
    },
    {
      id: "app_002",
      vacancyId: job4Id,
      teacherId: tProf2Id,
      coverLetter: "Respected Academic Director, my coaching background at Allen coupled with school teaching ensures students grasp physical concepts intuitively.",
      resumeSnapshotUrl: "/uploads/resumes/sample_rajesh_verma_resume.pdf",
      status: "under_review",
      employerNotes: null,
      createdAt: now - 86400000 * 3,
      updatedAt: now,
    },
    {
      id: "app_003",
      vacancyId: job2Id,
      teacherId: tProf3Id,
      coverLetter: "I would love to contribute my creative writing workshops and speech mentoring to Greenwood International Primary Wing.",
      resumeSnapshotUrl: "/uploads/resumes/sample_priya_nair_resume.pdf",
      status: "submitted",
      employerNotes: null,
      createdAt: now - 86400000 * 1,
      updatedAt: now,
    },
  ]);

  await db.insert(schema.savedJobs).values([
    { id: "save_001", teacherId: tProf1Id, vacancyId: job3Id, createdAt: now - 86400000 * 4 },
    { id: "save_002", teacherId: tProf1Id, vacancyId: job4Id, createdAt: now - 86400000 * 3 },
    { id: "save_003", teacherId: tProf2Id, vacancyId: job1Id, createdAt: now - 86400000 * 2 },
  ]);

  await db.insert(schema.busInquiries).values([
    {
      id: "inq_001",
      busId: bus1Id,
      buyerUserId: instAdmin3Id,
      senderName: "Prof. Arvind Mehta",
      senderOrganization: "Delhi Academy of Sciences",
      senderPhone: "+91 11 2617 7300",
      senderEmail: "contact@delhiacademy.edu",
      message: "We are looking to acquire 2 buses for our suburban routes. Is this Tata Starbus available for physical inspection this weekend in Bengaluru?",
      status: "contacted",
      createdAt: now - 86400000 * 3,
    },
  ]);

  await db.insert(schema.notifications).values([
    {
      id: "notif_001",
      userId: teacher1Id,
      title: "Application Shortlisted!",
      message: "Greenwood International School has shortlisted your application for Senior PGT Mathematics Teacher.",
      link: "/dashboard/teacher/applications",
      isRead: 0,
      createdAt: now - 86400000 * 2,
    },
    {
      id: "notif_002",
      userId: instAdmin1Id,
      title: "New Application Received",
      message: "Anjali Sharma applied for Senior PGT Mathematics Teacher (Grades 11-12).",
      link: "/dashboard/institute/vacancies",
      isRead: 1,
      createdAt: now - 86400000 * 5,
    },
    {
      id: "notif_003",
      userId: instAdmin1Id,
      title: "New Bus Inquiry Received",
      message: "Delhi Academy of Sciences inquired about your Tata Starbus Ultra 40-Seater.",
      link: "/dashboard/institute/buses",
      isRead: 0,
      createdAt: now - 86400000 * 3,
    },
  ]);

  console.log("✓ Created Applications, Saved Jobs, Bus Inquiries, and Notifications");
  console.log("🎉 EduNexus database seed completed successfully!");
}

runSeed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
