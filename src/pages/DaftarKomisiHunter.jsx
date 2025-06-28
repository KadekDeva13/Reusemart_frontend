import React, { useEffect, useState } from 'react';
import API from '@/utils/api';

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(angka);
};

function DaftarKomisiHunterPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKomisi();
  }, []);

  const fetchKomisi = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/api/pegawai/hunter/komisi/daftar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setData(res.data.data);
    } catch (e) {
      console.error("Gagal ambil data komisi:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto px-5">
      <div className="min-w-full">
        <h3 className="text-4xl font-semibold mb-6">Daftar Komisi Hunter</h3>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm text-center border">
            <thead className="bg-green-100 text-gray-800 font-semibold">
              <tr>
                <th className="py-3 border">No</th>
                <th className="py-3 border">Nama Barang</th>
                <th className="py-3 border">Tanggal Titip</th>
                <th className="py-3 border">Nama Hunter</th>
                <th className="py-3 border">Status</th>
                <th className="py-3 border">Komisi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-gray-500">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-gray-500">Tidak ada data komisi.</td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-2 border">{idx + 1}</td>
                    <td className="py-2 border">{item.nama_barang}</td>
                    <td className="py-2 border">{item.tanggal_masuk}</td>
                    <td className="py-2 border">{item.nama_hunter || '-'}</td>
                    <td className="py-2 border">{item.status_barang}</td>
                    <td className="py-2 border">{formatRupiah(item.komisi_hunter)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DaftarKomisiHunterPage;
