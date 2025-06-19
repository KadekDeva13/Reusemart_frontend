// LaporanPenjualanBulananPDF.jsx
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
} from '@react-pdf/renderer';

// Gaya PDF
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
    title: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { marginBottom: 10 },
    tableWrapper: {
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: '#000',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#000',
    },
    cell: {
        padding: 5,
        borderRightWidth: 1,
        borderColor: '#000',
    },
    colBulan: { width: '34%' },
    colJumlah: { width: '33%', textAlign: 'center' },
    colTotal: { width: '33%', textAlign: 'right' },
    bold: { fontWeight: 'bold' },
    grafikBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 160,
        marginTop: 20,
    },
    grafikColumn: {
        alignItems: 'center',
        marginHorizontal: 3,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
        color: 'gray',
    }
});

// Fungsi bantu
const formatRupiah = (angka) =>
    angka.toLocaleString('id-ID', { minimumFractionDigits: 0 });

const bulanPendek = (bulan) =>
    bulan.substring(0, 3); // Jan, Feb, dst

const LaporanPenjualanBulananPDF = ({ data, tahun }) => {
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const totalTerjual = data.reduce((sum, item) => sum + item.jumlah_terjual, 0);
    const totalUang = data.reduce((sum, item) => sum + item.total_penjualan, 0);

    // Untuk skala grafik
    const maxPenjualan = Math.max(...data.map(d => d.total_penjualan), 1);

    return (
        <Document>
            {/* Halaman 1 - Tabel */}
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.title}>ReUse Mart</Text>
                <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                <Text style={[styles.title, { marginTop: 30, textDecoration: 'underline' }]}>LAPORAN PENJUALAN BULANAN</Text>
                <Text>Tahun: {tahun}</Text>
                <Text style={styles.subtitle}>Tanggal cetak: {tanggalCetak}</Text>

                <View style={styles.tableWrapper}>
                    {/* Header */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, styles.colBulan, styles.bold]}>Bulan</Text>
                        <Text style={[styles.cell, styles.colJumlah, styles.bold]}>Jumlah Barang Terjual</Text>
                        <Text style={[styles.cell, styles.colTotal, styles.bold]}>Jumlah Penjualan Kotor</Text>
                    </View>

                    {/* Baris Data */}
                    {data.map((item, i) => (
                        <View key={i} style={styles.row}>
                            <Text style={[styles.cell, styles.colBulan]}>{item.bulan}</Text>
                            <Text style={[styles.cell, styles.colJumlah]}>{item.jumlah_terjual}</Text>
                            <Text style={[styles.cell, styles.colTotal]}>{formatRupiah(item.total_penjualan)}</Text>
                        </View>
                    ))}

                    {/* Total */}
                    <View style={[styles.row, { backgroundColor: '#eee' }]}>
                        <Text style={[styles.cell, { width: '67%', textAlign: 'right', paddingRight: 6 }]}>
                            <Text style={styles.bold}>Total</Text>
                        </Text>
                        <Text style={[styles.cell, styles.colTotal]}>
                            <Text style={styles.bold}>{formatRupiah(totalUang)}</Text>
                        </Text>
                    </View>
                </View>

                {/* Footer halaman */}
                <View style={styles.footer} fixed>
                    <Text
                        render={({ pageNumber, totalPages }) =>
                            `Halaman ${pageNumber} dari ${totalPages}`
                        }
                    />
                </View>
            </Page>

            {/* Halaman 2 - Grafik */}
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Judul grafik di atas halaman */}
                <View style={{ position: 'absolute', top: 50, left: 0, right: 0, alignItems: 'center' }}>
                    <Text style={[styles.title]}>Grafik Penjualan per Bulan</Text>
                </View>

                {/* Isi grafik di tengah halaman */}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        {/* Sumbu Y */}
                        <View style={{ width: 60, justifyContent: 'space-between', paddingRight: 6 }}>
                            {[5, 4, 3, 2, 1, 0].map((i) => {
                                const unit = Math.pow(10, Math.floor(Math.log10(maxPenjualan)));
                                const roundedMax = Math.ceil(maxPenjualan / unit) * unit;
                                const step = roundedMax / 5;
                                const yVal = Math.round(step * i);
                                return (
                                    <Text key={i} style={{ fontSize: 9, textAlign: 'right' }}>
                                        {formatRupiah(yVal)}
                                    </Text>
                                );
                            })}
                        </View>

                        {/* Grafik area */}
                        <View
                            style={{
                                width: 680,
                                height: 260,
                                paddingHorizontal: 12,
                            }}
                        >
                            {/* Area grafik (grid dan batang) */}
                            <View
                                style={{
                                    height: 220,
                                    borderLeftWidth: 1,
                                    borderBottomWidth: 1,
                                    borderColor: '#888',
                                    position: 'relative',
                                }}
                            >
                                {/* Grid horizontal */}
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <View
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            top: (220 / 5) * i,
                                            left: 0,
                                            right: 0,
                                            height: 1,
                                            backgroundColor: '#ccc',
                                        }}
                                    />
                                ))}

                                {/* Batang grafik */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 220,
                                        flexDirection: 'row',
                                        alignItems: 'flex-end',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {data.map((item, i) => {
                                        const unit = Math.pow(10, Math.floor(Math.log10(maxPenjualan)));
                                        const roundedMax = Math.ceil(maxPenjualan / unit) * unit;
                                        const tinggi = Math.round((item.total_penjualan / roundedMax) * 220);

                                        return (
                                            <View
                                                key={i}
                                                style={{
                                                    alignItems: 'center',
                                                    width: `${100 / data.length}%`,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: 40,
                                                        height: tinggi,
                                                        backgroundColor: '#4a90e2',
                                                    }}
                                                />
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Label bulan */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 4,
                                    paddingHorizontal: 4,
                                }}
                            >
                                {data.map((item, i) => (
                                    <View
                                        key={i}
                                        style={{
                                            width: `${100 / data.length}%`,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: 8 }}>{item.bulan.substring(0, 3)}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer halaman */}
                <View style={styles.footer} fixed>
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

export default LaporanPenjualanBulananPDF;
