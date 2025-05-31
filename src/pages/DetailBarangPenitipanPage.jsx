import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import axios from "axios";

export default function DetailBarangPenitipanPage() {
  const { id } = useParams();
  const [penitipan, setPenitipan] = useState(null);
  const [barang, setBarang] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusTransaksi, setStatusTransaksi] = useState("");
  const [statusBarang, setStatusBarang] = useState("");
  const [konfirmasiLoading, setKonfirmasiLoading] = useState(false);
  const [perpanjangLoading, setPerpanjangLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/api/penitipan/show/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPenitipan(res.data.penitipan);
      setBarang(res.data.barang);
      setStatusTransaksi(res.data.status_transaksi || "tidak diketahui");
      setStatusBarang(res.data.status_barang || "tidak diketahui");
    } catch (error) {
      console.error("Gagal memuat detail penitipan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleKonfirmasiAmbil = async () => {
    if (!window.confirm("Yakin ingin mengambil barang ini?")) return;
    try {
      setKonfirmasiLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8000/api/transaksi/konfirmasi-ambil/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Barang berhasil dikonfirmasi telah diambil.");
      fetchDetail(); // refresh data
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal mengonfirmasi pengambilan barang."
      );
    } finally {
      setKonfirmasiLoading(false);
    }
  };

  const handlePerpanjang = async () => {
    if (!window.confirm("Yakin ingin memperpanjang masa penitipan 30 hari?")) return;

    try {
      setPerpanjangLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:8000/api/penitipan/perpanjang/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Perpanjangan berhasil.");
      fetchDetail(); // refresh data
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal memperpanjang masa penitipan."
      );
    } finally {
      setPerpanjangLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (!penitipan || !barang)
    return <div className="text-center mt-5">Data tidak ditemukan.</div>;

  const renderStatusBarang = () => {
    const text = statusBarang;
    if (text === "donasi")
      return <button className="btn btn-sm btn-info mt-2" disabled>Donasi</button>;
    if (text === "tersedia")
      return <button className="btn btn-sm btn-success mt-2" disabled>Tersedia</button>;
    if (text === "terjual" || text === "soldout")
      return <button className="btn btn-sm btn-danger mt-2" disabled>Terjual</button>;
    return null;
  };

  const renderStatusTransaksi = () => {
    const text = statusTransaksi === "pending" ? "sedang disiapkan" : statusTransaksi;
    if (text === "sedang disiapkan")
      return <button className="btn btn-sm btn-warning mt-2" disabled>📦 Sedang Disiapkan</button>;
    if (text === "dikirim")
      return <button className="btn btn-sm btn-primary mt-2" disabled>🚚 Dikirim</button>;
    if (text === "selesai")
      return <button className="btn btn-sm btn-success mt-2" disabled>✅ Selesai</button>;
    return null;
  };

  return (
    <Container className="my-4">
      <Row className="g-4 mt-5 px-3">
        {/* Gambar Barang */}
        <Col md={6}>
          <img
            src={
              barang.foto_barang?.[selectedImage]?.url_foto
                ? `http://localhost:8000/storage/foto_barang/${barang.foto_barang[selectedImage].url_foto}`
                : "https://via.placeholder.com/500x500?text=No+Image"
            }
            alt={barang.nama_barang}
            className="w-100 rounded border"
            style={{ objectFit: "cover", maxHeight: "500px" }}
          />

          <div className="d-flex gap-2 mt-3">
            {barang.foto_barang?.map((foto, i) => (
              <img
                key={i}
                src={`http://localhost:8000/storage/foto_barang/${foto.url_foto}`}
                alt={`Foto ${i + 1}`}
                onClick={() => setSelectedImage(i)}
                className={`border rounded ${i === selectedImage ? "border-success" : ""}`}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </Col>

        {/* Detail Barang dan Penitipan */}
        <Col md={6} className="mt-4 ps-3 pe-3">
          <h4>{barang.nama_barang}</h4>
          <h3 className="text-success mb-4">
            Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
          </h3>

          <div className="border rounded p-3 shadow-sm mb-4">
            <h6 className="fw-bold mb-3">Informasi Penitipan</h6>
            <p><strong>Kategori:</strong> {barang.kategori_barang}</p>
            <p><strong>Tanggal Masuk:</strong> {penitipan.tanggal_masuk}</p>
            <p><strong>Tanggal Akhir:</strong> {penitipan.tanggal_akhir}</p>
            <p><strong>Batas Pengambilan:</strong> {penitipan.batas_pengambilan}</p>
            <p><strong>Status Perpanjangan:</strong> {penitipan.status_perpanjangan}</p>

            {/* Tombol Perpanjang */}
            <div className="mt-2 mb-3">
              <Button
                variant="outline-primary"
                disabled={
                  perpanjangLoading ||
                  penitipan.status_perpanjangan.toLowerCase() !== "diperpanjang"
                }
                onClick={handlePerpanjang}
              >
                {perpanjangLoading ? "Memproses..." : "Perpanjang Penitipan 30 Hari"}
              </Button>
            </div>

            {/* Status Barang dan Transaksi */}
            <div className="d-flex gap-2 mb-2">
              {renderStatusBarang()}
              {renderStatusTransaksi()}
            </div>

            {/* Tombol Konfirmasi */}
            <div className="mt-3">
              <Button
                variant="outline-success"
                disabled={
                  konfirmasiLoading ||
                  !(statusTransaksi === "pending" || statusTransaksi === "sedang disiapkan")
                }
                onClick={handleKonfirmasiAmbil}
              >
                {konfirmasiLoading ? "Memproses..." : "Konfirmasi Barang Sudah Diambil"}
              </Button>
            </div>
          </div>

          <h6>Detail Barang</h6>
          <p>{barang.deskripsi || "Tidak ada deskripsi."}</p>
        </Col>
      </Row>
    </Container>
  );
}
