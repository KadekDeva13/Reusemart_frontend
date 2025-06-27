import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 10,
    textAlign: "left",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textDecoration: "underline",
  },
  subtitle: {
    marginBottom: 2,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 4,
  },
  col1: { width: "12%" },
  col2: { width: "20%" },
  col3: { width: "10%" },
  col4: { width: "18%" },
  col5: { width: "13%" },
  col6: { width: "17%" },
  col7: { width: "12%" },
});

const formatTanggalCetak = (isoDate) => {
  const date = new Date(isoDate);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatter.format(date);
};

const LaporanDonasiBarangPDF = ({
  data = [],
  tanggalCetak = new Date().toISOString(),
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>ReUse Mart</Text>
        <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
        <Text style={styles.title}>LAPORAN Donasi Barang</Text>
        <Text style={styles.subtitle}>Tahun : 2025</Text>
        <Text style={styles.subtitle}>
          Tanggal cetak: {formatTanggalCetak(tanggalCetak)}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.cell, styles.col1]}>Kode Produk</Text>
          <Text style={[styles.cell, styles.col2]}>Nama Produk</Text>
          <Text style={[styles.cell, styles.col3]}>Id Penitip</Text>
          <Text style={[styles.cell, styles.col4]}>Nama Penitip</Text>
          <Text style={[styles.cell, styles.col5]}>Tanggal Donasi</Text>
          <Text style={[styles.cell, styles.col6]}>Organisasi</Text>
          <Text style={[styles.cell, styles.col7]}>Nama Penerima</Text>
        </View>

        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cell, styles.col1]}>{item.kode_produk}</Text>
            <Text style={[styles.cell, styles.col2]}>{item.nama_produk}</Text>
            <Text style={[styles.cell, styles.col3]}>
              {item.id_penitip || "-"}
            </Text>
            <Text style={[styles.cell, styles.col4]}>
              {item.nama_penitip || "-"}
            </Text>
            <Text style={[styles.cell, styles.col5]}>
              {item.tanggal_donasi}
            </Text>
            <Text style={[styles.cell, styles.col6]}>{item.organisasi}</Text>
            <Text style={[styles.cell, styles.col7]}>{item.nama_penerima}</Text>
          </View>
        ))}
      </View>

      <View
        fixed
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 9,
          color: "gray",
        }}
      >
        <Text
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

export default LaporanDonasiBarangPDF;
