import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Bell, 
  User, 
  ShieldCheck, 
  BookOpen, 
  HeartHandshake, 
  ChevronDown, 
  Menu, 
  X,
  Sparkles,
  Volume2,
  Calendar,
  LogOut,
  ArrowRightLeft
} from 'lucide-react';
import { UserAccount, RoleType, LembagaSettings } from '../types';
import { 
  getWaktuSholatList, 
  formatWIBTime, 
  formatWIBDate, 
  getNamaHijriah 
} from '../utils/prayerTimes';

interface HeaderProps {
  currentUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;
  allUsers: UserAccount[];
  onOpenLoginModal: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  settings?: LembagaSettings;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  onOpenLoginModal,
  mobileMenuOpen,
  setMobileMenuOpen,
  settings,
  onLogout,
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sholatList = getWaktuSholatList(time);
  const nextSholat = sholatList.find(s => s.isNext) || sholatList[0];

  const getRoleBadge = (role: RoleType) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin / Pengurus Utama',
          color: 'bg-emerald-800 text-amber-200 border-emerald-600',
          icon: <ShieldCheck className="w-3.5 h-3.5" />
        };
      case 'guru':
        return {
          label: 'Dewan Asatidz / Guru',
          color: 'bg-emerald-700 text-emerald-100 border-emerald-500',
          icon: <BookOpen className="w-3.5 h-3.5" />
        };
      case 'wali':
        return {
          label: 'Wali Santri (Read-Only)',
          color: 'bg-amber-700 text-amber-100 border-amber-500',
          icon: <HeartHandshake className="w-3.5 h-3.5" />
        };
    }
  };

  const roleBadge = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800/80">
      {/* Topmost bar: Clock, Hijri Date, Next Prayer */}
      <div className="bg-emerald-950 text-emerald-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-emerald-800/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono text-sm tracking-wide text-white">{formatWIBTime(time)} WIB</span>
          </div>
          <span className="hidden sm:inline text-emerald-600">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatWIBDate(time)}</span>
            <span className="text-amber-400 font-arabic font-semibold ml-1">({getNamaHijriah()})</span>
          </div>
        </div>

        {/* Next Prayer Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-900/90 border border-emerald-700/60 px-2.5 py-0.5 rounded text-xs text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Menuju {nextSholat.nama} ({nextSholat.waktu} WIB):</span>
            <span className="font-semibold text-white">{nextSholat.countdownStr}</span>
          </div>

          {/* Quick switch button for evaluation */}
          <button 
            onClick={onOpenLoginModal}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium transition shadow-xs"
            title="Ganti Akun & Role"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span className="hidden md:inline">Ganti Role</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Pesantren Branding */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-emerald-200 hover:bg-emerald-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo Badge */}
          {settings?.logoUrl ? (
            <div className="w-11 h-11 rounded-lg bg-white p-1 shadow-md flex items-center justify-center shrink-0 border border-amber-400/40">
              <img 
                src={settings.logoUrl} 
                alt="Logo Lembaga" 
                className="w-full h-full object-contain rounded"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-lg bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-emerald-950 rounded-md flex items-center justify-center text-amber-400 border border-amber-400/30">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M12 2L4 7v13h16V7L12 2z" strokeLinejoin="round" />
                  <path d="M12 2v7" />
                  <path d="M9 13a3 3 0 0 1 6 0v7H9v-7z" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="12" cy="5.5" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {settings?.namaLembaga || 'Pondok Pesantren Raudhotu Hidayah'}
              </h1>
            </div>
            <p className="text-xs text-emerald-200/90 hidden sm:block">
              {settings?.subNamaTagline || 'Sistem Informasi Manajemen Santri, Absensi, Kedisiplinan & Perizinan Terpadu'}
            </p>
          </div>
        </div>

        {/* User Role Card & Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-700/80 transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs uppercase shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-white leading-tight line-clamp-1 max-w-[150px]">
                {currentUser.name}
              </div>
              <div className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded border ${roleBadge.color}`}>
                {roleBadge.icon}
                <span>{currentUser.role.toUpperCase()}</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-emerald-300 ml-0.5" />
          </button>

          {/* Role Dropdown */}
          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 text-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-stone-100 bg-stone-50/80">
                <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Akun Aktif Saat Ini</p>
                <p className="text-xs font-bold text-emerald-900 mt-0.5">{currentUser.name}</p>
                <p className="text-[11px] text-stone-600">{currentUser.title}</p>
                {currentUser.santriName && (
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    Ananda Santri: {currentUser.santriName}
                  </p>
                )}
              </div>

              <div className="px-3 py-2">
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  Simulasi Cepat Role:
                </p>
                <div className="space-y-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                        user.id === currentUser.id 
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' 
                          : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          user.role === 'admin' ? 'bg-emerald-600' : user.role === 'guru' ? 'bg-teal-600' : 'bg-amber-600'
                        }`} />
                        <div>
                          <div>{user.name}</div>
                          <div className="text-[10px] text-stone-500 capitalize">{user.role} - {user.title}</div>
                        </div>
                      </div>
                      {user.id === currentUser.id && (
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">Aktif</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-1 px-3 space-y-1">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onOpenLoginModal();
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center gap-2 font-medium"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Buka Form Login / Ganti Akun</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar / Logout Sesi</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Running Text Marquee Widget */}
      {showAnnouncement && (
        <div className="bg-emerald-800 text-emerald-100 text-xs px-3 py-1 flex items-center border-t border-emerald-700/60 overflow-hidden">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300 shrink-0 mr-3 pr-3 border-r border-emerald-700">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span className="text-[11px] uppercase tracking-wider">Maklumat Pondok:</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap relative flex-1">
            <div className="inline-block animate-marquee hover:pause text-emerald-100">
              <span className="mx-4 font-medium text-amber-200">★ Tasmi' Al-Qur'an 5 Juz Bulanan Ahad 12 Oktober 2026</span>
              <span className="mx-4">| Seluruh santri wajib menuntaskan setoran tahfidz ba'da maghrib</span>
              <span className="mx-4 font-medium text-amber-200">★ Perizinan pulang diperketat menjelang UTS Madrasah Diniyah</span>
              <span className="mx-4">| Harap wali santri mematuhi tanggal wajib kembali</span>
              <span className="mx-4 font-medium text-amber-200">★ Jumat Bersih: Kerja bakti akbar pembersihan maktabah dan serambi masjid jami'</span>
            </div>
          </div>
          <button 
            onClick={() => setShowAnnouncement(false)}
            className="ml-2 text-emerald-300 hover:text-white p-0.5 rounded"
            title="Tutup pengumuman"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
