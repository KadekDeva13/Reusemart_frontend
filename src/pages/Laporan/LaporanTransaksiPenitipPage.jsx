import React, { useState, useEffect } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import LaporanTransaksiPenitipPDF from "./LaporanTransaksiPenitipPDF";
import API from "@/utils/api";

const LaporanTransaksiPenitipPage = () => {
  const [data, setData] = useState([]);
  const [tanggalCetak, setTanggalCetak] = useState("");
  const [namaPenitip, setNamaPenitip] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [idPenitip, setIdPenitip] = useState("");
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun] = useState(new Date().getFullYear());
  const [penitipList, setPenitipList] = useState([]);

  const fetchPenitipList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/penitip", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPenitipList(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat daftar penitip:", err);
    }
  };

  const fetchLaporan = async () => {
    if (!idPenitip) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/api/laporan/transaksi-penitip/${idPenitip}/${bulan}/${tahun}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const hasil = res.data.data || [];
      const tanggal = res.data.tanggal_cetak || new Date().toISOString();

      setData(hasil);
      setTanggalCetak(tanggal);
      setNamaPenitip(res.data.nama_penitip || "-");

      const doc = (
        <LaporanTransaksiPenitipPDF
          data={hasil}
          tanggalCetak={tanggal}
          namaPenitip={res.data.nama_penitip}
          idPenitip={idPenitip}
          bulan={bulan}
          tahun={tahun}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenitipList();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Laporan Transaksi Penitip</h2>

      <div className="flex flex-col lg:flex-row gap-4 items-start mb-6">
        <select
          className="border px-3 py-2 rounded text-sm bg-white text-gray-800"
          value={idPenitip}
          onChange={(e) => setIdPenitip(e.target.value)}
        >
          <option value="">Pilih Penitip</option>
          {penitipList.map((p) => (
            <option key={p.id_penitip} value={p.id_penitip}>
              {p.nama_lengkap} (T{p.id_penitip})
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded text-sm bg-white text-gray-800"
          value={bulan}
          onChange={(e) => setBulan(Number(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>

        <button
          onClick={fetchLaporan}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          🔍 Tampilkan Laporan
        </button>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada transaksi tersedia.</p>
      ) : (
        <>
          <PDFDownloadLink
            document={
              <LaporanTransaksiPenitipPDF
                data={data}
                tanggalCetak={tanggalCetak}
                namaPenitip={namaPenitip}
                idPenitip={idPenitip}
                bulan={bulan}
                tahun={tahun}
              />
            }
            fileName={`Laporan_Transaksi_Penitip_${idPenitip}_${bulan}_${tahun}.pdf`}
          >
            {({ loading }) => (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 text-sm"
                disabled={loading}
              >
                {loading ? "Menyiapkan PDF..." : "⬇️ Unduh PDF"}
              </button>
            )}
          </PDFDownloadLink>

          {previewUrl && (
            <div className="mt-6 w-full border border-gray-300 rounded shadow overflow-hidden">
              <iframe
                src={previewUrl}
                title="Preview Laporan Transaksi"
                width="100%"
                height="700px"
                className="w-full"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LaporanTransaksiPenitipPage;
