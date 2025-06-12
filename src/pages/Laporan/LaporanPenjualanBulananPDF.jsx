// LaporanPenjualanBulananPDF.jsx
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';

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
    tableWrapper: {
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: '#000',
        marginTop: 10,
        marginBottom: 10,
    },
    row: { flexDirection: 'row' },
    cell: {
        padding: 4,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
    },
});

const LaporanPenjualanBulananPDF = ({ data, tahun, grafikImage }) => {
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

                {/* Tabel Data */}
                <View style={styles.tableWrapper}>
                    <View style={styles.row}>
                        <View style={[styles.cell, { width: '34%' }]}>
                            <Text>Bulan</Text>
                        </View>
                        <View style={[styles.cell, { width: '33%' }]}>
                            <Text>Jumlah Barang Terjual</Text>
                        </View>
                        <View style={[styles.cell, { width: '33%' }]}>
                            <Text>Jumlah Penjualan Kotor</Text>
                        </View>
                    </View>

                    {data.map((item, i) => (
                        <View key={i} style={styles.row}>
                            <View style={[styles.cell, { width: '34%' }]}>
                                <Text>{item.bulan}</Text>
                            </View>
                            <View style={[styles.cell, { width: '33%', textAlign: 'center' }]}>
                                <Text style={{ textAlign: 'center' }}>{item.jumlah_terjual}</Text>
                            </View>
                            <View style={[styles.cell, { width: '33%' }]}>
                                <Text style={{ textAlign: 'right' }}>
                                    {formatRupiah(item.total_penjualan)}
                                </Text>
                            </View>
                        </View>
                    ))}

                    <View style={[styles.row, { backgroundColor: '#eee' }]}>
                        <View style={[styles.cell, { width: '67%' }]}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    textAlign: 'right',
                                    paddingRight: 6,
                                }}
                            >
                                Total
                            </Text>
                        </View>
                        <View style={[styles.cell, { width: '33%' }]}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                {formatRupiah(totalUang)}
                            </Text>
                        </View>
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
            {grafikImage && (
                <Page size="A4" orientation="landscape" style={styles.page}>
                    <View style={{ textAlign: 'center', marginTop: 20 }}>
                        <Text style={[styles.bold, { marginBottom: 6 }]}>
                            Grafik Penjualan per Bulan
                        </Text>
                        <Image
                            src={grafikImage}
                            style={{ width: 700, height: 300, margin: 'auto' }}
                        />
                    </View>
                </Page>
            )}
        </Document>
    );
};

export default LaporanPenjualanBulananPDF;
