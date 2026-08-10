# 🛡️ แผนผังสถาปัตยกรรมระบบยืนยันตัวตนและการนำไปใช้งานจริง (Production Authentication & Authorization Roadmap)

เอกสารฉบับนี้จัดทำขึ้นเพื่อเป็นแนวทางและพิมพ์เขียว (Blueprint) สำหรับการพัฒนาและติดตั้งใช้จริง (Production Deployment) สำหรับระบบ **ศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่ จังหวัดนนทบุรี** ตามมาตรฐานความปลอดภัยและ PDPA

---

## 1. 🏗️ สถาปัตยกรรมระบบ Auth ในระยะ Production (Production Tech Stack)

```
[ Frontend: Next.js / PWA ] 
         │
         │  (1) Request Login (Username/Password / OTP / LINE OAuth)
         ▼
[ API Gateway / NestJS Authentication Module ]
         │
         ├─► Validate Credentials (Bcrypt / Argon2 Password Hashing)
         ├─► Issue Signed JWT Access Token & HttpOnly Secure Cookie
         └─► Write Security Audit Log (Timestamp, User, IP, Action)
         │
         ▼
[ Data Layer & Database ]
         ├─► PostgreSQL (User Accounts, Roles, Child-Parent Mappings)
         └─► Redis Cache (Session Revocation & Active Token Blacklist)
```

---

## 2. 🔐 การจัดสรรสิทธิ์และขอบเขตข้อมูล (RBAC & Data Scoping Matrix)

| บทบาทผู้ใช้ (Role) | วิธีเข้าสู่ระบบที่แนะนำ | JWT Scope / Permissions | ขอบเขตข้อมูล (Data Access Scoping) |
| :--- | :--- | :--- | :--- |
| **01 ผู้ปกครอง (PARENT)** | Phone + PIN 6 หลัก / LINE Login | `ROLE_PARENT`<br>`READ_MY_CHILD`, `SUBMIT_LEAVE` | **Child Scoping**: อ่านและแก้ไขได้เฉพาะข้อมูลเด็กที่มี `parent_id` ตรงกับ User ID ตนเองเท่านั้น |
| **02 ครู/ผู้ดูแลเด็ก (TEACHER)** | Email/Username + Password | `ROLE_TEACHER`<br>`ATTENDANCE_WRITE`, `APPROVE_LEAVE` | **Class Scoping**: อ่านและบันทึกข้อมูลได้เฉพาะเด็กใน `class_id` ที่ตนเองได้รับมอบหมาย |
| **03 ผู้บริหาร/เทศบาล (EXECUTIVE)**| Staff Email + Password + 2FA | `ROLE_EXECUTIVE`<br>`VIEW_DASHBOARD`, `READ_AUDIT_LOGS` | **Global Scoping**: อ่านข้อมูลสถิติรวมและรายงานได้ทั้งศูนย์ฯ (แบบ anonymized / ไม่แสดงข้อมูลส่วนบุคคลเกินจำเป็น) |

---

## 3. 🛡️ มาตรการความปลอดภัยและ Privacy by Design (PDPA & OWASP)

1. **Password Security**: เข้ารหัสรหัสผ่านด้วย **Argon2id** หรือ **Bcrypt (Salt factor >= 12)** ห้ามเก็บ Plaintext เด็ดขาด
2. **Session & Cookie Protection**:
   - `HttpOnly`: ป้องกัน JavaScript อ่าน Token หมดปัญหา XSS Attack
   - `SameSite=Strict`: ป้องกัน CSRF Attack
   - `Secure`: บังคับส่งผ่าน HTTPS เท่านั้น
3. **Audit Logging & Non-repudiation**: บันทึกการเข้าใช้งาน (Log-in, Log-out, Data Export, Sensitive View) ลงใน Audit Log Database ที่ไม่สามารถแก้ไขย้อนหลังได้ (Append-only)
4. **Data Minimization (PDPA)**: หน้าผู้บริหารแสดงผลเป็นสถิติตัวเลขเชิงปริมาณ ไม่แสดงเลขบัตรประชาชน หรือรูปถ่ายเด็กในรายงานสาธารณะ

---

## 4. 🚀 แผนการติดตั้งและปรับใช้จริง 4 ขั้นตอน (Deployment Roadmap)

- [x] **ระยะที่ 1 (Interactive Prototype)**: ระบบจำลอง Authentication และ RBAC 3 บทบาทบน Web App (เสร็จสมบูรณ์)
- [ ] **ระยะที่ 2 (Backend Core & Database Setup)**: สร้าง NestJS REST API + PostgreSQL Database Schema (User, Role, AuditLog)
- [ ] **ระยะที่ 3 (LINE Login & Mobile OTP Integration)**: เชื่อมต่อ LINE Messaging API / SMS Gateway สำหรับฝั่งผู้ปกครอง
- [ ] **ระยะที่ 4 (Production Server Deployment)**: ติดตั้งบน Server ของเทศบาลเมืองบางใหญ่ ผ่าน Docker Compose พร้อมจัดทำ SSL/TLS (HTTPS)

---
*จัดทำโดย: ทีมพัฒนานวัตกรรมดิจิทัล ศูนย์พัฒนาเด็กเล็ก เทศบาลเมืองบางใหญ่*
