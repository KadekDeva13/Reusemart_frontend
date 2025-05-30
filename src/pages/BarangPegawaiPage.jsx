import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BarangPegawaiPage = () => {
  const [barangList, setBarangList] = useState([]);
  const [idJabatan, setIdJabatan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/barang/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBarangList(res.data.barang || []);
        setIdJabatan(res.data.id_jabatan);
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
      }
    };

    fetchBarang();
  }, []);

  const handleBukaDiskusi = async (id_barang) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/diskusi/baca/${id_barang}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/user/pegawai/diskusi/${id_barang}`);
    } catch (err) {
      console.error("Gagal menandai diskusi dibaca:", err);
    }
  };

  return (
    <Container className="mt-5">
      <h4 className="mb-4">Daftar Barang</h4>
      <Row className="g-4">
        {barangList.length > 0 ? (
          barangList.map((barang) => (
            <Col key={barang.id_barang} md={4}>
              <Card className="h-100 shadow-sm border-start border-3 border-black">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="d-flex justify-content-between align-items-start">
                      <span className="fw-bold">{barang.nama_barang}</span>
                      {barang.jumlah_chat_baru > 0 && (
                        <Badge bg="danger" pill>
                          {barang.jumlah_chat_baru} Chat Baru
                        </Badge>
                      )}
                    </Card.Title>

                    <div className="mb-2 text-muted small">
                      <div>
                        <strong>Kategori:</strong> {barang.kategori_barang}
                      </div>
                      <div>
                        <strong>Harga:</strong> Rp
                        {barang.harga_barang.toLocaleString("id-ID")}
                      </div>
                      <div className="mt-1">
                        <Badge bg="info" className="me-1">
                          {barang.status_barang}
                        </Badge>
                        <Badge bg="secondary">
                          Stock: {barang.stock}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <Button
                      variant={idJabatan === 3 ? "primary" : "outline-secondary"}
                      size="sm"
                      disabled={idJabatan !== 3}
                      onClick={() => handleBukaDiskusi(barang.id_barang)}
                    >
                      {idJabatan === 3 ? "💬 Buka Diskusi" : "Diskusi (khusus CS)"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-muted text-center">Tidak ada barang tersedia.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default BarangPegawaiPage;
