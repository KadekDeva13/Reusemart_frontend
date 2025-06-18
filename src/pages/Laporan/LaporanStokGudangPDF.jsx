import {
    Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
    title: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    table: { display: "table", width: "100%", borderWidth: 1, marginTop: 10 },
    row: { flexDirection: "row" },
    cell: { borderWidth: 1, padding: 4, flex: 1, textAlign: "center" },
    header: { fontWeight: "bold", backgroundColor: "#eee" },
});

const StokGudangPDF = ({ data }) => {
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });


    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.title}>ReUse Mart</Text>
                <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                <Text style={{ marginTop: 6, fontWeight: 'bold', textDecoration: 'underline' }}>
                    LAPORAN Stok Gudang
                </Text>
                <Text style={{ marginBottom: 1 }}>Tanggal cetak: {tanggalCetak}</Text>

                <View style={styles.table}>
                    <View style={[styles.row, styles.header]}>
                        <Text style={[styles.cell, { flex: 0.7 }]}>Kode {'\n'} Produk</Text>
                        <Text style={[styles.cell, { flex: 1.5 }]}>Nama Produk</Text>
                        <Text style={styles.cell}>ID Penitip</Text>
                        <Text style={styles.cell}>Nama Penitip</Text>
                        <Text style={styles.cell}>Tanggal Masuk</Text>
                        <Text style={styles.cell}>Perpanjangan</Text>
                        <Text style={styles.cell}>ID Hunter</Text>
                        <Text style={styles.cell}>Nama Hunter</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>Harga</Text>
                    </View>

                    {data.map((item, i) => (
                        <View key={i} style={styles.row}>
                            <Text style={[styles.cell, { flex: 0.7 }]}>PR{item.kode_produk}</Text>
                            <Text style={[styles.cell, { flex: 1.5 }]}>{item.nama_produk}</Text>
                            <Text style={styles.cell}>{item.id_penitip}</Text>
                            <Text style={styles.cell}>{item.nama_penitip}</Text>
                            <Text style={styles.cell}>{item.tanggal_masuk}</Text>
                            <Text style={styles.cell}>{item.perpanjangan}</Text>
                            <Text style={styles.cell}>
                                {item.id_hunter ? `P${item.id_hunter}` : '-'}
                            </Text>
                            <Text style={styles.cell}>{item.nama_hunter}</Text>
                            <Text style={[styles.cell, { flex: 1, textAlign: 'right' }]}>
                                {Number(item.harga).toLocaleString('id-ID')}
                            </Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default StokGudangPDF;
