import { client } from "./index";

export async function initDatabase() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      is_email_verified INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS teacher_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      headline TEXT,
      bio TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      is_phone_visible INTEGER NOT NULL DEFAULT 0,
      city TEXT,
      state TEXT,
      preferred_locations TEXT,
      highest_qualification TEXT,
      degrees TEXT,
      subjects TEXT NOT NULL DEFAULT '[]',
      grade_levels TEXT NOT NULL DEFAULT '[]',
      years_of_experience INTEGER NOT NULL DEFAULT 0,
      previous_institutes TEXT,
      languages TEXT DEFAULT '[]',
      employment_type_pref TEXT,
      expected_salary_min INTEGER,
      expected_salary_max INTEGER,
      resume_url TEXT,
      available_from TEXT,
      is_open_to_work INTEGER NOT NULL DEFAULT 0,
      is_public INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS institutes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL DEFAULT 'School',
      logo_url TEXT,
      cover_url TEXT,
      description TEXT,
      established_year INTEGER,
      address TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT,
      official_email TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      website_url TEXT,
      education_levels TEXT NOT NULL DEFAULT '[]',
      specializations TEXT NOT NULL DEFAULT '[]',
      verification_status TEXT NOT NULL DEFAULT 'pending',
      verification_notes TEXT,
      verified_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS institute_members (
      id TEXT PRIMARY KEY,
      institute_id TEXT NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS job_vacancies (
      id TEXT PRIMARY KEY,
      institute_id TEXT NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      required_qualifications TEXT NOT NULL,
      required_subjects TEXT NOT NULL DEFAULT '[]',
      grade_levels TEXT NOT NULL DEFAULT '[]',
      years_of_experience_min INTEGER NOT NULL DEFAULT 0,
      openings_count INTEGER NOT NULL DEFAULT 1,
      employment_type TEXT NOT NULL DEFAULT 'Full-time',
      salary_min INTEGER,
      salary_max INTEGER,
      salary_negotiable INTEGER NOT NULL DEFAULT 1,
      location_city TEXT NOT NULL,
      location_state TEXT NOT NULL,
      application_deadline INTEGER,
      expected_joining_date TEXT,
      benefits TEXT DEFAULT '[]',
      contact_instructions TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      views_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      vacancy_id TEXT NOT NULL REFERENCES job_vacancies(id) ON DELETE CASCADE,
      teacher_id TEXT NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
      cover_letter TEXT,
      resume_snapshot_url TEXT,
      status TEXT NOT NULL DEFAULT 'submitted',
      employer_notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_jobs (
      id TEXT PRIMARY KEY,
      teacher_id TEXT NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
      vacancy_id TEXT NOT NULL REFERENCES job_vacancies(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bus_listings (
      id TEXT PRIMARY KEY,
      institute_id TEXT NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      model TEXT NOT NULL,
      manufacturing_year INTEGER NOT NULL,
      registration_year INTEGER,
      registration_state TEXT NOT NULL,
      asking_price INTEGER NOT NULL,
      is_negotiable INTEGER NOT NULL DEFAULT 1,
      seating_capacity INTEGER NOT NULL,
      fuel_type TEXT NOT NULL DEFAULT 'Diesel',
      odometer_kms INTEGER NOT NULL,
      vehicle_condition TEXT NOT NULL DEFAULT 'Good',
      previous_owners INTEGER NOT NULL DEFAULT 1,
      location_city TEXT NOT NULL,
      location_state TEXT NOT NULL,
      description TEXT NOT NULL,
      maintenance_info TEXT,
      primary_image_url TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      views_count INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bus_listing_images (
      id TEXT PRIMARY KEY,
      bus_id TEXT NOT NULL REFERENCES bus_listings(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bus_inquiries (
      id TEXT PRIMARY KEY,
      bus_id TEXT NOT NULL REFERENCES bus_listings(id) ON DELETE CASCADE,
      buyer_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      sender_name TEXT NOT NULL,
      sender_organization TEXT NOT NULL,
      sender_phone TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at INTEGER NOT NULL
    );
  `);
}
