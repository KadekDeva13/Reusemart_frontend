import React, { useEffect, useState } from "react";
import axios from "axios";
import NotaPDF from "../pages/NotaPenjualan/NotaPenjualanPageKurir";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function NotaPenjualanKurirPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [showNota, setShowNota] = useState(false);

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/transaksi/semua", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        const filtered = res.data.filter(
          trx =>
            ["selesai", "sedang disiapkan"].includes(trx.status_transaksi?.toLowerCase()) &&
            trx.jenis_pengiriman?.toLowerCase() === "kurir reusemart"
        );
        setTransaksiList(filtered);
      }
    } catch (err) {
      console.error("Gagal mengambil data transaksi", err);
    }
  };

  const handleProsesDanTampilkanNota = async () => {
    if (!selectedTransaksi) return;

    const konfirmasi = window.confirm(`Proses final dan tampilkan nota untuk transaksi ${selectedTransaksi.nomor_nota}?`);
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8000/api/transaksi/proses-final/${selectedTransaksi.id_transaksi}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowNota(true);
    } catch (err) {
      console.error("Gagal memproses final transaksi", err);
      alert("Gagal memproses transaksi. Pastikan backend sudah mengizinkan status 'sedang disiapkan' untuk kurir.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Nota Penjualan Kurir</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Pilih Transaksi:</label>
        <select
          value={selectedTransaksi?.id_transaksi || ""}
          onChange={(e) => {
            const selectedId = parseInt(e.target.value);
            const trx = transaksiList.find(t => t.id_transaksi === selectedId);
            setSelectedTransaksi(trx);
            setShowNota(false); // reset PDF
          }}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md bg-white"
        >
          <option value="">-- Pilih Transaksi --</option>
          {transaksiList.map(trx => (
            <option key={trx.id_transaksi} value={trx.id_transaksi}>
              {trx.nomor_nota} - {trx.pembeli?.nama_lengkap || "Pembeli"}
            </option>
          ))}
        </select>
      </div>

      {selectedTransaksi && (
        <>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mb-4"
            onClick={handleProsesDanTampilkanNota}
          >
            Proses Final & Tampilkan Nota
          </button>

          {showNota && (
            <PDFDownloadLink
              document={<NotaPDF transaksi={selectedTransaksi} />}
              fileName={`${selectedTransaksi.nomor_nota}.pdf`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              {({ loading }) => (loading ? "Membuat Nota..." : "Download Nota Penjualan")}
            </PDFDownloadLink>
          )}
        </>
      )}
    </div>
  );
}
