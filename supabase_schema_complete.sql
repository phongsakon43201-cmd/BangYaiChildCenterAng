-- ==========================================================================
-- 🏫 ศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี (Child Center MIS)
-- 📜 Supabase Database Schema & Seed Data (ฉบับแก้ไข Generated Column)
-- ==========================================================================

-- 1. EXTENSIONS SETUP
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 2. PUBLIC TABLES CREATION (สร้างตารางข้อมูลระบบ)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PARENT', 'TEACHER', 'EXECUTIVE')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.classrooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id),
  student_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.children (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES public.classrooms(id),
  parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  national_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('ชาย', 'หญิง')),
  birth_date DATE,
  age_string TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_relation TEXT,
  allergy TEXT DEFAULT 'ไม่มี',
  blood_type TEXT DEFAULT 'O',
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  growth_status TEXT DEFAULT 'สมส่วนตามเกณฑ์',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('PRESENT', 'LATE', 'LEAVE', 'ABSENT')),
  check_time TEXT,
  checked_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.profiles(id),
  leave_type TEXT NOT NULL CHECK (leave_type IN ('ลาป่วย', 'ลากิจจำเป็น', 'ลาอื่นๆ')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  remark TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.development_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
  term TEXT DEFAULT '1/2569',
  physical_score INT CHECK (physical_score BETWEEN 1 AND 5),
  emotional_score INT CHECK (emotional_score BETWEEN 1 AND 5),
  social_score INT CHECK (social_score BETWEEN 1 AND 5),
  intellectual_score INT CHECK (intellectual_score BETWEEN 1 AND 5),
  evaluator TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS POLICIES)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Parents view own children strictly" ON public.children
    FOR SELECT USING (
      parent_id = auth.uid() 
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('TEACHER', 'EXECUTIVE'))
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. AUTH USERS SEEDING

-- ผู้ปกครอง (Parent)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated', 'parent@bangyai.go.th',
  crypt('1234', gen_salt('bf')), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"PARENT","full_name":"คุณวรรณา สมบูรณ์"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'parent@bangyai.go.th');

-- ครู (Teacher)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'b2222222-2222-2222-2222-222222222222',
  'authenticated', 'authenticated', 'teacher@bangyai.go.th',
  crypt('1234', gen_salt('bf')), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"TEACHER","full_name":"คุณครู สมศรี มีสุข"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'teacher@bangyai.go.th');

-- ผู้บริหาร (Executive)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'c3333333-3333-3333-3333-333333333333',
  'authenticated', 'authenticated', 'executive@bangyai.go.th',
  crypt('1234', gen_salt('bf')), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"EXECUTIVE","full_name":"นายสมชาย ใจดี"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'executive@bangyai.go.th');

-- 5. IDENTITIES MAPPING (ตัดคอลัมน์ email ออกเพราะเป็น Generated Column)
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  id::text,
  id,
  format('{"sub":"%s","email":"%s"}', id, email)::jsonb,
  'email',
  NOW(),
  NOW(),
  NOW()
FROM auth.users 
WHERE email IN ('parent@bangyai.go.th', 'teacher@bangyai.go.th', 'executive@bangyai.go.th')
  AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = auth.users.id);

-- 6. PUBLIC PROFILES
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 'a1111111-1111-1111-1111-111111111111', 'parent@bangyai.go.th', 'คุณวรรณา สมบูรณ์', 'PARENT'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'a1111111-1111-1111-1111-111111111111');

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 'b2222222-2222-2222-2222-222222222222', 'teacher@bangyai.go.th', 'คุณครู สมศรี มีสุข', 'TEACHER'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'b2222222-2222-2222-2222-222222222222');

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 'c3333333-3333-3333-3333-333333333333', 'executive@bangyai.go.th', 'นายสมชาย ใจดี', 'EXECUTIVE'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'c3333333-3333-3333-3333-333333333333');

-- 7. CLASSROOMS & CHILDREN
INSERT INTO public.classrooms (id, name, student_count)
SELECT 'class-1', 'ห้องเตรียมอนุบาล (2-3 ขวบ)', 15 WHERE NOT EXISTS (SELECT 1 FROM public.classrooms WHERE id = 'class-1');
INSERT INTO public.classrooms (id, name, student_count)
SELECT 'class-2', 'ห้องอนุบาล 1/1 (3-4 ขวบ)', 18 WHERE NOT EXISTS (SELECT 1 FROM public.classrooms WHERE id = 'class-2');
INSERT INTO public.classrooms (id, name, student_count)
SELECT 'class-3', 'ห้องอนุบาล 1/2 (3-4 ขวบ)', 17 WHERE NOT EXISTS (SELECT 1 FROM public.classrooms WHERE id = 'class-3');

INSERT INTO public.children (
  id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy
)
SELECT 
  'child-101', 'class-2', 'a1111111-1111-1111-1111-111111111111',
  '1-1002-00345-67-8', 'ปัณณธร', 'วิสุทธิ์อัมพร', 'น้องโปรด', 'ชาย',
  '3 ขวบ 5 เดือน', 'คุณวรรณา สมบูรณ์', '081-234-5678', 'มารดา', 'ไม่มี'
WHERE NOT EXISTS (SELECT 1 FROM public.children WHERE id = 'child-101');
