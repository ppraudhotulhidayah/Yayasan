import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Search, 
  Filter, 
  Save, 
  CheckCheck, 
  Download, 
  Sparkles, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { 
  Santri, 
  AbsensiRecord, 
  SesiAbsensi, 
  StatusKehadiran, 
  RoleType 
} from '../types';

interface AbsensiViewProps {
  santriList: Santri[];
  absensiList: AbsensiRecord[];
  onSaveAbsensi: (updated: AbsensiRecord[]) => void;
  userRole: RoleType;
  userName: string;
  onNavigateToLaporan: () => void;
}

export const AbsensiView: React.FC<AbsensiViewProps> = ({
  santriList,
  absensiList,
  onSaveAbsensi,
  userRole,
  userName,
  onNavigateToLaporan,
}) => {
  const [selectedTanggal, setSelectedTanggal] = useState<string>('2026-10-07');
  const [selectedSesi, setSelectedSesi] = useState<SesiAbsensi>('ngaji_asar');
  const [filterKamar, setFilterKamar] = useState<string>('all');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Local state for the currently displayed attendance records
  const [currentAttendance, setCurrentAttendance] = useState<{ [santriId: string]: { status: StatusKehadiran; keterangan?: string } }>(() => {
    const map: { [santriId: string]: { status: StatusKehadiran; keterangan?: string } } = {};
    santriList.forEach(s => {
      const existing = absensiList.find(a => a.santriId === s.id && a.sesi === selectedSesi && a.tanggal === selectedTanggal);
      map[s.id] = {
        status: existing ? existing.status : (s.statusMukim === 'Izin Pulang' ? 'Pulang' : 'Hadir'),
        keterangan: existing?.keterangan || ''
      };
    });
    return map;
  });

  // When sesi or date changes, re-sync from absensiList
  const handleSessionOrDateChange = (newSesi: SesiAbsensi, newTanggal: string) => {
    setSelectedSesi(newSesi);
    setSelectedTanggal(newTanggal);
    const map: { [santriId: string]: { status: StatusKehadiran; keterangan?: string } } = {};
    santriList.forEach(s => {
      const existing = absensiList.find(a => a.santriId === s.id && a.sesi === newSesi && a.tanggal === newTanggal);
      map[s.id] = {
        status: existing ? existing.status : (s.statusMukim === 'Izin Pulang' ? 'Pulang' : 'Hadir'),
        keterangan: existing?.keterangan || ''
      };
    });
    setCurrentAttendance(map);
  };

  const handleStatusChange = (santriId: string, status: StatusKehadiran) => {
    if (userRole === 'wali') return; // Read-only
    setCurrentAttendance(prev => ({
      ...prev,
      [santriId]: {
        ...prev[santriId],
        status
      }
    }));
  };

  const handleKeteranganChange = (santriId: string, keterangan: string) => {
    if (userRole === 'wali') return;
    setCurrentAttendance(prev => ({
      ...prev,
      [santriId]: {
        ...prev[santriId],
        keterangan
      }
    }));
  };

  const handleSetAllHadir = () => {
    if (userRole === 'wali') return;
    setCurrentAttendance(prev => {
      const next = { ...prev };
      filteredSantri.forEach(s => {
        if (s.statusMukim !== 'Izin Pulang') {
          next[s.id] = { ...next[s.id], status: 'Hadir' };
        }
      });
      return next;
    });
  };

  const handleSave = () => {
    if (userRole === 'wali') return;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Construct updated list
    const otherRecords = absensiList.filter(a => !(a.tanggal === selectedTanggal && a.sesi === selectedSesi));
    const newRecords: AbsensiRecord[] = santriList.map(s => {
      const cur = currentAttendance[s.id] || { status: 'Hadir' };
      return {
        id: `abs_${s.id}_${selectedSesi}_${selectedTanggal}`,
        santriId: s.id,
        tanggal: selectedTanggal,
        sesi: selectedSesi,
        status: cur.status,
        keterangan: cur.keterangan,
        petugas: userName,
        updatedAt: nowTime,
      };
    });

    onSaveAbsensi([...otherRecords, ...newRecords]);
    setSaveSuccessMsg(`Alhamdulillah! Absensi sesi ${getSesiLabel(selectedSesi)} berhasil disimpan.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const getSesiLabel = (s: SesiAbsensi) => {
    switch (s) {
      case 'ngaji_asar': return 'Ngaji Asar / Madrasah Diniyah';
      case 'ngaji_maghrib': return 'Ngaji Maghrib (Tahsin Al-Qur\'an)';
      case 'ngaji_isya': return 'Ngaji Isya (Bandongan / Sorogan)';
      case 'sholat_subuh': return 'Sholat Shubuh Berjamaah';
      case 'sholat_dzuhur': return 'Sholat Dzuhur Berjamaah';
      case 'sholat_asar': return 'Sholat Asar Berjamaah';
      case 'sholat_maghrib': return 'Sholat Maghrib Berjamaah';
      case 'sholat_isya': return 'Sholat Isya Berjamaah';
    }
  };

  // Filter santri
  const filteredSantri = santriList.filter(s => {
    const matchKamar = filterKamar === 'all' || s.kamar.includes(filterKamar);
    const matchKelas = filterKelas === 'all' || s.kelasMadrasah === filterKelas;
    const matchSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.nis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKamar && matchKelas && matchSearch;
  });

  // Calculate live count for current session
  const statusCounts = {
    Hadir: 0,
    Telat: 0,
    Izin: 0,
    Sakit: 0,
    Pulang: 0,
    Alfa: 0,
  };

  filteredSantri.forEach(s => {
    const status = currentAttendance[s.id]?.status || 'Hadir';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statuses: StatusKehadiran[] = ['Hadir', 'Telat', 'Izin', 'Sakit', 'Pulang', 'Alfa'];

  const getStatusColor = (st: StatusKehadiran, active: boolean) => {
    switch (st) {
      case 'Hadir':
        return active 
          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
      case 'Telat':
        return active 
          ? 'bg-amber-500 text-stone-900 border-amber-600 shadow-sm font-bold' 
          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
      case 'Izin':
        return active 
          ? 'bg-sky-600 text-white border-sky-700 shadow-sm' 
          : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100';
      case 'Sakit':
        return active 
          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
          : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100';
      case 'Pulang':
        return active 
          ? 'bg-teal-600 text-white border-teal-700 shadow-sm' 
          : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100';
      case 'Alfa':
        return active 
          ? 'bg-rose-600 text-white border-rose-700 shadow-sm' 
          : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-800">Presensi & Absensi Santri Terpadu</h2>
            {userRole === 'wali' && (
              <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold border border-amber-300">
                Mode Wali Santri: Hanya Melihat
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Presensi Pengajian Madrasah Diniyah dan Sholat Berjamaah 5 Waktu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNavigateToLaporan}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-700 font-semibold hover:bg-stone-50 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor PDF Rekap</span>
          </button>

          {userRole !== 'wali' && (
            <>
              <button
                onClick={handleSetAllHadir}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Tandai semua santri yang mukim menjadi Hadir"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Set Semua Hadir</span>
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>Simpan Presensi</span>
              </button>
            </>
          )}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Sesi Selector Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 px-1">
          Pilih Sesi Absensi:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {[
            { id: 'ngaji_asar' as SesiAbsensi, label: 'Ngaji Asar', sub: 'Madrasah', icon: '📖' },
            { id: 'ngaji_maghrib' as SesiAbsensi, label: 'Ngaji Maghrib', sub: 'Tahsin Qur\'an', icon: '🕌' },
            { id: 'ngaji_isya' as SesiAbsensi, label: 'Ngaji Isya', sub: 'Bandongan/Tahfidz', icon: '🌙' },
            { id: 'sholat_subuh' as SesiAbsensi, label: 'Sholat Shubuh', sub: 'Berjamaah', icon: '🌅' },
            { id: 'sholat_dzuhur' as SesiAbsensi, label: 'Sholat Dzuhur', sub: 'Berjamaah', icon: '☀️' },
            { id: 'sholat_asar' as SesiAbsensi, label: 'Sholat Asar', sub: 'Berjamaah', icon: '🌤️' },
            { id: 'sholat_maghrib' as SesiAbsensi, label: 'Sholat Maghrib', sub: 'Berjamaah', icon: '🌇' },
            { id: 'sholat_isya' as SesiAbsensi, label: 'Sholat Isya', sub: 'Berjamaah', icon: '🌌' },
          ].map((item) => {
            const isSelected = selectedSesi === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSessionOrDateChange(item.id, selectedTanggal)}
                className={`p-2.5 rounded-xl text-left border transition text-xs ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-md font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-sm">{item.icon}</div>
                <div className="font-semibold leading-tight mt-1 line-clamp-1">{item.label}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                  {item.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control bar: Tanggal, Filter Kamar, Filter Kelas, Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Tanggal Presensi:
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedTanggal}
              onChange={(e) => handleSessionOrDateChange(selectedSesi, e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Rayon / Kamar:
          </label>
          <select
            value={filterKamar}
            onChange={(e) => setFilterKamar(e.target.value)}
            className="w-full text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
          >
            <option value="all">Semua Kamar Asrama</option>
            <option value="Al-Ghazali">Kamar Al-Ghazali (01, 02, 03)</option>
            <option value="Ibnu Sina">Kamar Ibnu Sina (01, 02, 03)</option>
            <option value="Al-Fatih">Kamar Al-Fatih (01, 02, 03)</option>
            <option value="Imam Syafi'i">Kamar Imam Syafi'i (01, 02)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Kelas Madrasah:
          </label>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="w-full text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
          >
            <option value="all">Semua Kelas Madrasah</option>
            <option value="Ula A">Kelas Ula A</option>
            <option value="Ula B">Kelas Ula B</option>
            <option value="Wustha A">Kelas Wustha A</option>
            <option value="Wustha B">Kelas Wustha B</option>
            <option value="Ulya">Kelas Ulya</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Cari Nama / NIS Santri:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Ketik nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Summary Counter Bar */}
      <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="font-semibold text-stone-700">
          Statistik Presensi ({filteredSantri.length} Santri Terpilih):
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
            Hadir: {statusCounts.Hadir}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold border border-amber-200">
            Telat: {statusCounts.Telat}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold border border-sky-200">
            Izin: {statusCounts.Izin}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
            Sakit: {statusCounts.Sakit}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 font-bold border border-teal-200">
            Pulang: {statusCounts.Pulang}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold border border-rose-200">
            Alfa: {statusCounts.Alfa}
          </span>
        </div>
      </div>

      {/* Santri Attendance Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Santri & Rayon</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Opsi Kehadiran (Pilih Status)</th>
                <th className="py-3 px-4 w-60">Keterangan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSantri.map((santri, idx) => {
                const cur = currentAttendance[santri.id] || { status: 'Hadir', keterangan: '' };
                const isPulangMukim = santri.statusMukim === 'Izin Pulang';

                return (
                  <tr key={santri.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 text-center text-stone-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-800 text-sm">{santri.nama}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-stone-400">{santri.nis}</span>
                        <span>•</span>
                        <span>{santri.kamar}</span>
                        {isPulangMukim && (
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-medium">
                            Izin Pulang Aktif
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {santri.kelasMadrasah}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {statuses.map((st) => {
                          const isActive = cur.status === st;
                          return (
                            <button
                              key={st}
                              disabled={userRole === 'wali'}
                              onClick={() => handleStatusChange(santri.id, st)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${getStatusColor(st, isActive)} ${
                                userRole === 'wali' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        disabled={userRole === 'wali'}
                        placeholder={userRole === 'wali' ? '-' : 'Contoh: Terlambat wudhu, sakit klinik...'}
                        value={cur.keterangan || ''}
                        onChange={(e) => handleKeteranganChange(santri.id, e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-emerald-600 disabled:bg-stone-100 disabled:text-stone-400"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
