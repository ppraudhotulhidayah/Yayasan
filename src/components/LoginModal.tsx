import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  HeartHandshake, 
  X, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  KeyRound,
  Zap
} from 'lucide-react';
import { UserAccount, RoleType } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSelectUser: (user: UserAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'demo'>('form');
  const [selectedRole, setSelectedRole] = useState<RoleType>(currentUser.role || 'admin');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccessUser, setLoginSuccessUser] = useState<UserAccount | null>(null);

  if (!isOpen) return null;

  const roleConfigs = [
    {
      role: 'admin' as RoleType,
      label: 'Administrator',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-emerald-800 text-amber-200 border-emerald-700',
      activeTabClass: 'bg-emerald-800 text-amber-300 shadow-sm',
      desc: 'Pengurus Utama - Akses penuh seluruh modul & kelola pengguna',
      defaultDemo: { user: 'admin', pass: 'admin123' },
    },
    {
      role: 'guru' as RoleType,
      label: 'Dewan Guru / Asatidz',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-teal-700 text-teal-100 border-teal-600',
      activeTabClass: 'bg-teal-700 text-white shadow-sm',
      desc: 'Ustadz / Pengajar - Presensi, KBM, izin mengajar & takzir',
      defaultDemo: { user: 'guru1', pass: 'guru123' },
    },
    {
      role: 'wali' as RoleType,
      label: 'Wali Santri',
      icon: <HeartHandshake className="w-4 h-4" />,
      color: 'bg-amber-600 text-white border-amber-700',
      activeTabClass: 'bg-amber-600 text-white shadow-sm',
      desc: 'Orang Tua Santri - Pantau kehadiran, izin & perkembangan anak',
      defaultDemo: { user: 'wali1', pass: 'wali123' },
    },
  ];

  // Quick fill helper
  const handleQuickFill = (user: string, pass: string, role: RoleType) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  // Form submit handler with credential validation
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Harap masukkan Username dan Password.');
      return;
    }

    // Search for user matching username and role
    const matched = allUsers.find(
      u => u.username.toLowerCase() === cleanUser && u.role === selectedRole
    );

    if (!matched) {
      setErrorMessage(`Akun dengan username "${username}" tidak ditemukan untuk peran ${selectedRole.toUpperCase()}. Pastikan peran yang dipilih sudah sesuai.`);
      return;
    }

    // Check password (support password property or default fallback)
    const validPassword = matched.password || (matched.role === 'admin' ? 'admin123' : matched.role === 'guru' ? 'guru123' : 'wali123');

    if (cleanPass !== validPassword) {
      setErrorMessage('Password yang Anda masukkan salah. Silakan coba lagi.');
      return;
    }

    // Successful login!
    setLoginSuccessUser(matched);
    setTimeout(() => {
      onSelectUser(matched);
      onClose();
      setLoginSuccessUser(null);
      setUsername('');
      setPassword('');
    }, 600);
  };

  // Immediate 1-click switch handler
  const handleDirectSwitch = (user: UserAccount) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h3 className="text-lg font-bold text-stone-900">
                Sistem Autentikasi & Login Multi-Role
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Pondok Pesantren Raudhotu Hidayah • Validasi Hak Akses & Akun
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Form Login vs Quick Demo Switcher */}
        <div className="flex border-b border-stone-200 mt-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'form' 
                ? 'border-emerald-800 text-emerald-900 font-extrabold bg-emerald-50/40' 
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Form Login Kredensial</span>
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'demo' 
                ? 'border-emerald-800 text-emerald-900 font-extrabold bg-emerald-50/40' 
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulasi Cepat (1-Klik)</span>
          </button>
        </div>

        {/* TAB 1: FORM LOGIN */}
        {activeTab === 'form' && (
          <div className="mt-5 space-y-4">
            {/* Success Animation Banner */}
            {loginSuccessUser && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Login Berhasil!</div>
                  <div className="text-[11px] text-emerald-700">
                    Selamat datang, {loginSuccessUser.name} ({loginSuccessUser.role.toUpperCase()}). Mengalihkan...
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Step 1: Role Selector Tabs */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Pilih Peran (Role):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleConfigs.map((cfg) => {
                  const isSelected = selectedRole === cfg.role;
                  return (
                    <button
                      key={cfg.role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(cfg.role);
                        setErrorMessage(null);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 text-center ${
                        isSelected 
                          ? `${cfg.activeTabClass} border-transparent ring-2 ring-emerald-600/30` 
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {cfg.icon}
                        <span className="truncate">{cfg.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Demo Autofill Chips */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
                <span>Klik untuk Isi Otomatis Akun Contoh:</span>
                <span className="text-amber-600 font-normal">Tersedia 3 Role</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', 'admin123', 'admin')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold border border-emerald-300 transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Admin: admin / admin123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('guru1', 'guru123', 'guru')}
                  className="px-2.5 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-800 text-[11px] font-bold border border-teal-300 transition flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3 text-teal-700" />
                  <span>Guru: guru1 / guru123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('wali1', 'wali123', 'wali')}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-bold border border-amber-300 transition flex items-center gap-1"
                >
                  <HeartHandshake className="w-3 h-3 text-amber-700" />
                  <span>Wali: wali1 / wali123</span>
                </button>
              </div>
            </div>

            {/* Login Form Fields */}
            <form onSubmit={handleFormLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Username:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Contoh: admin, guru1, atau wali1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password akun"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Masuk ke Sistem (Login)</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: DEMO QUICK SWITCHER */}
        {activeTab === 'demo' && (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-stone-500">
              Pilih langsung akun aktif di bawah ini untuk beralih peran dalam 1-klik:
            </p>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {allUsers.map((u) => {
                const isCurrent = currentUser.id === u.id;
                const roleBadge = 
                  u.role === 'admin' 
                    ? 'bg-emerald-800 text-amber-200' 
                    : u.role === 'guru' 
                      ? 'bg-teal-700 text-teal-100' 
                      : 'bg-amber-600 text-white';

                return (
                  <div
                    key={u.id}
                    onClick={() => handleDirectSwitch(u)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent 
                        ? 'border-emerald-700 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-600/20' 
                        : 'border-stone-200 hover:border-emerald-500 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs truncate">{u.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${roleBadge}`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          @{u.username} • {u.title}
                        </div>
                        {u.santriName && (
                          <div className="text-[10px] text-amber-700 font-medium">
                            Ananda: {u.santriName}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                        isCurrent 
                          ? 'bg-emerald-800 text-white' 
                          : 'bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800'
                      }`}
                    >
                      {isCurrent ? 'Aktif' : 'Pilih'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Sesi login tersimpan otomatis di browser ini.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
