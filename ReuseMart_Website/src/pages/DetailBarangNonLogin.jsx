import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { MessageCircle, Heart, Share2 } from "lucide-react";
import TopNavbarNonLogin from "../component/TopNavBarNonLogin"; // Mengimpor TopNavbarNonLogin

export default function DetailBarangNonLoginPage() {
  const { id } = useParams(); // Mendapatkan id barang dari parameter URL
  const navigate = useNavigate();
  const [barang, setBarang] = useState(null); // Menyimpan data barang
  const [loading, setLoading] = useState(true); // Menyimpan status loading
  const [selectedImage, setSelectedImage] = useState(0); // Menyimpan gambar yang dipilih

  // Fungsi untuk mengambil data barang berdasarkan id
  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/non/${id}`);
        setBarang(res.data); // Menyimpan data barang
      } catch (error) {
        console.error("Gagal memuat detail barang:", error);
      } finally {
        setLoading(false); // Mengubah status loading menjadi false setelah data selesai diambil
      }
    };

    fetchBarang(); // Memanggil fungsi fetchBarang ketika id berubah
  }, [id]);

  const handleChatClick = () => {
    // Navigasi ke halaman chat dengan id barang
    navigate(`/user/nonlogin/diskusi/${barang.id_barang}`);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  if (!barang) return <div className="text-center mt-5">Barang tidak ditemukan.</div>;

  return (
    <>
      {/* Navbar untuk non-login */}
      <TopNavbarNonLogin /> 

      {/* Main content */}
      <Container className="my-4">
        <Row className="g-4">
          {/* Kolom Kiri: Gambar */}
          <Col md={6}>
            <img
              src={
                barang.fotoBarang?.[selectedImage]?.url_foto
                  ? `http://localhost:8000/storage/foto_barang/${barang.fotoBarang[selectedImage].url_foto}`
                  : "https://via.placeholder.com/500x500?text=No+Image"
              }
              alt={barang.nama_barang}
              className="w-100 rounded border"
              style={{ objectFit: "cover", maxHeight: "500px" }}
            />

            <div className="d-flex gap-2 mt-3">
              {barang.fotoBarang?.map((foto, i) => (
                <img
                  key={i}
                  src={`http://localhost:8000/storage/foto_barang/${foto.url_foto}`}
                  alt={`Foto ${i + 1}`}
                  onClick={() => setSelectedImage(i)}
                  className={`border rounded ${i === selectedImage ? "border-primary" : ""}`}
                  style={{ width: "60px", height: "60px", objectFit: "cover", cursor: "pointer" }}
                />
              ))}
            </div>
          </Col>

          {/* Kolom Kanan: Detail dan Aksi */}
          <Col md={6}>
            <h4>{barang.nama_barang}</h4>
            <h3 className="text-danger mb-4">Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}</h3>

            {/* Card Aksi Pembelian */}
            <div className="border rounded p-3 shadow-sm mb-4">
              <div className="fw-semibold mb-2">Atur jumlah dan catatan</div>

              <div className="d-flex align-items-center mb-3">
                <Button variant="outline-secondary" size="sm" disabled>-</Button>
                <span className="mx-3">1</span>
                <Button variant="outline-secondary" size="sm" disabled>+</Button>
                <span className="ms-3 text-warning fw-semibold">
                  Stok Total: Sisa {barang.stock}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold fs-5 text-dark">
                  Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
                </span>
              </div>

              <Button className="w-100 mb-2" variant="success">+ Keranjang</Button>
              <div className="d-flex justify-content-between px-3 text-muted fs-6">
                <div
                  className="d-flex align-items-center gap-1"
                  style={{ cursor: "pointer" }}
                  onClick={handleChatClick}
                >
                  <MessageCircle size={16} /> Chat
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Heart size={16} /> Wishlist
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Share2 size={16} /> Share
                </div>
              </div>
            </div>

            {/* Detail Tambahan */}
            <h6>Detail Barang</h6>
            <p><strong>Kategori:</strong> {barang.kategori_barang}</p>
            {barang.tanggal_garansi && (
              <p><strong>Garansi:</strong> {barang.tanggal_garansi}</p>
            )}
            <p>{barang.deskripsi}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
