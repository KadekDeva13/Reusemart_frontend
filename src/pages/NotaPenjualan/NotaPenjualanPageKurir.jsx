import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
    title: { fontSize: 12, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
    section: { marginBottom: 6 },
    bold: { fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    outlineBox: {
        border: '1pt solid black',
        padding: 10,
        borderRadius: 5,
    },
    labelRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    label: { fontWeight: 'bold', width: 90 },
});

const formatRupiah = (number) => `Rp${(number || 0).toLocaleString('id-ID')}`;
const formatTanggalJam = (tanggal) => {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
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

const NotaPDF = ({ transaksi }) => {
    if (!transaksi || !['selesai', 'sedang disiapkan'].includes(transaksi.status_transaksi)) {
        return (
            <Document>
                <Page size={[283.5, 595]} style={styles.page}>
                    <Text style={styles.title}>Transaksi ini tidak berhak mendapatkan nota.</Text>
                </Page>
            </Document>
        );
    }

    const totalAkhir = (transaksi.total_pembayaran || 0) - ((transaksi.poin_digunakan || 0) * 100);

    const getQcName = () => {
    for (const dt of transaksi.detailtransaksi || []) {
        const barangId = dt.barang?.id_barang;
        const qc = dt.barang?.penitipan?.nama_qc;
        console.log(`[DEBUG] Barang ID: ${barangId}, QC: ${qc}`);
        if (qc) return qc;
    }
    return '-';
};
    return (
        <Document>
            <Page size={[283.5, 595]} style={styles.page}>
                <View style={styles.outlineBox}>
                    <Text style={styles.title}>Nota Penjualan</Text>

                    <View style={styles.section}>
                        <Text style={styles.bold}>ReUse Mart</Text>
                        <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.labelRow}><Text style={styles.label}>No Nota</Text><Text>: {transaksi.nomor_nota || '-'}</Text></View>
                        <View style={styles.labelRow}><Text style={styles.label}>Tanggal pesan</Text><Text>: {formatTanggalJam(transaksi.created_at)}</Text></View>
                        <View style={styles.labelRow}><Text style={styles.label}>Lunas pada</Text><Text>: {transaksi.tanggal_pelunasan ? formatTanggalJam(transaksi.tanggal_pelunasan) : 'Belum dilunasi'}</Text></View>
                        <View style={styles.labelRow}><Text style={styles.label}>Tanggal kirim</Text><Text>: {formatTanggal(transaksi.tanggal_pengambilan)}</Text></View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.bold}>Pembeli :</Text>
                        <Text>{transaksi.pembeli?.email || '-'} / {transaksi.pembeli?.nama_lengkap || '-'}</Text>
                        <Text>
                            {(transaksi.pembeli && transaksi.pembeli.alamat)
                                ? `${transaksi.pembeli.alamat.detail_alamat}, ${transaksi.pembeli.alamat.kelurahan}, ${transaksi.pembeli.alamat.kecamatan}, ${transaksi.pembeli.alamat.provinsi}, ${transaksi.pembeli.alamat.kode_pos}`
                                : 'Alamat tidak tersedia'}
                        </Text>
                        <Text>Delivery: Kurir ReUseMart ({transaksi.nama_pengirim || '-'})</Text>
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
                        <View style={styles.row}><Text>Total</Text><Text>{formatRupiah(transaksi.total_pembayaran)}</Text></View>
                        <View style={styles.row}><Text>Ongkos Kirim</Text><Text>{formatRupiah(transaksi.biaya_pengiriman)}</Text></View>
                        <View style={styles.row}><Text>Total</Text><Text>{formatRupiah(transaksi.total_pembayaran)}</Text></View>
                        <View style={styles.row}><Text>Potongan {transaksi.poin_digunakan || 0} poin</Text><Text>- {formatRupiah(transaksi.poin_digunakan * 100)}</Text></View>
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
        </Document>
    );
};

export default NotaPDF;
