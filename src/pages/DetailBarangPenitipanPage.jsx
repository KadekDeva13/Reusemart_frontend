import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";

export default function DetailBarangPenitipanPage() {
  const { id } = useParams();
  const [penitipan, setPenitipan] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/penitipan/show/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPenitipan(res.data.penitipan);
      } catch (error) {
        console.error("Gagal memuat detail penitipan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!penitipan || !penitipan.barang) return <div className="text-center mt-5">Data tidak ditemukan.</div>;

  const barang = penitipan.barang;

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
                style={{ width: "60px", height: "60px", objectFit: "cover", cursor: "pointer" }}
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
          </div>

          <h6>Detail Barang</h6>
          <p>{barang.deskripsi || "Tidak ada deskripsi."}</p>
        </Col>
      </Row>
    </Container>
  );
}
