import React, { useEffect, useState } from "react";
import axios from "axios";

export default function KonfirmasiBarangDiterimaPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/gudang/transaksi", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filter = res.data.filter(trx =>
        trx.jenis_pengiriman?.toLowerCase() === 'pengambilan mandiri' &&
        trx.status_transaksi?.toLowerCase() === 'sedang disiapkan'
      );
      setTransaksiList(filter);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAlert({ show: true, message: "Gagal memuat data.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleKonfirmasi = async (trx) => {
    const konfirmasi = window.confirm(`Konfirmasi bahwa transaksi ${trx.id_transaksi} sudah diterima pembeli?`);
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");

      // Step 1: Konfirmasi bahwa barang diterima
      await axios.post(
        `http://localhost:8000/api/gudang/transaksi/konfirmasi-diterima/${trx.id_transaksi}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Panggil proses final transaksi (gabungan komisi & saldo & poin)
      await axios.post(
        `http://localhost:8000/api/transaksi/proses-final/${trx.id_transaksi}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlert({
        show: true,
        message: "Berhasil dikonfirmasi. Semua proses (komisi, poin, saldo) telah dihitung.",
        variant: "success",
      });

      fetchTransaksi();
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal memproses transaksi.";
      setAlert({ show: true, message: msg, variant: "danger" });
    }
  };

  return (
    <div className="p-6">
      <h4 className="text-xl font-bold mb-4">Konfirmasi Barang Telah Diterima</h4>

      {alert.show && (
        <div
          className={`mb-4 p-3 rounded text-sm text-white ${
            alert.variant === "danger" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {alert.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-green-100 text-gray-700 font-semibold text-center">
              <tr>
                <th className="border border-gray-300 px-3 py-2">No</th>
                <th className="border border-gray-300 px-3 py-2">Pembeli</th>
                <th className="border border-gray-300 px-3 py-2">Jenis Pengiriman</th>
                <th className="border border-gray-300 px-3 py-2">Status</th>
                <th className="border border-gray-300 px-3 py-2">Aksi</th>
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
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-1 rounded"
                        onClick={() => handleKonfirmasi(trx)}
                      >
                        Konfirmasi
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border border-gray-300 py-3 text-gray-600">
                    Tidak ada transaksi menunggu konfirmasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
