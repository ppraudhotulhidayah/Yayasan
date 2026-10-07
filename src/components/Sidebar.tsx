import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  GraduationCap, 
  Users, 
  FileText, 
  AlertTriangle, 
  Download, 
  HeartHandshake,
  ShieldCheck,
  BookOpen,
  Settings,
  UserCog,
  LogOut,
  ArrowRightLeft
} from 'lucide-react';
import { RoleType, LembagaSettings, UserAccount } from '../types';

export type ActiveTab = 
  | 'dashboard'
  | 'absensi'
  | 'jadwal'
  | 'pengajar'
  | 'santri'
  | 'surat_izin'
  | 'kedisiplinan'
  | 'laporan'
  | 'wali_portal'
  | 'kelola_pengguna'
  | 'pengaturan';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: RoleType;
  counts: {
    suratIzinAktif: number;
    takzirAktif: number;
    izinUstadzPending: number;
  };
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  settings?: LembagaSettings;
  currentUser?: UserAccount;
  onLogout?: () => void;
  onOpenLoginModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  counts,
  mobileMenuOpen,
  setMobileMenuOpen,
  settings,
  currentUser,
  onLogout,
  onOpenLoginModal,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard Utama',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'guru'],
    },
    {
      id: 'absensi' as ActiveTab,
      label: 'Absensi Santri',
      icon: <CheckSquare className="w-5 h-5" />,
      sub: 'Ngaji & Sholat Berjamaah',
      roles: ['admin', 'guru'],
    },
    {
      id: 'jadwal' as ActiveTab,
      label: 'Jadwal & Kegiatan',
      icon: <CalendarDays className="w-5 h-5" />,
      sub: 'Madrasah, 24 Jam & Piket',
      roles: ['admin', 'guru'],
    },
    {
      id: 'pengajar' as ActiveTab,
      label: 'Dewan Pengajar / Asatidz',
      icon: <GraduationCap className="w-5 h-5" />,
      sub: 'Izin Mengajar & Jurnal KBM',
      roles: ['admin', 'guru'],
      badge: counts.izinUstadzPending > 0 && userRole === 'admin' ? counts.izinUstadzPending : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'santri' as ActiveTab,
      label: 'Data Santri & Kelas',
      icon: <Users className="w-5 h-5" />,
      sub: 'Biodata, Kamar & Rayon',
      roles: ['admin', 'guru'],
    },
    {
      id: 'surat_izin' as ActiveTab,
      label: 'Surat Izin Pulang',
      icon: <FileText className="w-5 h-5" />,
      sub: 'Cetak Surat & Tracing',
      roles: ['admin', 'guru'],
      badge: counts.suratIzinAktif > 0 ? counts.suratIzinAktif : undefined,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'kedisiplinan' as ActiveTab,
      label: 'Kedisiplinan & Takzir',
      icon: <AlertTriangle className="w-5 h-5" />,
      sub: 'Pelanggaran & Hukuman Edukatif',
      roles: ['admin', 'guru'],
      badge: counts.takzirAktif > 0 ? counts.takzirAktif : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'laporan' as ActiveTab,
      label: 'Laporan & Rekap PDF',
      icon: <Download className="w-5 h-5" />,
      sub: 'Export A4 Siap Cetak',
      roles: ['admin', 'guru'],
    },
    {
      id: 'wali_portal' as ActiveTab,
      label: 'Portal Wali Santri',
      icon: <HeartHandshake className="w-5 h-5" />,
      sub: 'Khusus Pantau Ananda',
      roles: ['wali', 'admin'],
      highlight: true,
    },
    {
      id: 'kelola_pengguna' as ActiveTab,
      label: 'Kelola Pengguna',
      icon: <UserCog className="w-5 h-5" />,
      sub: 'Manajemen Akun Guru & Wali',
      roles: ['admin'],
    },
    {
      id: 'pengaturan' as ActiveTab,
      label: 'Pengaturan Sistem',
      icon: <Settings className="w-5 h-5" />,
      sub: 'Identitas & Akun Admin',
      roles: ['admin'],
    },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(userRole));

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-stone-200/90 flex flex-col justify-between
        transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation list */}
        <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
          <div className="pb-3 mb-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Menu Navigasi
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              userRole === 'admin' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : userRole === 'guru' 
                  ? 'bg-teal-100 text-teal-800 border border-teal-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {userRole === 'admin' ? 'Administrator' : userRole === 'guru' ? 'Dewan Guru' : 'Wali Santri'}
            </span>
          </div>

          <nav className="space-y-1.5">
            {filteredNav.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`
                    w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between group
                    ${isActive 
                      ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/10' 
                      : item.highlight && userRole === 'wali'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-lg ${
                      isActive 
                        ? 'text-amber-300' 
                        : item.highlight ? 'text-amber-600' : 'text-stone-500 group-hover:text-emerald-700'
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight flex items-center gap-1.5">
                        {item.label}
                        {item.highlight && userRole === 'wali' && (
                          <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                            Utama
                          </span>
                        )}
                      </div>
                      {item.sub && (
                        <div className={`text-[11px] leading-tight ${isActive ? 'text-emerald-200' : 'text-stone-400'}`}>
                          {item.sub}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-stone-200 text-stone-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Logout Section */}
        <div className="p-3 border-t border-stone-100 bg-stone-50/90 space-y-2">
          {currentUser && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                  {(currentUser.displayName || currentUser.name).charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-800 truncate">
                    {currentUser.displayName || currentUser.name}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono truncate">@{currentUser.username}</div>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Logout / Keluar Sesi"
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 transition shrink-0 ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Quick Action buttons */}
          <div className="flex gap-1.5">
            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="flex-1 py-1.5 px-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <ArrowRightLeft className="w-3 h-3 text-amber-300" />
                <span>Ganti Akun</span>
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="py-1.5 px-2.5 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

