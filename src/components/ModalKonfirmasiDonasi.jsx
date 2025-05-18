import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function ModalKonfirmasiDonasi({ show, handleClose, barang, request, onKirim }) {
  const [tanggalDonasi, setTanggalDonasi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tanggalDonasi) {
      alert("Silakan isi tanggal donasi.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/donasi/kirim/${request.id_donasi}`,
        {
          id_barang: barang.id_barang,
          tanggal_donasi: tanggalDonasi,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      onKirim({ barang, request, tanggal: tanggalDonasi }); // update parent
    } catch (err) {
      console.error("Gagal mengirim donasi", err);
      alert("Terjadi kesalahan saat mengirim donasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi Donasi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Organisasi:</strong> {request.organisasi?.nama_organisasi}</p>
        <p><strong>Pesan:</strong> {request.pesan_request || "-"}</p>
        <p><strong>Barang:</strong> {barang.nama_barang}</p>

        <Form.Group className="mt-3">
          <Form.Label>Tanggal Donasi</Form.Label>
          <Form.Control
            type="date"
            value={tanggalDonasi}
            onChange={(e) => setTanggalDonasi(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Donasi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalKonfirmasiDonasi;
