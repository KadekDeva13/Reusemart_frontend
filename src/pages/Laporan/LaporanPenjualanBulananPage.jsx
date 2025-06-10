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

/* ---------- PDF Component ---------- */
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
      {/* Halaman 1 - Tabel */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={[styles.title, styles.underline, { marginBottom: 10 }]}>
          RINCIAN PENJUALAN
        </Text>
        <Text style={styles.bold}>ReUse Mart</Text>
        <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
        <Text style={[styles.title, styles.underline]}>
          LAPORAN PENJUALAN BULANAN
        </Text>
        <Text>Tahun: {tahun}</Text>
        <Text style={{ marginBottom: 6 }}>Tanggal cetak: {tanggalCetak}</Text>

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
              <Text style={styles.cell}>
                {formatRupiah(item.total_penjualan)}
              </Text>
            </View>
          ))}
          <View style={[styles.row, { backgroundColor: '#eee' }]}>
            <Text style={styles.monthCell}></Text>

            <Text
              style={[
                styles.cell,
                {
                  fontWeight: 'bold',
                  textAlign: 'right',
                  paddingRight: 10,
                  borderLeftWidth: 1,               // tetap ada
                  borderColor: '#eee',              // hilangkan secara visual
                  backgroundColor: '#eee',
                },
              ]}
            >
              Total
            </Text>

            <Text
              style={[
                styles.cell,
                {
                  fontWeight: 'bold',
                  textAlign: 'right',
                  paddingRight: 6,
                  backgroundColor: '#eee',
                },
              ]}
            >
              {formatRupiah(totalUang)}
            </Text>
          </View>
        </View>

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

      {/* Halaman 2 - Grafik */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {grafikImage && (
          <View style={{ textAlign: 'center', marginTop: 20 }}>
            <Text style={[styles.bold, { marginBottom: 6 }]}>
              Grafik Penjualan per Bulan
            </Text>
            <Image
              src={grafikImage}
              style={{ width: 700, height: 300, margin: 'auto' }}
            />
          </View>
        )}
      </Page>
    </Document>
  );
};

/* ---------- Main React Page ---------- */
const LaporanPenjualanBulananPage = () => {
  const chartRef = useRef();
  const thisYear = new Date().getFullYear();
  const tahunList = Array.from({ length: thisYear - 2019 }, (_, i) => 2020 + i);
  const [tahun, setTahun] = useState(thisYear);
  const [data, setData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingPDF, setLoadingPDF] = useState(false);

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
      setLoadingPDF(true);
      setTimeout(() => generatePDF(hasil, tahunDipilih), 500);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
    }
  };

  const generatePDF = async (dataArr, tahunVal) => {
    if (!chartRef.current) {
      console.warn("⚠️ chartRef.current null, grafik belum siap.");
      return;
    }

    try {
      const image = await htmlToImage.toPng(chartRef.current, {
        skipFonts: true,
      });
      const doc = <LaporanPDF data={dataArr} tahun={tahunVal} grafikImage={image} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setLoadingPDF(false);
      console.log("✅ PDF URL dibuat:", url);
    } catch (err) {
      console.error("❌ Gagal generate PDF:", err);
      setLoadingPDF(false);
    }
  };

  return (
    <div className="p-6 bg-white">
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

      {/* Grafik */}
      <div className="overflow-x-auto mb-6 bg-white">
        <div
          style={{ width: 1200, height: 400, fontFamily: 'Arial, sans-serif' }}
          ref={chartRef}
        >
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

      {/* Tabel */}
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

      {/* Tombol Unduh */}
      <div className="mt-6">
        {!pdfUrl && loadingPDF ? (
          <span className="text-gray-500 text-sm">⏳ Menyiapkan PDF...</span>
        ) : pdfUrl ? (
          <a
            href={pdfUrl}
            download={`Laporan_Penjualan_Bulanan_${tahun}.pdf`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            ⬇️ Unduh PDF
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default LaporanPenjualanBulananPage;
