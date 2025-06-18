import React, { useState, useEffect } from "react";
import {
  Tab,
  Nav,
  Card,
  Form,
  Button,
  Row,
  Col,
  Table,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PenitipPageCS() {
  const [penitipList, setPenitipList] = useState([]);
  const [formData, setFormData] = useState({
    badge: "",
    poin_sosial: 0,
    nama_lengkap: "",
    no_telepon: "",
    email: "",
    password: "",
    gender: "",
    tanggal_lahir: "",
    komisi: 0,
    bonus: 0,
    foto_ktp: null,
    no_ktp: "",
    image_user: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    success: true,
    message: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [klaimList, setKlaimList] = useState([]);
  const [showTanggalModal, setShowTanggalModal] = useState(false);
  const [selectedKlaimId, setSelectedKlaimId] = useState(null);
  const [tanggalAmbil, setTanggalAmbil] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  const navigate = useNavigate();
  useEffect(() => {
    fetchPenitip();
    fetchKlaim();
  }, []);



  const fetchPenitip = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showModal(
          false,
          "Token tidak ditemukan, silakan login terlebih dahulu."
        );
        return;
      }

      const res = await axios.get("http://localhost:8000/api/penitip/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];
      setPenitipList(list);
    } catch (error) {
      console.error("Gagal mengambil data penitip:", error);
      setPenitipList([]);
    }
  };

  const resetForm = () => {
    setFormData({
      badge: "",
      poin_sosial: 0,
      nama_lengkap: "",
      no_telepon: "",
      email: "",
      password: "",
      gender: "",
      tanggal_lahir: "",
      komisi: 0,
      bonus: 0,
      foto_ktp: null,
      no_ktp: "",
      image_user: null,
    });
    setImagePreview(null);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === "image_user") {
        setImagePreview(URL.createObjectURL(file));
      }
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    }
    payload.append("id_role", 3);

    try {
      const endpoint = editingId
        ? `http://127.0.0.1:8000/api/penitip/update/${editingId}?_method=PUT`
        : "http://127.0.0.1:8000/api/penitip/store";

      const token = localStorage.getItem("token");

      await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showModal(
        true,
        editingId ? "Data berhasil diubah." : "Data berhasil ditambahkan."
      );
      fetchPenitip();
      resetForm();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error submit data:", err);
      const msg =
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.";
      showModal(false, msg);
    }
    resetForm();
  };

  const handleEdit = async (item) => {
    setFormData({
      nama_lengkap: item.nama_lengkap || "",
      email: item.email || "",
      password: "",
      tanggal_lahir: item.tanggal_lahir || "",
      image_user: null,
    });

    setImagePreview(null);
    setEditingId(item.id_penitip);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`http://127.0.0.1:8000/api/penitip/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        showModal(true, "Data berhasil dihapus.");
        fetchPenitip();
      } catch (err) {
        console.error("Gagal menghapus data:", err);
        showModal(false, "Gagal menghapus data.");
      }
    }
  };

  const showModal = (success, message) => {
    setModalInfo({ show: true, success, message });
  };

  const handleCloseModal = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  const fetchKlaim = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/merchandise/klaim", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setKlaimList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal ambil klaim merchandise:", err);
    }
  };

  const handleIsiTanggalAmbil = (id_klaim) => {
    setSelectedKlaimId(id_klaim);
    setTanggalAmbil(""); // reset input
    setShowTanggalModal(true);
  };

  const submitTanggalAmbil = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/merchandise/klaim/tanggal-ambil/${selectedKlaimId}`,
        { tanggal_ambil: tanggalAmbil },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      toast.success("Tanggal ambil berhasil disimpan");
      setShowTanggalModal(false);
      fetchKlaim();
    } catch (err) {
      toast.error("Gagal menyimpan tanggal ambil");
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Gagal menyimpan tanggal ambil");
    }
  };


  const filteredPenitip = Array.isArray(penitipList)
    ? penitipList.filter((p) =>
      p.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <div className="pt-1 px-4 pb-4">
      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="primary"
          onClick={() => navigate("/user/pegawai/barang")}
        >
          Kelola Barang
        </Button>
        <Button
          variant="outline-success"
          onClick={() => navigate("/user/pegawai/verifikasi-transaksi")}
        >
          Verifikasi Transaksi
        </Button>
      </div>

      <Nav.Item>
        <Nav.Link className="fw-bold mb-4" eventKey="data_penitip">
          Kelola Data Penitip
        </Nav.Link>
      </Nav.Item>
      <Tab.Container defaultActiveKey="tambah">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="tambah">Tambah</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="tampil">Tampil</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="cari">Cari</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="transaksi">Transaksi</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="klaim">Klaim Merchandise</Nav.Link>
          </Nav.Item>

        </Nav>

        <Tab.Content className="mt-4">
          {/* Form Tambah Data */}
          <Tab.Pane eventKey="tambah">
            <Card className="p-4 shadow-sm">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Badge</Form.Label>
                      <Form.Control
                        name="badge"
                        value={formData.badge}
                        type="text"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Nama Lengkap</Form.Label>
                      <Form.Control
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        type="text"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>No Telepon</Form.Label>
                      <Form.Control
                        name="no_telepon"
                        value={formData.no_telepon}
                        type="text"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        name="email"
                        value={formData.email}
                        type="email"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        name="password"
                        value={formData.password}
                        type="password"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        name="gender"
                        value={formData.gender}
                        type="text"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tanggal Lahir</Form.Label>
                      <Form.Control
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        type="date"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Komisi</Form.Label>
                      <Form.Control
                        name="komisi"
                        value={formData.komisi}
                        type="number"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Bonus</Form.Label>
                      <Form.Control
                        name="bonus"
                        value={formData.bonus}
                        type="number"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>No KTP</Form.Label>
                      <Form.Control
                        name="no_ktp"
                        value={formData.no_ktp}
                        type="text"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Foto KTP</Form.Label>
                      <Form.Control
                        type="file"
                        name="foto_ktp"
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 text-center">
                      <Form.Label>Image User</Form.Label>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="rounded mb-2"
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                            border: "1px solid #ddd",
                          }}
                        />
                      )}
                      <Form.Control
                        type="file"
                        name="image_user"
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="success">
                  Tambah Penitip
                </Button>
              </Form>
            </Card>
          </Tab.Pane>

          {/* Tampil Data */}
          <Tab.Pane eventKey="tampil">
            <Card className="p-4 shadow-sm">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No Telepon</th>
                    <th>Gender</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {penitipList.map((item) => (
                    <tr key={item.id_penitip}>
                      <td>{item.nama_lengkap}</td>
                      <td>{item.email}</td>
                      <td>{item.no_telepon}</td>
                      <td>{item.gender}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleEdit(item)}
                        >
                          Ubah
                        </Button>{" "}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(item.id_penitip)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          {/* Cari Data */}
          <Tab.Pane eventKey="cari">
            <Form.Control
              type="text"
              placeholder="Cari nama penitip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-3"
            />
            <Card className="p-4 shadow-sm">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No Telepon</th>
                    <th>Gender</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPenitip.length > 0 ? (
                    filteredPenitip.map((item) => (
                      <tr key={item.id_penitip}>
                        <td>{item.nama_lengkap}</td>
                        <td>{item.email}</td>
                        <td>{item.no_telepon}</td>
                        <td>{item.gender}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(item)}
                          >
                            Ubah
                          </Button>{" "}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(item.id_penitip)}
                          >
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

          {/* Klaim Merchandise */}
          <Tab.Pane eventKey="klaim">
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mb-3"
              style={{ maxWidth: "200px" }}
            >
              <option value="semua">Semua</option>
              <option value="belum diambil">Belum diambil</option>
              <option value="sudah diambil">Sudah diambil</option>
            </Form.Select>
            <Card className="p-4 shadow-sm">
              <h5 className="mb-3">Daftar Klaim Merchandise</h5>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Nama Pembeli</th>
                    <th>Merchandise</th>
                    <th>Poin</th>
                    <th>Tanggal Klaim</th>
                    <th>Status</th>
                    <th>Tanggal Ambil</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {klaimList
                    .filter((item) =>
                      filterStatus === "semua" ? true : item.status === filterStatus
                    )
                    .map((item) => (
                      <tr key={item.id_klaim}>
                        <td>{item.pembeli?.nama_lengkap || "-"}</td>
                        <td>{item.merchandise?.nama_merchandise || "-"}</td>
                        <td>{item.merchandise?.poin_penukaran || "-"}</td>
                        <td>{item.tanggal_klaim}</td>
                        <td>
                          {item.status === "sudah diambil" ? (
                            <span className="text-success fw-bold">Sudah diambil</span>
                          ) : (
                            <span className="text-warning fw-bold">Belum diambil</span>
                          )}
                        </td>
                        <td>{item.tanggal_ambil || "-"}</td>
                        <td className="text-center">
                          {item.status === "belum diambil" && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleIsiTanggalAmbil(item.id_klaim)}
                            >
                              Isi Tanggal Ambil
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card>
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ubah Data Penitip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    type="text"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    value={formData.email}
                    type="email"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    value={formData.password}
                    type="password"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Lahir</Form.Label>
                  <Form.Control
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    type="date"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-center">
                  <Form.Label>Image User</Form.Label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="rounded mb-2"
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                  )}
                  <Form.Control
                    type="file"
                    name="image_user"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="success">
              Ubah Penitip
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Info */}
      <Modal show={modalInfo.show} onHide={handleCloseModal} centered>
        <Modal.Header
          closeButton
          className={
            modalInfo.success ? "bg-success text-white" : "bg-danger text-white"
          }
        >
          <Modal.Title>{modalInfo.success ? "Berhasil" : "Gagal"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{modalInfo.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalInfo.success ? "success" : "danger"}
            onClick={handleCloseModal}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTanggalModal} onHide={() => setShowTanggalModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Isi Tanggal Ambil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tanggal Ambil</Form.Label>
            <Form.Control
              type="date"
              value={tanggalAmbil}
              onChange={(e) => setTanggalAmbil(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTanggalModal(false)}>
            Batal
          </Button>
          <Button variant="success" onClick={submitTanggalAmbil}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
