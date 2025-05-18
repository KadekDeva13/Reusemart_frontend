import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";

export default function KategoriBarangPage() {
  const { kategori } = useParams();
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/barang/kategori/${encodeURIComponent(
          kategori
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBarangList(res.data);
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, [kategori]);

  return (
    <Container className="mt-4">
      <h4 className="fw-bold mb-4">Kategori: {kategori}</h4>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : barangList.length === 0 ? (
        <div className="text-center text-muted">
          Tidak ada barang dalam kategori ini.
        </div>
      ) : (
        <Row className="g-3">
          {barangList.map((barang) => (
            <Col xs={12} sm={6} md={4} key={barang.id_barang}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src={
                    barang.foto_barang?.[0]?.url_foto ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={barang.nama_barang}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                  <Card.Text className="fw-bold text-danger">
                    Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/user/pembeli/barang/${barang.id_barang}`)}
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
  );
}