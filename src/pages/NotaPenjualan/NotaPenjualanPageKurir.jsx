import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.2 },
  title: { fontSize: 12, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  section: { marginBottom: 4 },
  bold: { fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2.5 },
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
  signatureSpace: {
    marginTop: 20,
  },
});

const safeText = (val) => typeof val === 'string' ? val : String(val ?? '-');

const formatRupiah = (number) => {
  const parsed = Number(number);
  if (isNaN(parsed)) return '-';
  return parsed.toLocaleString('id-ID');
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

const generateNomorNota = (transaksi) => {
  const tanggal = new Date(transaksi.created_at || Date.now());
  const tahun = String(tanggal.getFullYear()).slice(-2);
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
  const urut = String(transaksi.id_transaksi).padStart(3, '0');
  return `${tahun}.${bulan}.${urut}`;
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
        const detailList = (transaksi.detailtransaksi || []).filter(dt => dt && dt.barang);
        const itemCount = detailList.length || 1;
        const baseHeight = 430;
        const pageHeight = baseHeight + itemCount * 22;

        if (!['selesai', 'disiapkan', 'dikirim'].includes(transaksi.status_transaksi)) {
          return (
            <Page key={index} size={[283.5, 100]} style={styles.page}>
              <Text style={styles.value}>: {generateNomorNota(transaksi)}</Text>
            </Page>
          );
        }

        const totalBarang = detailList.reduce(
          (sum, dt) => sum + Number(dt.barang?.harga_barang || 0),
          0
        );

        const ongkir = Number(transaksi.biaya_pengiriman || 0);
        const potongan = Number(transaksi.poin_digunakan || 0) * 100;
        const totalAkhir = totalBarang + ongkir - potongan;

        const getQcName = () => {
          for (const dt of detailList) {
            const qcName =
              dt?.barang?.detailpenitipan?.penitipan?.pegawaiqc?.nama_lengkap;
            if (typeof qcName === 'string' && qcName.trim() !== '') {
              return qcName;
            }
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
                  <Text style={styles.value}>: {generateNomorNota(transaksi)}</Text>
                </View>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Tanggal pesan</Text>
                  <Text style={styles.value}>: {formatTanggalDenganJamLokal(transaksi.created_at)}</Text>
                </View>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Lunas pada</Text>
                  <Text style={styles.value}>: {transaksi.tanggal_pelunasan ? formatTanggalDenganJamLokal(transaksi.tanggal_pelunasan) : '-'}</Text>
                </View>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Tanggal kirim</Text>
                  <Text style={styles.value}>: {formatTanggal(transaksi.tanggal_pengambilan)}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.bold}>Pembeli :</Text>
                <Text>{safeText(transaksi.pembeli?.email)} / {safeText(transaksi.pembeli?.nama_lengkap)}</Text>
                {transaksi.pembeli?.alamat?.length > 0 ? (
                  (() => {
                    const alamat = transaksi.pembeli.alamat[0];
                    return (
                      <Text>
                        {[
                          alamat.detail_alamat || '-',
                          alamat.kelurahan || '-',
                          alamat.kecamatan || '-',
                          alamat.provinsi || '-',
                          alamat.kode_pos || '-',
                        ].join(', ')}
                      </Text>
                    );
                  })()
                ) : (
                  <Text>Alamat tidak tersedia</Text>
                )}
                <Text>Delivery: Kurir ReUseMart ({safeText(getNamaKurir(transaksi))})</Text>
              </View>

              <View style={styles.section}>
                {detailList.length > 0 ? detailList.map((dt, i) => (
                  <View key={i} style={styles.row}>
                    <Text>{safeText(dt.barang?.nama_barang)}</Text>
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
                <Text>QC oleh: {safeText(getQcName())}</Text>
              </View>

              <View style={styles.section}>
                <Text>Diterima oleh:</Text>
                <Text style={styles.signatureSpace}>(........................................)</Text>
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
