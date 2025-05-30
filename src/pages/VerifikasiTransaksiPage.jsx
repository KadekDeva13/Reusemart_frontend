import React, { useEffect, useState } from "react";
import { Table, Card, Button, Alert } from "react-bootstrap";
import axios from "axios";

export default function VerifikasiTransaksiPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    fetchTransaksiDibayar();
  }, []);

  const fetchTransaksiDibayar = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8000/api/transaksi/dibayar",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransaksiList(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil transaksi:", err);
      setTransaksiList([]);
    }
  };

  const handleTolak = async (id) => {
    if (!window.confirm("Yakin ingin menolak transaksi ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/transaksi/tolak/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlert({
        show: true,
        message: "Transaksi berhasil ditolak.",
        variant: "warning",
      });
      fetchTransaksiDibayar();
    } catch (err) {
      console.error("Penolakan gagal:", err);
      setAlert({
        show: true,
        message: "Gagal menolak transaksi.",
        variant: "danger",
      });
    }
  };

  const handleVerifikasi = async (id) => {
    if (!window.confirm("Yakin ingin verifikasi transaksi ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/transaksi/verifikasi/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlert({
        show: true,
        message: "Transaksi berhasil diverifikasi.",
        variant: "success",
      });
      fetchTransaksiDibayar();
    } catch (err) {
      console.error("Verifikasi gagal:", err);
      setAlert({
        show: true,
        message: "Gagal memverifikasi transaksi.",
        variant: "danger",
      });
    }
  };

  return (
    <div className="p-4">
      <h4 className="fw-bold mb-3">Verifikasi Transaksi Dibayar</h4>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari ID transaksi atau status..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <Card className="p-3 shadow-sm">
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Total</th>
              <th>Bukti Bayar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transaksiList
              .filter(
                (trx) =>
                  trx.status_transaksi
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  trx.id_transaksi?.toString().includes(searchQuery)
              )
              .map((trx) => (
                <tr key={trx.id_transaksi}>
                  <td>{trx.id_transaksi}</td>
                  <td>{new Date(trx.created_at).toLocaleDateString()}</td>
                  <td>{trx.status_transaksi}</td>
                  <td>Rp{parseInt(trx.total_pembayaran).toLocaleString()}</td>
                  <td>
                    {trx.bukti_pembayaran ? (
                      <img
                        src={`http://localhost:8000/storage/bukti_bayar/${trx.bukti_pembayaran}`}
                        alt="Bukti Bayar"
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleVerifikasi(trx.id_transaksi)}
                      >
                        Verifikasi
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleTolak(trx.id_transaksi)}
                      >
                        Tolak
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {transaksiList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Tidak ada transaksi dibayar
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
