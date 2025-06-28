import React, { useEffect, useState } from "react";
import { Card, Table, Button, Badge, Spinner, Modal } from "react-bootstrap";
import API from "@/utils/api";

export default function DisiapkanTransaksiPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    fetchDisiapkanTransaksi();
  }, []);

  const fetchDisiapkanTransaksi = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/transaksi/valid", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransaksiList(res.data.data || []);
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal memuat data transaksi disiapkan.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBatalkan = (transaksi) => {
    setSelectedTransaksi(transaksi);
    setShowModal(true);
  };

  const konversiPoin = (totalRp) => Math.floor(totalRp / 10000);

  const totalPoinBaru = (total) => {
    const poinBaru = konversiPoin(total);
    return (selectedTransaksi?.poin_reward || 0) + poinBaru;
  };

  const handleKonfirmasiBatalkan = () => {
    setShowModal(false);
    alert("Pesanan dibatalkan dan poin telah dikonversi.");
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case "belum bayar":
        return "warning";
      case "sudah bayar":
        return "success";
      case "dibatalkan":
        return "danger";
      case "disiapkan":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="p-4" style={{ marginTop: "80px" }}>
      <h4 className="fw-bold mb-4">Transaksi Disiapkan</h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card className="p-4 shadow-sm">
          <h5 className="fw-bold mb-3">Daftar Transaksi</h5>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transaksiList.length > 0 ? (
                transaksiList.map((item) => (
                  <tr key={item.id_transaksi}>
                    <td>{item.id_transaksi}</td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at.replace(" ", "T")).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>Rp{parseInt(item.total_pembayaran).toLocaleString()}</td>
                    <td>
                      <Badge bg={getBadgeVariant(item.status_transaksi)}>
                        {item.status_transaksi}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleBatalkan(item)}
                      >
                        Batalkan Pesanan
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Tidak ada transaksi disiapkan
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Pembatalan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaksi && (
            <>
              <p>
                Apakah Anda yakin ingin membatalkan transaksi sebesar{" "}
                <strong>
                  Rp{parseInt(selectedTransaksi.total_pembayaran).toLocaleString()}
                </strong>
                ?
              </p>
              <p>
                Transaksi ini akan dikonversi menjadi poin sebanyak{" "}
                <strong>{konversiPoin(selectedTransaksi.total_pembayaran)} poin</strong>.
              </p>
              <p>
                Total poin Anda setelah konversi:{" "}
                <strong>{totalPoinBaru(selectedTransaksi.total_pembayaran)} poin</strong>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleKonfirmasiBatalkan}>
            Ya, Batalkan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
