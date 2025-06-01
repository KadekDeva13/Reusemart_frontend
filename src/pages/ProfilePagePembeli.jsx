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
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePagePembeli() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    no_telepon: "",
    tanggal_lahir: "",
    password: "",
    poin_sosial: 0,
    saldo: 0,
    alamat: "",
    image_user: null,
    imagePreview: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  });
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("biodata");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");
  const [transaksiList, setTransaksiList] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaksiId, setSelectedTransaksiId] = useState(null);
  const [detailList, setDetailList] = useState([]);
  const [buktiFile, setBuktiFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchRiwayat = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:8000/api/riwayat-pembelian",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data && Array.isArray(res.data.data)) {
        setTransaksiList(res.data.data);
      }
    } catch (err) {
      console.error("Gagal ambil riwayat transaksi:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/pembeli/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data || res.data;
        setFormData((prev) => ({
          ...prev,
          nama_lengkap: data.nama_lengkap || "",
          email: data.email || "",
          no_telepon: data.no_telepon || "",
          tanggal_lahir: data.tanggal_lahir || "",
          poin_sosial: data.poin_sosial || 0,
          saldo: data.saldo || 0,
          alamat: data.alamat || "",
          image_user: null,
          imagePreview: data.image_user
            ? `http://localhost:8000/storage/foto_pembeli/${data.image_user}`
            : prev.imagePreview,
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data pembeli:", err);
        setLoading(false);
      });

    fetchRiwayat();

    const interval = setInterval(async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/transaksi/batalkan-otomatis",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.success) {
          console.log("✅ Transaksi dibatalkan otomatis");
          fetchRiwayat(); // refresh data transaksi
        }
      } catch (err) {
        console.error("❌ Gagal batalkan transaksi otomatis:", err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBayar = (id_transaksi) => {
    setSelectedTransaksiId(id_transaksi);
    setShowUploadModal(true);
  };

  const handleSubmitPembayaran = async () => {
    if (!buktiFile || !selectedTransaksiId) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("bukti_pembayaran", buktiFile);

    try {
      await axios.post(
        `http://localhost:8000/api/transaksi/upload-bukti/${selectedTransaksiId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Bukti pembayaran berhasil diunggah!");
      setShowUploadModal(false);
      fetchRiwayat();
    } catch (err) {
      console.error("Upload bukti gagal:", err);
      alert("Gagal mengunggah bukti pembayaran.");
    }
  };

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
          "http://localhost:8000/api/pembeli/update",
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
          "http://localhost:8000/api/pembeli/update",
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
          ? `http://localhost:8000/storage/foto_pembeli/${updatedData.image_user}`
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

  const handleSubmitRating = async () => {
    if (!selectedBarang) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/barang/rating/${selectedBarang.id_barang}`,
        { rating_barang: selectedRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetailList((prev) =>
        prev.map((item) =>
          item.id_barang === selectedBarang.id_barang
            ? { ...item, rating_barang: selectedRating }
            : item
        )
      );

      alert("Rating berhasil dikirim.");
      setShowRatingModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim rating.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return "success";
      case "dibayar":
        return "primary";
      case "belum bayar":
        return "warning";
      case "ditolak":
        return "secondary";
      case "batal":
        return "danger";
      case "disiapkan":
        return "info"
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
            <Button
              variant="outline-secondary"
              className="mb-3"
              style={{ width: "fit-content" }}
              onClick={() => navigate("/user/pembeli/alamat")}
            >
              Kelola Alamat
            </Button>
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
      <h5 className="fw-bold mb-3">Riwayat Transaksi</h5>
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
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>Rp{parseInt(item.total_pembayaran).toLocaleString()}</td>
                <td>
                  <Badge bg={getBadgeVariant(item.status_transaksi)}>
                    {item.status_transaksi}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => fetchDetailTransaksi(item.id_transaksi)}
                  >
                    Detail
                  </Button>

                  {item.status_transaksi === "belum bayar" && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleBayar(item.id_transaksi)}
                    >
                      Bayar
                    </Button>
                  )}
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

  const renderUploadModal = () => (
    <Modal
      show={showUploadModal}
      onHide={() => setShowUploadModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Upload Bukti Pembayaran</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="file"
          className="form-control"
          accept="image/*,application/pdf"
          onChange={(e) => setBuktiFile(e.target.files[0])}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmitPembayaran}
          disabled={!buktiFile}
        >
          Simpan Pembayaran
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderRatingModal = () => (
    <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Beri Rating Barang</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p className="mb-2 font-semibold">{selectedBarang?.nama_barang}</p>
        <div className="text-3xl mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{ cursor: "pointer", color: star <= selectedRating ? "gold" : "#ccc" }}
              onClick={() => setSelectedRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <Button
          variant="success"
          onClick={handleSubmitRating}
          disabled={submitting || selectedRating === 0}
        >
          {submitting ? "Mengirim..." : "Kirim Rating"}
        </Button>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="p-4" style={{ marginTop: "80px" }}>
      <h4 className="fw-bold mb-4">Halaman Profil</h4>
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav.Item>
          <Nav.Link eventKey="biodata">Biodata Diri</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="history">Riwayat Pembelian</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-4">
        {activeTab === "biodata" && renderBiodata()}
        {activeTab === "history" && renderHistory()}
        {activeTab === "detail" && renderDetail()}
      </div>

      {/* ✅ Modal Detail Transaksi */}
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
            <Table bordered className="text-center">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Rating Barang</th>
                </tr>
              </thead>
              <tbody>
                {detailList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama_barang}</td>
                    <td>{item.kategori_barang}</td>
                    <td>Rp{parseInt(item.harga).toLocaleString()}</td>
                    <td>
                      {Number(item.rating_barang) > 0 ? (
                        <div className="text-warning text-lg">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ color: star <= item.rating_barang ? "gold" : "#ccc" }}>
                              ★
                            </span>
                          ))}
                        </div>
                      ) : (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => {
                            console.log("📦 Barang diklik untuk rating:", item);
                            setSelectedBarang(item);
                            setSelectedRating(0);
                            setShowRatingModal(true);
                          }}
                        >
                          Beri Rating
                        </Button>
                      )}
                    </td>
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

      {/* ✅ Modal Upload Bukti Pembayaran */}
      {renderUploadModal()}

      {/* ✅ Modal Beri Rating */}
      {renderRatingModal()}
    </div>
  );
}
