import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";

export default function KategoriPenitipPage() {
    const { kategori } = useParams();
    const [barangList, setBarangList] = useState([]);
    const navigate = useNavigate();

    const fetchBarangByKategori = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8000/api/penitipan/barang/kategori/${encodeURIComponent(kategori)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Response kategori:", res.data);

            const barangData = res.data.map((penitipan) => ({
                ...penitipan.barang,
                id_penitipan: penitipan.id_penitipan, // ✅ tambahkan ini
            }));


            setBarangList(barangData);
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
                {barangList.map((barang) => (
                    <Col xs={12} sm={6} md={4} key={barang.id_barang} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Img
                                variant="top"
                                src={
                                    barang.foto_barang?.[0]?.url_foto
                                        ? `http://localhost:8000/storage/foto_barang/${barang.foto_barang[0].url_foto}`
                                        : "https://via.placeholder.com/300x200?text=No+Image"
                                }
                                style={{ height: "180px", objectFit: "cover" }}
                            />
                            <Card.Body className="pt-2 pb-3 px-3">
                                <div className="small text-muted mb-1">{barang.kategori_barang}</div>
                                <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                                <Card.Text className="fw-bold text-success">
                                    Rp{parseInt(barang.harga_barang).toLocaleString("id-ID")}
                                </Card.Text>
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => navigate(`/user/penitip/penitipan/show/${barang.id_penitipan}`)}

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
