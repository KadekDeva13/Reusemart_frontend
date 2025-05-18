// ProfilePagePenitip.js
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Nav,
  Modal,
  Spinner,
  Table,
  Badge,
} from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function ProfilePagePenitip() {
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    no_telepon: "",
    tanggal_lahir: "",
    password: "",
    poin_sosial: 0,
    komisi: 0,
    bonus: 0,
    image_user: null,
    imagePreview: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  });
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [activeTab, setActiveTab] = useState("biodata");
  const [transaksiList, setTransaksiList] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaksiId, setSelectedTransaksiId] = useState(null);
  const [detailList, setDetailList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        const imageUrl = data.image_user
          ? data.image_user.startsWith("http")
            ? data.image_user
            : `http://localhost:8000/storage/foto_penitip/${data.image_user}`
          : formData.imagePreview;

        setFormData((prev) => ({
          ...prev,
          ...data,
          image_user: null,
          imagePreview: imageUrl,
          password: "",
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data penitip:", err);
        setLoading(false);
      });

    axios
      .get("http://localhost:8000/api/riwayat-penjualan", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setTransaksiList(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Gagal ambil riwayat penjualan:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        image_user: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setImageUploading(true);
      let response;

      if (formData.image_user instanceof File) {
        const payload = new FormData();
        payload.append("nama_lengkap", formData.nama_lengkap);
        payload.append("no_telepon", formData.no_telepon);
        payload.append("tanggal_lahir", formData.tanggal_lahir);
        if (formData.password) payload.append("password", formData.password);
        payload.append("image_user", formData.image_user);

        response = await axios.post(
          "http://localhost:8000/api/penitip/update",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        const payload = {
          nama_lengkap: formData.nama_lengkap,
          no_telepon: formData.no_telepon,
          tanggal_lahir: formData.tanggal_lahir,
        };
        if (formData.password) payload.password = formData.password;

        response = await axios.post(
          "http://localhost:8000/api/penitip/update",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const updatedData = response.data.data;
      setFormData((prev) => ({
        ...prev,
        imagePreview: updatedData?.image_user
          ? `http://localhost:8000/storage/foto_penitip/${updatedData.image_user}`
          : prev.imagePreview,
        password: "",
      }));

      setModalType("success");
      setModalMessage("Profil berhasil diperbarui!");
    } catch (err) {
      setModalType("error");
      const firstError = err.response?.data?.errors
        ? Object.values(err.response.data.errors)[0][0]
        : "Terjadi kesalahan saat menyimpan profil.";
      setModalMessage(firstError);
    } finally {
      setImageUploading(false);
      setShowModal(true);
    }
  };

  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return "success";
      case "dibayar":
        return "primary";
      case "diproses":
        return "warning";
      case "pending":
        return "secondary";
      case "gagal":
        return "danger";
      default:
        return "dark";
    }
  };

  const fetchDetailTransaksi = (id) => {
    const selected = transaksiList.find((t) => t.id_transaksi === id);
    if (selected && Array.isArray(selected.detail)) {
      setDetailList(selected.detail);
    } else {
      setDetailList([]);
    }
    setSelectedTransaksiId(id);
    setShowDetailModal(true);
  };

  const renderBiodata = () => (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={4}>
          <Card className="p-3 text-center shadow-sm position-relative">
            {imageUploading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center z-3">
                <Spinner animation="border" variant="success" />
              </div>
            )}
            <img
              src={formData.imagePreview}
              alt="Avatar"
              className="rounded"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png";
              }}
            />
            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label className="btn btn-outline-secondary w-100">
                Pilih Foto
                <Form.Control
                  type="file"
                  name="image_user"
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />
              </Form.Label>
            </Form.Group>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            {["nama_lengkap", "no_telepon", "tanggal_lahir", "email"].map(
              (field, index) => (
                <Form.Group className="mb-3" key={index}>
                  <Form.Label>
                    {field
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Form.Label>
                  <Form.Control
                    type={
                      field === "tanggal_lahir"
                        ? "date"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    readOnly={field === "email"}
                  />
                </Form.Group>
              )
            )}
            <Form.Group className="mb-3">
              <Form.Label>Password (opsional)</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pe-5"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Poin Sosial</Form.Label>
              <Form.Control
                type="text"
                value={`${formData.poin_sosial} poin`}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Saldo</Form.Label>
              <Form.Control
                type="text"
                value={`Rp${formData.komisi.toLocaleString()}`}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bonus</Form.Label>
              <Form.Control
                type="text"
                value={`Rp${formData.bonus.toLocaleString()}`}
                readOnly
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              Simpan Perubahan
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  const renderHistory = () => (
    <Card className="p-4 shadow-sm rounded-3 bg-white">
      <h5 className="fw-bold mb-3">Riwayat Transaksi</h5>
      <Table responsive bordered hover className="mb-0">
        <thead className="table-light">
          <tr className="text-center">
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
              <tr key={item.id_transaksi} className="text-center">
                <td>{item.id_transaksi}</td>
                <td>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td>
                  Rp{parseInt(item.total_pembayaran).toLocaleString("id-ID")}
                </td>
                <td>
                  <Badge bg={getBadgeVariant(item.status_transaksi)}>
                    {item.status_transaksi}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="px-3 text-white"
                    onClick={() => fetchDetailTransaksi(item.id_transaksi)}
                  >
                    Detail
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Tidak ada transaksi
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );

  return (
    <div
      className="p-4"
      style={{
        marginTop: "80px",
        backgroundColor: "#ede9e8",
        minHeight: "100vh",
      }}
    >
      <h4 className="fw-bold mb-4">Profil Penitip</h4>
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item>
          <Nav.Link eventKey="biodata">Biodata Diri</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="history">Riwayat Transaksi</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-4">
        {activeTab === "biodata" && renderBiodata()}
        {activeTab === "history" && renderHistory()}
      </div>

      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Transaksi #{selectedTransaksiId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailList.length > 0 ? (
            <Table bordered>
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {detailList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama_barang}</td>
                    <td>{item.kategori_barang}</td>
                    <td>Rp{parseInt(item.harga).toLocaleString()}</td>
                    <td>{item.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">Detail tidak tersedia.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
