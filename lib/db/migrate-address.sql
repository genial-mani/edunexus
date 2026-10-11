-- Migration: Add granular address fields to teacher_profiles, institutes, job_vacancies, bus_listings

ALTER TABLE teacher_profiles ADD COLUMN district TEXT;
ALTER TABLE teacher_profiles ADD COLUMN mandal TEXT;
ALTER TABLE teacher_profiles ADD COLUMN pincode TEXT;

ALTER TABLE institutes ADD COLUMN district TEXT;
ALTER TABLE institutes ADD COLUMN mandal TEXT;

ALTER TABLE job_vacancies ADD COLUMN district TEXT;
ALTER TABLE job_vacancies ADD COLUMN mandal TEXT;
ALTER TABLE job_vacancies ADD COLUMN pincode TEXT;

ALTER TABLE bus_listings ADD COLUMN district TEXT;
ALTER TABLE bus_listings ADD COLUMN mandal TEXT;
ALTER TABLE bus_listings ADD COLUMN pincode TEXT;
