import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import TopNavbarNonLogin from "../component/TopNavBarNonLogin";  // Mengimpor TopNavbarNonLogin

export default function KategoriBarangNonLoginPage() {
  const { kategori } = useParams();
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fungsi untuk mengambil data barang berdasarkan kategori
  const fetchBarang = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/barang/kategori/${encodeURIComponent(kategori)}`, {
        withCredentials: false,  // Menonaktifkan pengiriman cookies atau kredensial lainnya
      });
      setBarangList(res.data);
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchBarang(); // Panggil fungsi fetch barang ketika kategori berubah
  }, [kategori]);

  return (
    <>
      {/* Navbar untuk non-login */}
      <TopNavbarNonLogin />

      {/* Main content */}
      <Container className="mt-20">
        <h4 className="fw-bold mb-4">Kategori: {kategori}</h4>

        {/* Menampilkan Spinner saat loading */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : barangList.length === 0 ? (
          <div className="text-center text-muted">Tidak ada barang dalam kategori ini.</div>
        ) : (
          <Row className="g-3">
            {barangList.map((barang) => (
              <Col xs={12} sm={6} md={4} key={barang.id_barang}>
                <Card className="h-100 border-0 shadow-sm">
                  <div className="bg-gray-100 h-56 flex items-center justify-center">
                    <img
                      src={
                        barang.foto_barang?.[0]?.foto_barang
                          ? `http://localhost:8000/storage/${barang.foto_barang[0].foto_barang}`
                          : "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      alt={barang.nama_barang}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                    <Card.Text className="fw-bold text-danger">
                      Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/barang/${barang.id_barang}`)}
                    >
                      Lihat Detail
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
