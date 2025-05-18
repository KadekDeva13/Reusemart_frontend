import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
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
          headers: { Authorization: `Bearer ${token}` }
        });

        setBarangList(res.data.barang);
        setIdJabatan(res.data.id_jabatan); // ambil dari key yang sesuai backend
      } catch (error) {
        console.error("Gagal mengambil data barang:", error);
      }
    };

    fetchBarang();
  }, []);

  return (
    <Container className="mt-5">
      <h4 className="mb-4">Semua Barang</h4>
      <Row className="g-3">
        {barangList.map((barang) => (
          <Col key={barang.id_barang} md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{barang.nama_barang}</Card.Title>
                <Card.Text>Kategori: {barang.kategori_barang}</Card.Text>
                <Card.Text>
                  Harga: Rp{barang.harga_barang.toLocaleString("id-ID")}
                </Card.Text>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={idJabatan !== 3}
                  onClick={() =>
                    navigate(`/user/pegawai/diskusi/${barang.id_barang}`)
                  }
                >
                  {idJabatan === 3 ? "Buka Diskusi" : "Diskusi (khusus CS)"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BarangPegawaiPage;
