import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  KeyRound, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  ShieldCheck, 
  GraduationCap, 
  HeartHandshake, 
  Phone, 
  Mail, 
  Sparkles, 
  X, 
  Save, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCog
} from 'lucide-react';
import { UserAccount, RoleType, Santri } from '../types';

interface KelolaPenggunaViewProps {
  usersList: UserAccount[];
  santriList: Santri[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (id: string) => void;
  currentUser: UserAccount;
}

export const KelolaPenggunaView: React.FC<KelolaPenggunaViewProps> = ({
  usersList,
  santriList,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
}) => {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [modalType, setModalType] = useState<'guru' | 'wali' | 'resetPass' | null>(null);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Form State Guru
  const [guruForm, setGuruForm] = useState({
    name: '',
    nip: '',
    mapel: '',
    username: '',
    password: '',
    noHp: '',
    email: '',
  });

  // Form State Wali
  const [waliForm, setWaliForm] = useState({
    name: '',
    username: '',
    password: '',
    noHp: '',
    email: '',
    santriId: santriList[0]?.id || '',
  });

  // Form State Reset Password
  const [resetPassForm, setResetPassForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Open Add Guru Modal
  const handleOpenAddGuru = () => {
    setEditingUser(null);
    setGuruForm({
      name: '',
      nip: '',
      mapel: '',
      username: '',
      password: '',
      noHp: '',
      email: '',
    });
    setShowPassword(false);
    setModalType('guru');
  };

  // Open Edit Guru Modal
  const handleOpenEditGuru = (user: UserAccount) => {
    setEditingUser(user);
    setGuruForm({
      name: user.name,
      nip: user.nip || '',
      mapel: user.mapel || '',
      username: user.username,
      password: user.password || '',
      noHp: user.noHp || '',
      email: user.email || '',
    });
    setShowPassword(false);
    setModalType('guru');
  };

  // Open Add Wali Modal
  const handleOpenAddWali = () => {
    setEditingUser(null);
    setWaliForm({
      name: '',
      username: '',
      password: '',
      noHp: '',
      email: '',
      santriId: santriList[0]?.id || '',
    });
    setShowPassword(false);
    setModalType('wali');
  };

  // Open Edit Wali Modal
  const handleOpenEditWali = (user: UserAccount) => {
    setEditingUser(user);
    setWaliForm({
      name: user.name,
      username: user.username,
      password: user.password || '',
      noHp: user.noHp || '',
      email: user.email || '',
      santriId: user.santriId || santriList[0]?.id || '',
    });
    setShowPassword(false);
    setModalType('wali');
  };

  // Open Reset Password Modal
  const handleOpenResetPass = (user: UserAccount) => {
    setEditingUser(user);
    setResetPassForm({
      newPassword: '',
      confirmPassword: '',
    });
    setShowPassword(false);
    setModalType('resetPass');
  };

  // Save Guru (Add or Edit)
  const handleSaveGuru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruForm.name || !guruForm.username) {
      showToast('error', 'Nama dan Username wajib diisi.');
      return;
    }

    // Check duplicate username
    const existing = usersList.find(u => u.username.toLowerCase() === guruForm.username.toLowerCase() && u.id !== editingUser?.id);
    if (existing) {
      showToast('error', `Username "${guruForm.username}" sudah digunakan akun lain.`);
      return;
    }

    if (!editingUser && (!guruForm.password || guruForm.password.length < 6)) {
      showToast('error', 'Password minimal 6 karakter.');
      return;
    }

    if (editingUser) {
      const updated: UserAccount = {
        ...editingUser,
        name: guruForm.name,
        nip: guruForm.nip,
        mapel: guruForm.mapel,
        username: guruForm.username,
        email: guruForm.email || `${guruForm.username}@raudhotulhidayah.ponpes.id`,
        noHp: guruForm.noHp,
        title: `Dewan Asatidz / Pengampu ${guruForm.mapel || 'Kitab'}`,
        password: guruForm.password || editingUser.password,
      };
      onUpdateUser(updated);
      showToast('success', `Data akun guru "${updated.name}" berhasil diperbarui.`);
    } else {
      const newUser: UserAccount = {
        id: `user_guru_${Date.now()}`,
        name: guruForm.name,
        nip: guruForm.nip,
        mapel: guruForm.mapel,
        username: guruForm.username,
        email: guruForm.email || `${guruForm.username}@raudhotulhidayah.ponpes.id`,
        noHp: guruForm.noHp,
        role: 'guru',
        title: `Dewan Asatidz / Pengampu ${guruForm.mapel || 'Kitab'}`,
        password: guruForm.password || 'guru123',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      };
      onAddUser(newUser);
      showToast('success', `Akun guru baru "${newUser.name}" berhasil ditambahkan.`);
    }

    setModalType(null);
  };

  // Save Wali (Add or Edit)
  const handleSaveWali = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waliForm.name || !waliForm.username) {
      showToast('error', 'Nama Wali dan Username wajib diisi.');
      return;
    }

    const existing = usersList.find(u => u.username.toLowerCase() === waliForm.username.toLowerCase() && u.id !== editingUser?.id);
    if (existing) {
      showToast('error', `Username "${waliForm.username}" sudah digunakan akun lain.`);
      return;
    }

    if (!editingUser && (!waliForm.password || waliForm.password.length < 6)) {
      showToast('error', 'Password minimal 6 karakter.');
      return;
    }

    const targetSantri = santriList.find(s => s.id === waliForm.santriId);
    const santriName = targetSantri ? targetSantri.nama : '';

    if (editingUser) {
      const updated: UserAccount = {
        ...editingUser,
        name: waliForm.name,
        username: waliForm.username,
        email: waliForm.email || `${waliForm.username}@gmail.com`,
        noHp: waliForm.noHp,
        santriId: waliForm.santriId,
        santriName,
        title: santriName ? `Wali Santri dari ${santriName}` : 'Wali Santri',
        password: waliForm.password || editingUser.password,
      };
      onUpdateUser(updated);
      showToast('success', `Data akun wali santri "${updated.name}" berhasil diperbarui.`);
    } else {
      const newUser: UserAccount = {
        id: `user_wali_${Date.now()}`,
        name: waliForm.name,
        username: waliForm.username,
        email: waliForm.email || `${waliForm.username}@gmail.com`,
        noHp: waliForm.noHp,
        role: 'wali',
        santriId: waliForm.santriId,
        santriName,
        title: santriName ? `Wali Santri dari ${santriName}` : 'Wali Santri',
        password: waliForm.password || 'wali123',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      };
      onAddUser(newUser);
      showToast('success', `Akun wali santri baru "${newUser.name}" berhasil ditambahkan.`);
    }

    setModalType(null);
  };

  // Save Reset Password
  const handleSaveResetPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!resetPassForm.newPassword || resetPassForm.newPassword.length < 6) {
      showToast('error', 'Password baru minimal 6 karakter.');
      return;
    }

    if (resetPassForm.newPassword !== resetPassForm.confirmPassword) {
      showToast('error', 'Konfirmasi password baru tidak cocok.');
      return;
    }

    const updated: UserAccount = {
      ...editingUser,
      password: resetPassForm.newPassword,
    };

    onUpdateUser(updated);
    showToast('success', `Password akun "${editingUser.name}" berhasil direset.`);
    setModalType(null);
  };

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.santriName && u.santriName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.noHp && u.noHp.includes(searchQuery));
    return matchRole && matchSearch;
  });

  const countAdmin = usersList.filter(u => u.role === 'admin').length;
  const countGuru = usersList.filter(u => u.role === 'guru').length;
  const countWali = usersList.filter(u => u.role === 'wali').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
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
          <button onClick={() => setToast(null)} className="text-stone-400 hover:text-stone-700 ml-3">✕</button>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-arabic text-base font-semibold">إدارة المستخدمين</span>
            <span className="text-stone-300">•</span>
            <h2 className="text-lg font-bold text-stone-800">Manajemen Pengguna & Hak Akses</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Kelola akun Guru/Asatidz dan akun Wali Santri terhubung (Khusus Akses Administrator)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAddGuru}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>+ Tambah Akun Guru</span>
          </button>

          <button
            onClick={handleOpenAddWali}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>+ Tambah Akun Wali Santri</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Pengguna</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{usersList.length}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">Akun terdaftar di sistem</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Dewan Asatidz</span>
          <div className="text-2xl font-bold text-teal-700 mt-1">{countGuru}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">Guru KBM & Pengasuh</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Wali Santri</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{countWali}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">Akun orang tua terhubung</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Administrator</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{countAdmin}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">Pengurus Utama Pondok</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Peran / Role:
          </label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
          >
            <option value="all">Semua Peran ({usersList.length})</option>
            <option value="admin">Administrator ({countAdmin})</option>
            <option value="guru">Dewan Asatidz / Guru ({countGuru})</option>
            <option value="wali">Wali Santri ({countWali})</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Cari Pengguna:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, username, email, no HP, atau nama ananda santri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama & Username</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Detail Peran / Santri Terhubung</th>
                <th className="py-3 px-4">Kontak (HP & Email)</th>
                <th className="py-3 px-4 text-center w-36">Aksi Pengguna</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((u, idx) => {
                const isCurrentAdmin = u.id === currentUser.id;
                const roleBadge = 
                  u.role === 'admin' 
                    ? 'bg-emerald-800 text-amber-200 border-emerald-700' 
                    : u.role === 'guru' 
                      ? 'bg-teal-700 text-teal-100 border-teal-600' 
                      : 'bg-amber-600 text-white border-amber-700';

                return (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 text-center text-stone-400 font-medium">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrentAdmin && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>@{u.username}</span>
                            <span>•</span>
                            <span className="text-stone-400">Pass: {u.password || '••••••'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-xs ${roleBadge}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {u.role === 'guru' ? (
                        <div>
                          <div className="font-semibold text-stone-800">{u.mapel || 'Pengampu Kitab'}</div>
                          {u.nip && <div className="text-[10px] text-stone-400 font-mono">NIP: {u.nip}</div>}
                        </div>
                      ) : u.role === 'wali' ? (
                        <div>
                          {u.santriName ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                👦 {u.santriName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic">Belum ditautkan</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-600 font-medium">{u.title}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {u.noHp && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-700">
                            <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{u.noHp}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-stone-500">
                          <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Reset password button */}
                        <button
                          onClick={() => handleOpenResetPass(u)}
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 border border-stone-200"
                          title="Reset Password Pengguna"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit button */}
                        {u.role === 'guru' && (
                          <button
                            onClick={() => handleOpenEditGuru(u)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-stone-200"
                            title="Edit Data Guru"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {u.role === 'wali' && (
                          <button
                            onClick={() => handleOpenEditWali(u)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-stone-200"
                            title="Edit Data Wali Santri"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete button (cannot delete own logged in admin) */}
                        {!isCurrentAdmin && (
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus akun ${u.name} (@${u.username})?`)) {
                                onDeleteUser(u.id);
                                showToast('success', `Akun ${u.name} berhasil dihapus.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-stone-200"
                            title="Hapus Akun Pengguna"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          MODAL: TAMBAH / EDIT AKUN GURU
         ========================================================================= */}
      {modalType === 'guru' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
                <span>{editingUser ? 'Edit Akun Guru / Asatidz' : 'Tambah Akun Guru Baru'}</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuru} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nama Lengkap Guru (beserta Gelar):</label>
                <input
                  type="text"
                  placeholder="Contoh: Ustadz Ridwan Al-Bantani, Lc."
                  value={guruForm.name}
                  onChange={(e) => setGuruForm({ ...guruForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">NIP / ID Guru:</label>
                  <input
                    type="text"
                    placeholder="Contoh: 198504122010011002"
                    value={guruForm.nip}
                    onChange={(e) => setGuruForm({ ...guruForm, nip: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Jabatan / Mapel Kitab:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Nahwu & Fiqih"
                    value={guruForm.mapel}
                    onChange={(e) => setGuruForm({ ...guruForm, mapel: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Username Login:</label>
                  <input
                    type="text"
                    placeholder="Contoh: guru1"
                    value={guruForm.username}
                    onChange={(e) => setGuruForm({ ...guruForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Password {editingUser && '(Kosongkan jika tidak diubah)'}:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={editingUser ? 'Tetap gunakan yang lama' : 'Min. 6 karakter'}
                      value={guruForm.password}
                      onChange={(e) => setGuruForm({ ...guruForm, password: e.target.value })}
                      className="w-full px-3 py-2 pr-9 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nomor WhatsApp / HP:</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-3456-7890"
                    value={guruForm.noHp}
                    onChange={(e) => setGuruForm({ ...guruForm, noHp: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email:</label>
                  <input
                    type="email"
                    placeholder="guru@raudhotulhidayah.ponpes.id"
                    value={guruForm.email}
                    onChange={(e) => setGuruForm({ ...guruForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>{editingUser ? 'Simpan Perubahan' : 'Buat Akun Guru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TAMBAH / EDIT AKUN WALI SANTRI
         ========================================================================= */}
      {modalType === 'wali' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-600" />
                <span>{editingUser ? 'Edit Akun Wali Santri' : 'Tambah Akun Wali Santri Baru'}</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWali} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nama Lengkap Orang Tua / Wali:</label>
                <input
                  type="text"
                  placeholder="Contoh: Bpk. H. Syamsuddin Nur"
                  value={waliForm.name}
                  onChange={(e) => setWaliForm({ ...waliForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pilih Ananda Santri (Menghubungkan Akun dengan Data Santri):
                </label>
                <select
                  value={waliForm.santriId}
                  onChange={(e) => setWaliForm({ ...waliForm, santriId: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                  required
                >
                  {santriList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.nis} - {s.kamar})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-400 mt-1">
                  Akun wali hanya akan bisa memantau kehadiran, perizinan, takzir, dan rapor santri yang dipilih ini.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Username Login:</label>
                  <input
                    type="text"
                    placeholder="Contoh: wali1"
                    value={waliForm.username}
                    onChange={(e) => setWaliForm({ ...waliForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Password {editingUser && '(Kosongkan jika tidak diubah)'}:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={editingUser ? 'Tetap gunakan yang lama' : 'Min. 6 karakter'}
                      value={waliForm.password}
                      onChange={(e) => setWaliForm({ ...waliForm, password: e.target.value })}
                      className="w-full px-3 py-2 pr-9 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nomor WhatsApp / Telepon:</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-9876-5432"
                    value={waliForm.noHp}
                    onChange={(e) => setWaliForm({ ...waliForm, noHp: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email:</label>
                  <input
                    type="email"
                    placeholder="wali@gmail.com"
                    value={waliForm.email}
                    onChange={(e) => setWaliForm({ ...waliForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingUser ? 'Simpan Perubahan' : 'Buat Akun Wali'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RESET PASSWORD PENGGUNA
         ========================================================================= */}
      {modalType === 'resetPass' && editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>Reset Password Pengguna</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 mb-4 text-xs">
              <div>Nama: <strong>{editingUser.name}</strong></div>
              <div className="text-stone-500 font-mono mt-0.5">Username: @{editingUser.username} ({editingUser.role.toUpperCase()})</div>
            </div>

            <form onSubmit={handleSaveResetPass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Password Baru (Min. 6 Karakter):</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password baru"
                    value={resetPassForm.newPassword}
                    onChange={(e) => setResetPassForm({ ...resetPassForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-9 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Konfirmasi Password Baru:</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ulangi password baru"
                  value={resetPassForm.confirmPassword}
                  onChange={(e) => setResetPassForm({ ...resetPassForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset & Simpan Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
