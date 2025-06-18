import React, { useState, useEffect } from "react";
import { Tab, Nav, Card, Form, Button, Row, Col, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

export default function RequestDonasiPage() {
  const [donasiList, setDonasiList] = useState([]);
  const [organisasiList, setOrganisasiList] = useState([]);
  const [formData, setFormData] = useState({
    nama_barang: "",
    kategori_barang: "",
    pesan_request: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchDonasi();
    fetchOrganisasi();
  }, []);

  const fetchDonasi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8000/api/donasi", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDonasiList(res.data);
  };

  const fetchOrganisasi = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8000/api/organisasi", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrganisasiList(res.data);
  };

  const getNamaOrganisasi = (id) => {
    const org = organisasiList.find((o) => o.id_organisasi === id);
    return org ? org.nama_organisasi : "-";
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const payload = {
        nama_barang: formData.nama_barang,
        kategori_barang: formData.kategori_barang,
        pesan_request: formData.pesan_request,
      };

      const res = await axios.post("http://localhost:8000/api/donasi/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.message) {
        toast.success("Request donasi berhasil dikirim!");
        setFormData({
          nama_barang: "",
          kategori_barang: "",
          pesan_request: "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim request.");
    }
  };


  const handleEdit = (item) => {
    setFormData({ nama_barang: item.nama_barang, pesan_request: item.pesan_request, status_donasi: item.status_donasi, id_organisasi: item.id_organisasi });
    setEditingId(item.id_donasi);
    setEditModalShow(true);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:8000/api/donasi/update/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalMessage("Berhasil mengubah request donasi.");
      setShowModal(true);
      fetchDonasi();
      setEditModalShow(false);
      setEditingId(null);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setModalMessage("Gagal mengubah data.");
      setShowModal(true);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
    setModalMessage("Apakah Anda yakin ingin menghapus data ini?");
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/donasi/delete/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalMessage("Berhasil menghapus data.");
      fetchDonasi();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setModalMessage("Gagal menghapus data.");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredDonasi = donasiList.filter((d) =>
    d.nama_barang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4" style={{ marginTop: "0.5px" }}>
      <h4 className="fw-bold mb-4">Kelola Request Donasi</h4>
      <Tab.Container defaultActiveKey="tambah">
        <Nav variant="tabs">
          <Nav.Item><Nav.Link eventKey="tambah">Tambah</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="tampil">Tampil</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="cari">Cari</Nav.Link></Nav.Item>
        </Nav>

        <Tab.Content className="mt-4">
          <Tab.Pane eventKey="tambah">
            <Card className="p-4 shadow-sm">
              <Form onSubmit={handleSubmit}>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nama Barang</Form.Label>
                      <Form.Control
                        name="nama_barang"
                        value={formData.nama_barang}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Kategori Barang</Form.Label>
                      <Form.Select
                        name="kategori_barang"
                        value={formData.kategori_barang}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Pilih Kategori --</option>
                        <option value="Elektronik & Gadget">Elektronik & Gadget</option>
                        <option value="Pakaian & Aksesori">Pakaian & Aksesori</option>
                        <option value="Perabotan Rumah Tangga">Perabotan Rumah Tangga</option>
                        <option value="Buku, Alat Tulis, & Peralatan Sekolah">Buku, Alat Tulis, & Peralatan Sekolah</option>
                        <option value="Hobi, Mainan, & Koleksi">Hobi, Mainan, & Koleksi</option>
                        <option value="Perlengkapan Bayi & Anak">Perlengkapan Bayi & Anak</option>
                        <option value="Otomotif & Aksesori">Otomotif & Aksesori</option>
                        <option value="Perlengkapan Taman & Outdoor">Perlengkapan Taman & Outdoor</option>
                        <option value="Peralatan Kantor & Industri">Peralatan Kantor & Industri</option>
                        <option value="Kosmetik & Perawatan Diri">Kosmetik & Perawatan Diri</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pesan Request</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="pesan_request"
                        value={formData.pesan_request}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="success" className="mt-2">
                  Tambah Request
                </Button>
              </Form>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="tampil">
            <Card className="p-4 shadow-sm">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Pesan</th>
                    <th>Organisasi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {donasiList.map((item) => (
                    <tr key={item.id_donasi}>
                      <td>{item.nama_barang}</td>
                      <td>{item.status_donasi}</td>
                      <td>{item.tanggal_donasi}</td>
                      <td>{item.pesan_request}</td>
                      <td>{getNamaOrganisasi(item.id_organisasi)}</td>
                      <td>
                        <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>Ubah</Button>{" "}
                        <Button size="sm" variant="danger" onClick={() => confirmDelete(item.id_donasi)}>Hapus</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="cari">
            <Card className="p-4 shadow-sm">
              <Form.Control
                type="text"
                placeholder="Cari nama barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-3"
              />
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Pesan</th>
                    <th>Organisasi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonasi.length > 0 ? (
                    filteredDonasi.map((item) => (
                      <tr key={item.id_donasi}>
                        <td>{item.nama_barang}</td>
                        <td>{item.status_donasi}</td>
                        <td>{item.tanggal_donasi}</td>
                        <td>{item.pesan_request}</td>
                        <td>{getNamaOrganisasi(item.id_organisasi)}</td>
                        <td>
                          <Button size="sm" variant="warning" onClick={() => handleEdit(item)}>Ubah</Button>{" "}
                          <Button size="sm" variant="danger" onClick={() => confirmDelete(item.id_donasi)}>Hapus</Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">Tidak ada hasil ditemukan</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Modal show={editModalShow} onHide={() => setEditModalShow(false)} centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>Edit Data Donasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Barang</Form.Label>
              <Form.Control name="nama_barang" value={formData.nama_barang} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pesan Request</Form.Label>
              <Form.Control as="textarea" rows={3} name="pesan_request" value={formData.pesan_request} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Donasi</Form.Label>
              <Form.Control type="text" value={formData.status_donasi} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Organisasi</Form.Label>
              <Form.Select
                name="id_organisasi"
                value={formData.id_organisasi}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Pilih Organisasi --</option>
                {organisasiList.map((org) => (
                  <option key={org.id_organisasi} value={org.id_organisasi}>
                    {org.nama_organisasi}
                  </option>
                ))}
              </Form.Select>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalShow(false)}>
            Batal
          </Button>
          <Button variant="warning" onClick={handleUpdate}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal && !editModalShow} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={deleteId ? "bg-danger text-white" : "bg-success text-white"}>
          <Modal.Title>{deleteId ? "Konfirmasi Hapus" : "Notifikasi"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{modalMessage}</Modal.Body>
        <Modal.Footer>
          {deleteId ? (
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Batal
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Hapus
              </Button>
            </>
          ) : (
            <Button variant="success" onClick={() => setShowModal(false)}>
              Tutup
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}