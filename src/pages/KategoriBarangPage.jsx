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
    <Container className="mt-4" style={{ paddingTop: "100px" }}>
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
        <Row className="g-4">
          {barangList.map((barang) => (
            <Col xs={12} sm={6} md={4} lg={3} key={barang.id_barang}>
              <Card className="relative h-full border-0 shadow-sm rounded overflow-hidden hover:shadow-md transition">
                {/* Gambar */}
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

                {/* Seluruh card bisa diklik */}
                <div
                  onClick={() => navigate(`/barang/${barang.id_barang}`)}
                  className="absolute inset-0 z-10 cursor-pointer"
                ></div>

                <Card.Body className="relative z-20 d-flex flex-column justify-between p-3">
                  <div>
                    <div className="text-xs text-gray-500">{barang.kategori_barang}</div>
                    <Card.Title className="text-sm font-semibold text-gray-800 mb-1">
                      {barang.nama_barang}
                    </Card.Title>
                    <Card.Text className="text-base font-bold text-red-600 mb-2">
                      {barang.harga_barang
                        ? `Rp${parseInt(barang.harga_barang).toLocaleString("id-ID")}`
                        : "Harga Tidak Tersedia"}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>

            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}