import React, { useEffect, useState } from 'react';
import { FaChartBar } from 'react-icons/fa';
import API from '@/utils/api';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  pdf,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
  bold: { fontWeight: 'bold' },
  underline: { textDecoration: 'underline' },
  section: { marginBottom: 6 },
  table: { display: 'table', width: '100%', borderWidth: 1, borderStyle: 'solid', marginTop: 10 },
  tableRow: { flexDirection: 'row' },
  cell: { borderWidth: 1, padding: 4, flex: 1, textAlign: 'center', fontSize: 9 },
  kategoriCell: { borderWidth: 1, padding: 4, flex: 2, textAlign: 'center', fontSize: 9 },
  headerCell: { fontWeight: 'bold' },
});

const kategoriListMaster = [
  "Elektronik & Gadget",
  "Pakaian & Aksesori",
  "Perabotan Rumah Tangga",
  "Buku, Alat Tulis, & Peralatan Sekolah",
  "Hobi, Mainan, & Koleksi",
  "Perlengkapan Bayi & Anak",
  "Otomotif & Aksesori",
  "Perlengkapan Taman & Outdoor",
  "Peralatan Kantor & Industri",
  "Kosmetik & Perawatan Diri",
];

const LaporanPDF = ({ data, tahun, tanggalCetak }) => {
  const rowsPerPage = 25;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const totalTerjual = data.reduce((sum, item) => sum + (item.terjual || 0), 0);
  const totalGagal = data.reduce((sum, item) => sum + (item.gagal || 0), 0);

  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const start = pageIndex * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    return (
      <Page key={pageIndex} size="A4" style={styles.page}>
        <Text style={[styles.bold, { marginBottom: 2 }]}>ReUse Mart</Text>
        <Text style={{ marginBottom: 4 }}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
        <Text style={[styles.bold, styles.underline, { marginBottom: 6 }]}>LAPORAN PENJUALAN PER KATEGORI BARANG</Text>
        <Text style={{ marginBottom: 2 }}>Tahun : {tahun}</Text>
        <Text style={{ marginBottom: 6 }}>Tanggal cetak: {tanggalCetak}</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.kategoriCell, styles.headerCell]}>Kategori</Text>
            <Text style={[styles.cell, styles.headerCell]}>Jumlah item terjual</Text>
            <Text style={[styles.cell, styles.headerCell]}>Jumlah item gagal terjual</Text>
          </View>
          {pageData.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.kategoriCell}>{item.kategori}</Text>
              <Text style={styles.cell}>{item.terjual ?? '....'}</Text>
              <Text style={styles.cell}>{item.gagal ?? '....'}</Text>
            </View>
          ))}
          {pageIndex === totalPages - 1 && (
            <View style={styles.tableRow}>
              <Text style={[styles.kategoriCell, styles.headerCell]}>Total</Text>
              <Text style={styles.cell}>{totalTerjual}</Text>
              <Text style={styles.cell}>{totalGagal}</Text>
            </View>
          )}
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
          <Text render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} />
        </View>
      </Page>
    );
  });

  return <Document>{pages}</Document>;
};

const LaporanKategoriPage = () => {
  const [laporan, setLaporan] = useState({});
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState(null);
  const currentYear = new Date().getFullYear();
  const tahunList = Array.from({ length: currentYear - 2022 + 1 }, (_, i) => 2023 + i);

  const fetchLaporanByTahun = async (tahun) => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/api/laporan/kategori-barang?tahun=${tahun}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const hasilMap = {};
      res.data.data.forEach((item) => {
        hasilMap[item.kategori] = item;
      });

      const mergedData = kategoriListMaster.map((kategori) => ({
        kategori,
        terjual: hasilMap[kategori]?.terjual ?? 0,
        gagal: hasilMap[kategori]?.gagal ?? 0,
      }));

      const tanggalCetak = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      const doc = (
        <LaporanPDF
          data={mergedData}
          tahun={res.data.tahun}
          tanggalCetak={tanggalCetak}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      setLaporan((prev) => ({
        ...prev,
        [tahun]: {
          ...res.data,
          previewUrl: url,
          document: doc,
        },
      }));
    } catch (error) {
      console.error('Gagal mengambil data laporan tahun ' + tahun, error);
    }
  };

  useEffect(() => {
    tahunList.forEach((tahun) => {
      fetchLaporanByTahun(tahun);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaChartBar className="w-6 h-6" />
        Laporan Penjualan Per Kategori Barang
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full">
          <table className="w-full bg-white border border-gray-300 rounded-md shadow">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="text-left px-4 py-2 border border-gray-300 font-semibold">Tahun</th>
                <th className="text-center px-4 py-2 border border-gray-300 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tahunList.map((tahun) => (
                <tr key={tahun} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border border-gray-300">{tahun}</td>
                  <td className="px-4 py-2 border border-gray-300 text-center space-x-2 flex justify-center">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm shadow transition"
                      onClick={() => setSelectedPreviewUrl(laporan[tahun]?.previewUrl || null)}
                    >
                      Preview
                    </button>
                    {laporan[tahun]?.document ? (
                      <PDFDownloadLink
                        document={laporan[tahun].document}
                        fileName={`Laporan Penjualan Per Kategori Barang ${tahun}.pdf`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm shadow transition"
                      >
                        {({ loading }) => (loading ? '...' : 'Unduh')}
                      </PDFDownloadLink>
                    ) : (
                      <span className="bg-gray-300 text-white px-3 py-1 rounded text-sm shadow">Loading...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedPreviewUrl && (
          <div className={`w-full lg:w-[calc(50vw-4rem)] border border-gray-300 rounded-md shadow overflow-hidden transition-all duration-500`}>
            <h3 className="text-lg font-semibold bg-gray-100 px-4 py-2 border-b">Preview Laporan PDF</h3>
            <iframe
              src={selectedPreviewUrl}
              title="Preview PDF"
              width="100%"
              height="1000px"
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanKategoriPage;
