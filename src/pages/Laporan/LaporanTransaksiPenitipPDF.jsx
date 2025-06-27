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
  col2: { width: "25%" },
  col3: { width: "12%" },
  col4: { width: "12%" },
  col5: { width: "15%" },
  col6: { width: "12%" },
  col7: { width: "12%" },
});

const formatTanggal = (isoDate) => {
  const date = new Date(isoDate);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatter.format(date);
};

const LaporanTransaksiPenitipPDF = ({
  data = [],
  tanggalCetak = new Date().toISOString(),
  namaPenitip = "-",
  idPenitip = "-",
  bulan = "-",
  tahun = "-",
}) => {
  const totalHarga = data.reduce((sum, item) => sum + item.harga_bersih, 0);
  const totalBonus = data.reduce(
    (sum, item) => sum + (typeof item.bonus === "number" ? item.bonus : 0),
    0
  );
  const totalPendapatan = data.reduce((sum, item) => sum + item.pendapatan, 0);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ fontWeight: "bold", fontSize: 14 }}>ReUse Mart</Text>
          <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
          <Text style={styles.title}>LAPORAN TRANSAKSI PENITIP</Text>
          <Text>ID Penitip : {idPenitip}</Text>
          <Text>Nama Penitip : {namaPenitip}</Text>
          <Text>Bulan : {bulan}</Text>
          <Text>Tahun : {tahun}</Text>
          <Text style={styles.subtitle}>
            Tanggal cetak: {formatTanggal(tanggalCetak)}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, styles.col1]}>Kode Produk</Text>
            <Text style={[styles.cell, styles.col2]}>Nama Produk</Text>
            <Text style={[styles.cell, styles.col3]}>Tanggal Masuk</Text>
            <Text style={[styles.cell, styles.col4]}>Tanggal Laku</Text>
            <Text style={[styles.cell, styles.col5]}>Harga Jual Bersih</Text>
            <Text style={[styles.cell, styles.col6]}>Bonus</Text>
            <Text style={[styles.cell, styles.col7]}>Pendapatan</Text>
          </View>

          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cell, styles.col1]}>{item.kode_produk}</Text>
              <Text style={[styles.cell, styles.col2]}>{item.nama_produk}</Text>
              <Text style={[styles.cell, styles.col3]}>{item.tanggal_masuk}</Text>
              <Text style={[styles.cell, styles.col4]}>{item.tanggal_laku}</Text>
              <Text style={[styles.cell, styles.col5]}>{item.harga_bersih.toLocaleString("id-ID")}</Text>
              <Text style={[styles.cell, styles.col6]}>
                {item.bonus === "-" ? "-" : item.bonus.toLocaleString("id-ID")}
              </Text>
              <Text style={[styles.cell, styles.col7]}>
                {item.pendapatan.toLocaleString("id-ID")}
              </Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, styles.col1]}>TOTAL</Text>
            <Text style={[styles.cell, styles.col2]}></Text>
            <Text style={[styles.cell, styles.col3]}></Text>
            <Text style={[styles.cell, styles.col4]}></Text>
            <Text style={[styles.cell, styles.col5]}>{totalHarga.toLocaleString("id-ID")}</Text>
            <Text style={[styles.cell, styles.col6]}>{totalBonus.toLocaleString("id-ID")}</Text>
            <Text style={[styles.cell, styles.col7]}>{totalPendapatan.toLocaleString("id-ID")}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LaporanTransaksiPenitipPDF;