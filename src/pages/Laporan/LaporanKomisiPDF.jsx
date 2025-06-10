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
    tableHeader: {
        flexDirection: "row",
        lineHeight: 1.2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        backgroundColor: "#eee",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        paddingVertical: 3,
    },
    totalRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        paddingVertical: 4,
        fontWeight: "bold",
    },
    cell: {
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRightWidth: 1,
        textAlign: "left",
        borderColor: "#000",
        borderStyle: "solid",
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

const LaporanKomisiPDF = ({ data, bulan, tahun }) => {
    const namaBulan = bulanIndonesia[bulan - 1];
    const tanggalCetak = formatTanggal(new Date());

    let totalHunter = 0;
    let totalReuse = 0;
    let totalBonus = 0;

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.header}>ReUse Mart</Text>
                <Text style={styles.subheader}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                <Text style={{ fontSize: 11, marginTop: 10, fontWeight: "bold" }}>LAPORAN KOMISI BULANAN</Text>
                <Text style={{ marginBottom: 2 }}>Bulan: {namaBulan}</Text>
                <Text style={{ marginBottom: 2 }}>Tahun: {tahun}</Text>
                <Text style={{ marginBottom: 10 }}>Tanggal cetak: {tanggalCetak}</Text>

                {/* Header Table */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.cell, { width: "12%" }]} wrap={false}>Kode Produk</Text>
                    <Text style={[styles.cell, { width: "20%" }]} wrap={false}>Nama Produk</Text>
                    <Text style={[styles.cell, { width: "12%",}]} wrap={false}>Harga Jual</Text>
                    <Text style={[styles.cell, { width: "10%",}]} wrap={false}>Tanggal Masuk</Text>
                    <Text style={[styles.cell, { width: "10%",}]} wrap={false}>Tanggal Laku</Text>
                    <Text style={[styles.cell, { width: "12%",}]} wrap={false}>Komisi Hunter</Text>
                    <Text style={[styles.cell, { width: "12%",}]} wrap={false}>Komisi ReUse</Text>
                    <Text style={{ width: "12%", paddingHorizontal: 4 }} wrap={false}>Bonus Penitip</Text>
                </View>


                {/* Data Table */}
                {data.map((item, index) => {
                    const harga = item.harga_barang;
                    const komisiHunter = harga * parseFloat(item.komisi_hunter || 0);
                    const bonusPenitip = parseFloat(item.bonus_penitip || 0);
                    const komisiReusemart = harga * 0.2 - komisiHunter - bonusPenitip;

                    totalHunter += komisiHunter;
                    totalBonus += bonusPenitip;
                    totalReuse += komisiReusemart;

                    return (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.cell, { width: "12%" }]}>PR{item.id_barang}</Text>
                            <Text style={[styles.cell, { width: "20%" }]}>{item.nama_barang}</Text>
                            <Text style={[styles.cell, { width: "12%", textAlign: "right" }]}>{formatRp(harga)}</Text>
                            <Text style={[styles.cell, { width: "10%", textAlign: "center" }]}>{formatTanggal(item.tanggal_masuk)}</Text>
                            <Text style={[styles.cell, { width: "10%", textAlign: "center" }]}>{formatTanggal(item.tanggal_pelunasan)}</Text>
                            <Text style={[styles.cell, { width: "12%", textAlign: "right" }]}>{formatRp(komisiHunter)}</Text>
                            <Text style={[styles.cell, { width: "12%", textAlign: "right" }]}>{formatRp(komisiReusemart)}</Text>
                            <Text style={{ width: "12%", textAlign: "right", paddingHorizontal: 4 }}>{formatRp(bonusPenitip)}</Text>
                        </View>
                    );
                })}

                {/* Row Total */}
                <View style={styles.totalRow}>
                    <Text style={[styles.cell, { width: "12%" }]}></Text>
                    <Text style={[styles.cell, { width: "20%" }]}>Total</Text>
                    <Text style={[styles.cell, { width: "12%" }]}></Text>
                    <Text style={[styles.cell, { width: "10%" }]}></Text>
                    <Text style={[styles.cell, { width: "10%" }]}></Text>
                    <Text style={[styles.cell, { width: "12%", textAlign: "right" }]}>{formatRp(totalHunter)}</Text>
                    <Text style={[styles.cell, { width: "12%", textAlign: "right" }]}>{formatRp(totalReuse)}</Text>
                    <Text style={{ width: "12%", textAlign: "right", paddingHorizontal: 4 }}>{formatRp(totalBonus)}</Text>
                </View>

                {/* Footer */}
                <Text
                    render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`}
                    style={styles.footer}
                    fixed
                />
            </Page>
        </Document>
    );
};

export default LaporanKomisiPDF;
