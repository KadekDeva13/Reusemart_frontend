import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.2,
    },
    title: {
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    section: { marginBottom: 6 },
    bold: { fontWeight: 'bold' },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    outlineBox: {
        border: '1pt solid black',
        padding: 10,
        borderRadius: '0pt',
    },
    labelRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    label: { width: 110 },
    value: { flex: 1 },
});

const formatRupiah = (number) => {
    if (!number && number !== 0) return '-';
    return Number(number).toLocaleString('id-ID');
};

const formatTanggalDenganJam = (tanggalDb) => {
    if (!tanggalDb) return '-';
    const date = new Date(tanggalDb);
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

const NotaPenitipanBarang = ({ data }) => {
    const itemCount = data?.barang?.length || 1;
    const baseHeight = 230; // tinggi tetap untuk header+footer
    const itemHeight = 28;  // tinggi rata-rata tiap barang
    const pageHeight = baseHeight + itemCount * itemHeight;

    return (
        <Document>
            <Page size={[283.5, pageHeight]} style={styles.page} wrap={false}>
                <View style={styles.outlineBox}>
                    {/* HEADER */}
                    <View style={styles.section}>
                        <Text style={styles.title}>Nota Penitipan Barang</Text>
                        <Text style={styles.bold}>ReUse Mart</Text>
                        <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                    </View>

                    {/* INFORMASI */}
                    <View style={styles.section}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>No Nota</Text>
                            <Text style={styles.value}>: {data.nomor_nota || '-'}</Text>
                        </View>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Tanggal penitipan</Text>
                            <Text style={styles.value}>: {formatTanggalDenganJam(data.tanggal_masuk)}</Text>
                        </View>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Masa penitipan sampai</Text>
                            <Text style={styles.value}>: {formatTanggal(data.tanggal_akhir)}</Text>
                        </View>
                    </View>

                    {/* PENITIP */}
                    <View style={styles.section}>
                        <Text style={styles.bold}>
                            Penitip : {data.penitip?.id_penitip} / {data.penitip?.nama_lengkap}
                        </Text>
                        <Text>{data.penitip?.alamat_penitip || '-'}</Text>
                    </View>

                    {/* LIST BARANG */}
                    <View style={styles.section}>
                        {data.barang?.length > 0 ? data.barang.map((b, i) => (
                            <View key={i} style={{ marginBottom: 6 }}>
                                <View style={styles.row}>
                                    <Text>{b.nama_barang || '-'}</Text>
                                    <Text>{formatRupiah(b.harga_barang)}</Text>
                                </View>
                                {b.tanggal_garansi && (
                                    <Text>Garansi ON {new Date(b.tanggal_garansi).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</Text>
                                )}
                                <Text>Berat barang: {b.berat_barang || b.berat || 0} kg</Text>
                            </View>
                        )) : <Text>-</Text>}
                    </View>

                    {/* QC */}
                    <View style={styles.section}>
                        <Text>Diterima dan QC oleh:</Text>
                        <Text style={{ marginTop: 18 }}>........................................</Text>
                        <Text>{data.nama_qc || '-'}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default NotaPenitipanBarang;
