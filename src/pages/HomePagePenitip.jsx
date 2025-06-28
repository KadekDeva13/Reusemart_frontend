import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import API from "@/utils/api";

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

const HomePagePenitip = () => {
  const [barangList, setBarangList] = useState([]);
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext();

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await API.get("/api/penitipan/barang", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allBarang = [];

    res.data.forEach((penitipan) => {
      penitipan.detailpenitipan?.forEach((detail) => {
        if (detail.barang) {
          allBarang.push({
            ...detail.barang,
            id_penitipan: penitipan.id_penitipan,
          });
        }
      });
    });

    setBarangList(allBarang);
  } catch (error) {
    console.error("Gagal mengambil data barang penitip:", error.response?.data || error.message);
  }
};

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
                onClick={() =>
                  navigate(
                    `/user/penitip/kategori/${encodeURIComponent(cat.label)}`
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

      {/* Barang Titipan */}
      <section className="bg-white rounded shadow-sm p-3">
        <h5 className="fw-bold mb-3">Barang yang Anda Titipkan</h5>
        <Row className="g-3">
          {filteredList.length > 0 ? (
            filteredList.map((barang) => (
              <Col xs={12} sm={6} md={4} key={barang.id_barang}>
                <Card className="h-100 border-0 shadow-sm">
                  {/* Gambar */}
                  <div className="bg-gray-100 h-56 flex items-center justify-center">
                    <img
                      src={
                        barang.foto_barang?.[0]?.foto_barang
                          ? `${API.defaults.baseURL}/storage/${barang.foto_barang[0].foto_barang}`
                          : "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      alt={barang.nama_barang}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div
                    onClick={() => navigate(`/user/penitip/penitipan/show/${barang.id_penitipan}`)}
                    className="absolute inset-0 z-10 cursor-pointer"
                  ></div>
                  <Card.Body className="relative z-20 d-flex flex-column justify-between p-3">
                    <div>
                      <div className="text-xs text-gray-500">{barang.kategori_barang}</div>
                      <Card.Title className="text-sm font-semibold text-gray-800 mb-1">
                        {barang.nama_barang}
                      </Card.Title>
                      <Card.Text className="text-base font-bold text-green-600 mb-2">
                        {barang.harga_barang
                          ? `Rp${parseInt(barang.harga_barang).toLocaleString("id-ID")}`
                          : "Harga Tidak Tersedia"}
                      </Card.Text>
                    </div>
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
