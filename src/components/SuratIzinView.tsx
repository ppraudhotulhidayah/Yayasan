import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  X, 
  QrCode,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { SuratIzinPulang, Santri, RoleType, LembagaSettings } from '../types';

interface SuratIzinViewProps {
  suratIzinList: SuratIzinPulang[];
  santriList: Santri[];
  onAddSuratIzin: (surat: SuratIzinPulang) => void;
  onUpdateStatusSurat: (id: string, status: 'Sedang Di Luar' | 'Sudah Kembali' | 'Terlambat') => void;
  userRole: RoleType;
  userName: string;
  settings?: LembagaSettings;
}

export const SuratIzinView: React.FC<SuratIzinViewProps> = ({
  suratIzinList,
  santriList,
  onAddSuratIzin,
  onUpdateStatusSurat,
  userRole,
  userName,
  settings,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [printSuratModal, setPrintSuratModal] = useState<SuratIzinPulang | null>(null);

  // Form State
  const [selectedSantriId, setSelectedSantriId] = useState<string>(santriList[0]?.id || '');
  const [alasanPulang, setAlasanPulang] = useState<string>('');
  const [tanggalPergi, setTanggalPergi] = useState<string>('2026-10-07');
  const [tanggalKembali, setTanggalKembali] = useState<string>('2026-10-10');
  const [penanggungJawab, setPenanggungJawab] = useState<string>('');
  const [teleponPenanggungJawab, setTeleponPenanggungJawab] = useState<string>('');
  const [alamatTujuan, setAlamatTujuan] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('Wajib kembali sebelum adzan Maghrib dan menyetorkan target hafalan.');

  const handleSelectSantriChange = (santriId: string) => {
    setSelectedSantriId(santriId);
    const found = santriList.find(s => s.id === santriId);
    if (found) {
      setPenanggungJawab(found.namaWali);
      setTeleponPenanggungJawab(found.teleponWali);
      setAlamatTujuan(found.alamat);
    }
  };

  const handleCreateSurat = (e: React.FormEvent) => {
    e.preventDefault();
    const foundSantri = santriList.find(s => s.id === selectedSantriId);
    if (!foundSantri) return;

    const romanMonth = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
    const suratCount = String(suratIzinList.length + 1).padStart(3, '0');
    const nomor = `${suratCount}/SIP/PPRH/${romanMonth}/2026`;

    const newSurat: SuratIzinPulang = {
      id: `sip_${Date.now()}`,
      nomorSurat: nomor,
      santriId: foundSantri.id,
      namaSantri: foundSantri.nama,
      nis: foundSantri.nis,
      kamar: foundSantri.kamar,
      alasanPulang,
      tanggalPergi,
      tanggalKembali,
      penanggungJawab: penanggungJawab || foundSantri.namaWali,
      teleponPenanggungJawab: teleponPenanggungJawab || foundSantri.teleponWali,
      alamatTujuan: alamatTujuan || foundSantri.alamat,
      statusKepulangan: 'Sedang Di Luar',
      petugasPemberiIzin: userName,
      catatan,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddSuratIzin(newSurat);
    setShowAddForm(false);
    // Reset form
    setAlasanPulang('');
    // Automatically preview print for convenience
    setPrintSuratModal(newSurat);
  };

  const filteredSurat = suratIzinList.filter(s => {
    const matchStatus = filterStatus === 'all' || s.statusKepulangan === filterStatus;
    const matchSearch = s.namaSantri.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: SuratIzinPulang['statusKepulangan']) => {
    switch (status) {
      case 'Sedang Di Luar':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Sudah Kembali':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Terlambat':
        return 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Surat Izin Pulang & Tracing Santri</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Penerbitan surat jalan dinas pesantren, pencetakan dokumen resmi A4, dan pelacakan status kepulangan
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={() => {
              if (santriList[0]) handleSelectSantriChange(santriList[0].id);
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>{showAddForm ? 'Tutup Formulir' : 'Terbitkan Surat Izin Pulang'}</span>
          </button>
        )}
      </div>

      {/* Form Buat Surat Izin */}
      {showAddForm && userRole === 'admin' && (
        <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-5 h-5 text-emerald-800" />
            <h3 className="text-sm font-bold text-emerald-950">
              Formulir Penerbitan Surat Izin Pulang Santri (Resmi)
            </h3>
          </div>

          <form onSubmit={handleCreateSurat} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Pilih Santri:</label>
                <select
                  value={selectedSantriId}
                  onChange={(e) => handleSelectSantriChange(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                >
                  {santriList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.nis} - {s.kamar})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Tanggal Mulai Izin (Pergi):</label>
                <input
                  type="date"
                  value={tanggalPergi}
                  onChange={(e) => setTanggalPergi(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Tanggal Wajib Kembali:</label>
                <input
                  type="date"
                  value={tanggalKembali}
                  onChange={(e) => setTanggalKembali(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Penanggung Jawab / Wali:</label>
                <input
                  type="text"
                  placeholder="Nama orang tua/wali penjemput"
                  value={penanggungJawab}
                  onChange={(e) => setPenanggungJawab(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Nomor Kontak / WhatsApp Wali:</label>
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx"
                  value={teleponPenanggungJawab}
                  onChange={(e) => setTeleponPenanggungJawab(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Alasan Kepulangan Santri:</label>
                <input
                  type="text"
                  placeholder="Contoh: Takziyah keluarga / Pengobatan gigi"
                  value={alasanPulang}
                  onChange={(e) => setAlasanPulang(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Alamat Tujuan Pulang:</label>
                <input
                  type="text"
                  placeholder="Alamat lengkap tujuan"
                  value={alamatTujuan}
                  onChange={(e) => setAlamatTujuan(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Catatan Khusus / Tugas Selama di Rumah:</label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Terbitkan & Siapkan Dokumen Cetak</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Status Kepulangan:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
          >
            <option value="all">Semua Status</option>
            <option value="Sedang Di Luar">Sedang Di Luar (Aktif Pulang)</option>
            <option value="Sudah Kembali">Sudah Kembali ke Asrama</option>
            <option value="Terlambat">Terlambat Kembali (Melewati Batas)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Pencarian Surat:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari santri, no surat, penanggung jawab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Table of Permits */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">No. Surat & Santri</th>
                <th className="py-3 px-4">Alasan Kepulangan</th>
                <th className="py-3 px-4">Masa Izin (Pergi - Kembali)</th>
                <th className="py-3 px-4">Penanggung Jawab</th>
                <th className="py-3 px-4 text-center">Status Tracing</th>
                <th className="py-3 px-4 text-center w-36">Aksi & Cetak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSurat.map((surat) => (
                <tr key={surat.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-800 text-sm">{surat.namaSantri}</div>
                    <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5">
                      {surat.nomorSurat}
                    </div>
                    <div className="text-[10px] text-stone-400">{surat.kamar}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-stone-800 font-medium">{surat.alasanPulang}</div>
                    <div className="text-[11px] text-stone-500 line-clamp-1">{surat.alamatTujuan}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-800">
                      {surat.tanggalPergi} s/d {surat.tanggalKembali}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Pemberi Izin: {surat.petugasPemberiIzin}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-800">{surat.penanggungJawab}</div>
                    <div className="text-[11px] text-stone-500">{surat.teleponPenanggungJawab}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(surat.statusKepulangan)}`}>
                      {surat.statusKepulangan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setPrintSuratModal(surat)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1 transition"
                        title="Cetak Surat Izin Resmi"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Cetak</span>
                      </button>

                      {userRole === 'admin' && surat.statusKepulangan !== 'Sudah Kembali' && (
                        <button
                          onClick={() => onUpdateStatusSurat(surat.id, 'Sudah Kembali')}
                          className="px-2 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px]"
                          title="Tandai Santri Sudah Tiba di Pondok"
                        >
                          Konfirmasi Kembali
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PRINT RESMI SURAT IZIN PULANG (A4 VIEW) */}
      {printSuratModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[95vh] overflow-y-auto">
            {/* Top Modal Controls */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 no-print">
              <span className="font-bold text-sm text-stone-700">
                Pratinjau Dokumen Resmi Surat Jalan / Izin Pulang
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Cetak Dokumen (A4)</span>
                </button>
                <button
                  onClick={() => setPrintSuratModal(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* DOKUMEN RESMI SIAP CETAK (PRINTER-FRIENDLY, WHITE BACKGROUND) */}
            <div className="p-6 border border-stone-300 bg-white text-stone-900 rounded-xl shadow-xs print-page">
              {/* Kop Surat Resmi */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 text-center relative">
                {settings?.logoUrl && (
                  <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                    <img 
                      src={settings.logoUrl} 
                      alt="Logo Lembaga" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="text-xs uppercase tracking-widest font-semibold text-stone-600">
                  {settings?.subNamaTagline || 'Yayasan Pendidikan & Pondok Pesantren'}
                </div>
                <h1 className="text-xl font-bold tracking-wide uppercase text-stone-900 mt-0.5">
                  {settings?.namaLembaga || 'Pondok Pesantren Raudhotu Hidayah'}
                </h1>
                <p className="text-[11px] text-stone-600 italic">
                  {settings?.alamatLengkap || 'Jl. Pesantren No. 14, Ciamis, Jawa Barat'} • Telp: {settings?.telepon || '(0265) 778899'} • Email: {settings?.email || 'info@raudhotulhidayah.ponpes.id'}
                </p>
                <div className="w-full h-0.5 bg-stone-900 mt-2" />
                <div className="w-full h-px bg-stone-400 mt-0.5" />
              </div>

              {/* Judul & Nomor Surat */}
              <div className="text-center mb-5">
                <h2 className="text-sm font-bold uppercase underline tracking-wider">
                  SURAT IZIN PULANG / JALAN SANTRI
                </h2>
                <p className="text-xs font-mono font-medium mt-0.5">
                  Nomor: {printSuratModal.nomorSurat}
                </p>
              </div>

              {/* Pembuka */}
              <p className="text-xs leading-relaxed text-justify mb-3">
                Biro Kepengasuhan dan Keamanan Santri {settings?.namaLembaga || 'Pondok Pesantren Raudhotu Hidayah'} dengan ini memberikan izin kepada santri yang bersangkutan di bawah ini:
              </p>

              {/* Data Santri */}
              <div className="space-y-1.5 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200 mb-4">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Nama Santri</span>
                  <span className="col-span-8">: <strong>{printSuratModal.namaSantri}</strong></span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Nomor Induk Santri (NIS)</span>
                  <span className="col-span-8">: {printSuratModal.nis}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Rayon / Kamar Asrama</span>
                  <span className="col-span-8">: {printSuratModal.kamar}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Penanggung Jawab / Wali</span>
                  <span className="col-span-8">: {printSuratModal.penanggungJawab} ({printSuratModal.teleponPenanggungJawab})</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Alamat Tujuan</span>
                  <span className="col-span-8">: {printSuratModal.alamatTujuan}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Alasan Kepulangan</span>
                  <span className="col-span-8">: {printSuratModal.alasanPulang}</span>
                </div>
              </div>

              {/* Ketentuan Waktu */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs mb-4">
                <div className="font-bold text-amber-950 mb-1">Jadwal Perizinan:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500">Tanggal Keberangkatan:</span>
                    <div className="font-bold text-stone-900">{printSuratModal.tanggalPergi}</div>
                  </div>
                  <div>
                    <span className="text-stone-500">Wajib Kembali ke Pesantren:</span>
                    <div className="font-bold text-stone-900">{printSuratModal.tanggalKembali} (Maks. 17:00 WIB)</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-amber-900 italic">
                  *Catatan Pengasuh: {printSuratModal.catatan || 'Wajib menuntaskan kewajiban setoran hafalan.'}
                </div>
              </div>

              {/* Syarat & Ketentuan Perizinan */}
              <div className="text-[11px] text-stone-600 mb-6 space-y-1">
                <p className="font-bold text-stone-800">Ketentuan Santri Selama di Luar Pondok:</p>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Menjaga nama baik dan akhlak karimah Pondok Pesantren Raudhotu Hidayah.</li>
                  <li>Melaksanakan sholat 5 waktu secara berjamaah tepat waktu.</li>
                  <li>Kembali ke pondok tepat pada tanggal yang telah ditentukan tanpa keterlambatan.</li>
                  <li>Membawa kembali surat ini dengan ditandatangani oleh orang tua/wali santri.</li>
                </ol>
              </div>

              {/* Kolom Tanda Tangan Resmi (3 Pihak) */}
              <div className="grid grid-cols-3 text-center text-xs gap-4 pt-4 border-t border-stone-200">
                <div>
                  <p className="text-stone-500">Wali / Penanggung Jawab,</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-stone-300 italic text-[10px]">(Tanda Tangan)</span>
                  </div>
                  <p className="font-bold underline text-stone-900">{printSuratModal.penanggungJawab}</p>
                </div>

                <div>
                  <p className="text-stone-500">Biro Keamanan Santri,</p>
                  <div className="h-16 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border border-stone-400 rounded flex items-center justify-center text-[9px] text-stone-400 font-mono">
                      STEMPEL
                    </div>
                  </div>
                  <p className="font-bold underline text-stone-900">{printSuratModal.petugasPemberiIzin}</p>
                </div>

                <div>
                  <p className="text-stone-500">Pengasuh Pondok Pesantren,</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-stone-400 font-arabic text-sm">عبد الهادي</span>
                  </div>
                  <p className="font-bold underline text-stone-900">{settings?.namaPengasuh || 'KH. Abdul Hadi'}</p>
                </div>
              </div>

              {/* Barcode / Validasi Footer */}
              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-stone-600" />
                  <span>Validasi Digital Kesantrian PPRH • ID: {printSuratModal.id}</span>
                </div>
                <span>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
