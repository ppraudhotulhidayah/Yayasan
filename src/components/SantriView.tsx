import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  MapPin, 
  Award, 
  AlertTriangle, 
  FileText, 
  Eye, 
  X, 
  Save, 
  ShieldCheck 
} from 'lucide-react';
import { Santri, RoleType, SuratIzinPulang, PelanggaranSantri } from '../types';

interface SantriViewProps {
  santriList: Santri[];
  onAddSantri: (santri: Santri) => void;
  onUpdateSantri: (santri: Santri) => void;
  onDeleteSantri: (id: string) => void;
  userRole: RoleType;
  suratIzinList: SuratIzinPulang[];
  pelanggaranList: PelanggaranSantri[];
}

export const SantriView: React.FC<SantriViewProps> = ({
  santriList,
  onAddSantri,
  onUpdateSantri,
  onDeleteSantri,
  userRole,
  suratIzinList,
  pelanggaranList,
}) => {
  const [filterKamar, setFilterKamar] = useState<string>('all');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [detailSantri, setDetailSantri] = useState<Santri | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Santri>>({
    nama: '',
    nis: '',
    gender: 'L',
    kamar: 'Al-Ghazali 01',
    rayon: 'Rayon Putra Al-Ghazali',
    kelasMadrasah: 'Wustha A',
    kelasFormal: 'MA Kelas 10',
    namaWali: '',
    teleponWali: '',
    alamat: '',
    statusMukim: 'Mukim',
    poinPelanggaran: 0,
  });

  const filteredSantri = santriList.filter(s => {
    const matchKamar = filterKamar === 'all' || s.kamar.includes(filterKamar);
    const matchKelas = filterKelas === 'all' || s.kelasMadrasah === filterKelas;
    const matchSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.namaWali.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKamar && matchKelas && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData({
      nama: '',
      nis: `RH-2024-${String(santriList.length + 1).padStart(3, '0')}`,
      gender: 'L',
      kamar: 'Al-Ghazali 01',
      rayon: 'Rayon Putra Al-Ghazali',
      kelasMadrasah: 'Wustha A',
      kelasFormal: 'MA Kelas 10',
      namaWali: '',
      teleponWali: '',
      alamat: '',
      statusMukim: 'Mukim',
      poinPelanggaran: 0,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Santri) => {
    setEditingSantri(s);
    setFormData(s);
  };

  const handleSaveSantri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nis) return;

    if (editingSantri) {
      onUpdateSantri({
        ...editingSantri,
        ...formData as Santri,
      });
      setEditingSantri(null);
    } else {
      const newSantri: Santri = {
        id: `santri_${Date.now()}`,
        nama: formData.nama || '',
        nis: formData.nis || '',
        gender: formData.gender as 'L' | 'P' || 'L',
        kamar: formData.kamar || 'Al-Ghazali 01',
        rayon: formData.kamar?.includes('Al-Ghazali') ? 'Rayon Putra Al-Ghazali' : 
               formData.kamar?.includes('Ibnu Sina') ? 'Rayon Putra Ibnu Sina' :
               formData.kamar?.includes('Al-Fatih') ? 'Rayon Putra Al-Fatih' : 'Rayon Putra Imam Syafi\'i',
        kelasMadrasah: formData.kelasMadrasah || 'Wustha A',
        kelasFormal: formData.kelasFormal || 'MA Kelas 10',
        namaWali: formData.namaWali || '',
        teleponWali: formData.teleponWali || '',
        alamat: formData.alamat || '',
        statusMukim: formData.statusMukim as any || 'Mukim',
        poinPelanggaran: 0,
      };
      onAddSantri(newSantri);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Manajemen Data Santri & Rayon Asrama</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Database profil santri, kamar asrama, jenjang madrasah, dan kontak wali santri
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Tambah Santri Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Rayon / Asrama:
          </label>
          <select
            value={filterKamar}
            onChange={(e) => setFilterKamar(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
          >
            <option value="all">Semua Rayon / Kamar</option>
            <option value="Al-Ghazali">Rayon Al-Ghazali</option>
            <option value="Ibnu Sina">Rayon Ibnu Sina</option>
            <option value="Al-Fatih">Rayon Al-Fatih</option>
            <option value="Imam Syafi'i">Rayon Imam Syafi'i</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Filter Kelas Madrasah:
          </label>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
          >
            <option value="all">Semua Kelas</option>
            <option value="Ula A">Ula A</option>
            <option value="Ula B">Ula B</option>
            <option value="Wustha A">Wustha A</option>
            <option value="Wustha B">Wustha B</option>
            <option value="Ulya">Ulya</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Pencarian Cepat:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, NIS, atau wali..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Santri Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Santri & NIS</th>
                <th className="py-3 px-4">Kamar / Rayon</th>
                <th className="py-3 px-4">Jenjang Kelas</th>
                <th className="py-3 px-4">Wali Santri & Kontak</th>
                <th className="py-3 px-4 text-center">Status Mukim</th>
                <th className="py-3 px-4 text-center">Poin Disiplin</th>
                <th className="py-3 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSantri.map((santri, idx) => {
                const statusStyle = 
                  santri.statusMukim === 'Mukim' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  santri.statusMukim === 'Izin Pulang' ? 'bg-teal-100 text-teal-800 border-teal-300' :
                  'bg-rose-100 text-rose-800 border-rose-300';

                return (
                  <tr key={santri.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-4 text-center text-stone-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-800 text-sm">{santri.nama}</div>
                      <div className="text-[11px] text-stone-400 font-mono mt-0.5">{santri.nis}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-700">{santri.kamar}</div>
                      <div className="text-[11px] text-stone-400">{santri.rayon}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-800">{santri.kelasMadrasah}</div>
                      <div className="text-[11px] text-stone-400">{santri.kelasFormal}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-800">{santri.namaWali}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{santri.teleponWali}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle}`}>
                        {santri.statusMukim}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {santri.poinPelanggaran > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                          {santri.poinPelanggaran} Poin
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">
                          0 (Disiplin)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDetailSantri(santri)}
                          className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200"
                          title="Lihat Detail Profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {userRole === 'admin' && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(santri)}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100"
                              title="Edit Data Santri"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus data santri ${santri.nama}?`)) {
                                  onDeleteSantri(santri.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100"
                              title="Hapus Santri"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
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

      {/* DETAIL MODAL */}
      {detailSantri && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Biodata Lengkap Santri</span>
              </h3>
              <button onClick={() => setDetailSantri(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-800 text-amber-300 font-bold text-xl flex items-center justify-center shadow-xs">
                  {detailSantri.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-950">{detailSantri.nama}</h4>
                  <p className="text-xs text-stone-500 font-mono">NIS: {detailSantri.nis}</p>
                  <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                    {detailSantri.kamar} • {detailSantri.kelasMadrasah}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Rayon Asrama</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{detailSantri.rayon}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Pendidikan Formal</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{detailSantri.kelasFormal}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Wali Santri</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{detailSantri.namaWali}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Nomor Telepon Wali</span>
                  <p className="font-semibold text-stone-800 mt-0.5">{detailSantri.teleponWali}</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-stone-400">Alamat Rumah</span>
                <p className="font-semibold text-stone-800 mt-0.5">{detailSantri.alamat}</p>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800">Status & Kedisiplinan</span>
                <div className="flex items-center justify-between mt-1">
                  <span>Status Mukim: <strong>{detailSantri.statusMukim}</strong></span>
                  <span>Akumulasi Poin: <strong>{detailSantri.poinPelanggaran} Poin</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setDetailSantri(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL (ADMIN ONLY) */}
      {(showAddModal || editingSantri) && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">
                {editingSantri ? 'Edit Data Santri' : 'Tambah Santri Baru'}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingSantri(null); }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSantri} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Nama Lengkap Santri:</label>
                <input
                  type="text"
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">NIS Santri:</label>
                  <input
                    type="text"
                    value={formData.nis || ''}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Kamar Asrama:</label>
                  <select
                    value={formData.kamar || 'Al-Ghazali 01'}
                    onChange={(e) => setFormData({ ...formData, kamar: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Al-Ghazali 01">Al-Ghazali 01</option>
                    <option value="Al-Ghazali 02">Al-Ghazali 02</option>
                    <option value="Al-Ghazali 03">Al-Ghazali 03</option>
                    <option value="Ibnu Sina 01">Ibnu Sina 01</option>
                    <option value="Ibnu Sina 02">Ibnu Sina 02</option>
                    <option value="Al-Fatih 01">Al-Fatih 01</option>
                    <option value="Al-Fatih 02">Al-Fatih 02</option>
                    <option value="Imam Syafi'i 01">Imam Syafi'i 01</option>
                    <option value="Imam Syafi'i 02">Imam Syafi'i 02</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Kelas Madrasah:</label>
                  <select
                    value={formData.kelasMadrasah || 'Wustha A'}
                    onChange={(e) => setFormData({ ...formData, kelasMadrasah: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Ula A">Ula A</option>
                    <option value="Ula B">Ula B</option>
                    <option value="Wustha A">Wustha A</option>
                    <option value="Wustha B">Wustha B</option>
                    <option value="Ulya">Ulya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Kelas Formal:</label>
                  <input
                    type="text"
                    placeholder="Contoh: MTs Kelas 8 / MA Kelas 10"
                    value={formData.kelasFormal || ''}
                    onChange={(e) => setFormData({ ...formData, kelasFormal: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Nama Wali Santri:</label>
                  <input
                    type="text"
                    value={formData.namaWali || ''}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-600 mb-1">Telepon / WhatsApp:</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    value={formData.teleponWali || ''}
                    onChange={(e) => setFormData({ ...formData, teleponWali: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 mb-1">Alamat Asal Santri:</label>
                <textarea
                  rows={2}
                  value={formData.alamat || ''}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingSantri(null); }}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingSantri ? 'Simpan Perubahan' : 'Tambahkan Santri'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
