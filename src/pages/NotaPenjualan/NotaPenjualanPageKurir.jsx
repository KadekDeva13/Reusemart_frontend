import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.2 },
  title: { fontSize: 12, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  section: { marginBottom: 4 },
  bold: { fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1.5 },
  outlineBox: {
    border: '1pt solid black',
    padding: 8,
    borderRadius: '0pt',
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  label: {
    width: 90,
  },
  value: {
    flex: 1,
  },
});

const formatRupiah = (number) => {
  if (!number && number !== 0) return '-';
  return number.toLocaleString('id-ID');
};

const formatTanggalDenganJamLokal = (tanggalDb) => {
  if (!tanggalDb) return '-';
  const date = new Date(tanggalDb);
  const now = new Date();
  date.setHours(now.getHours(), now.getMinutes(), 0, 0);
  return date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '');
};

const formatTanggal = (tanggal) => {
  if (!tanggal) return '-';
  const [year, month, day] = tanggal.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const getNamaKurir = (transaksi) => {
  if (transaksi?.pegawai?.id_jabatan === 2) {
    return transaksi.pegawai.nama_lengkap;
  }
  return '-';
};

const NotaPDF = ({ transaksiList }) => {
  if (!Array.isArray(transaksiList) || transaksiList.length === 0) {
    return (
      <Document>
        <Page size={[283.5, 100]} style={styles.page}>
          <Text style={styles.title}>Tidak ada transaksi untuk dicetak.</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {transaksiList.map((transaksi, index) => {
        const itemCount = transaksi?.detailtransaksi?.length || 1;
        const baseHeight = 430;
        const pageHeight = baseHeight + itemCount * 22;

        if (!['selesai', 'sedang disiapkan', 'dikirim'].includes(transaksi.status_transaksi)) {
          return (
            <Page key={index} size={[283.5, 100]} style={styles.page}>
              <Text style={styles.title}>Transaksi {transaksi.nomor_nota || index + 1} tidak valid untuk nota.</Text>
            </Page>
          );
        }

        // ✅ Hitung ulang total harga barang
        const totalBarang = transaksi.detailtransaksi?.reduce(
          (sum, dt) => sum + (dt.barang?.harga_barang || 0),
          0
        );
        const ongkir = transaksi.biaya_pengiriman || 0;
        const potongan = (transaksi.poin_digunakan || 0) * 100;
        const totalAkhir = totalBarang + ongkir - potongan;

        const getQcName = () => {
          for (const dt of transaksi.detailtransaksi || []) {
            const qc = dt.barang?.penitipan?.nama_qc;
            if (qc) return qc;
          }
          return '-';
        };

        return (
          <Page key={index} size={[283.5, pageHeight]} style={styles.page}>
            <View style={styles.outlineBox}>
              <View style={styles.section}>
                <Text style={styles.bold}>ReUse Mart</Text>
                <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>No Nota</Text>
                  <Text style={styles.value}>: {transaksi.nomor_nota || '-'}</Text>
                </View>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Tanggal pesan</Text>
                  <Text style={styles.value}>: {formatTanggalDenganJamLokal(transaksi.created_at)}</Text>
                </View>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Lunas pada</Text>
                  <Text style={styles.value}>: {transaksi.tanggal_pelunasan ? formatTanggalDenganJamLokal(transaksi.tanggal_pelunasan) : 'Belum dilunasi'}</Text>
                </View>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Tanggal kirim</Text>
                  <Text style={styles.value}>: {formatTanggal(transaksi.tanggal_pengambilan)}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.bold}>Pembeli :</Text>
                <Text>{transaksi.pembeli?.email || '-'} / {transaksi.pembeli?.nama_lengkap || '-'}</Text>
                <Text>
                  {(transaksi.pembeli && transaksi.pembeli.alamat)
                    ? `${transaksi.pembeli.alamat.detail_alamat}, ${transaksi.pembeli.alamat.kelurahan}, ${transaksi.pembeli.alamat.kecamatan}, ${transaksi.pembeli.alamat.provinsi}, ${transaksi.pembeli.alamat.kode_pos}`
                    : 'Alamat tidak tersedia'}
                </Text>
                <Text>Delivery: Kurir ReUseMart ({getNamaKurir(transaksi)})</Text>
              </View>

              <View style={styles.section}>
                {transaksi.detailtransaksi?.length > 0 ? transaksi.detailtransaksi.map((dt, i) => (
                  <View key={i} style={styles.row}>
                    <Text>{dt.barang?.nama_barang || '-'}</Text>
                    <Text>{formatRupiah(dt.barang?.harga_barang)}</Text>
                  </View>
                )) : <Text>-</Text>}
              </View>

              <View style={styles.section}>
                <View style={styles.row}><Text>Total</Text><Text>{formatRupiah(totalBarang)}</Text></View>
                <View style={styles.row}><Text>Ongkos Kirim</Text><Text>{formatRupiah(ongkir)}</Text></View>
                <View style={styles.row}><Text>Total</Text><Text>{formatRupiah(totalBarang + ongkir)}</Text></View>
                <View style={styles.row}><Text>Potongan {transaksi.poin_digunakan || 0} poin</Text><Text>- {formatRupiah(potongan)}</Text></View>
                <View style={styles.row}><Text>Total</Text><Text>{formatRupiah(totalAkhir)}</Text></View>
              </View>

              <View style={styles.section}>
                <Text>Poin dari pesanan ini: {transaksi.poin_reward || 0}</Text>
                <Text>Total poin customer: {transaksi.pembeli?.poin_sosial || 0}</Text>
              </View>

              <View style={styles.section}>
                <Text>QC oleh: {getQcName()}</Text>
              </View>

              <View style={styles.section}>
                <Text>Diterima oleh:</Text>
                <Text style={{ marginTop: 20 }}>(........................................)</Text>
                <Text>Tanggal: ............................</Text>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default NotaPDF;
