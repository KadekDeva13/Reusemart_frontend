import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
    flexDirection: 'column',
  },
  title: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  section: { marginBottom: 6 },
  bold: { fontWeight: 'bold' },
  underline: { textDecoration: 'underline' },
  row: { flexDirection: 'row' },
  cell: {
    borderWidth: 1,
    padding: 4,
    textAlign: 'center',
    fontSize: 9,
    flex: 1,
  },
  wideCell: {
    borderWidth: 1,
    padding: 4,
    textAlign: 'center',
    fontSize: 9,
    flex: 2,
  },
  widerCell: {
    borderWidth: 1,
    padding: 4,
    textAlign: 'center',
    fontSize: 9,
    flex: 3,
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});

const formatTanggal = (tanggal) => {
  if (!tanggal) return '-';
  const t = new Date(tanggal);
  return `${t.getDate().toString().padStart(2, '0')}/${(t.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${t.getFullYear()}`;
};

const LaporanBarangHabisPDF = ({ data = [], tanggalCetak = "" }) => {
  const rowsPerPage = 20;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const start = pageIndex * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

    return (
      <Page key={pageIndex} size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.bold}>ReUse Mart</Text>
          <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
        </View>

        <Text style={[styles.title, styles.underline]}>
          Laporan Barang Yang Masa Penitipannya Sudah Habis
        </Text>
        <Text>Tanggal cetak: {formatTanggal(tanggalCetak)}</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.wideCell}>Kode Produk</Text>
            <Text style={styles.wideCell}>Nama Produk</Text>
            <Text style={styles.cell}>ID Penitip</Text>
            <Text style={styles.widerCell}>Penitip</Text>
            <Text style={styles.cell}>Tgl Masuk</Text>
            <Text style={styles.cell}>Tgl Akhir</Text>
            <Text style={styles.cell}>Ambil</Text>
          </View>

          {pageData.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.wideCell}>{item.id_barang}</Text>
              <Text style={styles.wideCell}>
                {item.nama_produk.length > 30 ? item.nama_produk.slice(0, 30) + '…' : item.nama_produk}
              </Text>
              <Text style={styles.cell}>{item.id_penitip}</Text>
              <Text style={styles.widerCell}>
                {item.nama_penitip.length > 25 ? item.nama_penitip.slice(0, 25) + '…' : item.nama_penitip}
              </Text>
              <Text style={styles.cell}>{formatTanggal(item.tanggal_masuk)}</Text>
              <Text style={styles.cell}>{formatTanggal(item.tanggal_akhir)}</Text>
              <Text style={styles.cell}>{formatTanggal(item.batas_ambil)}</Text>
            </View>
          ))}
        </View>

        {/* Footer halaman */}
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

export default LaporanBarangHabisPDF;
