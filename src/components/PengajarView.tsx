import React, { useState } from 'react';
import { 
  GraduationCap, 
  FileCheck, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  Plus, 
  Check, 
  X, 
  Clock, 
  Download, 
  MessageSquare,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  IzinMengajar, 
  JurnalHarian, 
  RoleType, 
  UserAccount 
} from '../types';

interface PengajarViewProps {
  currentUser: UserAccount;
  izinMengajarList: IzinMengajar[];
  onAddIzinMengajar: (izin: IzinMengajar) => void;
  onUpdateStatusIzin: (id: string, status: 'Disetujui' | 'Ditolak', catatan?: string) => void;
  jurnalList: JurnalHarian[];
  onAddJurnal: (jurnal: JurnalHarian) => void;
  onNavigateToLaporan: () => void;
}

export const PengajarView: React.FC<PengajarViewProps> = ({
  currentUser,
  izinMengajarList,
  onAddIzinMengajar,
  onUpdateStatusIzin,
  jurnalList,
  onAddJurnal,
  onNavigateToLaporan,
}) => {
  const [subTab, setSubTab] = useState<'jurnal' | 'izin'>('jurnal');

  // Form state for Jurnal
  const [showJurnalForm, setShowJurnalForm] = useState(false);
  const [jurnalForm, setJurnalForm] = useState({
    tanggal: '2026-10-07',
    namaUstadz: currentUser.name,
    kelas: 'Wustha A',
    kitab: 'Fathul Qorib Al-Mujib',
    babMateri: '',
    halaman: '',
    catatanSantri: '',
    kendalaKBM: '',
    jumlahHadir: 12,
    jumlahSantri: 12,
  });

  // Form state for Izin Mengajar
  const [showIzinForm, setShowIzinForm] = useState(false);
  const [izinForm, setIzinForm] = useState({
    tanggalMulai: '2026-10-10',
    tanggalSelesai: '2026-10-10',
    mapelKitab: 'Matan Al-Jurumiyyah (Nahwu) - Wustha A',
    alasan: '',
    ustadzBadal: 'Ustadz Faisal Basri, S.Hum',
  });

  const handleSaveJurnal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jurnalForm.babMateri || !jurnalForm.kitab) return;

    const newJurnal: JurnalHarian = {
      id: `jrn_${Date.now()}`,
      tanggal: jurnalForm.tanggal,
      namaUstadz: currentUser.role === 'admin' ? jurnalForm.namaUstadz : currentUser.name,
      kelas: jurnalForm.kelas,
      kitab: jurnalForm.kitab,
      babMateri: jurnalForm.babMateri,
      halaman: jurnalForm.halaman,
      catatanSantri: jurnalForm.catatanSantri,
      kendalaKBM: jurnalForm.kendalaKBM,
      jumlahHadir: Number(jurnalForm.jumlahHadir),
      jumlahSantri: Number(jurnalForm.jumlahSantri),
    };

    onAddJurnal(newJurnal);
    setShowJurnalForm(false);
    setJurnalForm({
      ...jurnalForm,
      babMateri: '',
      halaman: '',
      catatanSantri: '',
      kendalaKBM: '',
    });
  };

  const handleSaveIzin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!izinForm.alasan) return;

    const newIzin: IzinMengajar = {
      id: `im_${Date.now()}`,
      ustadzId: currentUser.id,
      namaUstadz: currentUser.name,
      tanggalMulai: izinForm.tanggalMulai,
      tanggalSelesai: izinForm.tanggalSelesai,
      mapelKitab: izinForm.mapelKitab,
      alasan: izinForm.alasan,
      ustadzBadal: izinForm.ustadzBadal,
      status: 'Menunggu',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddIzinMengajar(newIzin);
    setShowIzinForm(false);
    setIzinForm({
      ...izinForm,
      alasan: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Modul Dewan Asatidz & Pengajar</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Jurnal Harian Kegiatan Belajar Mengajar (KBM) & Pengajuan Izin Berhalangan Mengajar
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSubTab('jurnal')}
            className={`px-3 py-1.5 rounded-lg transition ${
              subTab === 'jurnal' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Jurnal Harian KBM
          </button>
          <button
            onClick={() => setSubTab('izin')}
            className={`px-3 py-1.5 rounded-lg transition ${
              subTab === 'izin' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Izin Mengajar & Badal
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: JURNAL HARIAN KBM */}
      {subTab === 'jurnal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Riwayat Jurnal KBM Asatidz ({jurnalList.length} Sesi Terdata)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToLaporan}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-700 font-semibold hover:bg-stone-50 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Jurnal</span>
              </button>

              <button
                onClick={() => setShowJurnalForm(!showJurnalForm)}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showJurnalForm ? 'Tutup Formulir' : 'Isi Jurnal Baru'}</span>
              </button>
            </div>
          </div>

          {/* Form input Jurnal */}
          {showJurnalForm && (
            <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-md">
              <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Formulir Pengisian Jurnal Harian Pengajar</span>
              </h3>

              <form onSubmit={handleSaveJurnal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Tanggal KBM:</label>
                    <input
                      type="date"
                      value={jurnalForm.tanggal}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, tanggal: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Nama Ustadz Pengampu:</label>
                    <input
                      type="text"
                      value={jurnalForm.namaUstadz}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, namaUstadz: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Kelas Madrasah:</label>
                    <select
                      value={jurnalForm.kelas}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, kelas: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="Ula A">Ula A</option>
                      <option value="Ula B">Ula B</option>
                      <option value="Wustha A">Wustha A</option>
                      <option value="Wustha B">Wustha B</option>
                      <option value="Ulya">Ulya</option>
                      <option value="Semua Tingkat">Semua Tingkat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Nama Kitab / Pelajaran:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Fathul Qorib Al-Mujib"
                      value={jurnalForm.kitab}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, kitab: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Bab / Materi yang Diajarkan:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bab Wudhu, Syarat dan Rukun Wudhu"
                      value={jurnalForm.babMateri}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, babMateri: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Capaian Halaman / Bait Nadhom:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Halaman 14 - 18 / Bait 15 - 28"
                      value={jurnalForm.halaman}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, halaman: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Catatan Perkembangan Santri:</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Santri memahami kaidah dengan lancar, hafalan mutun tepat waktu..."
                      value={jurnalForm.catatanSantri}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, catatanSantri: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Kendala KBM / Catatan Khusus:</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Beberapa santri memerlukan bimbingan tambahan dalam i'rab..."
                      value={jurnalForm.kendalaKBM}
                      onChange={(e) => setJurnalForm({ ...jurnalForm, kendalaKBM: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJurnalForm(false)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-600 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
                  >
                    Simpan Jurnal KBM
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of journals */}
          <div className="space-y-3">
            {jurnalList.map((jurnal) => (
              <div 
                key={jurnal.id}
                className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-emerald-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900">{jurnal.kitab}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold">
                        {jurnal.kelas}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Pengampu: <strong className="text-stone-800">{jurnal.namaUstadz}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-stone-500">
                      📅 {jurnal.tanggal}
                    </span>
                    <div className="text-[11px] text-emerald-700 font-semibold">
                      Kehadiran: {jurnal.jumlahHadir}/{jurnal.jumlahSantri} Santri
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Materi Pembahasan:
                    </div>
                    <div className="font-semibold text-stone-800">{jurnal.babMateri}</div>
                    <div className="text-stone-500">Halaman / Capaian: {jurnal.halaman}</div>
                  </div>

                  <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Catatan & Kendala KBM:
                    </div>
                    <p className="text-stone-700">{jurnal.catatanSantri || 'KBM berjalan lancar dan tertib.'}</p>
                    {jurnal.kendalaKBM && (
                      <p className="text-amber-800 text-[11px] font-medium mt-1">
                        ⚠️ Kendala: {jurnal.kendalaKBM}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: IZIN MENGAJAR & USTADZ BADAL */}
      {subTab === 'izin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Daftar Pengajuan Izin Mengajar Asatidz ({izinMengajarList.length})
            </span>

            <button
              onClick={() => setShowIzinForm(!showIzinForm)}
              className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showIzinForm ? 'Tutup Formulir' : 'Ajukan Izin Mengajar'}</span>
            </button>
          </div>

          {/* Form Izin Mengajar */}
          {showIzinForm && (
            <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-md">
              <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-700" />
                <span>Formulir Pengajuan Izin Mengajar Ustadz</span>
              </h3>

              <form onSubmit={handleSaveIzin} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Mulai Tanggal:</label>
                    <input
                      type="date"
                      value={izinForm.tanggalMulai}
                      onChange={(e) => setIzinForm({ ...izinForm, tanggalMulai: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Sampai Tanggal:</label>
                    <input
                      type="date"
                      value={izinForm.tanggalSelesai}
                      onChange={(e) => setIzinForm({ ...izinForm, tanggalSelesai: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Kitab / Halaqoh:</label>
                    <input
                      type="text"
                      value={izinForm.mapelKitab}
                      onChange={(e) => setIzinForm({ ...izinForm, mapelKitab: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Ustadz Badal (Pengganti):</label>
                    <input
                      type="text"
                      placeholder="Nama ustadz badal yang bersedia menggantikan"
                      value={izinForm.ustadzBadal}
                      onChange={(e) => setIzinForm({ ...izinForm, ustadzBadal: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Alasan Berhalangan:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Undangan Bahtsul Masail, keluarga sakit..."
                      value={izinForm.alasan}
                      onChange={(e) => setIzinForm({ ...izinForm, alasan: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIzinForm(false)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    Kirim Permohonan Izin
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of leave requests */}
          <div className="space-y-3">
            {izinMengajarList.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-stone-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-stone-900">{item.namaUstadz}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      item.status === 'Ditolak' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Mata Pelajaran: <strong>{item.mapelKitab}</strong>
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Alasan: "{item.alasan}"
                  </p>
                  <p className="text-xs text-emerald-800 font-medium mt-1">
                    🔄 Ustadz Badal (Pengganti): {item.ustadzBadal}
                  </p>
                  <div className="text-[11px] text-stone-400 mt-1">
                    Tanggal Izin: {item.tanggalMulai} {item.tanggalMulai !== item.tanggalSelesai && `s/d ${item.tanggalSelesai}`} • Diajukan: {item.createdAt}
                  </div>
                </div>

                {/* Admin actions: Approve / Reject */}
                {currentUser.role === 'admin' && item.status === 'Menunggu' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateStatusIzin(item.id, 'Disetujui', 'Disetujui oleh Kepala Kesantrian')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatusIzin(item.id, 'Ditolak', 'Jadwal ujian santri tidak dapat diganti')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
