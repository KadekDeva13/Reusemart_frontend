import React, { useState, useEffect } from "react";
import {Form,Button,Row,Col,Card,Nav,Modal,Spinner,Table,Badge,} from "react-bootstrap";
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
          : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

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
      .get("http://localhost:8000/api/transaksi-penitip", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) setTransaksiList(res.data);
      })
      .catch((err) => {
        console.error("Gagal ambil data transaksi penitip:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = new FormData();

    for (let key in formData) {
      if (key === "image_user") {
        if (formData.image_user instanceof File) {
          payload.append("image_user", formData.image_user);
        }
      } else {
        payload.append(key, formData[key]);
      }
    }

    try {
      setImageUploading(true);
      await axios.post("http://localhost:8000/api/penitip/update", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setModalType("success");
      setModalMessage("Data profil berhasil disimpan!");
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

  const renderBiodata = () =>
    loading ? (
      <Spinner animation="border" />
    ) : (
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
                <Form.Label>Komisi</Form.Label>
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
    <Card className="p-4 shadow-sm">
      <h5 className="fw-bold mb-3">Riwayat Donasi / Transaksi</h5>
      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tanggal</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transaksiList.length > 0 ? (
            transaksiList.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.tanggal}</td>
                <td>Rp{parseInt(item.total).toLocaleString()}</td>
                <td>
                  <Badge bg="secondary">{item.status}</Badge>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                Tidak ada transaksi
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );

  const renderDetail = () => (
    <Card className="p-4 shadow-sm">
      <h5 className="fw-bold mb-3">Detail Transaksi</h5>
      {transaksiList.length > 0 ? (
        <ul>
          {transaksiList.map((item) => (
            <li key={item.id}>
              Transaksi #{item.id} - Rp{parseInt(item.total).toLocaleString()} - {item.status}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Tidak ada detail transaksi</p>
      )}
    </Card>
  );

  return (
    <div className="p-4" style={{ marginTop: "80px" }}>
      <h4 className="fw-bold mb-4">Profil Penitip</h4>
      <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
        <Nav.Item>
          <Nav.Link eventKey="biodata">Biodata Diri</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="history">Riwayat Transaksi</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="detail">Detail Transaksi</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-4">
        {activeTab === "biodata" && renderBiodata()}
        {activeTab === "history" && renderHistory()}
        {activeTab === "detail" && renderDetail()}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={modalType === "error" ? "bg-danger text-white" : "bg-success text-white"}>
          <Modal.Title>{modalType === "error" ? "Gagal" : "Berhasil"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant={modalType === "error" ? "danger" : "success"} onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}