import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import LaporanBarangHabisPDF from './LaporanBarangHabisPDF';

const LaporanBarangHabisPage = () => {
    const [data, setData] = useState([]);
    const [tanggalCetak, setTanggalCetak] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLaporan();
    }, []);

    const fetchLaporan = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/api/penitipan/laporan/penitipan/habis', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = res.data.data || [];
            const tanggal = res.data.tanggal_cetak || new Date().toISOString();

            setData(result);
            setTanggalCetak(tanggal);
            setLoading(false);

            // Siapkan preview PDF
            const doc = <LaporanBarangHabisPDF data={result} tanggalCetak={tanggal} />;
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (err) {
            console.error('Gagal memuat laporan:', err);
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📄 Laporan Barang yang Masa Penitipannya Sudah Habis
            </h2>

            {loading ? (
                <p>Memuat data...</p>
            ) : data.length === 0 ? (
                <p className="text-gray-500 italic">Tidak ada data barang yang masa penitipannya habis.</p>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="space-y-3">
                        <PDFDownloadLink
                            document={<LaporanBarangHabisPDF data={data} tanggalCetak={tanggalCetak} />}
                            fileName="Laporan_Barang_Penitipan_Habis.pdf"
                        >
                            {({ loading }) => (
                                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition text-sm whitespace-nowrap">
                                    {loading ? 'Menyiapkan...' : '⬇️ Unduh PDF'}
                                </span>
                            )}
                        </PDFDownloadLink>

                    </div>

                    {previewUrl && (
                        <div className="w-full lg:w-[calc(100vw-350px)] border border-gray-300 rounded shadow overflow-hidden">
                            <iframe
                                src={previewUrl}
                                title="Preview Laporan"
                                width="100%"
                                height="700px"
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LaporanBarangHabisPage;
