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

  // Menghindari duplikat nomor_nota + pembeli
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
                {trx.nomor_nota} - {trx.pembeli?.nama_lengkap || "Pembeli"}
              </option>
            ))}
          </select>
        </div>

        {selectedTransaksi && (
          <PDFDownloadLink
            document={<NotaPDF transaksiList={[selectedTransaksi]} />}
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
            <NotaPDF transaksiList={[selectedTransaksi]} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}
