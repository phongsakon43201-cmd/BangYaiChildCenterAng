-- ==========================================================================
-- 🏫 ศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี (Child Center MIS)
-- 📜 Supabase Database Schema & Full Seed Data (Clean Slate & 100% Reset)
-- ==========================================================================
-- คำแนะนำ: คัดลอกโค้ดทั้งหมดนี้ ไปวางใน Supabase Dashboard -> SQL Editor แล้วกด RUN (Ctrl + Enter)

-- 1. EXTENSIONS SETUP
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 2. CLEAN DROP OLD TABLES (ล้างตารางเดิมทั้งหมดเพื่อเริ่มต้นใหม่อย่างสมบูรณ์)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.meal_plans CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.development_records CASCADE;
DROP TABLE IF EXISTS public.leave_requests CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.children CASCADE;
DROP TABLE IF EXISTS public.classrooms CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. CREATE PUBLIC TABLES (สร้างตารางข้อมูลระบบ)

-- ตารางข้อมูลโปรไฟล์ผู้ใช้งาน (รองรับ 23 บัญชีทางการ)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PARENT', 'TEACHER', 'EXECUTIVE')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางห้องเรียน
CREATE TABLE public.classrooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_name TEXT DEFAULT 'นางสาวกานดา ใจดี (ครูแก้ว)',
  student_count INT DEFAULT 20,
  line_group_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางข้อมูลนักเรียน (20 คน)
CREATE TABLE public.children (
  id TEXT PRIMARY KEY,
  class_id TEXT REFERENCES public.classrooms(id) ON DELETE SET NULL,
  parent_id UUID,
  national_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('ชาย', 'หญิง')),
  birth_date TEXT,
  age_string TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_relation TEXT,
  allergy TEXT DEFAULT 'ไม่มี',
  blood_type TEXT DEFAULT 'O',
  avatar_color TEXT DEFAULT '#4F46E5',
  height_cm NUMERIC(5,2) DEFAULT 92.0,
  weight_kg NUMERIC(5,2) DEFAULT 13.5,
  bmi NUMERIC(4,1) DEFAULT 15.9,
  growth_status TEXT DEFAULT 'สมส่วนตามเกณฑ์',
  vaccines TEXT[] DEFAULT ARRAY['BCG', 'คอกรน-บาดพยัก-โปลิโอ', 'MMR'],
  username TEXT,
  parent_line_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางการเช็กชื่อเข้าเรียนรายวัน
CREATE TABLE public.attendance (
  id TEXT PRIMARY KEY DEFAULT ('att-' || replace(gen_random_uuid()::text, '-', '')),
  child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PRESENT', 'LATE', 'LEAVE', 'ABSENT')),
  check_time TEXT,
  checked_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางคำขอแจ้งลา
CREATE TABLE public.leave_requests (
  id TEXT PRIMARY KEY DEFAULT ('leave-' || replace(gen_random_uuid()::text, '-', '')),
  child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
  child_name TEXT,
  parent_name TEXT,
  parent_id UUID,
  leave_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  remark TEXT,
  approved_by TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางบันทึกการประเมินพัฒนาการ 4 ด้าน
CREATE TABLE public.development_records (
  id TEXT PRIMARY KEY DEFAULT ('dev-' || replace(gen_random_uuid()::text, '-', '')),
  child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
  child_name TEXT,
  term TEXT DEFAULT '1/2569',
  eval_date TEXT,
  physical_score INT DEFAULT 4 CHECK (physical_score BETWEEN 1 AND 4),
  emotional_score INT DEFAULT 4 CHECK (emotional_score BETWEEN 1 AND 4),
  social_score INT DEFAULT 3 CHECK (social_score BETWEEN 1 AND 4),
  intellectual_score INT DEFAULT 4 CHECK (intellectual_score BETWEEN 1 AND 4),
  evaluator TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางประกาศข่าวสาร
CREATE TABLE public.announcements (
  id TEXT PRIMARY KEY DEFAULT ('news-' || replace(gen_random_uuid()::text, '-', '')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_class TEXT DEFAULT 'ALL',
  author TEXT,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางบันทึกกิจกรรมประจำวัน
CREATE TABLE public.activities (
  id TEXT PRIMARY KEY DEFAULT ('act-' || replace(gen_random_uuid()::text, '-', '')),
  title TEXT NOT NULL,
  description TEXT,
  class_id TEXT DEFAULT 'class-bm',
  date TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางรายการอาหารประจำวัน
CREATE TABLE public.meal_plans (
  id TEXT PRIMARY KEY DEFAULT ('meal-' || replace(gen_random_uuid()::text, '-', '')),
  date TEXT,
  day_of_week TEXT,
  breakfast TEXT,
  lunch TEXT,
  afternoon_snack TEXT,
  nutrition_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางบันทึกความปลอดภัยและการเข้าถึง (Audit Logs)
CREATE TABLE public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT ('log-' || replace(gen_random_uuid()::text, '-', '')),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS BYPASS / OPEN POLICIES (ปลดล็อกสิทธิ์ให้อ่าน-เขียนได้สะดวก ไม่มี Error 401/403)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.children DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;

-- 5. REALTIME REPLICATION (เปิดให้ซิงค์ข้อมูล Realtime ข้ามอุปกรณ์)
DO $$
BEGIN
  -- children
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'children') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.children';
  END IF;
  -- attendance
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'attendance') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance';
  END IF;
  -- leave_requests
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leave_requests') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_requests';
  END IF;
  -- development_records
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'development_records') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.development_records';
  END IF;
  -- announcements
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'announcements') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements';
  END IF;
  -- activities
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'activities') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.activities';
  END IF;
  -- audit_logs
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'audit_logs') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs';
  END IF;
END $$;

-- 6. AUTH USERS SEEDING (23 Official Accounts)
-- ลบ Users เดิมที่อาจค้างอยู่ใน auth.users
DELETE FROM auth.users WHERE email LIKE '%@bangyai.go.th';

-- Executives (ผู้บริหาร 2 ท่าน)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'by-exec01@bangyai.go.th', crypt('Exec01@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"EXECUTIVE","full_name":"นายสมศักดิ์ รักดี"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'by-exec02@bangyai.go.th', crypt('Exec02@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"EXECUTIVE","full_name":"นางสาววิภาดา พรหมณี"}'::jsonb, NOW(), NOW());

-- Teacher (ครูประจำชั้น 1 ท่าน)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'by-t01@bangyai.go.th', crypt('Kanda@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"TEACHER","full_name":"นางสาวกานดา ใจดี (ครูแก้ว)"}'::jsonb, NOW(), NOW());

-- Parents (ผู้ปกครอง 20 ท่าน)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'by-par01@bangyai.go.th', crypt('Par01@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายพัชรพล แสนเจริญ"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'by-par02@bangyai.go.th', crypt('Par02@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางสมพร โพธิ์ทอง"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'by-par03@bangyai.go.th', crypt('Par03@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายชาญชัย มงคลดี"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'by-par04@bangyai.go.th', crypt('Par04@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางสาวนภา วงศ์สว่าง"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'by-par05@bangyai.go.th', crypt('Par05@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายธนากร รัตนอุบล"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'by-par06@bangyai.go.th', crypt('Par06@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางวิไล เพิ่มพูน"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'f0000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'by-par07@bangyai.go.th', crypt('Par07@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายณัฐพล แก้วมณี"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'by-par08@bangyai.go.th', crypt('Par08@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางปรียา บุญมี"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000009', 'authenticated', 'authenticated', 'by-par09@bangyai.go.th', crypt('Par09@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายพงษ์เทพ แจ่มใส"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'by-par10@bangyai.go.th', crypt('Par10@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางพิศมัย เจริญสุข"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'by-par11@bangyai.go.th', crypt('Par11@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายภานุ สายชล"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000012', 'f0000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'by-par12@bangyai.go.th', crypt('Par12@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางมณีศรี สมบูรณ์"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000013', 'f0000000-0000-0000-0000-000000000013', 'authenticated', 'authenticated', 'by-par13@bangyai.go.th', crypt('Par13@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายวรวุฒิ เผ่าทอง"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000014', 'authenticated', 'authenticated', 'by-par14@bangyai.go.th', crypt('Par14@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางศิริพร รุ่งเรือง"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000015', 'authenticated', 'authenticated', 'by-par15@bangyai.go.th', crypt('Par15@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายอนุชา ประเสริฐ"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000016', 'authenticated', 'authenticated', 'by-par16@bangyai.go.th', crypt('Par16@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางอุมาพร มิ่งขวัญ"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000017', 'f0000000-0000-0000-0000-000000000017', 'authenticated', 'authenticated', 'by-par17@bangyai.go.th', crypt('Par17@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายกิตติ แสงสว่าง"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000018', 'f0000000-0000-0000-0000-000000000018', 'authenticated', 'authenticated', 'by-par18@bangyai.go.th', crypt('Par18@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางชลธิชา วงษ์ไทย"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000019', 'authenticated', 'authenticated', 'by-par19@bangyai.go.th', crypt('Par19@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นายณรงค์ สมบูรณ์"}'::jsonb, NOW(), NOW()),
('00000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000020', 'authenticated', 'authenticated', 'by-par20@bangyai.go.th', crypt('Par20@2026', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"role":"PARENT","full_name":"นางปานทิพย์ สุวรรณ"}'::jsonb, NOW(), NOW());

-- 7. IDENTITIES MAPPING
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id::text, id, format('{"sub":"%s","email":"%s"}', id, email)::jsonb, 'email', NOW(), NOW(), NOW()
FROM auth.users 
WHERE email LIKE '%@bangyai.go.th';

-- 8. PUBLIC PROFILES SEEDING
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, (raw_user_meta_data->>'full_name'), (raw_user_meta_data->>'role')
FROM auth.users
WHERE email LIKE '%@bangyai.go.th';

-- 9. CLASSROOM SEEDING
INSERT INTO public.classrooms (id, name, teacher_name, student_count)
VALUES ('class-bm', 'ห้อง "ลูกหมีน่ารัก" (กลุ่มเตรียมความพร้อม อายุ 2-3 ขวบ)', 'นางสาวกานดา ใจดี (ครูแก้ว)', 20);

-- 10. CHILDREN SEEDING (20 นักเรียน ครบถ้วนตรงตามเอกสารวิจัย 100%)
INSERT INTO public.children (id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy, blood_type, avatar_color, height_cm, weight_kg, bmi, growth_status, username, parent_line_id)
SELECT 
  v.id, 'class-bm', (SELECT id FROM public.profiles WHERE email = (v.username_lower || '@bangyai.go.th')),
  v.national_id, v.first_name, v.last_name, v.nickname, v.gender, v.age_string, v.parent_name, v.parent_phone, v.parent_relation, v.allergy, v.blood_type, v.avatar_color, v.height_cm, v.weight_kg, v.bmi, v.growth_status, v.username, v.parent_line_id
FROM (
  VALUES
    ('STD-01', '1-1002-00101-01-1', 'ณัฐธีร์', 'แสนเจริญ', 'น้องโต้', 'ชาย', '2 ขวบ 6 เดือน', 'นายพัชรพล แสนเจริญ', '081-001-0001', 'บิดา', 'ไม่มี', 'O', '#4F46E5', 92.0, 13.5, 15.9, 'สมส่วนตามเกณฑ์', 'BY-PAR01', 'by-par01', 'U4c8e56010b4418f615ba32341dab6a93'),
    ('STD-02', '1-1002-00101-02-2', 'กัญญารัตน์', 'โพธิ์ทอง', 'น้องแก้ม', 'หญิง', '2 ขวบ 7 เดือน', 'นางสมพร โพธิ์ทอง', '081-001-0002', 'มารดา', 'ไม่มี', 'A', '#EC4899', 90.5, 12.8, 15.6, 'สมส่วนตามเกณฑ์', 'BY-PAR02', 'by-par02', 'U97dc0505bb590d70c66d401224a422db'),
    ('STD-03', '1-1002-00101-03-3', 'ชยพล', 'มงคลดี', 'น้องพอล', 'ชาย', '2 ขวบ 5 เดือน', 'นายชาญชัย มงคลดี', '081-001-0003', 'บิดา', 'ไม่มี', 'B', '#10B981', 91.0, 13.2, 15.9, 'สมส่วนตามเกณฑ์', 'BY-PAR03', 'by-par03', NULL),
    ('STD-04', '1-1002-00101-04-4', 'ณิชาภัทร', 'วงศ์สว่าง', 'น้องณิชา', 'หญิง', '2 ขวบ 4 เดือน', 'นางสาวนภา วงศ์สว่าง', '081-001-0004', 'มารดา', 'ไม่มี', 'AB', '#F59E0B', 89.5, 12.5, 15.6, 'สมส่วนตามเกณฑ์', 'BY-PAR04', 'by-par04', NULL),
    ('STD-05', '1-1002-00101-05-5', 'ธนกฤต', 'รัตนอุบล', 'น้องคุณ', 'ชาย', '2 ขวบ 6 เดือน', 'นายธนากร รัตนอุบล', '081-001-0005', 'บิดา', 'ไม่มี', 'O', '#6366F1', 93.0, 14.0, 16.2, 'สมส่วนตามเกณฑ์', 'BY-PAR05', 'by-par05', NULL),
    ('STD-06', '1-1002-00101-06-6', 'ธันย์ชนก', 'เพิ่มพูน', 'น้องวาฬ', 'หญิง', '2 ขวบ 3 เดือน', 'นางวิไล เพิ่มพูน', '081-001-0006', 'มารดา', 'ไม่มี', 'A', '#8B5CF6', 88.5, 12.0, 15.3, 'สมส่วนตามเกณฑ์', 'BY-PAR06', 'by-par06', NULL),
    ('STD-07', '1-1002-00101-07-7', 'นพณัฐ', 'แก้วมณี', 'น้องนัท', 'ชาย', '2 ขวบ 7 เดือน', 'นายณัฐพล แก้วมณี', '081-001-0007', 'บิดา', 'ไม่มี', 'B', '#3B82F6', 92.5, 13.8, 16.1, 'สมส่วนตามเกณฑ์', 'BY-PAR07', 'by-par07', NULL),
    ('STD-08', '1-1002-00101-08-8', 'ปรินดา', 'บุญมี', 'น้องปาน', 'หญิง', '2 ขวบ 5 เดือน', 'นางปรียา บุญมี', '081-001-0008', 'มารดา', 'ไม่มี', 'AB', '#EC4899', 90.0, 12.6, 15.6, 'สมส่วนตามเกณฑ์', 'BY-PAR08', 'by-par08', NULL),
    ('STD-09', '1-1002-00101-09-9', 'พงศกร', 'แจ่มใส', 'น้องป๋อ', 'ชาย', '2 ขวบ 4 เดือน', 'นายพงษ์เทพ แจ่มใส', '081-001-0009', 'บิดา', 'ไม่มี', 'O', '#10B981', 91.5, 13.4, 16.0, 'สมส่วนตามเกณฑ์', 'BY-PAR09', 'by-par09', NULL),
    ('STD-10', '1-1002-00101-10-0', 'พิชญา', 'เจริญสุข', 'น้องพาย', 'หญิง', '2 ขวบ 6 เดือน', 'นางพิศมัย เจริญสุข', '081-001-0010', 'มารดา', 'ไม่มี', 'A', '#F59E0B', 89.0, 12.3, 15.5, 'สมส่วนตามเกณฑ์', 'BY-PAR10', 'by-par10', NULL),
    ('STD-11', '1-1002-00101-11-1', 'ภัทรดนัย', 'สายชล', 'น้องภีม', 'ชาย', '2 ขวบ 7 เดือน', 'นายภานุ สายชล', '081-001-0011', 'บิดา', 'ไม่มี', 'B', '#6366F1', 93.5, 14.2, 16.2, 'สมส่วนตามเกณฑ์', 'BY-PAR11', 'by-par11', NULL),
    ('STD-12', '1-1002-00101-12-2', 'มลนภัส', 'ศรีสมบูรณ์', 'น้องโมเม', 'หญิง', '2 ขวบ 5 เดือน', 'นางมณีศรี สมบูรณ์', '081-001-0012', 'มารดา', 'ไม่มี', 'O', '#8B5CF6', 90.2, 12.7, 15.6, 'สมส่วนตามเกณฑ์', 'BY-PAR12', 'by-par12', NULL),
    ('STD-13', '1-1002-00101-13-3', 'วรภพ', 'เผ่าทอง', 'น้องภพ', 'ชาย', '2 ขวบ 3 เดือน', 'นายวรวุฒิ เผ่าทอง', '081-001-0013', 'บิดา', 'ไม่มี', 'A', '#3B82F6', 91.0, 13.0, 15.7, 'สมส่วนตามเกณฑ์', 'BY-PAR13', 'by-par13', NULL),
    ('STD-14', '1-1002-00101-14-4', 'ศุภิสรา', 'รุ่งเรือง', 'น้องมายด์', 'หญิง', '2 ขวบ 4 เดือน', 'นางศิริพร รุ่งเรือง', '081-001-0014', 'มารดา', 'ไม่มี', 'B', '#EC4899', 89.8, 12.4, 15.4, 'สมส่วนตามเกณฑ์', 'BY-PAR14', 'by-par14', NULL),
    ('STD-15', '1-1002-00101-15-5', 'อัครวินท์', 'ประเสริฐ', 'น้องอ๋อง', 'ชาย', '2 ขวบ 6 เดือน', 'นายอนุชา ประเสริฐ', '081-001-0015', 'บิดา', 'ไม่มี', 'O', '#10B981', 92.8, 13.9, 16.1, 'สมส่วนตามเกณฑ์', 'BY-PAR15', 'by-par15', NULL),
    ('STD-16', '1-1002-00101-16-6', 'อัญชิสา', 'มิ่งขวัญ', 'น้องเอม', 'หญิง', '2 ขวบ 5 เดือน', 'นางอุมาพร มิ่งขวัญ', '081-001-0016', 'มารดา', 'ไม่มี', 'A', '#F59E0B', 89.2, 12.2, 15.3, 'สมส่วนตามเกณฑ์', 'BY-PAR16', 'by-par16', NULL),
    ('STD-17', '1-1002-00101-17-7', 'กิตติภพ', 'แสงสว่าง', 'น้องกิต', 'ชาย', '2 ขวบ 7 เดือน', 'นายกิตติ แสงสว่าง', '081-001-0017', 'บิดา', 'ไม่มี', 'B', '#6366F1', 93.2, 14.1, 16.2, 'สมส่วนตามเกณฑ์', 'BY-PAR17', 'by-par17', NULL),
    ('STD-18', '1-1002-00101-18-8', 'ชนกนันท์', 'วงษ์ไทย', 'น้องชาเนล', 'หญิง', '2 ขวบ 4 เดือน', 'นางชลธิชา วงษ์ไทย', '081-001-0018', 'มารดา', 'ไม่มี', 'AB', '#8B5CF6', 88.8, 12.1, 15.3, 'สมส่วนตามเกณฑ์', 'BY-PAR18', 'by-par18', NULL),
    ('STD-19', '1-1002-00101-19-9', 'ณัฐดนัย', 'สมบูรณ์', 'น้องดนัย', 'ชาย', '2 ขวบ 6 เดือน', 'นายณรงค์ สมบูรณ์', '081-001-0019', 'บิดา', 'ไม่มี', 'O', '#3B82F6', 92.1, 13.6, 16.0, 'สมส่วนตามเกณฑ์', 'BY-PAR19', 'by-par19', NULL),
    ('STD-20', '1-1002-00101-20-0', 'ปัณฑน์รี', 'สุวรรณ', 'น้องปันปัน', 'หญิง', '2 ขวบ 5 เดือน', 'นางปานทิพย์ สุวรรณ', '081-001-0020', 'มารดา', 'ไม่มี', 'A', '#EC4899', 90.6, 12.9, 15.7, 'สมส่วนตามเกณฑ์', 'BY-PAR20', 'by-par20', NULL)
) AS v(id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy, blood_type, avatar_color, height_cm, weight_kg, bmi, growth_status, username, username_lower, parent_line_id);

-- 11. INITIAL SAMPLE DATA SEEDING (Attendance, Leave Requests, Development, Announcements, Meals, Activities, Logs)

-- Attendance Sample
INSERT INTO public.attendance (id, child_id, date, status, check_time, checked_by)
VALUES ('att-1', 'STD-03', TO_CHAR(NOW() + INTERVAL '543 years', 'YYYY-MM-DD'), 'LEAVE', '08:00 น.', 'ระบบ (ผู้ปกครองแจ้งลา)');

-- Leave Requests Sample
INSERT INTO public.leave_requests (id, child_id, child_name, parent_name, leave_type, start_date, end_date, reason, status, approved_by, remark, submitted_at)
VALUES (
  'leave-1', 
  'STD-03', 
  'น้องพอล (ด.ช. ชยพล มงคลดี)', 
  'นายชาญชัย มงคลดี', 
  'ลาป่วย', 
  TO_CHAR(NOW() + INTERVAL '543 years', 'YYYY-MM-DD'), 
  TO_CHAR(NOW() + INTERVAL '543 years' + INTERVAL '1 day', 'YYYY-MM-DD'), 
  'น้องมีอาการเป็นไข้สูง ต้องไปพบแพทย์ที่ รพ.บางใหญ่', 
  'APPROVED', 
  'นางสาวกานดา ใจดี (ครูแก้ว)', 
  'รับทราบค่ะ ขอให้น้องหายไวๆ นะคะ',
  NOW()
);

-- Development Records Sample (สำหรับทั้ง 20 คน)
INSERT INTO public.development_records (id, child_id, child_name, term, eval_date, physical_score, emotional_score, social_score, intellectual_score, evaluator, notes)
SELECT 
  'dev-' || c.id,
  c.id,
  c.nickname || ' (ด.' || (CASE WHEN c.gender = 'ชาย' THEN 'ช. ' ELSE 'ญ. ' END) || c.first_name || ' ' || c.last_name || ')',
  '1/2569',
  TO_CHAR(NOW() + INTERVAL '543 years', 'YYYY-MM-DD'),
  4, 4, 3, 4,
  'นางสาวกานดา ใจดี (ครูแก้ว)',
  'เด็กมีความคล่องแคล่วในการเคลื่อนไหว ร่าเริงแจ่มใส มีมนุษยสัมพันธ์ดี สมวัย'
FROM public.children c;

-- Announcements Sample
INSERT INTO public.announcements (id, title, content, target_class, author, pinned)
VALUES (
  'news-1',
  'แจ้งการให้บริการฉีดวัคซีนป้องกันไข้หวัดใหญ่ประจำปี',
  'ศูนย์พัฒนาเด็กเล็กเทศบาลบางใหญ่ ขอเชิญชวนผู้ปกครองนำบุตรหลานเข้ารับการฉีดวัคซีนในวันศุกร์ที่ 15 สิงหาคม 2569 เวลา 09:00 - 12:00 น.',
  'ALL',
  'กองการศึกษา เทศบาลบางใหญ่',
  true
);

-- Daily Activities Sample
INSERT INTO public.activities (id, title, description, class_id, date, image)
VALUES (
  'act-1',
  'กิจกรรมศิลปะสร้างสรรค์ "ระบายสีภาพในฝัน"',
  'เด็กๆ ห้องลูกหมีน่ารัก ร่วมกันใช้นิ้วมือและสีน้ำระบายสีอย่างสนุกสนาน ช่วยฝึกกล้ามเนื้อมัดเล็กและจินตนาการ',
  'class-bm',
  TO_CHAR(NOW() + INTERVAL '543 years', 'YYYY-MM-DD'),
  './assets/images/banner.png'
);

-- Meal Plan Sample
INSERT INTO public.meal_plans (id, date, day_of_week, breakfast, lunch, afternoon_snack, nutrition_note)
VALUES (
  'meal-1',
  TO_CHAR(NOW() + INTERVAL '543 years', 'YYYY-MM-DD'),
  'วันจันทร์',
  'ข้าวต้มหมูสับใส่กล่อง + นมพาสเจอร์ไรส์รสจืด',
  'ข้าวสวย + ต้มจืดฟักใส่ไก่ + ผัดบล็อคโคลี่หมูสับ',
  'กล้วยน้ำว้าสุก + นมถั่วเหลือง',
  'ได้รับสารอาหารครบ 5 หมู่ พลังงาน 1,200 Kcal'
);

-- Audit Log Sample
INSERT INTO public.audit_logs (id, user_name, action, details)
VALUES ('log-1', 'ระบบสารสนเทศศูนย์ฯ (SYSTEM)', 'DATABASE_RESET_AND_INIT', 'รีเซ็ตและติดตั้งฐานข้อมูลโครงสร้างใหม่สมบูรณ์แบบ 100%');

-- ✅ สิ้นสุดการติดตั้ง (DATABASE READY 100%)
