import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Users, 
  MapPin, 
  CheckCircle, 
  Filter, 
  Search, 
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Coffee,
  Moon,
  Sun,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  JadwalMadrasah, 
  RutinitasHarian, 
  JadwalPiket, 
  RoleType 
} from '../types';

interface JadwalViewProps {
  jadwalMadrasahList: JadwalMadrasah[];
  rutinitasList: RutinitasHarian[];
  piketList: JadwalPiket[];
  userRole: RoleType;
  onAddJadwalMadrasah: (jadwal: JadwalMadrasah) => void;
  onUpdateJadwalMadrasah: (jadwal: JadwalMadrasah) => void;
  onDeleteJadwalMadrasah: (id: string) => void;
  onAddRutinitas: (rutinitas: RutinitasHarian) => void;
  onUpdateRutinitas: (rutinitas: RutinitasHarian) => void;
  onDeleteRutinitas: (id: string) => void;
  onAddPiket: (piket: JadwalPiket) => void;
  onUpdatePiket: (piket: JadwalPiket) => void;
  onDeletePiket: (id: string) => void;
}

export const JadwalView: React.FC<JadwalViewProps> = ({
  jadwalMadrasahList,
  rutinitasList,
  piketList,
  userRole,
  onAddJadwalMadrasah,
  onUpdateJadwalMadrasah,
  onDeleteJadwalMadrasah,
  onAddRutinitas,
  onUpdateRutinitas,
  onDeleteRutinitas,
  onAddPiket,
  onUpdatePiket,
  onDeletePiket,
}) => {
  const [subTab, setSubTab] = useState<'madrasah' | 'rutinitas24' | 'piket'>('madrasah');
  const [filterHari, setFilterHari] = useState<string>('all');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterKategoriRutinitas, setFilterKategoriRutinitas] = useState<string>('all');

  // Modals state
  const [modalMadrasah, setModalMadrasah] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: Partial<JadwalMadrasah> | null }>({
    isOpen: false,
    mode: 'add',
    data: null,
  });

  const [modalRutinitas, setModalRutinitas] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: Partial<RutinitasHarian> | null }>({
    isOpen: false,
    mode: 'add',
    data: null,
  });

  const [modalPiket, setModalPiket] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: Partial<JadwalPiket> | null }>({
    isOpen: false,
    mode: 'add',
    data: null,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const now = new Date();
  const currentHoursMins = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const canEdit = userRole === 'admin' || userRole === 'guru';

  // Days list for quick pill filter
  const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'];

  // Filtered Madrasah
  const filteredJadwal = jadwalMadrasahList.filter(j => {
    const matchHari = filterHari === 'all' || j.hari === filterHari;
    const matchKelas = filterKelas === 'all' || j.kelas.includes(filterKelas) || j.kelas === 'Semua Tingkat';
    const matchSearch = j.kitab.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.pengajar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        j.ruang.toLowerCase().includes(searchQuery.toLowerCase());
    return matchHari && matchKelas && matchSearch;
  });

  // Filtered Rutinitas
  const filteredRutinitas = rutinitasList.filter(r => {
    const matchKategori = filterKategoriRutinitas === 'all' || r.kategori === filterKategoriRutinitas;
    return matchKategori;
  });

  // Currently active routine item
  const currentRoutineItem = rutinitasList.find(r => 
    currentHoursMins >= r.waktuMulai && currentHoursMins <= r.waktuSelesai
  ) || rutinitasList[8]; // Default fallback

  // Handlers for Madrasah Modal
  const openAddMadrasah = () => {
    setModalMadrasah({
      isOpen: true,
      mode: 'add',
      data: {
        hari: 'Senin',
        waktu: '16:00 - 17:15',
        kelas: 'Wustha A',
        kitab: '',
        pengajar: '',
        ruang: 'Ruang Madrasah 01',
      }
    });
  };

  const openEditMadrasah = (item: JadwalMadrasah) => {
    setModalMadrasah({
      isOpen: true,
      mode: 'edit',
      data: { ...item }
    });
  };

  const saveMadrasah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalMadrasah.data?.kitab || !modalMadrasah.data?.pengajar) return;

    if (modalMadrasah.mode === 'add') {
      const newItem: JadwalMadrasah = {
        id: `jm_${Date.now()}`,
        hari: (modalMadrasah.data.hari as any) || 'Senin',
        waktu: modalMadrasah.data.waktu || '16:00 - 17:15',
        kelas: modalMadrasah.data.kelas || 'Wustha A',
        kitab: modalMadrasah.data.kitab,
        pengajar: modalMadrasah.data.pengajar,
        ruang: modalMadrasah.data.ruang || 'Ruang Madrasah 01',
      };
      onAddJadwalMadrasah(newItem);
      showToast('Jadwal pelajaran kitab berhasil ditambahkan!');
    } else if (modalMadrasah.data?.id) {
      onUpdateJadwalMadrasah(modalMadrasah.data as JadwalMadrasah);
      showToast('Jadwal pelajaran berhasil diperbarui!');
    }
    setModalMadrasah({ isOpen: false, mode: 'add', data: null });
  };

  // Handlers for Rutinitas Modal
  const openAddRutinitas = () => {
    setModalRutinitas({
      isOpen: true,
      mode: 'add',
      data: {
        waktuMulai: '15:00',
        waktuSelesai: '16:00',
        kegiatan: '',
        keterangan: '',
        kategori: 'KBM',
        lokasi: 'Masjid Jami\'',
      }
    });
  };

  const openEditRutinitas = (item: RutinitasHarian) => {
    setModalRutinitas({
      isOpen: true,
      mode: 'edit',
      data: { ...item }
    });
  };

  const saveRutinitas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalRutinitas.data?.kegiatan) return;

    if (modalRutinitas.mode === 'add') {
      const newItem: RutinitasHarian = {
        id: `rh_${Date.now()}`,
        waktuMulai: modalRutinitas.data.waktuMulai || '12:00',
        waktuSelesai: modalRutinitas.data.waktuSelesai || '13:00',
        kegiatan: modalRutinitas.data.kegiatan,
        keterangan: modalRutinitas.data.keterangan || '',
        kategori: (modalRutinitas.data.kategori as any) || 'KBM',
        lokasi: modalRutinitas.data.lokasi || 'Asrama Santri',
      };
      onAddRutinitas(newItem);
      showToast('Agenda rutinitas santri berhasil ditambahkan!');
    } else if (modalRutinitas.data?.id) {
      onUpdateRutinitas(modalRutinitas.data as RutinitasHarian);
      showToast('Agenda rutinitas berhasil diperbarui!');
    }
    setModalRutinitas({ isOpen: false, mode: 'add', data: null });
  };

  // Handlers for Piket Modal
  const openAddPiket = () => {
    setModalPiket({
      isOpen: true,
      mode: 'add',
      data: {
        hari: 'Senin',
        lokasi: '',
        kelompok: 'Regu Al-Ghazali 1',
        kamar: 'Al-Ghazali 01',
        koordinator: '',
        tugas: ['Menyapu & mengepel lantai', 'Merapikan peralatan', 'Membuang sampah'],
      }
    });
  };

  const openEditPiket = (item: JadwalPiket) => {
    setModalPiket({
      isOpen: true,
      mode: 'edit',
      data: { ...item }
    });
  };

  const savePiket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPiket.data?.lokasi || !modalPiket.data?.koordinator) return;

    if (modalPiket.mode === 'add') {
      const newItem: JadwalPiket = {
        id: `piket_${Date.now()}`,
        hari: modalPiket.data.hari || 'Senin',
        lokasi: modalPiket.data.lokasi,
        kelompok: modalPiket.data.kelompok || 'Regu Santri',
        kamar: modalPiket.data.kamar || 'Al-Ghazali 01',
        koordinator: modalPiket.data.koordinator,
        tugas: modalPiket.data.tugas && modalPiket.data.tugas.length > 0 ? modalPiket.data.tugas : ['Menyapu dan mengepel', 'Membersihkan area'],
      };
      onAddPiket(newItem);
      showToast('Jadwal piket kebersihan berhasil ditambahkan!');
    } else if (modalPiket.data?.id) {
      onUpdatePiket(modalPiket.data as JadwalPiket);
      showToast('Jadwal piket berhasil diperbarui!');
    }
    setModalPiket({ isOpen: false, mode: 'add', data: null });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-amber-200 border border-emerald-700 px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar with Islamic Contemporary Aesthetics */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-arabic text-base font-semibold">بِسْمِ اللَّهِ</span>
            <span className="text-stone-300">•</span>
            <h2 className="text-lg font-bold text-stone-800">Jadwal & Agenda Santri Terpadu</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manajemen Kurikulum Madrasah Diniyah, Rutinitas 24 Jam, dan Pembagian Piket Kebersihan Rayon
          </p>
        </div>

        {/* Sub-tab Pill Navigation */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl text-xs font-semibold gap-1 self-start md:self-auto border border-stone-200/70">
          <button
            onClick={() => setSubTab('madrasah')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              subTab === 'madrasah' 
                ? 'bg-emerald-800 text-white shadow-xs font-bold' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pelajaran Madrasah ({jadwalMadrasahList.length})</span>
          </button>

          <button
            onClick={() => setSubTab('rutinitas24')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              subTab === 'rutinitas24' 
                ? 'bg-emerald-800 text-white shadow-xs font-bold' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Rutinitas 24 Jam ({rutinitasList.length})</span>
          </button>

          <button
            onClick={() => setSubTab('piket')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              subTab === 'piket' 
                ? 'bg-emerald-800 text-white shadow-xs font-bold' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Piket Kebersihan ({piketList.length})</span>
          </button>
        </div>
      </div>

      {/* Role permission info banner for Wali */}
      {userRole === 'wali' && (
        <div className="bg-amber-50 border border-amber-200/80 text-amber-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Mode Wali Santri: Anda melihat jadwal kegiatan resmi yang berlaku untuk santri.</span>
          </span>
          <span className="text-[11px] font-semibold text-amber-800">Hanya Melihat</span>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 1: JADWAL PELAJARAN MADRASAH DINIYAH (KITAB KUNING)
         ========================================================================= */}
      {subTab === 'madrasah' && (
        <div className="space-y-4">
          {/* Day Selector Pills Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-2 overflow-x-auto pb-3 sm:pb-3.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Hari:</span>
            </span>
            <button
              onClick={() => setFilterHari('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                filterHari === 'all'
                  ? 'bg-emerald-900 text-amber-300 shadow-xs font-bold'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              Semua Hari ({jadwalMadrasahList.length})
            </button>
            {DAYS.map((day) => {
              const count = jadwalMadrasahList.filter(j => j.hari === day).length;
              const isActive = filterHari === day;
              return (
                <button
                  key={day}
                  onClick={() => setFilterHari(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs font-bold'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/80'
                  }`}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-emerald-950 font-bold' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filter Bar & Action Button */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div>
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
                >
                  <option value="all">Semua Jenjang Kelas</option>
                  <option value="Ula">Tingkat Ula (Dasar)</option>
                  <option value="Wustha">Tingkat Wustha (Menengah)</option>
                  <option value="Ulya">Tingkat Ulya (Lanjutan)</option>
                  <option value="Semua Tingkat">Semua Tingkat Gabungan</option>
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama kitab, ustadz, atau ruang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
                />
              </div>
            </div>

            {canEdit && (
              <button
                onClick={openAddMadrasah}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Pelajaran Kitab</span>
              </button>
            )}
          </div>

          {/* Timetable Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJadwal.map((jadwal) => {
              const isUla = jadwal.kelas.includes('Ula');
              const isWustha = jadwal.kelas.includes('Wustha');
              const isUlya = jadwal.kelas.includes('Ulya');

              return (
                <div 
                  key={jadwal.id}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition p-4 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    isUla ? 'bg-amber-500' : isWustha ? 'bg-emerald-600' : isUlya ? 'bg-teal-600' : 'bg-purple-600'
                  }`} />

                  <div>
                    <div className="flex items-center justify-between mb-2.5 pt-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Hari {jadwal.hari}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-600 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {jadwal.waktu} WIB
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base leading-snug font-serif text-emerald-950">
                      {jadwal.kitab}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-stone-50/80 rounded-xl border border-stone-100">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {jadwal.pengajar.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-stone-400 uppercase font-semibold">Dewan Asatidz</span>
                          <div className="font-semibold text-stone-800 truncate">{jadwal.pengajar}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-stone-600 px-1">
                        <span className="flex items-center gap-1.5 text-stone-500">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{jadwal.ruang}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isUla ? 'bg-amber-50 text-amber-900 border-amber-200' :
                          isWustha ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                          isUlya ? 'bg-teal-50 text-teal-900 border-teal-200' :
                          'bg-stone-100 text-stone-800 border-stone-200'
                        }`}>
                          {jadwal.kelas}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400 italic">Madrasah Diniyah</span>

                    {canEdit && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditMadrasah(jadwal)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition"
                          title="Edit Jadwal Pelajaran"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus jadwal kajian ${jadwal.kitab} hari ${jadwal.hari}?`)) {
                              onDeleteJadwalMadrasah(jadwal.id);
                              showToast('Jadwal pelajaran berhasil dihapus.');
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                          title="Hapus Jadwal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredJadwal.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="font-semibold text-stone-700">Tidak ada jadwal pelajaran yang cocok dengan filter.</p>
              <p className="mt-1">Silakan ubah filter hari, kelas, atau tambahkan jadwal baru.</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: RUTINITAS SANTRI 24 JAM (SIKLUS SEHARI-HARI)
         ========================================================================= */}
      {subTab === 'rutinitas24' && (
        <div className="space-y-4">
          {/* Active Banner Indicator */}
          <div className="bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-sm border border-emerald-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                </span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Agenda Sedang Berlangsung Saat Ini
                </span>
                <span className="text-xs font-mono bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-200">
                  {currentHoursMins} WIB
                </span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{currentRoutineItem.kegiatan}</span>
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                {currentRoutineItem.keterangan} • 📍 Lokasi: <strong>{currentRoutineItem.lokasi}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {canEdit && (
                <button
                  onClick={openAddRutinitas}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Agenda 24 Jam</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Kategori:</span>
            </span>
            {['all', 'Ibadah', 'KBM', 'Kemandirian', 'Istirahat', 'Olahraga'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterKategoriRutinitas(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  filterKategoriRutinitas === cat
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                {cat === 'all' ? `Semua Kategori (${rutinitasList.length})` : cat}
              </button>
            ))}
          </div>

          {/* Timeline List of 24h Routines */}
          <div className="space-y-3">
            {filteredRutinitas.map((item, index) => {
              const isCurrent = currentHoursMins >= item.waktuMulai && currentHoursMins <= item.waktuSelesai;
              const catColor = 
                item.kategori === 'Ibadah' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                item.kategori === 'KBM' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                item.kategori === 'Kemandirian' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                item.kategori === 'Istirahat' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                'bg-teal-100 text-teal-800 border-teal-300';

              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent 
                      ? 'bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-amber-400/30' 
                      : 'bg-white border-stone-200/90 shadow-xs hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Time Slot Badge */}
                    <div className={`shrink-0 w-28 text-center p-2 rounded-xl border ${
                      isCurrent 
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs' 
                        : 'bg-stone-50 border-stone-200 text-stone-800'
                    }`}>
                      <div className="font-mono text-xs font-bold leading-tight">
                        {item.waktuMulai} - {item.waktuSelesai}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">WIB</div>
                    </div>

                    <div className="h-10 w-0.5 bg-stone-200 hidden sm:block" />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm">{item.kegiatan}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            Sedang Berlangsung
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{item.keterangan}</p>
                      <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-3">
                        <span>📍 {item.lokasi}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.2 rounded-full font-bold border ${catColor}`}>
                          {item.kategori}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Edit & Delete */}
                  {canEdit && (
                    <div className="shrink-0 flex items-center gap-1 self-end sm:self-center">
                      <button
                        onClick={() => openEditRutinitas(item)}
                        className="px-2.5 py-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50 border border-stone-200 text-xs font-semibold flex items-center gap-1"
                        title="Edit Rutinitas"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus agenda rutinitas ${item.kegiatan}?`)) {
                            onDeleteRutinitas(item.id);
                            showToast('Agenda rutinitas berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-stone-200 text-xs"
                        title="Hapus Rutinitas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: JADWAL PIKET KEBERSIHAN ASRAMA & RAYON
         ========================================================================= */}
      {subTab === 'piket' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-stone-800">
                Pembagian Regu & Tugas Piket Kebersihan Pondok
              </h3>
              <p className="text-xs text-stone-500">
                Biro Lingkungan Hidup & Kebersihan Santri Raudhotu Hidayah
              </p>
            </div>

            {canEdit && (
              <button
                onClick={openAddPiket}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Jadwal Piket</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {piketList.map((piket) => (
              <div 
                key={piket.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Hari {piket.hari}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 bg-stone-50 px-2 py-0.5 rounded-lg border border-stone-200">
                      {piket.kamar}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base">
                    {piket.lokasi}
                  </h3>
                  <div className="text-xs text-emerald-800 font-semibold mt-0.5">
                    {piket.kelompok}
                  </div>

                  <div className="text-xs text-stone-600 mt-2 p-2 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="font-bold text-stone-700">👤 Koordinator:</span> {piket.koordinator}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Rincian Tugas Piket:
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-600">
                      {piket.tugas.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-stone-400">
                    Biro Kebersihan
                  </span>

                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditPiket(piket)}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-stone-200"
                        title="Edit Piket"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus jadwal piket ${piket.lokasi} hari ${piket.hari}?`)) {
                            onDeletePiket(piket.id);
                            showToast('Jadwal piket berhasil dihapus.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-stone-200"
                        title="Hapus Piket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TAMBAH / EDIT JADWAL PELAJARAN MADRASAH
         ========================================================================= */}
      {modalMadrasah.isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{modalMadrasah.mode === 'add' ? 'Tambah Pelajaran Kitab Baru' : 'Edit Jadwal Pelajaran'}</span>
              </h3>
              <button 
                onClick={() => setModalMadrasah({ isOpen: false, mode: 'add', data: null })}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveMadrasah} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Hari Kajian:</label>
                  <select
                    value={modalMadrasah.data?.hari || 'Senin'}
                    onChange={(e) => setModalMadrasah({ ...modalMadrasah, data: { ...modalMadrasah.data, hari: e.target.value as any } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Waktu KBM (Mulai - Selesai):</label>
                  <input
                    type="text"
                    placeholder="Contoh: 16:00 - 17:15"
                    value={modalMadrasah.data?.waktu || ''}
                    onChange={(e) => setModalMadrasah({ ...modalMadrasah, data: { ...modalMadrasah.data, waktu: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Nama Kitab & Bidang Ilmu:</label>
                <input
                  type="text"
                  placeholder="Contoh: Fathul Qorib Al-Mujib (Fiqih)"
                  value={modalMadrasah.data?.kitab || ''}
                  onChange={(e) => setModalMadrasah({ ...modalMadrasah, data: { ...modalMadrasah.data, kitab: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Jenjang Kelas:</label>
                  <select
                    value={modalMadrasah.data?.kelas || 'Wustha A'}
                    onChange={(e) => setModalMadrasah({ ...modalMadrasah, data: { ...modalMadrasah.data, kelas: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Ula A">Ula A</option>
                    <option value="Ula B">Ula B</option>
                    <option value="Ula A & B">Ula A & B</option>
                    <option value="Wustha A">Wustha A</option>
                    <option value="Wustha B">Wustha B</option>
                    <option value="Wustha A & B">Wustha A & B</option>
                    <option value="Ulya">Ulya</option>
                    <option value="Semua Tingkat">Semua Tingkat (Umum)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Ruang Belajar / Halaqoh:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ruang Madrasah 01 / Masjid Jami'"
                    value={modalMadrasah.data?.ruang || ''}
                    onChange={(e) => setModalMadrasah({ ...modalMadrasah, data: { ...modalMadrasah.data, ruang: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Ustadz Pengampu / Asatidz:</label>
                <input
                  type="text"
                  placeholder="Contoh: Ustadz Ridwan Al-Bantani, Lc."
                  value={modalMadrasah.data?.pengajar || ''}
                  onChange={(e) => setModalMadrasah({ ...modalMadrasah, data: { ...modalMadrasah.data, pengajar: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalMadrasah({ isOpen: false, mode: 'add', data: null })}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>{modalMadrasah.mode === 'add' ? 'Simpan Pelajaran Baru' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TAMBAH / EDIT RUTINITAS 24 JAM
         ========================================================================= */}
      {modalRutinitas.isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>{modalRutinitas.mode === 'add' ? 'Tambah Agenda Rutinitas 24 Jam' : 'Edit Agenda Rutinitas'}</span>
              </h3>
              <button 
                onClick={() => setModalRutinitas({ isOpen: false, mode: 'add', data: null })}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveRutinitas} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Waktu Mulai (HH:mm):</label>
                  <input
                    type="time"
                    value={modalRutinitas.data?.waktuMulai || '15:00'}
                    onChange={(e) => setModalRutinitas({ ...modalRutinitas, data: { ...modalRutinitas.data, waktuMulai: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Waktu Selesai (HH:mm):</label>
                  <input
                    type="time"
                    value={modalRutinitas.data?.waktuSelesai || '16:00'}
                    onChange={(e) => setModalRutinitas({ ...modalRutinitas, data: { ...modalRutinitas.data, waktuSelesai: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Nama Agenda / Kegiatan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Madrasah Diniyah Sore (Ngaji Asar)"
                  value={modalRutinitas.data?.kegiatan || ''}
                  onChange={(e) => setModalRutinitas({ ...modalRutinitas, data: { ...modalRutinitas.data, kegiatan: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Kategori Kegiatan:</label>
                  <select
                    value={modalRutinitas.data?.kategori || 'KBM'}
                    onChange={(e) => setModalRutinitas({ ...modalRutinitas, data: { ...modalRutinitas.data, kategori: e.target.value as any } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Ibadah">Ibadah</option>
                    <option value="KBM">KBM (Belajar)</option>
                    <option value="Kemandirian">Kemandirian</option>
                    <option value="Istirahat">Istirahat</option>
                    <option value="Olahraga">Olahraga</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Lokasi Kegiatan:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Masjid Jami' / Asrama"
                    value={modalRutinitas.data?.lokasi || ''}
                    onChange={(e) => setModalRutinitas({ ...modalRutinitas, data: { ...modalRutinitas.data, lokasi: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Keterangan / Rincian Instruksi:</label>
                <textarea
                  rows={2}
                  placeholder="Rincian kegiatan yang harus dilakukan santri..."
                  value={modalRutinitas.data?.keterangan || ''}
                  onChange={(e) => setModalRutinitas({ ...modalRutinitas, data: { ...modalRutinitas.data, keterangan: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalRutinitas({ isOpen: false, mode: 'add', data: null })}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>{modalRutinitas.mode === 'add' ? 'Simpan Agenda Baru' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TAMBAH / EDIT JADWAL PIKET KEBERSIHAN
         ========================================================================= */}
      {modalPiket.isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>{modalPiket.mode === 'add' ? 'Tambah Jadwal Piket Kebersihan' : 'Edit Jadwal Piket'}</span>
              </h3>
              <button 
                onClick={() => setModalPiket({ isOpen: false, mode: 'add', data: null })}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={savePiket} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Hari Piket:</label>
                  <select
                    value={modalPiket.data?.hari || 'Senin'}
                    onChange={(e) => setModalPiket({ ...modalPiket, data: { ...modalPiket.data, hari: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Lokasi / Zona Kebersihan:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Masjid Jami' & Tempat Wudhu"
                    value={modalPiket.data?.lokasi || ''}
                    onChange={(e) => setModalPiket({ ...modalPiket, data: { ...modalPiket.data, lokasi: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Kelompok Piket:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Regu Al-Ghazali 1"
                    value={modalPiket.data?.kelompok || ''}
                    onChange={(e) => setModalPiket({ ...modalPiket, data: { ...modalPiket.data, kelompok: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Kamar / Rayon Asrama:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Al-Ghazali 01"
                    value={modalPiket.data?.kamar || ''}
                    onChange={(e) => setModalPiket({ ...modalPiket, data: { ...modalPiket.data, kamar: e.target.value } })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Koordinator Santri:</label>
                <input
                  type="text"
                  placeholder="Nama santri penanggung jawab piket..."
                  value={modalPiket.data?.koordinator || ''}
                  onChange={(e) => setModalPiket({ ...modalPiket, data: { ...modalPiket.data, koordinator: e.target.value } })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">
                  Daftar Tugas (Pisahkan dengan baris baru):
                </label>
                <textarea
                  rows={4}
                  placeholder={`Menyapu & mengepel serambi masjid\nMembersihkan kran wudhu\nMerapikan sajadah & rak Al-Qur'an`}
                  value={(modalPiket.data?.tugas || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(l => l.trim() !== '');
                    setModalPiket({ ...modalPiket, data: { ...modalPiket.data, tugas: lines } });
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-sans"
                  required
                />
                <p className="text-[10px] text-stone-400 mt-1">Setiap baris akan menjadi 1 butir tugas terpisah.</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalPiket({ isOpen: false, mode: 'add', data: null })}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>{modalPiket.mode === 'add' ? 'Simpan Jadwal Piket' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
