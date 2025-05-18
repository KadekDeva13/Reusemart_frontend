import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import axios from "axios";

const wilayahDIY = {
  Gedongtengen: ["Sosromenduran", "Pringgokusuman"],
  Jetis: ["Cokrodiningratan", "Gowongan"],
  Danurejan: ["Tegalpanggung", "Suryatmajan", "Bausasran"],
  Ngampilan: ["Ngampilan", "Notoprajan"],
  Wirobrajan: ["Pakuncen", "Patangpuluhan", "Wirobrajan"],
  Mantrijeron: ["Mantrijeron", "Suryodiningratan", "Keparakan"],
  Kraton: ["Patehan", "Panembahan", "Kadipaten"],
  Gondomanan: ["Ngupasan", "Prawirodirjan"],
  Pakualaman: ["Gunungketur", "Purwokinanti"],
  Umbulharjo: [
    "Muja Muju",
    "Pandeyan",
    "Semaki",
    "Sorosutan",
    "Tahunan",
    "Warungboto",
  ],
  Kotagede: ["Rejowinangun", "Prenggan", "Jagalan"],
  Depok: ["Caturtunggal", "Condongcatur", "Maguwoharjo"],
  Banguntapan: ["Baturetno", "Jambidan", "Tamanan"],
  Sewon: ["Bangunharjo", "Panggungharjo", "Pendowoharjo"],
  Kasihan: ["Bangunjiwo", "Ngestiharjo", "Tamantirto", "Tirtonirmolo"],
};

export default function AlamatPage() {
  const [alamatList, setAlamatList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    kecamatan: "",
    kelurahan: "",
    detail_alamat: "",
    kode_pos: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAlamat();
  }, []);

  const fetchAlamat = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/alamat/show/user",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAlamatList(Array.isArray(res.data) ? res.data : res.data.data ?? []);
    } catch {
      setAlamatList([]);
    }
  };

  const aturSebagaiUtama = (id) => {
    setAlamatList((prev) =>
      prev.map((alamat) => ({
        ...alamat,
        utama: alamat.id_alamat === id,
      }))
    );
  };

  const handleHapus = async (id) => {
    if (window.confirm("Yakin ingin menghapus alamat ini?")) {
      try {
        await axios.delete(`http://localhost:8000/api/alamat/destroy/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchAlamat();
      } catch (err) {
        console.error("Gagal hapus", err);
      }
    }
  };

  const handleUbah = (id) => {
    const alamat = alamatList.find((a) => a.id_alamat === id);
    if (!alamat) return;
    setFormData({
      kecamatan: alamat.kecamatan,
      kelurahan: alamat.kelurahan,
      detail_alamat: alamat.detail_alamat,
      kode_pos: alamat.kode_pos,
    });
    setEditId(id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleTambah = () => {
    setFormData({
      kecamatan: "",
      kelurahan: "",
      detail_alamat: "",
      kode_pos: "",
    });
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      kecamatan: "",
      kelurahan: "",
      detail_alamat: "",
      kode_pos: "",
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "kecamatan" ? { kelurahan: "" } : {}),
    }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editMode && editId) {
        await axios.put(
          `http://localhost:8000/api/alamat/update/${editId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:8000/api/alamat/store", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchAlamat();
      handleClose();
    } catch (err) {
      console.error("Gagal simpan alamat", err);
      console.log(err.response?.data); 
    }
  };

  return (
    <div className="p-4" style={{ marginTop: "80px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">Alamat Saya</h4>
        <Button variant="success" size="sm" onClick={handleTambah}>
          + Tambah Alamat
        </Button>
      </div>

      {alamatList.map((alamat) => (
        <Card className="mb-3 shadow-sm" key={alamat.id_alamat}>
          <Card.Body>
            <Row className="justify-content-between align-items-center">
              <Col md={8}>
                <div className="fw-bold d-flex align-items-center gap-2">
                  {alamat.detail_alamat}
                  {alamat.utama && (
                    <Badge bg="danger" className="text-uppercase">
                      Utama
                    </Badge>
                  )}
                </div>
                <div className="text-muted small">
                  {alamat.kelurahan}, {alamat.kecamatan}, DIY Yogyakarta,{" "}
                  {alamat.kode_pos}
                </div>
              </Col>
              <Col md="auto" className="text-end">
                <div className="mb-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 me-2"
                    onClick={() => handleUbah(alamat.id_alamat)}
                  >
                    Ubah
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0"
                    onClick={() => handleHapus(alamat.id_alamat)}
                  >
                    Hapus
                  </Button>
                </div>
                {!alamat.utama && (
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => aturSebagaiUtama(alamat.id_alamat)}
                  >
                    Atur sebagai utama
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Ubah Alamat" : "Tambah Alamat"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleModalSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Provinsi</Form.Label>
              <Form.Control value="DIY Yogyakarta" readOnly disabled />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Kecamatan</Form.Label>
              <Form.Select
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleModalChange}
                required
              >
                <option value="">-- Pilih Kecamatan --</option>
                {Object.keys(wilayahDIY).map((kec) => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Kelurahan</Form.Label>
              <Form.Select
                name="kelurahan"
                value={formData.kelurahan}
                onChange={handleModalChange}
                required
                disabled={!formData.kecamatan}
              >
                <option value="">-- Pilih Kelurahan --</option>
                {(wilayahDIY[formData.kecamatan] || []).map((kel) => (
                  <option key={kel} value={kel}>
                    {kel}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Kode Pos</Form.Label>
              <Form.Control
                name="kode_pos"
                value={formData.kode_pos}
                onChange={handleModalChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Detail Alamat</Form.Label>
              <Form.Control
                name="detail_alamat"
                value={formData.detail_alamat}
                onChange={handleModalChange}
                required
                as="textarea"
                rows={3}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose}
              >
                Batal
              </Button>
              <Button variant="success" type="submit">
                {editMode ? "Simpan Perubahan" : "Tambah Alamat"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
