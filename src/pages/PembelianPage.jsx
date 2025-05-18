import React, { useState, useEffect } from "react";
import { Card, Nav, Table, Badge, Spinner, Button, Modal } from "react-bootstrap";
import axios from "axios";

export default function PembelianPage() {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [pembelianList, setPembelianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    axios.get("/api/transaksi")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setPembelianList(data);
      })
      .catch(() => setPembelianList([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredPembelian = activeFilter === "semua"
    ? pembelianList
    : pembelianList.filter(item => item.status === activeFilter);

  const statusBadge = (status) => {
    switch (status) {
      case "belum bayar": return <Badge bg="warning" text="dark">Belum Bayar</Badge>;
      case "dibayar": return <Badge bg="info">Dibayar</Badge>;
      case "dikirim": return <Badge bg="success">Dikirim</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleShowDetail = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="p-4" style={{ marginTop: "80px" }}>
      <h4 className="fw-bold mb-4">Pembelian</h4>

      <Nav variant="tabs" activeKey={activeFilter} onSelect={setActiveFilter}>
        <Nav.Item><Nav.Link eventKey="semua">Semua</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="belum bayar">Belum Bayar</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dibayar">Dibayar</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="dikirim">Dikirim</Nav.Link></Nav.Item>
      </Nav>

      <Card className="p-3 shadow-sm mt-3">
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPembelian.length > 0 ? (
                filteredPembelian.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.tanggal}</td>
                    <td>Rp{parseInt(item.total).toLocaleString()}</td>
                    <td>{statusBadge(item.status)}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" onClick={() => handleShowDetail(item)}>
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center text-muted">Tidak ada data transaksi</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detail Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem ? (
            <div>
              <p><strong>ID:</strong> {selectedItem.id}</p>
              <p><strong>Tanggal:</strong> {selectedItem.tanggal}</p>
              <p><strong>Total:</strong> Rp{parseInt(selectedItem.total).toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              {/* Tambahkan detail tambahan di sini jika tersedia */}
            </div>
          ) : <p>Memuat detail...</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Tutup</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
