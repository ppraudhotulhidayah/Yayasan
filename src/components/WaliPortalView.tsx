import React from 'react';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  UserCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { 
  Santri, 
  AbsensiRecord, 
  SuratIzinPulang, 
  PelanggaranSantri, 
  JadwalMadrasah,
  UserAccount 
} from '../types';

interface WaliPortalViewProps {
  currentUser: UserAccount;
  santri: Santri;
  absensiList: AbsensiRecord[];
  suratIzinList: SuratIzinPulang[];
  pelanggaranList: PelanggaranSantri[];
  jadwalList: JadwalMadrasah[];
  onNavigateToRapor: () => void;
}

export const WaliPortalView: React.FC<WaliPortalViewProps> = ({
  currentUser,
  santri,
  absensiList,
  suratIzinList,
  pelanggaranList,
  jadwalList,
  onNavigateToRapor,
}) => {
  // Filter data specifically for this student
  const childAttendance = absensiList.filter(a => a.santriId === santri.id);
  const childPermits = suratIzinList.filter(s => s.santriId === santri.id);
  const childViolations = pelanggaranList.filter(p => p.santriId === santri.id);
  const childSchedules = jadwalList.filter(j => j.kelas.includes(santri.kelasMadrasah) || j.kelas === 'Semua Tingkat');

  // Count attendance
  const hadirCount = childAttendance.filter(a => a.status === 'Hadir').length;
  const telatCount = childAttendance.filter(a => a.status === 'Telat').length;
  const izinCount = childAttendance.filter(a => a.status === 'Izin' || a.status === 'Pulang').length;
  const sakitCount = childAttendance.filter(a => a.status === 'Sakit').length;
  const totalSes = childAttendance.length || 1;
  const hadirPercentage = Math.round(((hadirCount + telatCount) / totalSes) * 100);

  return (
    <div className="space-y-6">
      {/* Mobile-First Parent Header */}
      <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-stone-900 font-bold text-2xl flex items-center justify-center shadow-md shrink-0 border-2 border-white/40">
              {santri.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Portal Orang Tua / Wali
                </span>
                <span className="text-xs text-emerald-200">
                  {currentUser.title}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {santri.nama}
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                NIS: <strong className="font-mono text-amber-300">{santri.nis}</strong> • {santri.kamar} • {santri.kelasMadrasah}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onNavigateToRapor}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Rapor PDF Ananda</span>
            </button>
          </div>
        </div>

        {/* Informational Read-Only notice */}
        <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Mode Pantau Khusus Wali Santri (Data Terverifikasi Resmi Pengasuhan)</span>
          </span>
          <span className="font-semibold text-amber-300">
            Status: {santri.statusMukim}
          </span>
        </div>
      </div>

      {/* 4 Key Stat Cards for Parent */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Kehadiran Keseluruhan</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{hadirPercentage}%</div>
          <p className="text-[11px] text-stone-500 mt-0.5">{hadirCount} Hadir • {telatCount} Telat</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Poin Pelanggaran</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">
            {santri.poinPelanggaran === 0 ? (
              <span className="text-emerald-700">0 Poin (Disiplin)</span>
            ) : (
              <span className="text-rose-600">{santri.poinPelanggaran} Poin</span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            {santri.poinPelanggaran === 0 ? 'Bebas dari takzir' : 'Dalam pembinaan'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Surat Izin Pulang</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{childPermits.length} Kali</div>
          <p className="text-[11px] text-stone-500 mt-0.5">Riwayat kepulangan resmi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Kelas Diniyah</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">{santri.kelasMadrasah}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">{santri.kelasFormal}</p>
        </div>
      </div>

      {/* Row 2: Riwayat Kehadiran Terkini & Jadwal Harian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Catatan Presensi Santri */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rekapitulasi Kehadiran Ananda</span>
            </h3>
            <span className="text-xs text-stone-400">Bulan Ini</span>
          </div>

          <div className="space-y-2">
            {childAttendance.map((rec) => {
              const badgeColor = 
                rec.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                rec.status === 'Telat' ? 'bg-amber-100 text-amber-800' :
                rec.status === 'Pulang' ? 'bg-teal-100 text-teal-800' :
                rec.status === 'Sakit' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800';

              const sesiName = 
                rec.sesi === 'ngaji_asar' ? 'Ngaji Asar (Madrasah)' :
                rec.sesi === 'ngaji_maghrib' ? 'Ngaji Maghrib (Tahsin Qur\'an)' :
                rec.sesi === 'ngaji_isya' ? 'Ngaji Isya (Bandongan Kitab)' :
                rec.sesi === 'sholat_dzuhur' ? 'Sholat Dzuhur Berjamaah' :
                rec.sesi === 'sholat_subuh' ? 'Sholat Shubuh Berjamaah' : 'Sholat Berjamaah';

              return (
                <div key={rec.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-stone-800">{sesiName}</div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                      📅 {rec.tanggal} • Petugas: {rec.petugas}
                    </div>
                    {rec.keterangan && (
                      <div className="text-[11px] text-stone-500 mt-0.5 italic">
                        "{rec.keterangan}"
                      </div>
                    )}
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badgeColor}`}>
                    {rec.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Jadwal Pelajaran Madrasah Ananda */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Jadwal Pengajian Kitab Ananda ({santri.kelasMadrasah})</span>
            </h3>
            <span className="text-xs text-stone-400">Madrasah Diniyah</span>
          </div>

          <div className="space-y-2.5">
            {childSchedules.map((j) => (
              <div key={j.id} className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">{j.kitab}</span>
                  <span className="font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {j.hari}
                  </span>
                </div>
                <div className="text-stone-600 mt-1 flex items-center gap-2">
                  <span>👳 {j.pengajar}</span>
                  <span>•</span>
                  <span>⏰ {j.waktu} WIB</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  📍 {j.ruang}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Riwayat Perizinan Pulang & Kedisiplinan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Riwayat Surat Izin Pulang */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Riwayat Surat Izin Pulang</span>
            </h3>
            <span className="text-xs text-stone-400">Resmi</span>
          </div>

          {childPermits.length > 0 ? (
            <div className="space-y-3">
              {childPermits.map((sip) => (
                <div key={sip.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-900">{sip.nomorSurat}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {sip.statusKepulangan}
                    </span>
                  </div>
                  <p className="font-semibold text-stone-800 mt-1">Alasan: {sip.alasanPulang}</p>
                  <div className="text-stone-500 text-[11px] mt-1">
                    Masa Izin: {sip.tanggalPergi} s/d {sip.tanggalKembali}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
              Belum ada riwayat izin kepulangan. Ananda mukim dengan tertib di pondok.
            </div>
          )}
        </div>

        {/* Catatan Kedisiplinan & Takzir */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Catatan Kedisiplinan & Karakter</span>
            </h3>
            <span className="text-xs text-stone-400">Biro Keamanan</span>
          </div>

          {childViolations.length > 0 ? (
            <div className="space-y-3">
              {childViolations.map((v) => (
                <div key={v.id} className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950">{v.kategori}</span>
                    <span className="font-bold text-rose-700">+{v.poin} Poin</span>
                  </div>
                  <p className="text-stone-700 mt-1">{v.keterangan}</p>
                  <div className="mt-2 text-[11px] text-stone-600">
                    Bentuk Takzir: <strong>{v.bentukTakzir}</strong>
                  </div>
                  <div className="mt-1 text-[10px] text-stone-400">
                    Status: {v.statusTakzir} • Tanggal: {v.tanggalKejadian}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="font-bold text-sm">Alhamdulillah, Ananda Sangat Berdisiplin!</div>
              <p className="text-emerald-700 mt-1 leading-relaxed">
                Tidak ada catatan pelanggaran atau takzir tata tertib pesantren. Ananda selalu mematuhi sunnah dan ketertiban asrama.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
