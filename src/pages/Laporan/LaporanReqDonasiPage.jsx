import React, { useState, useEffect } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import axios from "axios";
import LaporanRequestDonasiPDF from "./LaporanReqDonasi";

const LaporanRequestDonasiPage = () => {
  const [data, setData] = useState([]);
  const [tanggalCetak, setTanggalCetak] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/api/donasi/request/laporan", 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const hasil = res.data.data || [];
        const tanggal = res.data.tanggal_cetak || new Date().toISOString();

        setData(hasil);
        setTanggalCetak(tanggal);
        setLoading(false);

        const doc = (
          <LaporanRequestDonasiPDF data={hasil} tanggalCetak={tanggal} />
        );
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err) {
        console.error("Gagal memuat laporan:", err);
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Laporan Request Donasi</h2>

      {loading ? (
        <p>Memuat data...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada request donasi.</p>
      ) : (
        <>
          <PDFDownloadLink
            document={
              <LaporanRequestDonasiPDF
                data={data}
                tanggalCetak={tanggalCetak}
              />
            }
            fileName="Laporan_Request_Donasi.pdf"
          >
            {({ loading }) => (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 text-sm"
                disabled={loading}
              >
                {loading ? "Menyiapkan PDF..." : "⬇️ Unduh PDF"}
              </button>
            )}
          </PDFDownloadLink>

          {previewUrl && (
            <div className="mt-6 w-full lg:w-[calc(100vw-350px)] border border-gray-300 rounded shadow overflow-hidden">
              <iframe
                src={previewUrl}
                title="Preview Laporan Request"
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

export default LaporanRequestDonasiPage;
