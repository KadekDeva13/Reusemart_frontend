import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DaftarTransaksiGudangPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

  useEffect(() => {
    fetchTransaksiGudang();

    const interval = setInterval(() => {
      handleHanguskanOtomatis();
    }, 10 * 60 * 1000); // setiap 10 menit

    return () => clearInterval(interval);
  }, []);

  const fetchTransaksiGudang = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/gudang/transaksi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransaksiList(res.data || []);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAlert({ show: true, message: "Gagal mengambil data transaksi.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleHanguskanOtomatis = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/transaksi/hanguskan-otomatis",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert({
        show: true,
        message: "Transaksi berhasil dihanguskan otomatis.",
        variant: "success",
      });
      fetchTransaksiGudang();
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal menghanguskan otomatis.";
      setAlert({ show: true, message: msg, variant: "danger" });
    }
  };

  const handleShowDetail = (trx) => {
    setSelectedTransaksi(trx);
    setShowDetail(true);
  };

  return (
    <div className="p-6">
      <h4 className="text-xl font-bold mb-4">Daftar Transaksi Gudang</h4>

      {alert.show && (
        <div className={`mb-4 p-3 rounded text-sm text-white ${alert.variant === 'danger' ? 'bg-red-500' : 'bg-green-500'}`}>
          {alert.message}
        </div>
      )}

      {!loading && (
        <div className="flex justify-end mb-3 space-x-2">
          <button
            onClick={fetchTransaksiGudang}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleHanguskanOtomatis}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
          >
            🔥 Hanguskan Transaksi
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-green-100 font-semibold text-gray-700">
              <tr>
                <th className="w-[5%] border border-gray-300 px-3 py-3">No</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">Pembeli</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">Jenis Pengiriman</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">Status</th>
                <th className="w-[20%] border border-gray-300 px-3 py-3">Detail</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {transaksiList.length > 0 ? (
                transaksiList.map((trx, index) => (
                  <tr key={trx.id_transaksi}>
                    <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">{trx.pembeli?.nama_lengkap || "-"}</td>
                    <td className="border border-gray-300 px-3 py-2">{trx.jenis_pengiriman}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {trx.status_transaksi}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm"
                        onClick={() => handleShowDetail(trx)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border border-gray-300 py-3 text-gray-600">
                    Tidak ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showDetail && selectedTransaksi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold">Detail Transaksi</h5>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="space-y-2">
              <p><strong>Pembeli:</strong> {selectedTransaksi.pembeli?.nama_lengkap}</p>
              <p><strong>Jenis Pengiriman:</strong> {selectedTransaksi.jenis_pengiriman}</p>
              <p><strong>Status:</strong> {selectedTransaksi.status_transaksi}</p>
              <div>
                <h6 className="font-bold mb-1">Barang:</h6>
                {selectedTransaksi.penitip?.barang?.map((barang, i) => (
                  <div key={i} className="mb-4">
                    <p className="font-semibold">{barang.nama_barang}</p>
                    <div className="flex flex-wrap gap-2">
                      {(barang.foto_barang || []).map((foto, j) => (
                        <img
                          key={j}
                          src={`http://localhost:8000/storage/${foto.foto_barang}`}
                          alt={`Foto ${j + 1}`}
                          width="100"
                          className="rounded border"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setShowDetail(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-4 rounded">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
