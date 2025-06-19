import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { pdf } from '@react-pdf/renderer';
import StokGudangPDF from './LaporanStokGudangPDF';

export default function LaporanStokGudangPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/barang/laporan/stok-gudang", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const result = res.data.data || [];
            setData(result);
            generatePDF(result);
        } catch (err) {
            toast.error("Gagal memuat data laporan stok.");
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async (dataArr) => {
        const blob = await pdf(<StokGudangPDF data={dataArr} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = "Laporan_Stok_Gudang.pdf";
        a.click();
    };

    return (
        <div className="p-6 bg-white">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-8">Laporan Stok Gudang</h2>
                {pdfUrl && (
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
                        onClick={handleDownload}
                    >
                        Cetak PDF Laporan
                    </button>
                )}
            </div>


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
