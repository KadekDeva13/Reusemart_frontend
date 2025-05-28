import React, { useEffect, useState } from "react";
import axios from "axios";
import NotaPDF from "../pages/NotaPenjualan/NotaPenjualanPagePembeli";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

export default function NotaPenjualanPembeliPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

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
            ["selesai", "sedang disiapkan"].includes(trx.status_transaksi) &&
            trx.jenis_pengiriman?.toLowerCase() === "pengambilan mandiri"
        );
        setTransaksiList(filtered);
      }
    } catch (err) {
      console.error("Gagal mengambil data transaksi", err);
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
            value={selectedTransaksi?.id_transaksi || ""}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              const trx = transaksiList.find(t => t.id_transaksi === selectedId);
              setSelectedTransaksi(trx);
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
          <PDFDownloadLink
            document={<NotaPDF transaksi={selectedTransaksi} />}
            fileName={`${selectedTransaksi.nomor_nota}.pdf`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {({ loading }) => loading ? "Membuat Nota..." : "Download Nota Penjualan"}
          </PDFDownloadLink>
        )}
      </div>

      {/* Preview PDF */}
      {selectedTransaksi && (
        <div className="lg:w-1/2 h-[600px] border border-gray-300 rounded">
          <PDFViewer width="100%" height="100%" className="rounded">
            <NotaPDF transaksi={selectedTransaksi} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}
