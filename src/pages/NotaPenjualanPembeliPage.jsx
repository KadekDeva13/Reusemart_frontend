import React, { useEffect, useState } from "react";
import NotaPDFPembeli from "../pages/NotaPenjualan/NotaPenjualanPagePembeli";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import API from "@/utils/api";

// Fungsi generate nomor nota frontend format YY.MM.id_transaksi
const generateNomorNotaFrontend = (trx) => {
  const tanggal = new Date(trx.created_at || Date.now());
  const tahun2Digit = String(tanggal.getFullYear()).slice(-2);
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
  const id = String(trx.id_transaksi).padStart(3, '0');
  return `${tahun2Digit}.${bulan}.${id}`;
};

export default function NotaPenjualanPembeliPage() {
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
            ["selesai", "disiapkan"].includes(trx.status_transaksi) &&
            trx.jenis_pengiriman?.toLowerCase() === "pengambilan mandiri"
        );
        setTransaksiList(filtered);
      }
    } catch (err) {
      console.error("Gagal mengambil data transaksi", err);
    }
  };

  const uniqueTransaksiList = transaksiList.filter(
    (trx, index, self) =>
      index === self.findIndex(
        t =>
          t.nomor_nota === trx.nomor_nota &&
          t.pembeli?.nama_lengkap === trx.pembeli?.nama_lengkap
      )
  );

  const handleSelectNota = (notaDipilih) => {
    const transaksiDenganNotaTersebut = transaksiList.filter(
      t => t.nomor_nota === notaDipilih
    );

    if (transaksiDenganNotaTersebut.length > 0) {
      const pertama = transaksiDenganNotaTersebut[0];
      const semuaBarang = transaksiDenganNotaTersebut.flatMap(t => t.detailtransaksi);

      const gabungan = {
        ...pertama,
        detailtransaksi: semuaBarang,
      };

      setSelectedTransaksi(gabungan);
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

      const blob = await pdf(<NotaPDFPembeli transaksiList={[selectedTransaksi]} />).toBlob();
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
      {/* Form Pilihan & Tombol */}
      <div className="lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Nota Penjualan Pembeli</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Pilih Transaksi:</label>
          <select
            value={selectedTransaksi?.nomor_nota || ""}
            onChange={(e) => handleSelectNota(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-md bg-white"
          >
            <option value="">-- Pilih Transaksi --</option>
            {uniqueTransaksiList.map(trx => (
              <option
                key={trx.nomor_nota + trx.pembeli?.nama_lengkap}
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

      {/* Preview PDF */}
      {selectedTransaksi && (
        <div className="lg:w-1/2 h-[600px] border border-gray-300 rounded">
          <PDFViewer width="100%" height="100%" className="rounded">
            <NotaPDFPembeli transaksiList={[selectedTransaksi]} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}
