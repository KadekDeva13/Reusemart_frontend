import React, { useEffect, useState } from 'react';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import LaporanPenjualanBulananPDF from './LaporanPenjualanBulananPDF';
import API from '@/utils/api';

const LaporanPenjualanBulananPDFPage = () => {
    const thisYear = new Date().getFullYear();
    const tahunList = Array.from({ length: thisYear - 2019 }, (_, i) => 2020 + i);
    const [tahun, setTahun] = useState(thisYear);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async (tahunDipilih) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await API.get(
                `/api/laporan/penjualan-bulanan?tahun=${tahunDipilih}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(res.data.data || []);
        } catch (err) {
            console.error('Gagal fetch laporan:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(tahun);
    }, [tahun]);

    const handleDownloadPDF = async () => {
        const blob = await pdf(
            <LaporanPenjualanBulananPDF data={data} tahun={tahun} />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_Penjualan_Bulanan_${tahun}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                📄 Laporan Penjualan Bulanan (PDF Viewer)
            </h2>

            <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-gray-700">Pilih Tahun:</label>
                <select
                    className="border px-2 py-1 rounded text-sm bg-white text-gray-800"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                >
                    {tahunList.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleDownloadPDF}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded shadow"
                >
                    Cetak PDF Laporan
                </button>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">⏳ Memuat laporan PDF...</p>
            ) : (
                <PDFViewer width="100%" height={800}>
                    <LaporanPenjualanBulananPDF data={data} tahun={tahun} />
                </PDFViewer>
            )}
        </div>
    );
};

export default LaporanPenjualanBulananPDFPage;
