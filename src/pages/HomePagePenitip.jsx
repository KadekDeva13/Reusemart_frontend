import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

const categories = [
  { label: "Elektronik & Gadget", icon: "https://cdn-icons-png.flaticon.com/512/1041/1041880.png" },
  { label: "Pakaian & Aksesori", icon: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
  { label: "Perabotan Rumah Tangga", icon: "https://cdn-icons-png.flaticon.com/512/2513/2513791.png" },
  { label: "Buku, Alat Tulis, & Peralatan Sekolah", icon: "https://cdn-icons-png.flaticon.com/512/3004/3004613.png" },
  { label: "Hobi, Mainan, & Koleksi", icon: "https://cdn-icons-png.flaticon.com/512/3370/3370102.png" },
  { label: "Perlengkapan Bayi & Anak", icon: "https://cdn-icons-png.flaticon.com/512/1642/1642702.png" },
  { label: "Otomotif & Aksesori", icon: "https://cdn-icons-png.flaticon.com/512/859/859270.png" },
  { label: "Perlengkapan Taman & Outdoor", icon: "https://cdn-icons-png.flaticon.com/512/2635/2635714.png" },
  { label: "Peralatan Kantor & Industri", icon: "https://cdn-icons-png.flaticon.com/512/4729/4729432.png" },
  { label: "Kosmetik & Perawatan Diri", icon: "https://cdn-icons-png.flaticon.com/512/2947/2947990.png" },
];

const HomePagePenitip = () => {
  const [barangList, setBarangList] = useState([]);
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext(); // ✅ ambil dari layout

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("Token tidak ditemukan di localStorage");
        return;
      }

      const res = await axios.get("http://localhost:8000/api/penitipan/barang", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Barang penitipan:", res.data);

      const barangData = res.data.map((penitipan) => ({
        ...penitipan.barang,
      }));

      setBarangList(barangData);
    } catch (error) {
      console.error("Gagal mengambil data barang penitip:", error.response?.data || error.message);
    }
  };

  // ✅ Filter berdasarkan searchQuery (jika ada)
  const filteredList = searchQuery
    ? barangList.filter((barang) =>
        barang.nama_barang.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : barangList;

  return (
    <Container fluid className="mt-5">
      {/* Kategori Barang */}
      <section className="bg-white rounded shadow-sm p-3 mb-4">
        <h5 className="fw-bold mb-3">Kategori Barang Anda</h5>
        <Row className="g-3">
          {categories.map((cat, idx) => (
            <Col xs={4} sm={3} md={2} key={idx} className="text-center">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`kategori/${encodeURIComponent(cat.label)}`)}
              >
                <img
                  src={cat.icon}
                  alt={cat.label}
                  className="mb-2"
                  style={{ width: "48px", height: "48px", objectFit: "contain" }}
                />
                <div className="small text-truncate">{cat.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Barang Titipan */}
      <section className="bg-white rounded shadow-sm p-3">
        <h5 className="fw-bold mb-3">Barang yang Anda Titipkan</h5>
        <Row className="g-3">
          {filteredList.length > 0 ? (
            filteredList.map((barang) => (
              <Col xs={12} sm={6} md={4} key={barang.id_barang}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      barang.foto_barang?.[0]?.url_foto
                        ? `http://localhost:8000/storage/foto_barang/${barang.foto_barang[0].url_foto}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={barang.nama_barang}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <div className="small text-muted mb-1">{barang.kategori_barang}</div>
                    <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                    <Card.Text className="fw-bold text-success">
                      Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
                    </Card.Text>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => navigate(`/penitip/barang/${barang.id_barang}`)}
                    >
                      Lihat Detail
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-muted">Tidak ada barang yang ditampilkan.</p>
          )}
        </Row>
      </section>
    </Container>
  );
};

export default HomePagePenitip;
