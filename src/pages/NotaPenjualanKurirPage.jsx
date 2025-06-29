import React, { useEffect, useState } from "react";
import NotaPDF from "../pages/NotaPenjualan/NotaPenjualanPageKurir";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import API from "@/utils/api";

const generateNomorNotaFrontend = (trx) => {
  const tanggal = new Date(trx.created_at || Date.now());
  const tahun2Digit = String(tanggal.getFullYear()).slice(-2);
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
  const id = String(trx.id_transaksi).padStart(3, '0');
  return `${tahun2Digit}.${bulan}.${id}`;
};

export default function NotaPenjualanKurirPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/transaksi/semua", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        const filtered = res.data.filter(
          trx =>
            ["selesai", "disiapkan", "dikirim"].includes(trx.status_transaksi?.toLowerCase()) &&
            trx.jenis_pengiriman?.toLowerCase() === "kurir reusemart"
        );
        setTransaksiList(filtered);
      }
    } catch (err) {
      console.error("Gagal mengambil data transaksi", err);
    }
  };

  const uniqueNotaList = transaksiList.filter(
    (trx, index, self) =>
      index === self.findIndex(
        t =>
          t.nomor_nota === trx.nomor_nota &&
          t.pembeli?.nama_lengkap === trx.pembeli?.nama_lengkap
      )
  );

  const handleSelectNota = (nomorNota) => {
    const semuaTransaksiDenganNota = transaksiList.filter(
      t => t.nomor_nota === nomorNota
    );

    if (semuaTransaksiDenganNota.length > 0) {
      const referensi = semuaTransaksiDenganNota[0];
      const semuaBarangGabung = semuaTransaksiDenganNota.flatMap(t => t.detailtransaksi);

      const transaksiGabungan = {
        ...referensi,
        detailtransaksi: semuaBarangGabung,
      };

      setSelectedTransaksi(transaksiGabungan);
    }
  };

  const handleProsesDanDownloadNota = async () => {
    if (!selectedTransaksi) return;

    const konfirmasi = window.confirm(`Proses final dan download nota untuk transaksi ${selectedTransaksi.nomor_nota}?`);
    if (!konfirmasi) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await API.post(
        `/api/transaksi/proses-final/${selectedTransaksi.id_transaksi}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const blob = await pdf(<NotaPDF transaksiList={[selectedTransaksi]} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedTransaksi.nomor_nota}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal memproses final transaksi", err);
      alert("Gagal memproses transaksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Kiri: Form */}
      <div className="lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Nota Penjualan Kurir</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Pilih Transaksi:</label>
          <select
            value={selectedTransaksi?.nomor_nota || ""}
            onChange={(e) => handleSelectNota(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-md bg-white"
          >
            <option value="">-- Pilih Transaksi --</option>
            {uniqueNotaList.map(trx => (
              <option
                key={trx.id_transaksi}
                value={trx.nomor_nota}
              >
                {generateNomorNotaFrontend(trx)} - {trx.pembeli?.nama_lengkap || "Pembeli"}
              </option>
            ))}
          </select>
        </div>

        {selectedTransaksi && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mb-4"
            onClick={handleProsesDanDownloadNota}
            disabled={loading}
          >
            {loading ? "Memproses & Membuat Nota..." : "Proses Final & Download Nota"}
          </button>
        )}
      </div>

      {/* Kanan: Preview PDF */}
      {selectedTransaksi && (
        <div className="lg:w-1/2 h-[600px] border border-gray-300 rounded">
          <PDFViewer width="100%" height="100%" className="rounded">
            <NotaPDF transaksiList={[selectedTransaksi]} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}
