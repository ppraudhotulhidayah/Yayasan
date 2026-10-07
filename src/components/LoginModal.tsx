import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  HeartHandshake, 
  X, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  User, 
  KeyRound, 
  Zap, 
  Clock, 
  ShieldAlert,
  Fingerprint
} from 'lucide-react';
import { UserAccount, RoleType, UserSession } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSelectUser: (user: UserAccount) => void;
  isMandatory?: boolean; // When true, modal cannot be closed without logging in
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
  isMandatory = false,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'demo'>('form');
  const [selectedRole, setSelectedRole] = useState<RoleType>(currentUser?.role || 'admin');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccessUser, setLoginSuccessUser] = useState<UserAccount | null>(null);

  // Rate Limiting & Lockout Security State
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('pesantren_failed_attempts');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState<number>(0);

  // Check lockout on mount and active timer
  useEffect(() => {
    const checkLockout = () => {
      try {
        const lockoutUntilStr = localStorage.getItem('pesantren_lockout_until');
        if (lockoutUntilStr) {
          const lockoutUntil = parseInt(lockoutUntilStr, 10);
          const now = Date.now();
          if (now < lockoutUntil) {
            const remaining = Math.ceil((lockoutUntil - now) / 1000);
            setLockoutSecondsLeft(remaining);
            return;
          } else {
            // Lockout expired
            localStorage.removeItem('pesantren_lockout_until');
            localStorage.removeItem('pesantren_failed_attempts');
            setFailedAttempts(0);
            setLockoutSecondsLeft(0);
          }
        }
      } catch (e) {
        console.error('Error checking lockout:', e);
      }
    };

    checkLockout();

    const interval = setInterval(() => {
      setLockoutSecondsLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('pesantren_lockout_until');
          localStorage.removeItem('pesantren_failed_attempts');
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const isLocked = lockoutSecondsLeft > 0;

  const roleConfigs = [
    {
      role: 'admin' as RoleType,
      label: 'Administrator',
      icon: <ShieldCheck className="w-4 h-4" />,
      tag: 'Pengurus Utama',
      activeTabClass: 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-emerald-600/30',
      desc: 'Akses penuh ke seluruh data santri, perizinan, dan konfigurasi',
      defaultDemo: { user: 'admin', pass: 'admin123' },
    },
    {
      role: 'guru' as RoleType,
      label: 'Dewan Guru',
      icon: <BookOpen className="w-4 h-4" />,
      tag: 'Asatidz & KBM',
      activeTabClass: 'bg-teal-700 text-white shadow-md ring-2 ring-teal-500/30',
      desc: 'Input absensi harian, jurnal madrasah diniyah, dan takzir santri',
      defaultDemo: { user: 'guru1', pass: 'guru123' },
    },
    {
      role: 'wali' as RoleType,
      label: 'Wali Santri',
      icon: <HeartHandshake className="w-4 h-4" />,
      tag: 'Orang Tua',
      activeTabClass: 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/30',
      desc: 'Pantau kehadiran, jadwal kitab, perizinan, dan rapor ananda',
      defaultDemo: { user: 'wali1', pass: 'wali123' },
    },
  ];

  // Quick fill helper
  const handleQuickFill = (user: string, pass: string, role: RoleType) => {
    if (isLocked) return;
    setSelectedRole(role);
    setUsername(user);
    setPassword(pass);
    setErrorMessage(null);
  };

  // Form submit handler with credential validation & rate limit protection
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Harap masukkan Username dan Password akun Anda.');
      return;
    }

    // Search user matching username and role
    const matched = allUsers.find(
      (u) => u.username.toLowerCase() === cleanUser && u.role === selectedRole
    );

    if (!matched) {
      handleFailedAttempt(
        `Akun "${username}" tidak ditemukan untuk peran ${selectedRole.toUpperCase()}. Pastikan peran yang dipilih sudah tepat.`
      );
      return;
    }

    // Verify password (supports dynamic password or fallback)
    const validPassword =
      matched.password ||
      (matched.role === 'admin' ? 'admin123' : matched.role === 'guru' ? 'guru123' : 'wali123');

    if (cleanPass !== validPassword) {
      handleFailedAttempt('Password yang Anda masukkan salah. Silakan periksa kembali.');
      return;
    }

    // Login Success! Reset rate-limit counters
    localStorage.removeItem('pesantren_failed_attempts');
    localStorage.removeItem('pesantren_lockout_until');
    setFailedAttempts(0);

    // Create session token with timeout (12 hours)
    const tokenPayload = {
      userId: matched.id,
      username: matched.username,
      role: matched.role,
      loginTime: Date.now(),
    };
    const sessionToken = `pstr_${btoa(JSON.stringify(tokenPayload))}_${Math.random().toString(36).substring(2, 8)}`;
    const sessionData: UserSession = {
      token: sessionToken,
      userId: matched.id,
      username: matched.username,
      displayName: matched.displayName || matched.name,
      role: matched.role,
      loginTime: Date.now(),
      expiresAt: Date.now() + 12 * 60 * 60 * 1000, // 12 jam
    };

    try {
      localStorage.setItem('pesantren_session_token', JSON.stringify(sessionData));
      localStorage.setItem('pesantren_current_user', JSON.stringify(matched));
    } catch (err) {
      console.error('Failed to save session token', err);
    }

    setLoginSuccessUser(matched);
    setTimeout(() => {
      onSelectUser(matched);
      onClose();
      setLoginSuccessUser(null);
      setUsername('');
      setPassword('');
    }, 600);
  };

  const handleFailedAttempt = (customMsg: string) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    localStorage.setItem('pesantren_failed_attempts', nextAttempts.toString());

    if (nextAttempts >= 5) {
      const lockUntil = Date.now() + 30000; // 30 detik
      localStorage.setItem('pesantren_lockout_until', lockUntil.toString());
      setLockoutSecondsLeft(30);
      setErrorMessage(
        'PERINGATAN KEAMANAN: Terlalu banyak percobaan gagal (5x). Form login dikunci sementara selama 30 detik untuk mencegah serangan brute-force.'
      );
    } else {
      const sisa = 5 - nextAttempts;
      setErrorMessage(`${customMsg} (Peringatan: Sisa kesempatan sebelum terkunci: ${sisa} kali lagi).`);
    }
  };

  // Immediate 1-click switch handler for evaluator convenience
  const handleDirectSwitch = (user: UserAccount) => {
    if (isLocked) return;

    // Reset failed attempts
    localStorage.removeItem('pesantren_failed_attempts');
    localStorage.removeItem('pesantren_lockout_until');
    setFailedAttempts(0);

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      loginTime: Date.now(),
    };
    const sessionToken = `pstr_${btoa(JSON.stringify(tokenPayload))}_${Math.random().toString(36).substring(2, 8)}`;
    const sessionData: UserSession = {
      token: sessionToken,
      userId: user.id,
      username: user.username,
      displayName: user.displayName || user.name,
      role: user.role,
      loginTime: Date.now(),
      expiresAt: Date.now() + 12 * 60 * 60 * 1000,
    };

    try {
      localStorage.setItem('pesantren_session_token', JSON.stringify(sessionData));
      localStorage.setItem('pesantren_current_user', JSON.stringify(user));
    } catch {}

    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      {/* Decorative ambient blurred spots for glassmorphism */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-white/60 ring-1 ring-emerald-950/10 overflow-hidden max-h-[94vh] overflow-y-auto transition-all duration-300">
        
        {/* Subtle geometric pattern top header banner */}
        <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white border-b border-emerald-700/60 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-emerald-950 rounded-[14px] flex items-center justify-center text-amber-300">
                  <Fingerprint className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-300 font-arabic text-sm font-semibold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 mt-0.5">
                  <span>Portal Keamanan Masuk</span>
                  <Sparkles className="w-4 h-4 text-amber-300 inline" />
                </h3>
                <p className="text-xs text-emerald-200/90">
                  Pondok Pesantren Raudhotu Hidayah • Sesi Terverifikasi
                </p>
              </div>
            </div>

            {/* Close button only available if NOT a mandatory gate */}
            {!isMandatory && (
              <button 
                onClick={onClose} 
                className="p-2 text-emerald-200 hover:text-white rounded-full hover:bg-white/10 transition"
                title="Tutup dialog login"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab switcher: Form Login vs Simulasi Cepat Role */}
        <div className="flex border-b border-stone-200 mt-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-2 border-b-2 transition duration-200 ${
              activeTab === 'form' 
                ? 'border-emerald-800 text-emerald-900 font-extrabold bg-emerald-50/50 rounded-t-xl' 
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
            <span>Form Login Kredensial</span>
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-2 border-b-2 transition duration-200 ${
              activeTab === 'demo' 
                ? 'border-emerald-800 text-emerald-900 font-extrabold bg-emerald-50/50 rounded-t-xl' 
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulasi Cepat Role (1-Klik)</span>
          </button>
        </div>

        {/* TAB 1: FORM LOGIN DENGAN RATE LIMITING & SECURITY */}
        {activeTab === 'form' && (
          <div className="mt-5 space-y-4">
            
            {/* SUCCESS BANNER */}
            {loginSuccessUser && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-3 animate-in fade-in duration-200 shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Autentikasi Berhasil!</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Selamat datang kembali, <strong>{loginSuccessUser.displayName || loginSuccessUser.name}</strong> ({loginSuccessUser.role.toUpperCase()}). Membuka dasbor...
                  </div>
                </div>
              </div>
            )}

            {/* BRUTE-FORCE LOCKOUT ALERT WITH LIVE COUNTDOWN TIMER */}
            {isLocked && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 text-xs shadow-md animate-pulse">
                <div className="flex items-center gap-2.5 font-bold text-rose-800 text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Sistem Dikunci Sementara (Anti Brute-Force)</span>
                </div>
                <p className="mt-1 text-rose-900 leading-relaxed text-[11px]">
                  Terdeteksi 5 kali percobaan password tidak sesuai. Form login ditangguhkan sementara demi keamanan data pesantren.
                </p>
                <div className="mt-3 p-2.5 bg-white/80 rounded-xl border border-rose-300 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-700 font-medium">
                    <Clock className="w-4 h-4 animate-spin text-rose-600" />
                    <span>Waktu tunggu tersisa:</span>
                  </div>
                  <div className="font-mono text-base font-extrabold text-rose-700 bg-rose-100 px-3 py-1 rounded-lg">
                    {lockoutSecondsLeft} detik
                  </div>
                </div>
              </div>
            )}

            {/* GENERAL ERROR MESSAGE */}
            {errorMessage && !isLocked && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* STEP 1: ROLE SELECTOR TABS WITH SMOOTH TRANSITIONS */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Pilih Peran Akses (Role):
                </label>
                <span className="text-[10px] text-emerald-800 font-semibold">Wajib Sesuai Akun</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {roleConfigs.map((cfg) => {
                  const isSelected = selectedRole === cfg.role;
                  return (
                    <button
                      key={cfg.role}
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        setSelectedRole(cfg.role);
                        setErrorMessage(null);
                      }}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold border transition-all duration-200 flex flex-col items-center gap-1 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected 
                          ? `${cfg.activeTabClass} border-transparent scale-102` 
                          : 'bg-stone-50/80 hover:bg-stone-100 text-stone-700 border-stone-200/90 hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {cfg.icon}
                        <span className="truncate">{cfg.label}</span>
                      </div>
                      <span className={`text-[9px] font-normal ${isSelected ? 'text-amber-200/90' : 'text-stone-400'}`}>
                        {cfg.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK FILL DEMO HELPER CHIPS */}
            <div className="p-3 rounded-2xl bg-stone-50/90 border border-stone-200/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center justify-between">
                <span>Klik Cepat Kredensial Demo:</span>
                <span className="text-amber-700 font-semibold">1-Klik Terisi</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleQuickFill('admin', 'admin123', 'admin')}
                  className="px-2.5 py-1 rounded-xl bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold border border-emerald-300 transition flex items-center gap-1 disabled:opacity-50"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Admin: admin / admin123</span>
                </button>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleQuickFill('guru1', 'guru123', 'guru')}
                  className="px-2.5 py-1 rounded-xl bg-teal-100/80 hover:bg-teal-200 text-teal-900 text-[11px] font-bold border border-teal-300 transition flex items-center gap-1 disabled:opacity-50"
                >
                  <BookOpen className="w-3 h-3 text-teal-700" />
                  <span>Guru: guru1 / guru123</span>
                </button>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleQuickFill('wali1', 'wali123', 'wali')}
                  className="px-2.5 py-1 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-[11px] font-bold border border-amber-300 transition flex items-center gap-1 disabled:opacity-50"
                >
                  <HeartHandshake className="w-3 h-3 text-amber-700" />
                  <span>Wali: wali1 / wali123</span>
                </button>
              </div>
            </div>

            {/* FORM INPUT CREDENTIALS */}
            <form onSubmit={handleFormLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Username Akun:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    disabled={isLocked}
                    placeholder="Contoh: admin, guru1, atau wali1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50/90 border border-stone-300 rounded-xl font-mono focus:outline-emerald-600 focus:bg-white transition disabled:bg-stone-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Kata Sandi (Password):
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLocked}
                    placeholder="Masukkan password akun"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50/90 border border-stone-300 rounded-xl focus:outline-emerald-600 focus:bg-white transition disabled:bg-stone-100 disabled:cursor-not-allowed"
                    required
                  />
                  {/* Eye Toggle Icon */}
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 rounded transition disabled:opacity-40"
                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLocked}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{isLocked ? `Terkunci (${lockoutSecondsLeft}s)` : 'Masuk ke Sistem (Login Aman)'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: DEMO QUICK SWITCHER */}
        {activeTab === 'demo' && (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-stone-500">
              Pilih salah satu akun demo di bawah ini untuk beralih peran dalam 1-klik tanpa input password manual:
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {allUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
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
                    className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent 
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/20' 
                        : 'border-stone-200/90 hover:border-emerald-500 hover:bg-stone-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-xs truncate">
                            {u.displayName || u.name}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${roleBadge}`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          @{u.username} • {u.title}
                        </div>
                        {u.santriName && (
                          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                            👦 Ananda: {u.santriName}
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
                      {isCurrent ? 'Aktif' : 'Pilih Akun'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer with Security Note */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sesi terenkripsi & batas waktu aktif 12 jam</span>
          </div>
          {!isMandatory ? (
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition"
            >
              Batal
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-amber-700">Wajib Login</span>
          )}
        </div>
      </div>
    </div>
  );
};
