import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import LaporanBarangHabisPDF from './LaporanBarangHabisPDF';

const LaporanBarangHabisPage = () => {
    const [data, setData] = useState([]);
    const [tanggalCetak, setTanggalCetak] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bulan, setBulan] = useState('');
    const [tahun, setTahun] = useState(new Date().getFullYear());

    const daftarBulan = [
        { label: 'Semua', value: '' },
        { label: 'Januari', value: '1' },
        { label: 'Februari', value: '2' },
        { label: 'Maret', value: '3' },
        { label: 'April', value: '4' },
        { label: 'Mei', value: '5' },
        { label: 'Juni', value: '6' },
        { label: 'Juli', value: '7' },
        { label: 'Agustus', value: '8' },
        { label: 'September', value: '9' },
        { label: 'Oktober', value: '10' },
        { label: 'November', value: '11' },
        { label: 'Desember', value: '12' },
    ];

    const daftarTahun = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchLaporan();
    }, [bulan, tahun]);

    const fetchLaporan = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = {};
            if (bulan !== '') params.bulan = bulan;
            if (tahun !== '') params.tahun = tahun;
            console.log("🔍 Mengirim filter:", params);

            const res = await axios.get('http://localhost:8000/api/laporan/barang-penitipan-habis', {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
            console.log("✅ Response dari backend:", res.data);

            const result = res.data.data || [];
            const tanggal = res.data.tanggal_cetak || new Date().toISOString();

            setData(result);
            setTanggalCetak(tanggal);
            setLoading(false);

            const doc = <LaporanBarangHabisPDF data={result} tanggalCetak={tanggal} />;
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (err) {
            console.error('❌ Gagal memuat laporan:', err);
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📄 Laporan Barang yang Masa Penitipannya Sudah Habis
            </h2>

            <div className="flex flex-wrap gap-4 items-center mb-4 ">
                <div>
                    <label className="text-sm text-gray-600 ">Filter Bulan:</label>
                    <select
                        value={bulan}
                        onChange={(e) => setBulan(e.target.value)}
                        className="border border-gray-300 px-3 py-1 rounded text-sm bg-white"
                    >
                        {daftarBulan.map((b) => (
                            <option key={b.value} value={b.value}>
                                {b.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-600 bg-white">Filter Tahun:</label>
                    <select
                        value={tahun}
                        onChange={(e) => setTahun(e.target.value)}
                        className="border border-gray-300 px-3 py-1 rounded text-sm bg-white"
                    >
                        {daftarTahun.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Memuat data...</p>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="space-y-3">
                        <PDFDownloadLink
                            key={bulan + '-' + tahun + '-' + tanggalCetak}
                            document={<LaporanBarangHabisPDF data={data} tanggalCetak={tanggalCetak} />}
                            fileName={`Laporan Barang Masa Penitipan Habis - ${tanggalCetak.slice(0, 10)}.pdf`}
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
                                key={previewUrl}
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

            {!loading && data.length === 0 && (
                <p className="text-gray-500 italic mt-4">Tidak ada data barang yang masa penitipannya habis.</p>
            )}
        </div>
    );
};

export default LaporanBarangHabisPage;
