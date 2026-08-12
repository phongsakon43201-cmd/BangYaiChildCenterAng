-- ==========================================================================
-- 🏫 ศูนย์พัฒนาเด็กเล็ก เทศบาลบางใหญ่ จังหวัดนนทบุรี (Child Center MIS)
-- 📜 Supabase Database Schema & Seed Data (ข้อมูลจริง 23 บัญชีผู้ใช้ และ 20 นักเรียน)
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
  line_group_id TEXT,
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

-- 4. AUTH USERS SEEDING (23 Official Accounts)

-- Executives (ผู้บริหาร 2 ท่าน)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'by-exec01@bangyai.go.th', crypt('Exec01@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"EXECUTIVE","full_name":"นายสมศักดิ์ รักดี"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-exec01@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'by-exec02@bangyai.go.th', crypt('Exec02@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"EXECUTIVE","full_name":"นางสาววิภาดา พรหมณี"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-exec02@bangyai.go.th');

-- Teacher (ครูประจำชั้น 1 ท่าน)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'by-t01@bangyai.go.th', crypt('Kanda@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"TEACHER","full_name":"นางสาวกานดา ใจดี"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-t01@bangyai.go.th');

-- Parents (ผู้ปกครอง 20 ท่าน: by-par01@bangyai.go.th - by-par20@bangyai.go.th)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'by-par01@bangyai.go.th', crypt('Par01@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายวิทวัส สุขเสริฐ"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par01@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'by-par02@bangyai.go.th', crypt('Par02@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางสมพร โพธิ์ทอง"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par02@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'by-par03@bangyai.go.th', crypt('Par03@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายชาญชัย มงคลดี"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par03@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'by-par04@bangyai.go.th', crypt('Par04@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางสาวนภา วงศ์สว่าง"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par04@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'by-par05@bangyai.go.th', crypt('Par05@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายธนากร รัตนอุบล"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par05@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'by-par06@bangyai.go.th', crypt('Par06@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางวิไล เพิ่มพูน"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par06@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'by-par07@bangyai.go.th', crypt('Par07@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายณัฐพล แก้วมณี"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par07@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'by-par08@bangyai.go.th', crypt('Par08@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางปรียา บุญมี"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par08@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000009', 'authenticated', 'authenticated', 'by-par09@bangyai.go.th', crypt('Par09@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายพงษ์เทพ แจ่มใส"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par09@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'by-par10@bangyai.go.th', crypt('Par10@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางพิศมัย เจริญสุข"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par10@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'by-par11@bangyai.go.th', crypt('Par11@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายภานุ สายชล"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par11@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'by-par12@bangyai.go.th', crypt('Par12@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางมณีศรี สมบูรณ์"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par12@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000013', 'authenticated', 'authenticated', 'by-par13@bangyai.go.th', crypt('Par13@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายวรวุฒิ เผ่าทอง"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par13@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000014', 'authenticated', 'authenticated', 'by-par14@bangyai.go.th', crypt('Par14@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางศิริพร รุ่งเรือง"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par14@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000015', 'authenticated', 'authenticated', 'by-par15@bangyai.go.th', crypt('Par15@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายอนุชา ประเสริฐ"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par15@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000016', 'authenticated', 'authenticated', 'by-par16@bangyai.go.th', crypt('Par16@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางอุมาพร มิ่งขวัญ"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par16@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000017', 'authenticated', 'authenticated', 'by-par17@bangyai.go.th', crypt('Par17@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายกิตติ แสงสว่าง"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par17@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000018', 'authenticated', 'authenticated', 'by-par18@bangyai.go.th', crypt('Par18@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางชลธิชา วงษ์ไทย"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par18@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000019', 'authenticated', 'authenticated', 'by-par19@bangyai.go.th', crypt('Par19@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายณรงค์ สมบูรณ์"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par19@bangyai.go.th');

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000020', 'authenticated', 'authenticated', 'by-par20@bangyai.go.th', crypt('Par20@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางปานทิพย์ สุวรรณ"}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'by-par20@bangyai.go.th');

-- 5. IDENTITIES MAPPING
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id::text, id, format('{"sub":"%s","email":"%s"}', id, email)::jsonb, 'email', NOW(), NOW(), NOW()
FROM auth.users 
WHERE email LIKE '%@bangyai.go.th'
  AND NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = auth.users.id);

-- 6. PUBLIC PROFILES
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, (raw_user_meta_data->>'full_name'), (raw_user_meta_data->>'role')
FROM auth.users
WHERE email LIKE '%@bangyai.go.th'
  AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.users.id);

-- 7. CLASSROOM & 20 CHILDREN SEED DATA
INSERT INTO public.classrooms (id, name, student_count)
SELECT 'class-bm', 'ห้อง "ลูกหมีน่ารัก" (กลุ่มเตรียมความพร้อม อายุ 2-3 ขวบ)', 20
WHERE NOT EXISTS (SELECT 1 FROM public.classrooms WHERE id = 'class-bm');

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-01', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par01@bangyai.go.th'), '1-1002-00101-01-1', 'กวินท์', 'สุขเสริฐ', 'วิน', 'ชาย', '2 ขวบ 6 เดือน', 'นายวิทวัส สุขเสริฐ', '081-001-0001', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-02', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par02@bangyai.go.th'), '1-1002-00101-02-2', 'กัญญารัตน์', 'โพธิ์ทอง', 'แก้ม', 'หญิง', '2 ขวบ 7 เดือน', 'นางสมพร โพธิ์ทอง', '081-001-0002', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-03', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par03@bangyai.go.th'), '1-1002-00101-03-3', 'ชยพล', 'มงคลดี', 'พอล', 'ชาย', '2 ขวบ 5 เดือน', 'นายชาญชัย มงคลดี', '081-001-0003', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-04', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par04@bangyai.go.th'), '1-1002-00101-04-4', 'ณิชาภัทร', 'วงศ์สว่าง', 'ณิชา', 'หญิง', '2 ขวบ 4 เดือน', 'นางสาวนภา วงศ์สว่าง', '081-001-0004', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-05', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par05@bangyai.go.th'), '1-1002-00101-05-5', 'ธนกฤต', 'รัตนอุบล', 'คุณ', 'ชาย', '2 ขวบ 6 เดือน', 'นายธนากร รัตนอุบล', '081-001-0005', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-06', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par06@bangyai.go.th'), '1-1002-00101-06-6', 'ธันย์ชนก', 'เพิ่มพูน', 'วาฬ', 'หญิง', '2 ขวบ 3 เดือน', 'นางวิไล เพิ่มพูน', '081-001-0006', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-07', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par07@bangyai.go.th'), '1-1002-00101-07-7', 'นพณัฐ', 'แก้วมณี', 'นัท', 'ชาย', '2 ขวบ 7 เดือน', 'นายณัฐพล แก้วมณี', '081-001-0007', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-08', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par08@bangyai.go.th'), '1-1002-00101-08-8', 'ปรินดา', 'บุญมี', 'ปาน', 'หญิง', '2 ขวบ 5 เดือน', 'นางปรียา บุญมี', '081-001-0008', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-09', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par09@bangyai.go.th'), '1-1002-00101-09-9', 'พงศกร', 'แจ่มใส', 'ป๋อ', 'ชาย', '2 ขวบ 4 เดือน', 'นายพงษ์เทพ แจ่มใส', '081-001-0009', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-10', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par10@bangyai.go.th'), '1-1002-00101-10-0', 'พิชญา', 'เจริญสุข', 'พาย', 'หญิง', '2 ขวบ 6 เดือน', 'นางพิศมัย เจริญสุข', '081-001-0010', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-11', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par11@bangyai.go.th'), '1-1002-00101-11-1', 'ภัทรดนัย', 'สายชล', 'ภีม', 'ชาย', '2 ขวบ 7 เดือน', 'นายภานุ สายชล', '081-001-0011', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-12', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par12@bangyai.go.th'), '1-1002-00101-12-2', 'มลนภัส', 'ศรีสมบูรณ์', 'โมเม', 'หญิง', '2 ขวบ 5 เดือน', 'นางมณีศรี สมบูรณ์', '081-001-0012', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-13', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par13@bangyai.go.th'), '1-1002-00101-13-3', 'วรภพ', 'เผ่าทอง', 'ภพ', 'ชาย', '2 ขวบ 3 เดือน', 'นายวรวุฒิ เผ่าทอง', '081-001-0013', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-14', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par14@bangyai.go.th'), '1-1002-00101-14-4', 'ศุภิสรา', 'รุ่งเรือง', 'มายด์', 'หญิง', '2 ขวบ 4 เดือน', 'นางศิริพร รุ่งเรือง', '081-001-0014', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-15', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par15@bangyai.go.th'), '1-1002-00101-15-5', 'อัครวินท์', 'ประเสริฐ', 'อ๋อง', 'ชาย', '2 ขวบ 6 เดือน', 'นายอนุชา ประเสริฐ', '081-001-0015', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-16', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par16@bangyai.go.th'), '1-1002-00101-16-6', 'อัญชิสา', 'มิ่งขวัญ', 'เอม', 'หญิง', '2 ขวบ 5 เดือน', 'นางอุมาพร มิ่งขวัญ', '081-001-0016', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-17', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par17@bangyai.go.th'), '1-1002-00101-17-7', 'กิตติภพ', 'แสงสว่าง', 'กิต', 'ชาย', '2 ขวบ 7 เดือน', 'นายกิตติ แสงสว่าง', '081-001-0017', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-18', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par18@bangyai.go.th'), '1-1002-00101-18-8', 'ชนกนันท์', 'วงษ์ไทย', 'ชาเนล', 'หญิง', '2 ขวบ 4 เดือน', 'นางชลธิชา วงษ์ไทย', '081-001-0018', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-19', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par19@bangyai.go.th'), '1-1002-00101-19-9', 'ณัฐดนัย', 'สมบูรณ์', 'ดนัย', 'ชาย', '2 ขวบ 6 เดือน', 'นายณรงค์ สมบูรณ์', '081-001-0019', 'บิดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;

INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy)
SELECT 'STD-20', 'class-bm', (SELECT id FROM public.profiles WHERE email = 'by-par20@bangyai.go.th'), '1-1002-00101-20-0', 'ปัณฑน์รี', 'สุวรรณ', 'ปันปัน', 'หญิง', '2 ขวบ 5 เดือน', 'นางปานทิพย์ สุวรรณ', '081-001-0020', 'มารดา', 'ไม่มี'
ON CONFLICT (id) DO UPDATE SET class_id = EXCLUDED.class_id, parent_id = EXCLUDED.parent_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, nickname = EXCLUDED.nickname, parent_name = EXCLUDED.parent_name;
