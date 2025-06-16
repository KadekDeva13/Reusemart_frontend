import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { pdf } from '@react-pdf/renderer';
import LaporanKomisiPDF from './LaporanKomisiPDF';

export default function LaporanKomisiPage() {
    const [data, setData] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bulan, setBulan] = useState(new Date().getMonth() + 1);
    const [tahun, setTahun] = useState(new Date().getFullYear());

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/transaksi/laporan-komisi", {
                params: { bulan, tahun },
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const result = res.data.data || [];
            setData(result);
            const totalHargaJual = result.reduce((sum, item) => sum + item.harga_barang, 0);
            generatePDF(result, totalHargaJual);
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat data laporan komisi.");
        } finally {
            setLoading(false);
        }
    };

const generatePDF = async (dataArr, totalHarga) => {
  try {
    const blob = await pdf(
      <LaporanKomisiPDF
        data={dataArr}
        bulan={bulan}
        tahun={tahun}
        totalHargaJual={totalHarga}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  } catch (error) {
    console.error("Gagal generate PDF:", error);
    setPdfUrl(null);
  }
};

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = `Laporan_Komisi_Bulanan_${bulan}_${tahun}.pdf`;
        a.click();
    };

    useEffect(() => {
        fetchData();
    }, [bulan, tahun]);

    const daftarBulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];

    return (
        <div className="p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">📄 Laporan Komisi Bulanan per Produk</h2>
                {pdfUrl && (
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
                        onClick={handleDownload}
                    >
                        Cetak PDF Laporan
                    </button>
                )}
            </div>

            {/* Filter */}
            <div className="flex gap-4 mb-4">
                <div>
                    <label className="block mb-1 text-sm">Bulan</label>
                    <select
                        value={bulan}
                        onChange={(e) => setBulan(parseInt(e.target.value))}
                        className="border rounded px-3 py-1 bg-white"
                    >
                        {daftarBulan.map((nama, index) => (
                            <option key={index + 1} value={index + 1}>{nama}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm">Tahun</label>
                    <select
                        value={tahun}
                        onChange={(e) => setTahun(parseInt(e.target.value))}
                        className="border rounded px-3 py-1 bg-white"
                    >
                        {Array.from({ length: 6 }, (_, i) => 2020 + i).map((th) => (
                            <option key={th} value={th}>{th}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* PDF Preview */}
            {loading ? (
                <p className="text-gray-500">Memuat data PDF...</p>
            ) : pdfUrl ? (
                <iframe src={pdfUrl} width="100%" height="900px" className="border rounded shadow" />
            ) : (
                <p className="text-red-500">Gagal menampilkan PDF.</p>
            )}
        </div>
    );
}
