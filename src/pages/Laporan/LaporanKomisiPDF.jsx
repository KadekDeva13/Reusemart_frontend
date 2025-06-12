import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";

// Format Tanggal
const formatTanggal = (tglString) => {
    const tgl = new Date(tglString);
    const d = tgl.getDate();
    const m = tgl.getMonth() + 1;
    const y = tgl.getFullYear();
    return `${d}/${m}/${y}`;
};

// Format Rupiah
const formatRp = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

// Nama Bulan
const bulanIndonesia = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        backgroundColor: "#fff",
        position: "relative",
    },
    header: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 2,
    },
    subheader: {
        fontSize: 10,
        marginBottom: 10,
    },
    tableWrapper: {
        borderWidth: 1,
        borderColor: "#000",
        marginTop: 12,
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#eee",
        borderBottomWidth: 1,
        borderColor: "#000",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    totalRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderColor: "#000",
    },
    cell: {
        padding: 4,
        borderRightWidth: 1,
        borderColor: "#000",
        justifyContent: "center",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        fontSize: 10,
        textAlign: "center",
        color: "#888",
    },
});

const LaporanKomisiPDF = ({ data, bulan, tahun, totalHargaJual }) => {
    const namaBulan = bulanIndonesia[bulan - 1];
    const tanggalCetak = formatTanggal(new Date());

    let totalHunter = 0;
    let totalReuse = 0;
    let totalBonus = 0;

    const columnDefs = [
        { label: "Kode Produk", width: "12%" },
        { label: "Nama Produk", width: "20%" },
        { label: "Harga Jual", width: "12%" },
        { label: "Tanggal\nMasuk", width: "10%" },
        { label: "Tanggal\nLaku", width: "10%" },
        { label: "Komisi\nHunter", width: "12%" },
        { label: "Komisi\nReUse", width: "12%" },
        { label: "Bonus\nPenitip", width: "12%" },
    ];

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Header */}
                <Text style={styles.header}>ReUse Mart</Text>
                <Text style={styles.subheader}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                <Text style={{ fontSize: 11, marginTop: 10, fontWeight: "bold" }}>LAPORAN KOMISI BULANAN</Text>
                <Text style={{ marginBottom: 2 }}>Bulan: {namaBulan}</Text>
                <Text style={{ marginBottom: 2 }}>Tahun: {tahun}</Text>
                <Text style={{ marginBottom: 10 }}>Tanggal cetak: {tanggalCetak}</Text>

                {/* Table */}
                <View style={styles.tableWrapper}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        {columnDefs.map((col, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.cell,
                                    { width: col.width },
                                    index === 0 && { borderLeftWidth: 0 }, // no double left border
                                ]}
                            >
                                <Text>{col.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Table Body */}
                    {data.map((item, idx) => {
                        const harga = item.harga_barang;
                        const komisiHunter = harga * parseFloat(item.komisi_hunter || 0);
                        const bonusPenitip = parseFloat(item.bonus_penitip || 0);
                        const komisiReusemart = harga * 0.2 - komisiHunter - bonusPenitip;

                        totalHunter += komisiHunter;
                        totalBonus += bonusPenitip;
                        totalReuse += komisiReusemart;

                        return (
                            <View style={styles.tableRow} key={idx}>
                                <View style={[styles.cell, { width: "12%", borderLeftWidth: 0 }]}>
                                    <Text>PR{item.id_barang}</Text>
                                </View>
                                <View style={[styles.cell, { width: "20%" }]}>
                                    <Text>{item.nama_barang}</Text>
                                </View>
                                <View style={[styles.cell, { width: "12%" }]}>
                                    <Text style={{ textAlign: "right" }}>{formatRp(harga)}</Text>
                                </View>
                                <View style={[styles.cell, { width: "10%" }]}>
                                    <Text style={{ textAlign: "center" }}>{formatTanggal(item.tanggal_masuk)}</Text>
                                </View>
                                <View style={[styles.cell, { width: "10%" }]}>
                                    <Text style={{ textAlign: "center" }}>{formatTanggal(item.tanggal_pelunasan)}</Text>
                                </View>
                                <View style={[styles.cell, { width: "12%" }]}>
                                    <Text style={{ textAlign: "right" }}>{formatRp(komisiHunter)}</Text>
                                </View>
                                <View style={[styles.cell, { width: "12%" }]}>
                                    <Text style={{ textAlign: "right" }}>{formatRp(komisiReusemart)}</Text>
                                </View>
                                <View style={[styles.cell, { width: "12%" }]}>
                                    <Text style={{ textAlign: "right" }}>{formatRp(bonusPenitip)}</Text>
                                </View>
                            </View>
                        );
                    })}

                    {/* Total */}
                    <View style={styles.totalRow}>
                        <View style={[styles.cell, { width: "32%", borderLeftWidth: 0 }]}>
                            <Text style={{ fontWeight: "bold", textAlign: "right" }}>Total</Text>
                        </View>
                        <View style={[styles.cell, { width: "12%" }]}>
                            <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                                {formatRp(totalHargaJual)}
                            </Text>
                        </View>
                        <View style={[styles.cell, { width: "20%" }]} />
                        <View style={[styles.cell, { width: "12%" }]}>
                            <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                                {formatRp(totalHunter)}
                            </Text>
                        </View>
                        <View style={[styles.cell, { width: "12%" }]}>
                            <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                                {formatRp(totalReuse)}
                            </Text>
                        </View>
                        <View style={[styles.cell, { width: "12%" }]}>
                            <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                                {formatRp(totalBonus)}
                            </Text>
                        </View>
                    </View>

                </View>

                {/* Footer */}
                <Text
                    render={({ pageNumber, totalPages }) =>
                        `Halaman ${pageNumber} dari ${totalPages}`
                    }
                    style={styles.footer}
                    fixed
                />
            </Page>
        </Document>
    );
};

export default LaporanKomisiPDF;
