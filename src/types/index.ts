export type RoleType = 'admin' | 'guru' | 'wali';

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  password?: string;
  email: string;
  role: RoleType;
  title: string;
  nip?: string;
  noHp?: string;
  mapel?: string;
  avatar?: string;
  santriId?: string; // For Wali Santri, associated student
  santriName?: string;
}

export type StatusKehadiran = 'Hadir' | 'Telat' | 'Izin' | 'Sakit' | 'Pulang' | 'Alfa';

export type SesiAbsensi = 
  | 'ngaji_asar' 
  | 'ngaji_maghrib' 
  | 'ngaji_isya'
  | 'sholat_subuh'
  | 'sholat_dzuhur'
  | 'sholat_asar'
  | 'sholat_maghrib'
  | 'sholat_isya';

export interface Santri {
  id: string;
  nis: string;
  nama: string;
  gender: 'L' | 'P';
  kamar: string; // e.g., 'Al-Ghazali 01', 'Ibnu Sina 02'
  rayon: string; // e.g., 'Rayon Putra Al-Ghazali'
  kelasMadrasah: string; // e.g., 'Ula A', 'Ula B', 'Wustha A', 'Ulya'
  kelasFormal: string; // e.g., 'SMP Kelas 8', 'SMA Kelas 11'
  namaWali: string;
  teleponWali: string;
  alamat: string;
  statusMukim: 'Mukim' | 'Izin Pulang' | 'Terlambat Kembali';
  poinPelanggaran: number;
  foto?: string;
}

export interface AbsensiRecord {
  id: string;
  santriId: string;
  tanggal: string; // YYYY-MM-DD
  sesi: SesiAbsensi;
  status: StatusKehadiran;
  keterangan?: string;
  petugas: string;
  updatedAt: string;
}

export interface JadwalMadrasah {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Ahad';
  waktu: string;
  kelas: string;
  kitab: string;
  pengajar: string;
  ruang: string;
}

export interface RutinitasHarian {
  id: string;
  waktuMulai: string; // HH:MM
  waktuSelesai: string; // HH:MM
  kegiatan: string;
  keterangan: string;
  kategori: 'Ibadah' | 'KBM' | 'Kemandirian' | 'Istirahat' | 'Olahraga';
  lokasi: string;
}

export interface JadwalPiket {
  id: string;
  hari: string;
  lokasi: string;
  kelompok: string;
  kamar: string;
  koordinator: string;
  tugas: string[];
}

export interface IzinMengajar {
  id: string;
  ustadzId: string;
  namaUstadz: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  mapelKitab: string;
  alasan: string;
  ustadzBadal: string; // Pengganti
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  catatanAdmin?: string;
  createdAt: string;
}

export interface JurnalHarian {
  id: string;
  tanggal: string;
  namaUstadz: string;
  kelas: string;
  kitab: string;
  babMateri: string;
  halaman: string;
  catatanSantri: string;
  kendalaKBM?: string;
  jumlahHadir: number;
  jumlahSantri: number;
}

export interface SuratIzinPulang {
  id: string;
  nomorSurat: string;
  santriId: string;
  namaSantri: string;
  nis: string;
  kamar: string;
  alasanPulang: string;
  tanggalPergi: string; // YYYY-MM-DD
  tanggalKembali: string; // YYYY-MM-DD
  penanggungJawab: string;
  teleponPenanggungJawab: string;
  alamatTujuan: string;
  statusKepulangan: 'Sedang Di Luar' | 'Sudah Kembali' | 'Terlambat';
  tanggalRealisasiKembali?: string;
  petugasPemberiIzin: string;
  catatan?: string;
  createdAt: string;
}

export type TingkatPelanggaran = 'Ringan' | 'Sedang' | 'Berat';
export type StatusTakzir = 'Belum Dilaksanakan' | 'Sedang Proses' | 'Selesai';

export interface PelanggaranSantri {
  id: string;
  santriId: string;
  namaSantri: string;
  kamar: string;
  tingkat: TingkatPelanggaran;
  kategori: string;
  tanggalKejadian: string;
  keterangan: string;
  poin: number;
  bentukTakzir: string;
  statusTakzir: StatusTakzir;
  pencatat: string;
  diselesaikanPada?: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  prioritas: 'Normal' | 'Penting';
}

export interface LembagaSettings {
  namaLembaga: string;
  subNamaTagline: string;
  alamatLengkap: string;
  telepon: string;
  email: string;
  namaPengasuh: string;
  namaKepalaKesantrian: string;
  logoUrl?: string; // URL or Base64 data string
  adminUsername: string;
  adminEmail: string;
}
