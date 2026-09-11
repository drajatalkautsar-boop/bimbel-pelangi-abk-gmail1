export type UserRole = 'super_admin' | 'admin' | 'therapist' | 'finance';

export function normalizeUserRole(rawRole?: string | null): UserRole {
  if (!rawRole) return 'admin';
  const r = rawRole.toLowerCase().trim();
  if (r === 'super_admin' || r === 'superadmin') return 'super_admin';
  if (r === 'therapist' || r === 'terapis') return 'therapist';
  if (r === 'finance' || r === 'staff_keuangan' || r === 'keuangan') return 'finance';
  return 'admin';
}

export function getRoleDisplayName(role?: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Administrator';
    case 'therapist':
      return 'Terapis ABK';
    case 'finance':
      return 'Staff Keuangan';
    default:
      return 'Pengguna';
  }
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  status?: 'aktif' | 'nonaktif';
  createdAt?: string;
  updatedAt?: string;
}

export type AppModuleKey = 
  | 'dashboard'
  | 'data-siswa'
  | 'pengajar-terapis'
  | 'jenis-terapi'
  | 'paket-harga'
  | 'jadwal-terapi'
  | 'kehadiran'
  | 'catatan-terapi'
  | 'tagihan'
  | 'transaksi-pembayaran'
  | 'cicilan'
  | 'tunggakan'
  | 'riwayat-pembayaran'
  | 'laporan'
  | 'pengguna-admin'
  | 'profil-bimbel'
  | 'pengaturan-sistem';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export';

export interface ModulePermissionConfig {
  moduleKey: AppModuleKey;
  moduleName: string;
  category: string;
  description: string;
  supportedActions: PermissionAction[];
}

export type RolePermissions = Record<AppModuleKey, Record<PermissionAction, boolean>>;
export type AllRolesPermissionMatrix = Record<UserRole, RolePermissions>;

export type SpecialNeedCategory = 
  | 'Autism Spectrum Disorder (ASD)'
  | 'ADHD / ADD'
  | 'Speech Delay (Keterlambatan Bicara)'
  | 'Down Syndrome'
  | 'Sensory Processing Disorder'
  | 'Cerebral Palsy'
  | 'Global Developmental Delay (GDD)'
  | 'Kesulitan Belajar Spesifik (Disleksia/Diskaulkulia)';

export interface Student {
  id: string;
  nis: string;
  fullName: string;
  nickname: string;
  gender: 'L' | 'P';
  birthDate: string;
  diagnosis: SpecialNeedCategory | string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: 'active' | 'inactive' | 'aktif' | 'cuti' | 'lulus' | 'nonaktif' | string;
  therapistId?: string;
  therapistName?: string;
  packageId?: string;
  packageName?: string;
  joinedDate: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Therapist {
  id: string;
  nip: string;
  fullName: string;
  title: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'aktif' | 'cuti' | 'nonaktif' | string;
  totalActiveStudents?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface TherapyType {
  id: string;
  code: string;
  name: string;
  description: string;
  defaultDurationMinutes?: number;
  colorCode: string;
  status?: 'aktif' | 'nonaktif' | string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface TherapyPackage {
  id: string;
  name: string;
  therapyTypeId?: string;
  therapyTypeName?: string;
  therapyTypeCode?: string;
  therapyTypeColor?: string;
  sessionCount: number;
  price: number;
  validityDays: number;
  description?: string;
  isActive?: boolean;
  status?: 'aktif' | 'nonaktif' | string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ScheduleItem {
  id: string;
  studentId: string;
  studentName: string;
  studentDiagnosis: string;
  therapistId: string;
  therapistName: string;
  therapyTypeName: string;
  therapyColor: string;
  timeSlot: string; // e.g. "08:30 - 09:30"
  room: string;
  status: 'menunggu' | 'berlangsung' | 'selesai' | 'dibatalkan' | 'absen';
  date: string;
}

export interface OverduePayment {
  id: string;
  invoiceNumber: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  packageName: string;
  amount: number;
  dueDate: string;
  daysLate: number;
}

export interface Transaction {
  id: string;
  receiptNumber: string;
  studentName: string;
  parentName: string;
  packageName: string;
  amount: number;
  date: string;
  paymentMethod: 'Transfer BCA' | 'Transfer Mandiri' | 'QRIS' | 'Tunai';
  status: 'berhasil' | 'menunggu_verifikasi' | 'gagal';
}

export interface RevenueDataPoint {
  month: string;
  pendapatan: number;
  target: number;
}

export interface DashboardMetrics {
  siswaAktif: number;
  siswaAktifDelta: string;
  pengajarTerapis: number;
  pengajarTerapisDelta: string;
  jenisTerapi: number;
  paketAktif: number;
  sesiHariIni: number;
  sesiSelesaiHariIni: number;
  pendapatanBulanIni: number;
  pendapatanDeltaPersen: string;
  totalTagihan: number;
  totalTunggakan: number;
  jumlahSiswaMenunggak: number;
}

export interface SupabaseConfigState {
  url: string;
  anonKey: string;
  isConnected: boolean;
  isCustom: boolean;
  lastChecked?: string;
  error?: string | null;
}
