import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  KeyRound,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { LembagaSettings, RoleType, UserAccount } from '../types';

interface PengaturanViewProps {
  settings: LembagaSettings;
  onUpdateSettings: (newSettings: LembagaSettings) => void;
  userRole: RoleType;
  currentUser: UserAccount;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  settings,
  onUpdateSettings,
  userRole,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'identitas' | 'keamanan'>('identitas');

  // Form State for Lembaga
  const [formData, setFormData] = useState<LembagaSettings>({ ...settings });

  // Form State for Admin Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Feedback Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Logo Upload (converts image to Base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'Harap pilih berkas gambar yang valid (JPG, PNG, WebP, SVG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showFeedback('error', 'Ukuran gambar maksimal 2MB untuk performa terbaik.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, logoUrl: base64 }));
      showFeedback('success', 'Gambar logo berhasil diunggah dan dikonversi.');
    };
    reader.onerror = () => {
      showFeedback('error', 'Gagal membaca berkas gambar.');
    };
    reader.readAsDataURL(file);
  };

  // Remove Logo
  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }));
  };

  // Save Identitas Lembaga
  const handleSaveIdentitas = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      showFeedback('error', 'Hanya Admin yang memiliki hak akses untuk mengubah identitas lembaga.');
      return;
    }

    if (!formData.namaLembaga.trim()) {
      showFeedback('error', 'Nama Lembaga tidak boleh kosong.');
      return;
    }

    onUpdateSettings(formData);
    showFeedback('success', 'Identitas lembaga dan kop surat resmi berhasil disimpan dan diperbarui secara reaktif.');
  };

  // Save Keamanan Admin
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      showFeedback('error', 'Hanya Admin yang dapat mengubah kredensial keamanan.');
      return;
    }

    // Check if password change is attempted
    if (passwordData.newPassword || passwordData.confirmPassword || passwordData.currentPassword) {
      if (!passwordData.currentPassword) {
        showFeedback('error', 'Harap masukkan password saat ini untuk verifikasi keamanan.');
        return;
      }

      // Check stored password in localStorage, default is "admin123"
      const storedPass = localStorage.getItem('pesantren_admin_password') || 'admin123';
      if (passwordData.currentPassword !== storedPass) {
        showFeedback('error', 'Password saat ini tidak cocok! (Default: admin123)');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        showFeedback('error', 'Password baru minimal harus 6 karakter.');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        showFeedback('error', 'Konfirmasi password baru tidak cocok dengan password baru.');
        return;
      }

      // Save new password to localStorage
      localStorage.setItem('pesantren_admin_password', passwordData.newPassword);
    }

    // Update admin username/email
    const updated = {
      ...formData,
      adminUsername: formData.adminUsername.trim() || 'admin_raudhotu',
      adminEmail: formData.adminEmail.trim() || 'admin@raudhotulhidayah.ponpes.id',
    };

    setFormData(updated);
    onUpdateSettings(updated);

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    showFeedback('success', 'Kredensial dan pengaturan keamanan Admin berhasil diperbarui!');
  };

  // Reset to default
  const handleResetDefault = () => {
    if (confirm('Kembalikan seluruh identitas lembaga ke pengaturan awal Pondok Pesantren Raudhotu Hidayah?')) {
      const defaultData: LembagaSettings = {
        namaLembaga: 'Pondok Pesantren Raudhotu Hidayah',
        subNamaTagline: 'Pondok Pesantren Tahfizh, Kitab Kuning & Modern Terpadu',
        alamatLengkap: 'Jl. Pesantren No. 14, Ciamis, Jawa Barat 46211',
        telepon: '(0265) 778899 / 0812-9876-5432',
        email: 'info@raudhotulhidayah.ponpes.id',
        namaPengasuh: 'KH. Abdul Hadi',
        namaKepalaKesantrian: 'Ustadz H. Ahmad Muzammil, S.Pd.I',
        logoUrl: '',
        adminUsername: 'admin_raudhotu',
        adminEmail: 'admin@raudhotulhidayah.ponpes.id',
      };
      setFormData(defaultData);
      onUpdateSettings(defaultData);
      localStorage.setItem('pesantren_admin_password', 'admin123');
      showFeedback('success', 'Pengaturan berhasil dikembalikan ke standar awal.');
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Toast Alert Feedback */}
      {toast && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-stone-400 hover:text-stone-700 ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-arabic text-base font-semibold">الإعدادات</span>
            <span className="text-stone-300">•</span>
            <h2 className="text-lg font-bold text-stone-800">Pengaturan Sistem & Profil Lembaga</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Konfigurasi identitas pondok pesantren, logo, alamat kop surat dinas, dan keamanan akun
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl text-xs font-semibold gap-1 self-start md:self-auto border border-stone-200/70">
          <button
            onClick={() => setActiveTab('identitas')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'identitas'
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Identitas Lembaga & Kop</span>
          </button>

          <button
            onClick={() => setActiveTab('keamanan')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'keamanan'
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Keamanan & Akun Admin</span>
          </button>
        </div>
      </div>

      {/* Role permission info banner */}
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200/80 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Anda login sebagai <strong>{currentUser.role.toUpperCase()}</strong>. Fitur edit pengaturan sistem dan sandi hanya dapat diubah oleh Administrator Utama.
            </span>
          </span>
          <span className="text-[11px] font-semibold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
            Read-Only
          </span>
        </div>
      )}

      {/* TAB 1: IDENTITAS LEMBAGA & KOP SURAT */}
      {activeTab === 'identitas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Kop Surat & Logo Real-Time */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Preview Kop Surat Resmi</span>
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  Live Sync
                </span>
              </div>

              {/* Kop Preview Card */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center text-stone-900 space-y-1">
                {/* Logo Preview */}
                <div className="flex justify-center mb-2">
                  {formData.logoUrl ? (
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo Lembaga" 
                      className="w-14 h-14 object-contain rounded-lg border border-stone-200 bg-white p-1 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 p-0.5 shadow-sm flex items-center justify-center">
                      <div className="w-full h-full bg-emerald-950 rounded-lg flex items-center justify-center text-amber-400 border border-amber-400/30">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <path d="M12 2L4 7v13h16V7L12 2z" strokeLinejoin="round" />
                          <path d="M12 2v7" />
                          <path d="M9 13a3 3 0 0 1 6 0v7H9v-7z" fill="currentColor" fillOpacity="0.2" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                  Yayasan Pendidikan & Kepesantrenan
                </div>
                <h4 className="font-bold text-sm text-stone-950 uppercase tracking-wide">
                  {formData.namaLembaga || 'Pondok Pesantren Raudhotu Hidayah'}
                </h4>
                <p className="text-[11px] text-emerald-800 font-medium">
                  {formData.subNamaTagline || 'Pondok Pesantren Tahfizh & Modern'}
                </p>
                <p className="text-[10px] text-stone-500 italic mt-1 leading-tight">
                  {formData.alamatLengkap}
                </p>
                <p className="text-[10px] text-stone-500">
                  Telp: {formData.telepon} • {formData.email}
                </p>
                <div className="w-full h-0.5 bg-stone-900 mt-2" />
                <div className="w-full h-px bg-stone-400 mt-0.5" />
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Pengasuh Pondok:</span>
                  <strong className="text-stone-800">{formData.namaPengasuh}</strong>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Kepala Kesantrian:</span>
                  <strong className="text-stone-800">{formData.namaKepalaKesantrian}</strong>
                </div>
              </div>
            </div>

            {/* Quick Reset Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={handleResetDefault}
                className="w-full px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Standar Awal Pondok</span>
              </button>
            )}
          </div>

          {/* Form Identitas Lembaga */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Formulir Data Pokok Identitas Lembaga</span>
              </h3>

              <form onSubmit={handleSaveIdentitas} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Nama Resmi Lembaga / Pesantren:
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={formData.namaLembaga}
                      onChange={(e) => setFormData({ ...formData, namaLembaga: e.target.value })}
                      placeholder="Contoh: Pondok Pesantren Raudhotu Hidayah"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 font-semibold disabled:bg-stone-100 disabled:text-stone-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Sub-nama / Tagline Lembaga:
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={formData.subNamaTagline}
                      onChange={(e) => setFormData({ ...formData, subNamaTagline: e.target.value })}
                      placeholder="Contoh: Pondok Pesantren Tahfizh, Kitab Kuning & Modern Terpadu"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100 disabled:text-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Alamat Lengkap Lembaga (Muncul di Kop Surat):
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isAdmin}
                    value={formData.alamatLengkap}
                    onChange={(e) => setFormData({ ...formData, alamatLengkap: e.target.value })}
                    placeholder="Contoh: Jl. Pesantren No. 14, Ciamis, Jawa Barat 46211"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100 disabled:text-stone-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Nomor Telepon / WhatsApp Resmi:
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={formData.telepon}
                        onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                        placeholder="Contoh: (0265) 778899 / 0812-9876-5432"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100 disabled:text-stone-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Alamat Email Resmi Lembaga:
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        disabled={!isAdmin}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Contoh: info@raudhotulhidayah.ponpes.id"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100 disabled:text-stone-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Nama Pengasuh Pondok (Tanda Tangan Surat Resmi):
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={formData.namaPengasuh}
                        onChange={(e) => setFormData({ ...formData, namaPengasuh: e.target.value })}
                        placeholder="Contoh: KH. Abdul Hadi"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 font-semibold disabled:bg-stone-100 disabled:text-stone-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Kepala Bidang Kesantrian / Pengurus:
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={formData.namaKepalaKesantrian}
                        onChange={(e) => setFormData({ ...formData, namaKepalaKesantrian: e.target.value })}
                        placeholder="Contoh: Ustadz H. Ahmad Muzammil, S.Pd.I"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 font-semibold disabled:bg-stone-100 disabled:text-stone-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload Section */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-700" />
                        <span>Ikon / Logo Lembaga</span>
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Unggah gambar logo (PNG, JPG, WebP) yang akan otomatis dikonversi ke Base64 dan disimpan di sistem.
                      </p>
                    </div>

                    {formData.logoUrl && isAdmin && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-rose-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Logo</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    {/* File upload input */}
                    {isAdmin && (
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Pilih Berkas Gambar dari Komputer / HP:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="w-full text-xs text-stone-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-800 file:text-white hover:file:bg-emerald-900 cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Or URL */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Atau Masukkan URL Gambar:
                      </label>
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={formData.logoUrl?.startsWith('data:') ? 'Terpasang (Base64 Image)' : formData.logoUrl || ''}
                        onChange={(e) => {
                          if (!e.target.value.startsWith('Terpasang')) {
                            setFormData({ ...formData, logoUrl: e.target.value });
                          }
                        }}
                        placeholder="https://example.com/logo-pesantren.png"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100 disabled:text-stone-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                {isAdmin && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Simpan Pengaturan Identitas</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KEAMANAN & AKSES LOGIN ADMIN */}
      {activeTab === 'keamanan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="font-bold text-sm text-stone-900">Hak Akses & Keamanan</h4>
                <p className="text-[11px] text-stone-500">Pondok Pesantren Raudhotu Hidayah</p>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Akun Administrator Utama</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Akun Admin memiliki hak kendali penuh atas data santri, perizinan surat jalan, catatan takzir keamanan, hingga konfigurasi kop surat.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-stone-400">Status Password Saat Ini:</span>
              <div className="text-xs font-mono font-semibold text-stone-800">
                Tersimpan di Penyimpanan Aman Browser (LocalStorage)
              </div>
              <div className="text-[11px] text-stone-500">
                Password Bawaan: <code className="bg-stone-200 px-1.5 py-0.2 rounded text-stone-800 font-bold">admin123</code>
              </div>
            </div>
          </div>

          {/* Security Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Ubah Kredensial & Sandi Masuk Admin</span>
              </h3>

              <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Username / Nama Pengguna Admin:
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        disabled={!isAdmin}
                        value={formData.adminUsername}
                        onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                        placeholder="admin_raudhotu"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 font-mono disabled:bg-stone-100 disabled:text-stone-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Email Pemulihan Akun Admin:
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        disabled={!isAdmin}
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        placeholder="admin@raudhotulhidayah.ponpes.id"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 font-mono disabled:bg-stone-100 disabled:text-stone-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <h4 className="font-bold text-stone-800 text-xs">
                    Perbarui Kata Sandi (Password):
                  </h4>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Password Saat Ini (Verifikasi Keamanan):
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        disabled={!isAdmin}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Masukkan password saat ini (Default: admin123)"
                        className="w-full pl-3 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Password Baru (Min. 6 Karakter):
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          disabled={!isAdmin}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Masukkan password baru"
                          className="w-full pl-3 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Konfirmasi Password Baru:
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          disabled={!isAdmin}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Ulangi password baru"
                          className="w-full pl-3 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600 disabled:bg-stone-100"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Simpan Perubahan Keamanan</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
