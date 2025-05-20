import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function ModalKonfirmasiDonasi({
  show,
  handleClose,
  barang,
  request,
  mode = "kirim",
  onKirim,
  onUpdateTanggal,
}) {
  const [tanggalDonasi, setTanggalDonasi] = useState(request?.tanggal_donasi || "");
  const [namaPenerima, setNamaPenerima] = useState(request?.nama_penerima || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tanggalDonasi || !namaPenerima) {
      alert("Tanggal dan Nama Penerima harus diisi.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (mode === "kirim") {
        await axios.post(
          `http://localhost:8000/api/donasi/kirim/${request.id_donasi}`,
          {
            id_barang: barang.id_barang,
            tanggal_donasi: tanggalDonasi,
            nama_penerima: namaPenerima,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onKirim?.({ barang, request, tanggal: tanggalDonasi, nama_penerima: namaPenerima });

      } else if (mode === "update") {
        await axios.put(
          `http://localhost:8000/api/donasi/update-donasi/${request.id_donasi}`,
          {
            tanggal_donasi: tanggalDonasi,
            nama_penerima: namaPenerima,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        onUpdateTanggal?.({
          id_donasi: request.id_donasi,
          tanggal_donasi: tanggalDonasi,
          nama_penerima: namaPenerima,
        });
      }

      handleClose();
    } catch (err) {
      console.error("Gagal memproses donasi", err);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "update" ? "Update Donasi" : "Konfirmasi Donasi"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Organisasi:</strong> {request.organisasi?.nama_organisasi}</p>
        <p><strong>Pesan:</strong> {request.pesan_request || "-"}</p>
        {mode === "kirim" && (
          <p><strong>Barang:</strong> {barang.nama_barang}</p>
        )}

        <Form.Group className="mt-3">
          <Form.Label>Nama Penerima</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan nama penerima"
            value={namaPenerima}
            onChange={(e) => setNamaPenerima(e.target.value)}
          />
        </Form.Group>

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
          {loading
            ? mode === "update" ? "Menyimpan..." : "Mengirim..."
            : mode === "update" ? "Simpan Donasi" : "Kirim Donasi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalKonfirmasiDonasi;
