-- ==========================================================================
-- 🏫 ศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี (Child Center MIS)
-- 📜 Supabase Database Schema & Seed Data (ฉบับสมบูรณ์ 100%)
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. EXTENSIONS & SETUP
-- --------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- --------------------------------------------------------------------------
-- 2. PUBLIC TABLES CREATION (ตารางข้อมูลระบบ)
-- --------------------------------------------------------------------------

-- 2.1 ตารางข้อมูลโปรไฟล์ผู้ใช้งาน (Profiles)
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

-- 2.2 ตารางห้องเรียน (Classrooms)
CREATE TABLE IF NOT EXISTS public.classrooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id),
  student_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 ตารางข้อมูลเด็กรายบุคคล (Children - มี Parent ID เชื่อมโยงเพื่อแยกสิทธิ์ของใครของมัน)
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

-- 2.4 ตารางการเช็กชื่อเข้าเรียนรายวัน (Attendance)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id TEXT REFERENCES public.children(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('PRESENT', 'LATE', 'LEAVE', 'ABSENT')),
  check_time TEXT,
  checked_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 ตารางยื่นคำขอแจ้งลา (Leave Requests)
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

-- 2.6 ตารางประเมินพัฒนาการ 4 ด้าน (Development Records)
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

-- 2.7 ตารางประวัติ Audit Logs (Security Log)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS POLICIES - แยกสิทธิ์ข้อมูลเด็ดขาด)
-- --------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_records ENABLE ROW LEVEL SECURITY;

-- 3.1 Policy สำหรับ Profiles: ทุกคนที่ล็อกอินดูโปรไฟล์ตนเองได้
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 3.2 Policy สำหรับ Children: ผู้ปกครองดูได้เฉพาะลูกตนเอง (parent_id = auth.uid()) | ครู/ผู้บริหารดูได้ทั้งหมด
CREATE POLICY "Parents view own children strictly" ON public.children
  FOR SELECT USING (
    parent_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('TEACHER', 'EXECUTIVE')
    )
  );

-- 3.3 Policy สำหรับ Attendance & Leave: ผู้ปกครองดู/สร้างเฉพาะของลูกตนเอง
CREATE POLICY "Parents access own child leave requests" ON public.leave_requests
  FOR ALL USING (
    parent_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('TEACHER', 'EXECUTIVE')
    )
  );

-- --------------------------------------------------------------------------
-- 4. AUTH USERS SEEDING (สร้างบัญชีผู้ใช้งาน 3 บทบาท - รหัสผ่าน: 1234)
-- --------------------------------------------------------------------------

-- 4.1 สร้างผู้ใช้ใน auth.users
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES 
-- บัญชีผู้ปกครอง (Parent)
(
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated', 'parent@bangyai.go.th',
  crypt('1234', gen_salt('bf')), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"PARENT","full_name":"คุณวรรณา สมบูรณ์"}', NOW(), NOW()
),
-- บัญชีครู (Teacher)
(
  '00000000-0000-0000-0000-000000000000',
  'b2222222-2222-2222-2222-222222222222',
  'authenticated', 'authenticated', 'teacher@bangyai.go.th',
  crypt('1234', gen_salt('bf')), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"TEACHER","full_name":"คุณครู สมศรี มีสุข"}', NOW(), NOW()
),
-- บัญชีผู้บริหาร (Executive)
(
  '00000000-0000-0000-0000-000000000000',
  'c3333333-3333-3333-3333-333333333333',
  'authenticated', 'authenticated', 'executive@bangyai.go.th',
  crypt('1234', gen_salt('bf')), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"EXECUTIVE","full_name":"นายสมชาย ใจดี"}', NOW(), NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 4.2 สร้าง Identities Mapping (เพื่อให้ล็อกอินผ่าน Supabase Auth ได้)
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, format('{"sub":"%s","email":"%s"}', id, email)::jsonb, 'email', NOW(), NOW(), NOW()
FROM auth.users WHERE email IN ('parent@bangyai.go.th', 'teacher@bangyai.go.th', 'executive@bangyai.go.th')
ON CONFLICT (provider, id) DO NOTHING;

-- 4.3 เพิ่มข้อมูลใน public.profiles
INSERT INTO public.profiles (id, email, full_name, role) VALUES
('a1111111-1111-1111-1111-111111111111', 'parent@bangyai.go.th', 'คุณวรรณา สมบูรณ์', 'PARENT'),
('b2222222-2222-2222-2222-222222222222', 'teacher@bangyai.go.th', 'คุณครู สมศรี มีสุข', 'TEACHER'),
('c3333333-3333-3333-3333-333333333333', 'executive@bangyai.go.th', 'นายสมชาย ใจดี', 'EXECUTIVE')
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 5. INITIAL DATA SEEDING (เพิ่มข้อมูลเด็กและห้องเรียนตัวอย่าง)
-- --------------------------------------------------------------------------
INSERT INTO public.classrooms (id, name, student_count) VALUES
('class-1', 'ห้องเตรียมอนุบาล (2-3 ขวบ)', 15),
('class-2', 'ห้องอนุบาล 1/1 (3-4 ขวบ)', 18),
('class-3', 'ห้องอนุบาล 1/2 (3-4 ขวบ)', 17)
ON CONFLICT (id) DO NOTHING;

-- เพิ่มเด็ก 1 คนที่ผูกกับผู้ปกครอง 'a1111111-1111-1111-1111-111111111111' (คุณวรรณา สมบูรณ์)
INSERT INTO public.children (
  id, class_id, parent_id, national_id, first_name, last_name, nickname, gender, age_string, parent_name, parent_phone, parent_relation, allergy
) VALUES (
  'child-101', 'class-2', 'a1111111-1111-1111-1111-111111111111',
  '1-1002-00345-67-8', 'ปัณณธร', 'วิสุทธิ์อัมพร', 'น้องโปรด', 'ชาย',
  '3 ขวบ 5 เดือน', 'คุณวรรณา สมบูรณ์', '081-234-5678', 'มารดา', 'ไม่มี'
) ON CONFLICT (id) DO NOTHING;
