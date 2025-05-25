import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from '@react-pdf/renderer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as htmlToImage from 'html-to-image';

/* ---------- PDF styles ---------- */
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
  bold: { fontWeight: 'bold' },
  underline: { textDecoration: 'underline' },
  title: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    marginBottom: 20,
  },
  row: { flexDirection: 'row' },
  cell: {
    borderWidth: 1,
    padding: 4,
    textAlign: 'center',
    flex: 1,
  },
  monthCell: {
    borderWidth: 1,
    padding: 4,
    textAlign: 'center',
    flex: 2,
  },
  totalRow: { flexDirection: 'row', backgroundColor: '#eee' },
});

/* ---------- PDF component ---------- */
const LaporanPDF = ({ data, tahun, grafikImage }) => {
  const totalUang = data.reduce(
    (sum, item) => sum + (item.total_penjualan || 0),
    0
  );
  const tanggalCetak = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formatRupiah = (n) => n.toLocaleString('id-ID');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.bold}>ReUse Mart</Text>
        <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
        <Text style={[styles.title, styles.underline]}>
          LAPORAN PENJUALAN BULANAN
        </Text>
        <Text>Tahun: {tahun}</Text>
        <Text style={{ marginBottom: 6 }}>Tanggal cetak: {tanggalCetak}</Text>

        {/* Grafik di PDF */}
        {grafikImage && (
          <View style={{ textAlign: 'center', marginBottom: 15 }}>
            <Text style={[styles.bold, { marginBottom: 4 }]}>
              Grafik Penjualan per Bulan
            </Text>
            <Image
              src={grafikImage}
              style={{ width: 500, height: 500, margin: 'auto' }}
            />
          </View>
        )}

        {/* Tabel di PDF */}
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.monthCell}>Bulan</Text>
            <Text style={styles.cell}>Jumlah Terjual</Text>
            <Text style={styles.cell}>Total Penjualan</Text>
          </View>
          {data.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.monthCell}>{item.bulan}</Text>
              <Text style={styles.cell}>{item.jumlah_terjual}</Text>
              <Text style={styles.cell}>{formatRupiah(item.total_penjualan)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text
              style={{
                borderWidth: 1,
                padding: 4,
                textAlign: 'center',
                flex: 2,
                backgroundColor: '#eee',
                fontWeight: 'bold',
              }}
            >
              Total
            </Text>
            <Text
              style={{
                borderWidth: 1,
                padding: 4,
                textAlign: 'right',
                paddingRight: 6,
                flex: 2,
                backgroundColor: '#eee',
                fontWeight: 'bold',
              }}
            >
              {formatRupiah(totalUang)}
            </Text>
          </View>
        </View>

        {/* Footer nomor halaman */}
        <View
          fixed
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 9,
            color: 'gray',
          }}
        >
          <Text
            render={({ pageNumber, totalPages }) =>
              `Halaman ${pageNumber} dari ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

/* ---------- Halaman React ---------- */
const LaporanPenjualanBulananPage = () => {
  const chartRef = useRef();
  const thisYear = new Date().getFullYear();
  const tahunList = Array.from({ length: thisYear - 2019 }, (_, i) => 2020 + i);
  const [tahun, setTahun] = useState(thisYear);
  const [data, setData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetchData(tahun);
  }, [tahun]);

  /* --- Ambil data dari backend --- */
  const fetchData = async (tahunDipilih) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:8000/api/laporan/penjualan-bulanan?tahun=${tahunDipilih}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const hasil = res.data.data || [];
      setData(hasil);
      // Sedikit delay agar chart selesai render sebelum di-screenshot
      setTimeout(() => generatePDF(hasil, tahunDipilih), 500);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    }
  };

  /* --- Buat PDF (capture chart sebagai image) --- */
  const generatePDF = async (dataArr, tahunVal) => {
    if (!chartRef.current) return;
    const image = await htmlToImage.toPng(chartRef.current);
    const doc = <LaporanPDF data={dataArr} tahun={tahunVal} grafikImage={image} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="p-6 bg-white">
      {/* Header & selector tahun */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          📈 Laporan Penjualan Bulanan
        </h2>
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
      </div>

      {/* ---------- GRAFIK (di atas) ---------- */}
      <div className="overflow-x-auto mb-6 bg-white">
        <div style={{ width: 1200, height: 400 }} ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis dataKey="bulan" fontSize={10} />
              <YAxis
                fontSize={10}
                allowDecimals={false}
                domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
                tickFormatter={(v) => `Rp${v.toLocaleString('id-ID')}`}
              />
              <Tooltip
                formatter={(val) => `Rp ${val.toLocaleString('id-ID')}`}
              />
              <Bar dataKey="total_penjualan" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- TABEL (di bawah) ---------- */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto w-full">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Bulan</th>
              <th className="border px-3 py-2">Jumlah Terjual</th>
              <th className="border px-3 py-2">Total Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td className="border px-3 py-1">{item.bulan}</td>
                <td className="border px-3 py-1 text-center">
                  {item.jumlah_terjual}
                </td>
                <td className="border px-3 py-1 text-right">
                  {item.total_penjualan?.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tombol unduh PDF */}
      {pdfUrl && (
        <div className="mt-6">
          <a
            href={pdfUrl}
            download={`Laporan_Penjualan_Bulanan_${tahun}.pdf`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            ⬇️ Unduh PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default LaporanPenjualanBulananPage;
