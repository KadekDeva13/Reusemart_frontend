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
import API from "@/utils/api";

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
    id_pembeli: null,
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
  const [transaksiListValid, setTransaksiListValid] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaksiId, setSelectedTransaksiId] = useState(null);
  const [detailList, setDetailList] = useState([]);
  const [buktiFile, setBuktiFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedStatusTransaksi, setSelectedStatusTransaksi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const fetchJadwal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/transaksi/valid", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransaksiListValid(res.data || []);
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal memuat data.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRiwayat = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await API.get(
        "/api/riwayat-pembelian",
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

  const fetchAlamatUtama = async (id_pembeli) => {
    try {
      const res = await API.get(`/api/pembeli/${id_pembeli}/alamat-utama`);
      if (res.data) {
        const alamat = res.data;
        const alamatLengkap = `${alamat.detail_alamat}, ${alamat.kelurahan}, ${alamat.kecamatan}, ${alamat.provinsi} ${alamat.kode_pos}`;
        setFormData((prev) => ({
          ...prev,
          alamat: alamatLengkap,
        }));
      }
    } catch (err) {
      console.error("Gagal ambil alamat utama:", err);
      setFormData((prev) => ({
        ...prev,
        alamat: "-",
      }));
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");

    API
      .get("/api/pembeli/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data || res.data;

        setFormData((prev) => ({
          ...prev,
          id_pembeli: data.id_pembeli, // simpan id
          nama_lengkap: data.nama_lengkap || "",
          email: data.email || "",
          no_telepon: data.no_telepon || "",
          tanggal_lahir: data.tanggal_lahir || "",
          poin_sosial: data.poin_sosial || 0,
          saldo: data.saldo || 0,
          alamat: "", // kosong dulu, isi setelah fetch alamat utama
          image_user: null,
         imagePreview: data.image_user
  ? `${API.defaults.baseURL}/storage/foto_pembeli/${data.image_user}`
  : prev.imagePreview,
        }));

        fetchAlamatUtama(data.id_pembeli); // ⬅️ Panggil di sini
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data pembeli:", err);
        setLoading(false);
      });


    fetchRiwayat();
    fetchJadwal();

    const interval = setInterval(async () => {
      try {
        const res = await API.post(
          "/api/transaksi/batalkan-otomatis",
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
      await API.post(
        `/api/transaksi/upload-bukti/${selectedTransaksiId}`,
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

        response = await API.post(
          "/api/pembeli/update",
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

        response = await API.post(
          "/api/pembeli/update",
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
  ? `${API.defaults.baseURL}/storage/foto_pembeli/${updatedData.image_user}`
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
      await API.put(
        `/api/barang/rating/${selectedBarang.id_barang}`,
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
        return "info";
      default:
        return "dark";
    }
  };

  const fetchDetailTransaksi = (id) => {
    const selected = transaksiList.find((t) => t.id_transaksi === id);
    if (selected && Array.isArray(selected.detail)) {
      setDetailList(selected.detail);
      setSelectedStatusTransaksi(selected.status_transaksi);
    } else {
      setDetailList([]);
      setSelectedStatusTransaksi("");
    }
    setSelectedTransaksiId(id);
    setShowDetailModal(true);
  };

  const renderBiodata = () => {
    if (!isEditMode) {
      return (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Foto Profil */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <img
                src={formData.imagePreview}
                alt="Foto Profil"
                className="w-32 h-32 rounded-full mx-auto object-cover border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                }}
              />
              <h5 className="mt-3 font-semibold">{formData.nama_lengkap}</h5>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
          </div>

          {/* Biodata */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow p-6">
              <h6 className="text-lg font-bold mb-4 border-b pb-2 text-gray-700">Informasi Biodata</h6>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Nomor Telepon</span>
                  <span>{formData.no_telepon || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Tanggal Lahir</span>
                  <span>
                    {formData.tanggal_lahir
                      ? new Date(formData.tanggal_lahir).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Poin Sosial</span>
                  <span>{formData.poin_sosial} poin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Saldo</span>
                  <span>Rp{formData.saldo.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Alamat</span>
                  <span>{formData.alamat || "-"}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate("/user/pembeli/alamat")}
                >
                  Kelola Alamat
                </Button>
                <Button variant="warning" className="w-full" onClick={() => setIsEditMode(true)}>
                  Edit Profil
                </Button>
              </div>

            </div>
          </div>
        </div>
      );
    }

    return (
      <Form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* Upload Foto */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-xl shadow p-4 text-center relative">
            {imageUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                <Spinner animation="border" variant="success" />
              </div>
            )}
            <img
              src={formData.imagePreview}
              alt="Foto Profil"
              className="w-32 h-32 rounded-full mx-auto object-cover border border-gray-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
              }}
            />
            <Form.Group controlId="formFile" className="mt-4">
              <Form.Label className="btn btn-outline-secondary w-full">
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
          </div>
        </div>

        {/* Form Biodata */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow p-6">
            <h6 className="text-lg font-bold mb-4 border-b pb-2 text-gray-700">Edit Biodata</h6>
            <div className="grid grid-cols-1 gap-4">
              <Form.Group>
                <Form.Label className="text-sm text-gray-600">Nama Lengkap</Form.Label>
                <Form.Control
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-sm text-gray-600">Nomor Telepon</Form.Label>
                <Form.Control
                  type="text"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-sm text-gray-600">Tanggal Lahir</Form.Label>
                <Form.Control
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="text-sm text-gray-600">Password (opsional)</Form.Label>
                <div className="relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Kosongkan jika tidak ingin mengganti password"
                    className="pr-10"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </Form.Group>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button type="submit" variant="success" className="w-full">
                Simpan
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsEditMode(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      </Form>
    );
  };


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
            transaksiList.map((item) => {
              return (
                <tr key={item.id_transaksi}>
                  <td>{item.id_transaksi}</td>
                  <td>
                    {item.created_at
                      ? new Date(
                          item.created_at.replace(" ", "T")
                        ).toLocaleDateString()
                      : "-"}
                  </td>
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
              );
            })
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
    <Modal
      show={showRatingModal}
      onHide={() => setShowRatingModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Beri Rating Barang</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p className="mb-2 font-semibold">{selectedBarang?.nama_barang}</p>
        <div className="text-3xl mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: "pointer",
                color: star <= selectedRating ? "gold" : "#ccc",
              }}
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
        <Nav.Item>
          <Nav.Link eventKey="valid">Riwayat Valid</Nav.Link> 
        </Nav.Item>
      </Nav>

      <div className="mt-4">
        {activeTab === "biodata" && renderBiodata()}
        {activeTab === "history" && renderHistory()}
        {activeTab === "detail" && renderDetail()}
        {activeTab === "valid" && renderValid()}
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
                            <span
                              key={star}
                              style={{
                                color:
                                  star <= item.rating_barang ? "gold" : "#ccc",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      ) : selectedStatusTransaksi?.toLowerCase() === "selesai" ? (
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
                      ) : (
                        <span className="text-muted">Menunggu selesai</span>
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
