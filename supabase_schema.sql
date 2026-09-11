-- =========================================================
-- BIMBEL PELANGI ABK - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Bimbingan Belajar & Terapi Anak Berkebutuhan Khusus
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFIL PENGGUNA (Admin, Terapis, Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'therapist', 'finance', 'superadmin', 'terapis', 'staff_keuangan')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PENGAJAR / TERAPIS
CREATE TABLE IF NOT EXISTS public.therapists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nip TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialization TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'cuti', 'nonaktif')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL JENIS TERAPI
CREATE TABLE IF NOT EXISTS public.therapy_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_duration_minutes INT DEFAULT 60,
  color_code TEXT DEFAULT '#38BDF8',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL PAKET HARGA
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  therapy_type_id UUID REFERENCES public.therapy_types(id) ON DELETE SET NULL,
  session_count INT NOT NULL DEFAULT 8,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  validity_days INT DEFAULT 30,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL SISWA ABK
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nis TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  nickname TEXT,
  gender CHAR(1) CHECK (gender IN ('L', 'P')),
  birth_date DATE NOT NULL,
  diagnosis TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'cuti', 'lulus', 'nonaktif')),
  primary_therapist_id UUID REFERENCES public.therapists(id) ON DELETE SET NULL,
  active_package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL JADWAL TERAPI
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES public.therapists(id) ON DELETE CASCADE,
  therapy_type_id UUID REFERENCES public.therapy_types(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  room TEXT NOT NULL,
  status TEXT DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'berlangsung', 'selesai', 'dibatalkan', 'absen')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL KEHADIRAN
CREATE TABLE IF NOT EXISTS public.attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES public.schedules(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES public.therapists(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  student_status TEXT CHECK (student_status IN ('hadir', 'izin', 'sakit', 'alpa')),
  therapist_status TEXT CHECK (therapist_status IN ('hadir', 'izin', 'pengganti')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL CATATAN TERAPI & EVALUASI PERKEMBANGAN
CREATE TABLE IF NOT EXISTS public.therapy_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES public.schedules(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES public.therapists(id) ON DELETE CASCADE,
  target_activity TEXT NOT NULL,
  child_response TEXT,
  milestone_progress TEXT,
  recommendation_for_parents TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL TAGIHAN (INVOICE)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  paid_amount NUMERIC(12, 2) DEFAULT 0,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'belum_bayar' CHECK (status IN ('belum_bayar', 'sebagian', 'lunas', 'lewat_jatuh_tempo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL TRANSAKSI PEMBAYARAN
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number TEXT UNIQUE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Transfer BCA', 'Transfer Mandiri', 'QRIS', 'Tunai')),
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  verified_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'berhasil' CHECK (status IN ('berhasil', 'menunggu_verifikasi', 'gagal')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full read/write access
CREATE POLICY "Allow authenticated read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage" ON public.profiles FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read therapists" ON public.therapists FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read therapy_types" ON public.therapy_types FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read packages" ON public.packages FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read students" ON public.students FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read schedules" ON public.schedules FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read attendances" ON public.attendances FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read therapy_notes" ON public.therapy_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read invoices" ON public.invoices FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read payments" ON public.payments FOR ALL TO authenticated USING (true);

-- 13. SEED INITIAL THERAPY TYPES
INSERT INTO public.therapy_types (code, name, description, color_code) VALUES
('TW', 'Terapi Wicara', 'Melatih artikulasi, reseptif & ekspresif bahasa anak', '#F472B6'),
('OT', 'Okupasi Terapi', 'Mengembangkan motorik halus & kemandirian aktivitas harian', '#34D399'),
('SI', 'Sensori Integrasi', 'Stimulasi pemrosesan sensori vestibular & proprioseptif', '#38BDF8'),
('ABA', 'Terapi Perilaku (ABA)', 'Modifikasi perilaku adaptif & kepatuhan instruksi', '#A78BFA'),
('RT', 'Remedial Teaching', 'Bimbingan calistung & kesiapan kognitif anak khusus', '#FBBF24'),
('FT', 'Fisioterapi Pediatrik', 'Stimulasi motorik kasar, postur dan mobilitas fisik', '#FB7185')
ON CONFLICT (code) DO NOTHING;
