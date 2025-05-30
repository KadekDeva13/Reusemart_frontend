import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  {
    label: "Elektronik & Gadget",
    icon: "https://cdn-icons-png.flaticon.com/512/1041/1041880.png",
  },
  {
    label: "Pakaian & Aksesori",
    icon: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  },
  {
    label: "Perabotan Rumah Tangga",
    icon: "https://cdn-icons-png.flaticon.com/512/2513/2513791.png",
  },
  {
    label: "Buku, Alat Tulis, & Peralatan Sekolah",
    icon: "https://cdn-icons-png.flaticon.com/512/3004/3004613.png",
  },
  {
    label: "Hobi, Mainan, & Koleksi",
    icon: "https://cdn-icons-png.flaticon.com/512/3370/3370102.png",
  },
  {
    label: "Perlengkapan Bayi & Anak",
    icon: "https://cdn-icons-png.flaticon.com/512/1642/1642702.png",
  },
  {
    label: "Otomotif & Aksesori",
    icon: "https://cdn-icons-png.flaticon.com/512/859/859270.png",
  },
  {
    label: "Perlengkapan Taman & Outdoor",
    icon: "https://cdn-icons-png.flaticon.com/512/2635/2635714.png",
  },
  {
    label: "Peralatan Kantor & Industri",
    icon: "https://cdn-icons-png.flaticon.com/512/4729/4729432.png",
  },
  {
    label: "Kosmetik & Perawatan Diri",
    icon: "https://cdn-icons-png.flaticon.com/512/2947/2947990.png",
  },
];

const HomePagePembeli = () => {
  const [barangList, setBarangList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/barang/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBarangList(res.data);
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
    }
  };

  return (
    <Container fluid className="mt-5">
      {/* Kategori Barang */}
      <section className="bg-white rounded shadow-sm p-3 mb-4">
        <h5 className="fw-bold mb-3">Kategori Barang</h5>
        <Row className="g-3">
          {categories.map((cat, idx) => (
            <Col xs={4} sm={3} md={2} key={idx} className="text-center">
              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/user/pembeli/kategori/${encodeURIComponent(cat.label)}`
                  )
                }
              >
                <div className="flex justify-center">
                  <img
                    src={cat.icon}
                    alt={cat.label}
                    className="mb-2"
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="small text-truncate">{cat.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Barang Rekomendasi */}
      <section className="bg-white rounded shadow-sm p-3">
        <h5 className="fw-bold mb-3">Barang Rekomendasi</h5>
        <Row className="g-3">
          {barangList.map((barang) => (
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
                  <div className="small text-muted mb-1">
                    {barang.kategori_barang}
                  </div>
                  <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                  <Card.Text className="fw-bold text-danger">
                    Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/user/pembeli/barang/${barang.id_barang}`)
                    }
                  >
                    Lihat Detail
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default HomePagePembeli;
