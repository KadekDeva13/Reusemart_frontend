// LaporanPenjualanBulananPDFPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import domtoimage from 'dom-to-image';
import LaporanPDF from './LaporanPenjualanBulananPDF';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const LaporanPenjualanBulananPDFPage = () => {
    const chartRef = useRef();
    const thisYear = new Date().getFullYear();
    const tahunList = Array.from({ length: thisYear - 2019 }, (_, i) => 2020 + i);
    const [tahun, setTahun] = useState(thisYear);
    const [data, setData] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData(tahun);
    }, [tahun]);

    const fetchData = async (tahunDipilih) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:8000/api/laporan/penjualan-bulanan?tahun=${tahunDipilih}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const hasil = res.data.data || [];
            setData(hasil);
            setPdfUrl(null);
            setLoading(true);

            setTimeout(() => {
                if (chartRef.current) {
                    generatePDF(hasil, tahunDipilih);
                } else {
                    console.warn('Chart belum siap untuk di-capture');
                    setLoading(false);
                }
            }, 1000);
        } catch (err) {
            console.error('Gagal mengambil data:', err);
            setLoading(false);
        }
    };

    const generatePDF = async (dataArr, tahunVal) => {
        try {
            const image = await domtoimage.toPng(chartRef.current, {
                skipFonts: true,
                pixelRatio: 0.5,
            });

            if (!image) {
                console.error("❌ Gagal meng-capture chart.");
                setLoading(false);
                return;
            }

            const doc = <LaporanPDF data={dataArr} tahun={tahunVal} grafikImage={image} />;
            const blob = await pdf(doc).toBlob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setLoading(false);
        } catch (err) {
            console.error("❌ Gagal generate PDF:", err);
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    🧾 Laporan Penjualan Bulanan (Viewer)
                </h2>
                <select
                    className="border px-3 py-2 rounded text-sm bg-white text-gray-800"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                >
                    {tahunList.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            {/* Grafik tersembunyi untuk diambil gambarnya */}
            <div
                style={{
                    width: 600,
                    height: 300,
                    position: 'absolute',
                    left: '-9999px',
                    backgroundColor: 'white'
                }}
                ref={chartRef}
            >
                <ResponsiveContainer width={600} height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <XAxis dataKey="bulan" fontSize={10} />
                        <YAxis
                            fontSize={10}
                            allowDecimals={false}
                            tickFormatter={(v) => `Rp${v.toLocaleString('id-ID')}`}
                        />
                        <Tooltip formatter={(val) => `Rp ${val.toLocaleString('id-ID')}`} />
                        <Bar dataKey="total_penjualan" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* PDF Viewer */}
            {loading ? (
                <p className="text-gray-500">Sedang memuat PDF...</p>
            ) : pdfUrl ? (
                <iframe
                    title="PDF Viewer"
                    src={pdfUrl}
                    width="100%"
                    height="900px"
                    className="border rounded shadow"
                />
            ) : (
                <p className="text-red-500">PDF tidak dapat ditampilkan.</p>
            )}
        </div>
    );
};

export default LaporanPenjualanBulananPDFPage;
