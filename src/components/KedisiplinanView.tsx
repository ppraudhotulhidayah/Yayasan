import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  Plus, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search, 
  Download, 
  Check, 
  Flame, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { 
  PelanggaranSantri, 
  Santri, 
  RoleType, 
  TingkatPelanggaran, 
  StatusTakzir 
} from '../types';

interface KedisiplinanViewProps {
  pelanggaranList: PelanggaranSantri[];
  santriList: Santri[];
  onAddPelanggaran: (pelanggaran: PelanggaranSantri) => void;
  onUpdateStatusTakzir: (id: string, status: StatusTakzir) => void;
  userRole: RoleType;
  userName: string;
  onNavigateToLaporan: () => void;
}

export const KedisiplinanView: React.FC<KedisiplinanViewProps> = ({
  pelanggaranList,
  santriList,
  onAddPelanggaran,
  onUpdateStatusTakzir,
  userRole,
  userName,
  onNavigateToLaporan,
}) => {
  const [filterTingkat, setFilterTingkat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [selectedSantriId, setSelectedSantriId] = useState<string>(santriList[0]?.id || '');
  const [tingkat, setTingkat] = useState<TingkatPelanggaran>('Sedang');
  const [kategori, setKategori] = useState<string>('Pelanggaran Kedisiplinan Asrama');
  const [tanggalKejadian, setTanggalKejadian] = useState<string>('2026-10-07');
  const [keterangan, setKeterangan] = useState<string>('');
  const [poin, setPoin] = useState<number>(10);
  const [bentukTakzir, setBentukTakzir] = useState<string>('Setor hafalan Surat Al-Waqi\'ah & piket masjid 2 hari');
  const [statusTakzir, setStatusTakzir] = useState<StatusTakzir>('Belum Dilaksanakan');

  const handleTingkatChange = (newTingkat: TingkatPelanggaran) => {
    setTingkat(newTingkat);
    if (newTingkat === 'Ringan') {
      setPoin(5);
      setBentukTakzir('Membaca Nadhom Jurumiyyah / Imrithi & membersihkan selasar');
    } else if (newTingkat === 'Sedang') {
      setPoin(15);
      setBentukTakzir('Setor hafalan Surat Al-Waqi\'ah & membersihkan kamar mandi 3 hari');
    } else {
      setPoin(25);
      setBentukTakzir('Membaca Al-Qur\'an 3 Juz di serambi masjid & pemanggilan orang tua');
    }
  };

  const handleSubmitPelanggaran = (e: React.FormEvent) => {
    e.preventDefault();
    const found = santriList.find(s => s.id === selectedSantriId);
    if (!found || !keterangan) return;

    const newPelanggaran: PelanggaranSantri = {
      id: `plg_${Date.now()}`,
      santriId: found.id,
      namaSantri: found.nama,
      kamar: found.kamar,
      tingkat,
      kategori,
      tanggalKejadian,
      keterangan,
      poin: Number(poin),
      bentukTakzir,
      statusTakzir,
      pencatat: userName,
    };

    onAddPelanggaran(newPelanggaran);
    setShowAddForm(false);
    setKeterangan('');
  };

  // Top santri with highest violation points (Leaderboard)
  const leaderboardSantri = [...santriList]
    .filter(s => s.poinPelanggaran > 0)
    .sort((a, b) => b.poinPelanggaran - a.poinPelanggaran);

  const filteredPelanggaran = pelanggaranList.filter(p => {
    const matchTingkat = filterTingkat === 'all' || p.tingkat === filterTingkat;
    const matchStatus = filterStatus === 'all' || p.statusTakzir === filterStatus;
    const matchSearch = p.namaSantri.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTingkat && matchStatus && matchSearch;
  });

  const getTingkatBadge = (t: TingkatPelanggaran) => {
    switch (t) {
      case 'Ringan': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Sedang': return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Berat': return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
    }
  };

  const getTakzirBadge = (st: StatusTakzir) => {
    switch (st) {
      case 'Belum Dilaksanakan': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Sedang Proses': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Selesai': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Kedisiplinan & Takzir Edukatif Santri</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pencatatan pelanggaran tata tertib pondok dan pemantauan penuntasan takzir pembinaan santri
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToLaporan}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-700 font-semibold hover:bg-stone-50 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Takzir</span>
          </button>

          {userRole !== 'wali' && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{showAddForm ? 'Tutup Formulir' : 'Catat Pelanggaran & Takzir'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Row: Leaderboard Poin & Form Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Poin Pelanggaran */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm text-stone-800">Akumulasi Poin Tertinggi</h3>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Perhatian Pengasuh
              </span>
            </div>

            <p className="text-xs text-stone-500 mb-3">
              Santri yang memerlukan bimbingan konseling dan pendampingan intensif:
            </p>

            <div className="space-y-2">
              {leaderboardSantri.length > 0 ? (
                leaderboardSantri.slice(0, 4).map((s, idx) => (
                  <div 
                    key={s.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        idx === 0 ? 'bg-rose-600 text-white' : idx === 1 ? 'bg-orange-500 text-white' : 'bg-stone-300 text-stone-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-stone-900">{s.nama}</div>
                        <div className="text-[10px] text-stone-400">{s.kamar} • {s.kelasMadrasah}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                        {s.poinPelanggaran} Poin
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl">
                  Alhamdulillah, seluruh santri saat ini tertib dan disiplin.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            Ambang batas panggilan wali: <strong>30 Poin</strong>
          </div>
        </div>

        {/* Form Tambah Pelanggaran (Muncul jika dibuka atau default ringkas) */}
        <div className={`lg:col-span-2 ${showAddForm ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Input Pelanggaran & Penetapan Bentuk Takzir Santri</span>
            </h3>

            {userRole === 'wali' ? (
              <div className="p-4 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200">
                Wali santri hanya memiliki hak baca (Read-Only) untuk memantau kedisiplinan ananda santri.
              </div>
            ) : (
              <form onSubmit={handleSubmitPelanggaran} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Pilih Santri:</label>
                    <select
                      value={selectedSantriId}
                      onChange={(e) => setSelectedSantriId(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      {santriList.map(s => (
                        <option key={s.id} value={s.id}>{s.nama} ({s.kamar})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Tingkat Pelanggaran:</label>
                    <select
                      value={tingkat}
                      onChange={(e) => handleTingkatChange(e.target.value as TingkatPelanggaran)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                    >
                      <option value="Ringan">Ringan (5 Poin)</option>
                      <option value="Sedang">Sedang (15 Poin)</option>
                      <option value="Berat">Berat (25 Poin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Tanggal Kejadian:</label>
                    <input
                      type="date"
                      value={tanggalKejadian}
                      onChange={(e) => setTanggalKejadian(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Kategori Pelanggaran:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Kedisiplinan Ibadah / HP / Piket"
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Poin Penalti Pelanggaran:</label>
                    <input
                      type="number"
                      value={poin}
                      onChange={(e) => setPoin(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Keterangan Kronologi Kejadian:</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Ditemukan terlambat bangun dan tidak mengikuti sholat shubuh berjamaah..."
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Bentuk Takzir Edukatif:</label>
                    <input
                      type="text"
                      value={bentukTakzir}
                      onChange={(e) => setBentukTakzir(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-600 mb-1">Status Pelaksanaan Takzir:</label>
                    <select
                      value={statusTakzir}
                      onChange={(e) => setStatusTakzir(e.target.value as StatusTakzir)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    >
                      <option value="Belum Dilaksanakan">Belum Dilaksanakan</option>
                      <option value="Sedang Proses">Sedang Proses</option>
                      <option value="Selesai">Selesai (Sudah Tuntas)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Simpan Catatan Pelanggaran & Takzir</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Table of Violations */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Tingkat:
          </label>
          <select
            value={filterTingkat}
            onChange={(e) => setFilterTingkat(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
          >
            <option value="all">Semua Tingkat (Ringan, Sedang, Berat)</option>
            <option value="Ringan">Ringan</option>
            <option value="Sedang">Sedang</option>
            <option value="Berat">Berat</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Status Takzir:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
          >
            <option value="all">Semua Status Takzir</option>
            <option value="Belum Dilaksanakan">Belum Dilaksanakan</option>
            <option value="Sedang Proses">Sedang Proses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Pencarian Santri / Kasus:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama atau kronologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Violations and Takzir Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Santri & Tanggal</th>
                <th className="py-3 px-4">Tingkat & Poin</th>
                <th className="py-3 px-4">Kronologi & Keterangan</th>
                <th className="py-3 px-4">Bentuk Takzir Edukatif</th>
                <th className="py-3 px-4 text-center">Status Takzir</th>
                <th className="py-3 px-4 text-center w-32">Aksi Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPelanggaran.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-800 text-sm">{p.namaSantri}</div>
                    <div className="text-[11px] text-stone-500">{p.kamar}</div>
                    <div className="text-[10px] font-mono text-stone-400 mt-0.5">📅 {p.tanggalKejadian}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTingkatBadge(p.tingkat)}`}>
                      {p.tingkat}
                    </span>
                    <div className="font-bold text-rose-600 text-xs mt-1">+{p.poin} Poin</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-800">{p.kategori}</div>
                    <p className="text-stone-600 text-xs mt-0.5 max-w-md">{p.keterangan}</p>
                    <div className="text-[10px] text-stone-400 mt-1">Pencatat: {p.pencatat}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 font-medium">
                      {p.bentukTakzir}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTakzirBadge(p.statusTakzir)}`}>
                      {p.statusTakzir}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {userRole !== 'wali' ? (
                      <div className="flex flex-col gap-1 items-center">
                        {p.statusTakzir !== 'Selesai' ? (
                          <button
                            onClick={() => onUpdateStatusTakzir(p.id, 'Selesai')}
                            className="w-full px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-lg text-[11px] flex items-center justify-center gap-1"
                            title="Tandai Takzir Telah Tuntas"
                          >
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Set Selesai</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px]">
                            ✓ Tuntas
                          </span>
                        )}
                        {p.statusTakzir === 'Belum Dilaksanakan' && (
                          <button
                            onClick={() => onUpdateStatusTakzir(p.id, 'Sedang Proses')}
                            className="w-full px-2 py-0.5 text-stone-600 hover:bg-stone-100 rounded text-[10px]"
                          >
                            Set Proses
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400 text-[11px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
