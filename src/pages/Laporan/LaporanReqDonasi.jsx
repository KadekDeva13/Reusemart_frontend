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
  col1: { width: "15%" },
  col2: { width: "25%" },
  col3: { width: "30%" },
  col4: { width: "30%" },
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

const LaporanRequestDonasiPDF = ({ data = [], tanggalCetak = new Date().toISOString() }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>ReUse Mart</Text>
        <Text>Jl. Green Eco Park No. 456 Yogyakarta</Text>
        <Text style={styles.title}>LAPORAN REQUEST DONASI</Text>
        <Text style={styles.subtitle}>Tanggal cetak: {formatTanggalCetak(tanggalCetak)}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.cell, styles.col1]}>ID Organisasi</Text>
          <Text style={[styles.cell, styles.col2]}>Nama</Text>
          <Text style={[styles.cell, styles.col3]}>Alamat</Text>
          <Text style={[styles.cell, styles.col4]}>Request</Text>
        </View>

        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cell, styles.col1]}>ORG{item.organisasi?.id_organisasi}</Text>
            <Text style={[styles.cell, styles.col2]}>{item.organisasi?.nama_organisasi}</Text>
            <Text style={[styles.cell, styles.col3]}>{item.organisasi?.alamat}</Text>
            <Text style={[styles.cell, styles.col4]}>{item.pesan_request || '-'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default LaporanRequestDonasiPDF;