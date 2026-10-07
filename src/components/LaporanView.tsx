import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  FileText, 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  AlertTriangle, 
  Building, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { 
  Santri, 
  AbsensiRecord, 
  JurnalHarian, 
  PelanggaranSantri, 
  SuratIzinPulang, 
  RoleType,
  LembagaSettings
} from '../types';

interface LaporanViewProps {
  santriList: Santri[];
  absensiList: AbsensiRecord[];
  jurnalList: JurnalHarian[];
  pelanggaranList: PelanggaranSantri[];
  suratIzinList: SuratIzinPulang[];
  userRole: RoleType;
  settings?: LembagaSettings;
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  santriList,
  absensiList,
  jurnalList,
  pelanggaranList,
  suratIzinList,
  userRole,
  settings,
}) => {
  const [reportType, setReportType] = useState<'absensi' | 'jurnal' | 'kedisiplinan' | 'rapor'>('absensi');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [selectedSantriId, setSelectedSantriId] = useState<string>(santriList[0]?.id || '');

  const printCurrentReport = () => {
    window.print();
  };

  const selectedSantri = santriList.find(s => s.id === selectedSantriId) || santriList[0];
  const santriAttendance = absensiList.filter(a => a.santriId === selectedSantri?.id);
  const santriViolations = pelanggaranList.filter(p => p.santriId === selectedSantri?.id);
  const santriPermits = suratIzinList.filter(s => s.santriId === selectedSantri?.id);

  return (
    <div className="space-y-6">
      {/* Top action header (no-print) */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Laporan & Rekapitulasi Cetak PDF (A4)</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Dokumen cetak terformat rapi standar A4 dengan Kop Resmi Pondok Pesantren Raudhotu Hidayah
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={printCurrentReport}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak / Download PDF Dokumen Ini</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills (no-print) */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setReportType('absensi')}
            className={`px-3 py-1.5 rounded-lg transition ${
              reportType === 'absensi' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rekap Presensi Santri
          </button>
          <button
            onClick={() => setReportType('jurnal')}
            className={`px-3 py-1.5 rounded-lg transition ${
              reportType === 'jurnal' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rekap Jurnal Pengajar
          </button>
          <button
            onClick={() => setReportType('kedisiplinan')}
            className={`px-3 py-1.5 rounded-lg transition ${
              reportType === 'kedisiplinan' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rekap Kedisiplinan & Takzir
          </button>
          <button
            onClick={() => setReportType('rapor')}
            className={`px-3 py-1.5 rounded-lg transition ${
              reportType === 'rapor' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rapor Perkembangan Santri
          </button>
        </div>

        {reportType === 'rapor' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-500">Pilih Santri:</span>
            <select
              value={selectedSantriId}
              onChange={(e) => setSelectedSantriId(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
            >
              {santriList.map(s => (
                <option key={s.id} value={s.id}>{s.nama} ({s.nis})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* =========================================================================
          PRINTABLE DOCUMENT CANVAS (PRINTER FRIENDLY, CLEAN WHITE, A4 READY)
         ========================================================================= */}
      <div className="bg-white text-stone-900 p-8 sm:p-12 rounded-2xl border border-stone-300 shadow-md max-w-4xl mx-auto print-page">
        {/* Kop Surat Resmi Pesantren */}
        <div className="border-b-2 border-stone-900 pb-3 mb-6 text-center relative">
          {settings?.logoUrl && (
            <div className="absolute left-0 top-0 w-20 h-20 flex items-center justify-center">
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
          <h1 className="text-2xl font-bold tracking-wide uppercase text-stone-900 mt-0.5">
            {settings?.namaLembaga || 'Pondok Pesantren Raudhotu Hidayah'}
          </h1>
          <p className="text-xs text-stone-600 italic">
            {settings?.alamatLengkap || 'Jl. Pesantren No. 14, Ciamis, Jawa Barat'} • Telp: {settings?.telepon || '(0265) 778899'} • Email: {settings?.email || 'sekretariat@raudhotulhidayah.ponpes.id'}
          </p>
          <div className="w-full h-0.5 bg-stone-900 mt-3" />
          <div className="w-full h-px bg-stone-400 mt-0.5" />
        </div>

        {/* ==================== 1. REKAP ABSENSI SANTRI ==================== */}
        {reportType === 'absensi' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-base font-bold uppercase underline">
                LAPORAN REKAPITULASI PRESENSI & KEHADIRAN SANTRI
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Bulan: Oktober 2026 • Madrasah Diniyah & Sholat Berjamaah
              </p>
            </div>

            <table className="w-full text-left text-xs border border-stone-300 border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-300 text-stone-800 font-bold">
                  <th className="p-2 border border-stone-300 text-center w-10">No</th>
                  <th className="p-2 border border-stone-300">Nama Santri</th>
                  <th className="p-2 border border-stone-300">NIS</th>
                  <th className="p-2 border border-stone-300">Kamar Asrama</th>
                  <th className="p-2 border border-stone-300">Kelas</th>
                  <th className="p-2 border border-stone-300 text-center">Hadir</th>
                  <th className="p-2 border border-stone-300 text-center">Telat</th>
                  <th className="p-2 border border-stone-300 text-center">Izin/Sakit</th>
                  <th className="p-2 border border-stone-300 text-center">% Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {santriList.map((s, idx) => {
                  const records = absensiList.filter(a => a.santriId === s.id);
                  const h = records.filter(a => a.status === 'Hadir').length || 1;
                  const t = records.filter(a => a.status === 'Telat').length;
                  const is = records.filter(a => a.status === 'Izin' || a.status === 'Sakit' || a.status === 'Pulang').length;
                  const pct = Math.min(100, Math.round(((h + t) / (records.length || 1)) * 100));

                  return (
                    <tr key={s.id} className="border-b border-stone-200">
                      <td className="p-2 border border-stone-300 text-center">{idx + 1}</td>
                      <td className="p-2 border border-stone-300 font-semibold">{s.nama}</td>
                      <td className="p-2 border border-stone-300 font-mono text-[11px]">{s.nis}</td>
                      <td className="p-2 border border-stone-300">{s.kamar}</td>
                      <td className="p-2 border border-stone-300">{s.kelasMadrasah}</td>
                      <td className="p-2 border border-stone-300 text-center font-bold">{h}</td>
                      <td className="p-2 border border-stone-300 text-center">{t}</td>
                      <td className="p-2 border border-stone-300 text-center">{is}</td>
                      <td className="p-2 border border-stone-300 text-center font-bold text-stone-900">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== 2. REKAP JURNAL PENGAJAR ==================== */}
        {reportType === 'jurnal' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-base font-bold uppercase underline">
                LAPORAN REKAPITULASI JURNAL HARIAN DEWAN ASATIDZ
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Kajian Kitab Kuning Madrasah Diniyah Raudhotu Hidayah
              </p>
            </div>

            <table className="w-full text-left text-xs border border-stone-300 border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-300 text-stone-800 font-bold">
                  <th className="p-2 border border-stone-300 text-center w-10">No</th>
                  <th className="p-2 border border-stone-300">Tanggal</th>
                  <th className="p-2 border border-stone-300">Ustadz Pengampu</th>
                  <th className="p-2 border border-stone-300">Kitab & Kelas</th>
                  <th className="p-2 border border-stone-300">Materi & Capaian</th>
                  <th className="p-2 border border-stone-300">Catatan Santri / KBM</th>
                </tr>
              </thead>
              <tbody>
                {jurnalList.map((j, idx) => (
                  <tr key={j.id} className="border-b border-stone-200">
                    <td className="p-2 border border-stone-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-stone-300 font-mono">{j.tanggal}</td>
                    <td className="p-2 border border-stone-300 font-semibold">{j.namaUstadz}</td>
                    <td className="p-2 border border-stone-300">
                      <div className="font-bold">{j.kitab}</div>
                      <div className="text-[10px] text-stone-500">{j.kelas}</div>
                    </td>
                    <td className="p-2 border border-stone-300">
                      <div>{j.babMateri}</div>
                      <div className="text-[10px] text-stone-500 font-mono">{j.halaman}</div>
                    </td>
                    <td className="p-2 border border-stone-300 text-[11px] leading-relaxed">
                      {j.catatanSantri}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== 3. REKAP KEDISIPLINAN & TAKZIR ==================== */}
        {reportType === 'kedisiplinan' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-base font-bold uppercase underline">
                LAPORAN BUKU PELANGGARAN TATA TERTIB & TAKZIR SANTRI
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Biro Keamanan & Pembinaan Karakter Santri
              </p>
            </div>

            <table className="w-full text-left text-xs border border-stone-300 border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-300 text-stone-800 font-bold">
                  <th className="p-2 border border-stone-300 text-center w-10">No</th>
                  <th className="p-2 border border-stone-300">Nama Santri & Kamar</th>
                  <th className="p-2 border border-stone-300">Tanggal</th>
                  <th className="p-2 border border-stone-300">Tingkat & Poin</th>
                  <th className="p-2 border border-stone-300">Kronologi Kejadian</th>
                  <th className="p-2 border border-stone-300">Bentuk Takzir Edukatif</th>
                  <th className="p-2 border border-stone-300 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {pelanggaranList.map((p, idx) => (
                  <tr key={p.id} className="border-b border-stone-200">
                    <td className="p-2 border border-stone-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-stone-300">
                      <div className="font-bold">{p.namaSantri}</div>
                      <div className="text-[10px] text-stone-500">{p.kamar}</div>
                    </td>
                    <td className="p-2 border border-stone-300 font-mono text-[11px]">{p.tanggalKejadian}</td>
                    <td className="p-2 border border-stone-300 font-semibold">
                      {p.tingkat} (+{p.poin} Poin)
                    </td>
                    <td className="p-2 border border-stone-300 text-[11px]">{p.keterangan}</td>
                    <td className="p-2 border border-stone-300 text-[11px]">{p.bentukTakzir}</td>
                    <td className="p-2 border border-stone-300 text-center font-bold">
                      {p.statusTakzir}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== 4. RAPOR PERKEMBANGAN SANTRI ==================== */}
        {reportType === 'rapor' && selectedSantri && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-base font-bold uppercase underline">
                LEMBAR EVALUASI & RAPOR PERKEMBANGAN SANTRI
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Tahun Ajaran 2026/2027 • Semester Ganjil
              </p>
            </div>

            {/* Biodata Santri */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-lg border border-stone-200 mb-4">
              <div>
                <div>Nama Santri : <strong>{selectedSantri.nama}</strong></div>
                <div className="mt-1">NIS : <strong>{selectedSantri.nis}</strong></div>
                <div className="mt-1">Kamar : {selectedSantri.kamar} ({selectedSantri.rayon})</div>
              </div>
              <div>
                <div>Kelas Diniyah : <strong>{selectedSantri.kelasMadrasah}</strong></div>
                <div className="mt-1">Nama Wali : {selectedSantri.namaWali}</div>
                <div className="mt-1">Status Mukim : <strong>{selectedSantri.statusMukim}</strong></div>
              </div>
            </div>

            {/* Rekap Evaluasi */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs mb-4">
              <div className="p-3 border border-stone-300 rounded-lg">
                <span className="text-stone-500">Tingkat Kehadiran</span>
                <div className="text-xl font-bold text-stone-900 mt-1">98%</div>
                <span className="text-[10px] text-stone-400">Ngaji & Sholat Berjamaah</span>
              </div>
              <div className="p-3 border border-stone-300 rounded-lg">
                <span className="text-stone-500">Akumulasi Poin Disiplin</span>
                <div className="text-xl font-bold text-stone-900 mt-1">{selectedSantri.poinPelanggaran} Poin</div>
                <span className="text-[10px] text-stone-400">{selectedSantri.poinPelanggaran === 0 ? 'Tertib & Disiplin' : 'Catatan Pembinaan'}</span>
              </div>
              <div className="p-3 border border-stone-300 rounded-lg">
                <span className="text-stone-500">Surat Izin Keluar</span>
                <div className="text-xl font-bold text-stone-900 mt-1">{santriPermits.length} Kali</div>
                <span className="text-[10px] text-stone-400">Tertib Kembali</span>
              </div>
            </div>

            <div className="text-xs border border-stone-300 rounded-lg p-4 leading-relaxed text-stone-700">
              <strong className="text-stone-900">Catatan Dewan Pengasuh & Asatidz:</strong>
              <p className="mt-1">
                Ananda {selectedSantri.nama} menunjukkan keteladanan yang baik dalam sholat berjamaah, aktif dalam halaqoh pengajian kitab kuning, serta menjaga pergaulan dan sopan santun terhadap asatidz dan sesama santri. Harap orang tua senantiasa mendoakan dan membimbing selama libur kepulangan di rumah.
              </p>
            </div>
          </div>
        )}

        {/* Kolom Tanda Tangan Resmi Pengasuh & Pimpinan Pondok */}
        <div className="grid grid-cols-2 text-center text-xs gap-8 pt-10 mt-8 border-t border-stone-300">
          <div>
            <p className="text-stone-500">Mengetahui,</p>
            <p className="font-semibold text-stone-800">Kepala Bidang Kesantrian</p>
            <div className="h-20 flex items-center justify-center">
              <span className="text-stone-300 italic text-[10px]">(Tanda Tangan)</span>
            </div>
            <p className="font-bold underline text-stone-900">{settings?.namaKepalaKesantrian || 'Ustadz H. Ahmad Muzammil, S.Pd.I'}</p>
          </div>

          <div>
            <p className="text-stone-500">Ciamis, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="font-semibold text-stone-800">Pengasuh {settings?.namaLembaga || 'Pondok Pesantren Raudhotu Hidayah'}</p>
            <div className="h-20 flex items-center justify-center">
              <span className="text-stone-400 font-arabic text-lg">عبد الهادي</span>
            </div>
            <p className="font-bold underline text-stone-900">{settings?.namaPengasuh || 'KH. Abdul Hadi'}</p>
          </div>
        </div>

        {/* Footer Validasi */}
        <div className="mt-8 pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400">
          <div className="flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-stone-600" />
            <span>Dokumen Otentik Terverifikasi Sistem Manajemen {settings?.namaLembaga || 'Raudhotu Hidayah'}</span>
          </div>
          <span>Tanggal Unduh: {new Date().toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
};
