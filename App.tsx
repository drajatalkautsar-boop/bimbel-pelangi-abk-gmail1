import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { Sidebar, MenuItem } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ModuleView } from './pages/ModuleView';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

function AppContent() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>({
    id: 'dashboard',
    title: 'Dashboard Utama',
    category: 'DASHBOARD',
    icon: () => null as any,
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const handleSelectMenu = (item: MenuItem) => {
    setActiveMenu(item);
  };

  const handleNavigateMenu = (menuId: string) => {
    // Map shortcut IDs
    const menuMap: Record<string, { title: string; category: string }> = {
      'data-siswa': { title: 'Data Siswa', category: 'MASTER DATA' },
      'pengajar-terapis': { title: 'Pengajar / Terapis', category: 'MASTER DATA' },
      'jenis-terapi': { title: 'Jenis Terapi', category: 'MASTER DATA' },
      'paket-harga': { title: 'Paket Harga', category: 'MASTER DATA' },
      'jadwal-terapi': { title: 'Jadwal Terapi', category: 'OPERASIONAL' },
      'kehadiran': { title: 'Kehadiran', category: 'OPERASIONAL' },
      'catatan-terapi': { title: 'Catatan Terapi', category: 'OPERASIONAL' },
      'tagihan': { title: 'Tagihan', category: 'KEUANGAN' },
      'transaksi-pembayaran': { title: 'Transaksi Pembayaran', category: 'KEUANGAN' },
      'cicilan': { title: 'Cicilan', category: 'KEUANGAN' },
      'tunggakan': { title: 'Tunggakan', category: 'KEUANGAN' },
      'riwayat-pembayaran': { title: 'Riwayat Pembayaran', category: 'KEUANGAN' },
      'pengaturan-sistem': { title: 'Pengaturan Sistem', category: 'PENGATURAN' },
    };

    const target = menuMap[menuId];
    if (target) {
      setActiveMenu({
        id: menuId,
        title: target.title,
        category: target.category,
        icon: () => null as any,
      });
    }
  };

  return (
    <div id="app-root-layout" className="min-h-screen bg-slate-50/70 flex">
      {/* Responsive Pastel Rainbow Sidebar */}
      <Sidebar
        activeMenuId={activeMenu.id}
        onSelectMenu={handleSelectMenu}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          activeMenuTitle={activeMenu.title}
          activeCategoryTitle={activeMenu.category}
          onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeMenu.id === 'dashboard' ? (
            <DashboardPage
              onNavigateMenu={handleNavigateMenu}
              onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
            />
          ) : (
            <ModuleView
              menuId={activeMenu.id}
              menuTitle={activeMenu.title}
              categoryTitle={activeMenu.category}
              onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Supabase Connection & Configuration Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}
