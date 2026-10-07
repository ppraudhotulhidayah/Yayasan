/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserAccount, 
  Santri, 
  AbsensiRecord, 
  JadwalMadrasah, 
  RutinitasHarian, 
  JadwalPiket, 
  IzinMengajar, 
  JurnalHarian, 
  SuratIzinPulang, 
  PelanggaranSantri, 
  Pengumuman, 
  RoleType, 
  StatusTakzir,
  LembagaSettings
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_SANTRI, 
  INITIAL_ABSENSI, 
  INITIAL_JADWAL_MADRASAH, 
  INITIAL_RUTINITAS_24H, 
  INITIAL_JADWAL_PIKET, 
  INITIAL_IZIN_MENGAJAR, 
  INITIAL_JURNAL, 
  INITIAL_SURAT_IZIN, 
  INITIAL_PELANGGARAN, 
  INITIAL_PENGUMUMAN,
  INITIAL_SETTINGS
} from './data/initialData';

import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AbsensiView } from './components/AbsensiView';
import { JadwalView } from './components/JadwalView';
import { PengajarView } from './components/PengajarView';
import { SantriView } from './components/SantriView';
import { SuratIzinView } from './components/SuratIzinView';
import { KedisiplinanView } from './components/KedisiplinanView';
import { LaporanView } from './components/LaporanView';
import { WaliPortalView } from './components/WaliPortalView';
import { PengaturanView } from './components/PengaturanView';
import { KelolaPenggunaView } from './components/KelolaPenggunaView';
import { LoginModal } from './components/LoginModal';

import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  FileText, 
  HeartHandshake,
  Download,
  Settings,
  UserCog
} from 'lucide-react';

export default function App() {
  // Users List Management (Stored in localStorage)
  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('pesantren_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
    }
    return INITIAL_USERS;
  });

  const saveUsers = (newUsers: UserAccount[]) => {
    setUsersList(newUsers);
    try {
      localStorage.setItem('pesantren_users', JSON.stringify(newUsers));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  };

  // Authentication & Current User Session (Stored in localStorage)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const savedSession = localStorage.getItem('pesantren_current_user');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load user session from localStorage', e);
    }
    return INITIAL_USERS[0]; // Default: Admin
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Active Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return currentUser.role === 'wali' ? 'wali_portal' : 'dashboard';
  });

  // Core Data States
  const [santriList, setSantriList] = useState<Santri[]>(INITIAL_SANTRI);
  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>(INITIAL_ABSENSI);
  const [jadwalMadrasahList, setJadwalMadrasahList] = useState<JadwalMadrasah[]>(INITIAL_JADWAL_MADRASAH);
  const [rutinitasList, setRutinitasList] = useState<RutinitasHarian[]>(INITIAL_RUTINITAS_24H);
  const [piketList, setPiketList] = useState<JadwalPiket[]>(INITIAL_JADWAL_PIKET);
  const [izinMengajarList, setIzinMengajarList] = useState<IzinMengajar[]>(INITIAL_IZIN_MENGAJAR);
  const [jurnalList, setJurnalList] = useState<JurnalHarian[]>(INITIAL_JURNAL);
  const [suratIzinList, setSuratIzinList] = useState<SuratIzinPulang[]>(INITIAL_SURAT_IZIN);
  const [pelanggaranList, setPelanggaranList] = useState<PelanggaranSantri[]>(INITIAL_PELANGGARAN);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(INITIAL_PENGUMUMAN);

  // Lembaga Settings State (Stored in localStorage)
  const [settings, setSettings] = useState<LembagaSettings>(() => {
    try {
      const saved = localStorage.getItem('pesantren_settings');
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  });

  const handleUpdateSettings = (newSettings: LembagaSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('pesantren_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }

    // Also synchronize admin credentials in usersList
    const storedAdminPass = localStorage.getItem('pesantren_admin_password') || 'admin123';
    setUsersList(prev => {
      const updated = prev.map(u => {
        if (u.role === 'admin' && (u.id === 'user_admin' || u.username === 'admin')) {
          return {
            ...u,
            username: newSettings.adminUsername || u.username,
            email: newSettings.adminEmail || u.email,
            password: storedAdminPass,
          };
        }
        return u;
      });
      try {
        localStorage.setItem('pesantren_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Handler for user switch & Login
  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('pesantren_current_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist user session', e);
    }

    if (user.role === 'wali') {
      setActiveTab('wali_portal');
    } else if (activeTab === 'wali_portal') {
      setActiveTab('dashboard');
    }
  };

  // Handler for Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('pesantren_current_user');
    } catch (e) {}
    setIsLoginModalOpen(true);
  };

  // Handlers for User Management (Kelola Pengguna)
  const handleAddUser = (newUser: UserAccount) => {
    const updated = [newUser, ...usersList];
    saveUsers(updated);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    const updated = usersList.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(updated);
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('pesantren_current_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }
  };

  const handleDeleteUser = (id: string) => {
    const updated = usersList.filter(u => u.id !== id);
    saveUsers(updated);
  };

  // Handlers for Absensi
  const handleSaveAbsensi = (updatedList: AbsensiRecord[]) => {
    setAbsensiList(updatedList);
  };

  // Handlers for Santri CRUD
  const handleAddSantri = (newSantri: Santri) => {
    setSantriList(prev => [newSantri, ...prev]);
  };

  const handleUpdateSantri = (updatedSantri: Santri) => {
    setSantriList(prev => prev.map(s => s.id === updatedSantri.id ? updatedSantri : s));
  };

  const handleDeleteSantri = (id: string) => {
    setSantriList(prev => prev.filter(s => s.id !== id));
  };

  // Handlers for Surat Izin Pulang
  const handleAddSuratIzin = (newSurat: SuratIzinPulang) => {
    setSuratIzinList(prev => [newSurat, ...prev]);
    // Also update student mukim status
    setSantriList(prev => prev.map(s => {
      if (s.id === newSurat.santriId) {
        return { ...s, statusMukim: 'Izin Pulang' };
      }
      return s;
    }));
  };

  const handleUpdateStatusSurat = (id: string, status: 'Sedang Di Luar' | 'Sudah Kembali' | 'Terlambat') => {
    setSuratIzinList(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, statusKepulangan: status };
      }
      return s;
    }));

    const found = suratIzinList.find(s => s.id === id);
    if (found && status === 'Sudah Kembali') {
      setSantriList(prev => prev.map(s => {
        if (s.id === found.santriId) {
          return { ...s, statusMukim: 'Mukim' };
        }
        return s;
      }));
    }
  };

  // Handlers for Kedisiplinan & Takzir
  const handleAddPelanggaran = (newPelanggaran: PelanggaranSantri) => {
    setPelanggaranList(prev => [newPelanggaran, ...prev]);
    // Add points to student
    setSantriList(prev => prev.map(s => {
      if (s.id === newPelanggaran.santriId) {
        return { ...s, poinPelanggaran: s.poinPelanggaran + newPelanggaran.poin };
      }
      return s;
    }));
  };

  const handleUpdateStatusTakzir = (id: string, status: StatusTakzir) => {
    setPelanggaranList(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          statusTakzir: status,
          diselesaikanPada: status === 'Selesai' ? new Date().toISOString().substring(0, 10) : p.diselesaikanPada
        };
      }
      return p;
    }));
  };

  // Handlers for Dewan Pengajar
  const handleAddIzinMengajar = (newIzin: IzinMengajar) => {
    setIzinMengajarList(prev => [newIzin, ...prev]);
  };

  const handleUpdateStatusIzin = (id: string, status: 'Disetujui' | 'Ditolak', catatan?: string) => {
    setIzinMengajarList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status, catatanAdmin: catatan };
      }
      return item;
    }));
  };

  const handleAddJurnal = (newJurnal: JurnalHarian) => {
    setJurnalList(prev => [newJurnal, ...prev]);
  };

  // Handlers for Jadwal Pelajaran Madrasah
  const handleAddJadwalMadrasah = (newJadwal: JadwalMadrasah) => {
    setJadwalMadrasahList(prev => [...prev, newJadwal]);
  };

  const handleUpdateJadwalMadrasah = (updated: JadwalMadrasah) => {
    setJadwalMadrasahList(prev => prev.map(j => j.id === updated.id ? updated : j));
  };

  const handleDeleteJadwalMadrasah = (id: string) => {
    setJadwalMadrasahList(prev => prev.filter(j => j.id !== id));
  };

  // Handlers for Rutinitas 24 Jam
  const handleAddRutinitas = (newRutinitas: RutinitasHarian) => {
    setRutinitasList(prev => [...prev, newRutinitas]);
  };

  const handleUpdateRutinitas = (updated: RutinitasHarian) => {
    setRutinitasList(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleDeleteRutinitas = (id: string) => {
    setRutinitasList(prev => prev.filter(r => r.id !== id));
  };

  // Handlers for Jadwal Piket Kebersihan
  const handleAddPiket = (newPiket: JadwalPiket) => {
    setPiketList(prev => [...prev, newPiket]);
  };

  const handleUpdatePiket = (updated: JadwalPiket) => {
    setPiketList(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePiket = (id: string) => {
    setPiketList(prev => prev.filter(p => p.id !== id));
  };

  // Counts for badge notifications
  const counts = {
    suratIzinAktif: suratIzinList.filter(s => s.statusKepulangan === 'Sedang Di Luar').length,
    takzirAktif: pelanggaranList.filter(p => p.statusTakzir !== 'Selesai').length,
    izinUstadzPending: izinMengajarList.filter(i => i.status === 'Menunggu').length,
  };

  // Student assigned to Wali
  const waliSantriObj = santriList.find(s => s.id === (currentUser.santriId || 'santri_1')) || santriList[0];

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      {/* Top Navigation & Digital Prayer Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        allUsers={usersList}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        settings={settings}
        onLogout={handleLogout}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={currentUser.role}
          counts={counts}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          settings={settings}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 pb-20 lg:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              santriList={santriList}
              absensiList={absensiList}
              suratIzinList={suratIzinList}
              pelanggaranList={pelanggaranList}
              rutinitasList={rutinitasList}
              pengumumanList={pengumumanList}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'absensi' && (
            <AbsensiView
              santriList={santriList}
              absensiList={absensiList}
              onSaveAbsensi={handleSaveAbsensi}
              userRole={currentUser.role}
              userName={currentUser.name}
              onNavigateToLaporan={() => setActiveTab('laporan')}
            />
          )}

          {activeTab === 'jadwal' && (
            <JadwalView
              jadwalMadrasahList={jadwalMadrasahList}
              rutinitasList={rutinitasList}
              piketList={piketList}
              userRole={currentUser.role}
              onAddJadwalMadrasah={handleAddJadwalMadrasah}
              onUpdateJadwalMadrasah={handleUpdateJadwalMadrasah}
              onDeleteJadwalMadrasah={handleDeleteJadwalMadrasah}
              onAddRutinitas={handleAddRutinitas}
              onUpdateRutinitas={handleUpdateRutinitas}
              onDeleteRutinitas={handleDeleteRutinitas}
              onAddPiket={handleAddPiket}
              onUpdatePiket={handleUpdatePiket}
              onDeletePiket={handleDeletePiket}
            />
          )}

          {activeTab === 'pengajar' && (
            <PengajarView
              currentUser={currentUser}
              izinMengajarList={izinMengajarList}
              onAddIzinMengajar={handleAddIzinMengajar}
              onUpdateStatusIzin={handleUpdateStatusIzin}
              jurnalList={jurnalList}
              onAddJurnal={handleAddJurnal}
              onNavigateToLaporan={() => setActiveTab('laporan')}
            />
          )}

          {activeTab === 'santri' && (
            <SantriView
              santriList={santriList}
              onAddSantri={handleAddSantri}
              onUpdateSantri={handleUpdateSantri}
              onDeleteSantri={handleDeleteSantri}
              userRole={currentUser.role}
              suratIzinList={suratIzinList}
              pelanggaranList={pelanggaranList}
            />
          )}

          {activeTab === 'surat_izin' && (
            <SuratIzinView
              suratIzinList={suratIzinList}
              santriList={santriList}
              onAddSuratIzin={handleAddSuratIzin}
              onUpdateStatusSurat={handleUpdateStatusSurat}
              userRole={currentUser.role}
              userName={currentUser.name}
              settings={settings}
            />
          )}

          {activeTab === 'kedisiplinan' && (
            <KedisiplinanView
              pelanggaranList={pelanggaranList}
              santriList={santriList}
              onAddPelanggaran={handleAddPelanggaran}
              onUpdateStatusTakzir={handleUpdateStatusTakzir}
              userRole={currentUser.role}
              userName={currentUser.name}
              onNavigateToLaporan={() => setActiveTab('laporan')}
            />
          )}

          {activeTab === 'laporan' && (
            <LaporanView
              santriList={santriList}
              absensiList={absensiList}
              jurnalList={jurnalList}
              pelanggaranList={pelanggaranList}
              suratIzinList={suratIzinList}
              userRole={currentUser.role}
              settings={settings}
            />
          )}

          {activeTab === 'wali_portal' && (
            <WaliPortalView
              currentUser={currentUser}
              santri={waliSantriObj}
              absensiList={absensiList}
              suratIzinList={suratIzinList}
              pelanggaranList={pelanggaranList}
              jadwalList={jadwalMadrasahList}
              onNavigateToRapor={() => setActiveTab('laporan')}
            />
          )}

          {activeTab === 'kelola_pengguna' && currentUser.role === 'admin' && (
            <KelolaPenggunaView
              usersList={usersList}
              santriList={santriList}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'pengaturan' && currentUser.role === 'admin' && (
            <PengaturanView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              userRole={currentUser.role}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Handy for Smartphones with RBAC) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-2 py-2 flex items-center justify-around shadow-lg no-print">
        {currentUser.role !== 'wali' ? (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'dashboard' ? 'text-emerald-800 font-bold' : 'text-stone-500'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px]">Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('absensi')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'absensi' ? 'text-emerald-800 font-bold' : 'text-stone-500'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-[10px]">Absensi</span>
            </button>

            <button
              onClick={() => setActiveTab('surat_izin')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'surat_izin' ? 'text-emerald-800 font-bold' : 'text-stone-500'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px]">Surat Izin</span>
            </button>

            {currentUser.role === 'admin' ? (
              <button
                onClick={() => setActiveTab('kelola_pengguna')}
                className={`flex flex-col items-center gap-1 ${
                  activeTab === 'kelola_pengguna' ? 'text-emerald-800 font-bold' : 'text-stone-500'
                }`}
              >
                <UserCog className="w-5 h-5" />
                <span className="text-[10px]">Pengguna</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('jadwal')}
                className={`flex flex-col items-center gap-1 ${
                  activeTab === 'jadwal' ? 'text-emerald-800 font-bold' : 'text-stone-500'
                }`}
              >
                <CalendarDays className="w-5 h-5" />
                <span className="text-[10px]">Jadwal</span>
              </button>
            )}

            {currentUser.role === 'admin' ? (
              <button
                onClick={() => setActiveTab('pengaturan')}
                className={`flex flex-col items-center gap-1 ${
                  activeTab === 'pengaturan' ? 'text-emerald-800 font-bold' : 'text-stone-500'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-[10px]">Pengaturan</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('laporan')}
                className={`flex flex-col items-center gap-1 ${
                  activeTab === 'laporan' ? 'text-emerald-800 font-bold' : 'text-stone-500'
                }`}
              >
                <Download className="w-5 h-5" />
                <span className="text-[10px]">Laporan</span>
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('wali_portal')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'wali_portal' ? 'text-amber-700 font-bold' : 'text-stone-500'
              }`}
            >
              <HeartHandshake className="w-5 h-5" />
              <span className="text-[10px]">Portal Ananda</span>
            </button>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex flex-col items-center gap-1 text-stone-500 hover:text-emerald-800"
            >
              <UserCog className="w-5 h-5" />
              <span className="text-[10px]">Ganti Akun</span>
            </button>
          </>
        )}
      </div>

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        allUsers={usersList}
        onSelectUser={handleSwitchUser}
      />
    </div>
  );
}
