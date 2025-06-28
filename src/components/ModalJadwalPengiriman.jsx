import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import API from "@/utils/api";

export default function ModalJadwalPengiriman({ show, onHide, transaksi, onSuccess }) {
  const [kurirList, setKurirList] = useState([]);
  const [idPegawai, setIdPegawai] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });

  useEffect(() => {
    if (show) {
      setAlert({ show: false, message: "" });
      setIdPegawai("");
      fetchKurir();
    }
  }, [show]);

  const fetchKurir = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/pegawai/kurir", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKurirList(res.data.kurir || []);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAlert({ show: true, message: "Gagal memuat daftar kurir.", variant: "danger" });
    }
  };

  const handleSubmit = async () => {
    if (!idPegawai) {
      setAlert({ show: true, message: "Pilih kurir terlebih dahulu.", variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/api/gudang/transaksi/jadwalkan-kurir/${transaksi.id_transaksi}`,
        { id_pegawai: idPegawai },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onHide();
    } catch (error) {
      const msg = error.response?.data?.message || "Terjadi kesalahan.";
      setAlert({ show: true, message: msg, variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Jadwalkan Pengiriman Kurir</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Pilih Kurir</Form.Label>
          <Form.Select value={idPegawai} onChange={(e) => setIdPegawai(e.target.value)}>
            <option value="">-- Pilih Kurir --</option>
            {kurirList.map((k) => (
              <option key={k.id_pegawai} value={k.id_pegawai}>
                {k.nama_lengkap}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Batal</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Jadwalkan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}