import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchBarangPage() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("q") || "";
    const [barangList, setBarangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!keyword.trim()) return;

        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/barang/search");
                const filtered = res.data.filter((barang) =>
                    barang.nama_barang.toLowerCase().startsWith(keyword.toLowerCase())
                );
                setBarangList(filtered);
            } catch (err) {
                console.error("Gagal mengambil data barang:", err);
                setBarangList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [keyword]);

    return (
        <Container fluid className="mt-5 pt-4">
            <h5 className="fw-bold mb-4">
                Hasil pencarian untuk: <span className="text-primary">"{keyword}"</span>
            </h5>

            {loading ? (
                <p>Loading...</p>
            ) : barangList.length === 0 ? (
                <p>Tidak ada barang yang cocok.</p>
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

                                {/* Klik seluruh card */}
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
