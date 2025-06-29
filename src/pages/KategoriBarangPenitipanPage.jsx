import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import API from "@/utils/api";

export default function KategoriPenitipPage() {
  const { kategori } = useParams();
  const [barangList, setBarangList] = useState([]);
  const navigate = useNavigate();

  const fetchBarangByKategori = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        `/api/penitipan/barang/kategori/${encodeURIComponent(kategori)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response kategori:", res.data);

      const data = [];

      res.data.forEach((penitipan) => {
        penitipan.detailpenitipan.forEach((detail) => {
          if (detail.barang) {
            data.push({
              ...detail.barang,
              id_penitipan: penitipan.id_penitipan,
            });
          }
        });
      });

      setBarangList(data);
    } catch (error) {
      console.error("Gagal mengambil barang kategori:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchBarangByKategori();
  }, [kategori]);

  return (
    <Container className="mt-4">
      <section className="pt-5">
        <h4 className="fw-bold mb-3">Kategori: {kategori}</h4>
      </section>
      <Row className="g-3">
        {barangList.map((barang, index) => (
          <Col xs={12} sm={6} md={4} key={`${barang.id_barang}-${index}`}>
            <Card className="h-100 border-0 shadow-sm">
              <div className="bg-gray-100 h-56 flex items-center justify-center">
                <img
                  src={
                    barang.foto_barang?.[0]?.foto_barang
                      ? `${API.defaults.baseURL}/storage/${barang.foto_barang[0].foto_barang}`
                      : "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                  alt={barang.nama_barang}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <Card.Body>
                <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                <Card.Text className="fw-bold text-danger">
                  {barang.harga_barang != null
                    ? `Rp${parseInt(barang.harga_barang).toLocaleString("id-ID")}`
                    : "Rp0"}
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
    </Container>
  );
}
