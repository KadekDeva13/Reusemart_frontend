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
import { toast } from "react-toastify";
import { form } from "framer-motion/client";
import API from "@/utils/api";

export default function PengajuanPenarikanSaldoPage() {
    const [formData, setFormData] = useState({
        nama_lengkap: "",
        email: "",
        no_telepon: "",
        tanggal_lahir: "",
        password: "",
        rating_penitip: 0,
        poin_sosial: 0,
        komisi: 0,
        saldo: 0,
        nominal_tarik: 0,
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [isTarikMode, setIsTarikMode] = useState(false);
    const [showTarikModal, setShowTarikModal] = useState(false);
    const [jumlahTarik, setJumlahTarik] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
  const token = localStorage.getItem("token");

  API.get("/api/user", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      const data = res.data;
      const imageUrl = data.image_user
        ? data.image_user.startsWith("http")
          ? data.image_user
          : `${API.defaults.baseURL}/storage/foto_penitip/${data.image_user}`
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

  API.get("/api/riwayat-penjualan", {
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

    const handleTarikSubmit = (e) => {
        // e.preventDefault();

        const token = localStorage.getItem("token");

        API
            .post(
                "/api/penitip/penarikan-saldo",
                {
                    nominal_tarik: nominal_tarik,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((res) => {
                if (res.data.status === "success") {
                    setModalType("success");
                    setModalMessage(res.data.message);
                    setShowModal(true);
                } else {
                    setModalType("danger");
                    setModalMessage(res.data.message);
                    setShowModal(true);
                }
            })
            .catch((err) => {
                console.error("Gagal tarik saldo:", err);

            });
    };

    const handleModalTarik = () => {
        formData.saldo > formData.nominal_tarik ? setShowConfirmModal(true) : toast.error("Saldo tidak mencukupi");
        console.log(formData.nominal_tarik, formData.saldo);
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

    const renderBiodata = () => {
        if (!isEditMode) {
            return (
                <Form onSubmit={handleTarikSubmit}>
                    <div className="flex flex-col justify-center md:flex-row gap-6">

                        {/* Info Biodata */}
                        <div className="w-full md:w-2/3">
                            <div className="bg-white rounded-xl shadow p-6">
                                <h6 className="text-lg font-bold mb-4 border-b pb-2 text-gray-700 text-center">Biodata Penitip</h6>
                                <div className="space-y-3">
                                    <div className="flex justify-center">
                                        <span className="text-gray-950 text-3xl">{formData.nama_lengkap || "-"}</span>
                                    </div>
                                    <div className="flex justify-center">
                                        <span className="text-gray-600 font-medium">Saldo:</span>

                                    </div>
                                    <div className="flex justify-center">
                                        <span className="text-gray-600 text-3xl">Rp{formData.saldo.toLocaleString("id-ID")}</span>
                                    </div>
                                    <Form.Group>
                                        <Form.Label className="text-sm text-gray-600">Nominal Tarik</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="nominal_tarik"
                                            onChange={handleChange}
                                            className="bg-white"
                                        />
                                    </Form.Group>
                                </div>

                                <div className="mt-5">
                                    <Button variant="warning" className="w-full" onClick={() => handleModalTarik(true)}>
                                        Tarik Saldo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            );
        }

        return (
            <Form onSubmit={handleTarik} className="flex flex-col md:flex-row gap-6">
                {/* Foto Upload */}
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
                {/* Form Input */}
                <div className="w-full md:w-2/3">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h6 className="text-lg font-bold mb-4 border-b pb-2 text-gray-700">
                            Edit Biodata
                        </h6>
                        <div className="grid grid-cols-1 gap-4">
                            <Form.Group>
                                <Form.Label className="text-sm text-gray-600">Nama Lengkap</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nama_lengkap"
                                    value={formData.nama_lengkap}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sm text-gray-600">Nomor Telepon</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="no_telepon"
                                    value={formData.no_telepon}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="text-sm text-gray-600">Tanggal Lahir</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="tanggal_lahir"
                                    value={formData.tanggal_lahir}
                                    onChange={handleChange}
                                    className="bg-white"
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
                                        className="pr-10 bg-white"
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
                                <td>{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                                <td>Rp{parseInt(item.total_pembayaran).toLocaleString("id-ID")}</td>
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
        <div className="p-4 mt-20 min-h-screen bg-neutral-100">

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
                                        <td>
                                            Rp
                                            {parseFloat(item.harga || 0).toLocaleString("id-ID")}
                                        </td>
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
                                                <span>Barang belum diberi rating</span>
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

            {/* <Modal show={showTarikModal} onHide={() => setShowTarikModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tarik Saldo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleTarikSubmit}>
                        <Form.Group controlId="jumlahTarik">
                            <Form.Label>Jumlah Tarik</Form.Label>
                            <Form.Control
                                type="number"
                                value={jumlahTarik}
                                onChange={(e) => setJumlahTarik(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" variant="success" className="w-full">
                            Tarik Saldo
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTarikModal(false)}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal> */}

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Peringatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Apakah Anda yakin ingin menarik saldo sebesar Rp{formData.nominal_tarik}?</p>
                    <p>Biaya Penarikan: Rp{formData.nominal_tarik * 0.05}, </p>
                    <p>Sisa saldo Anda setelah penarikan adalah Rp{formData.saldo - (formData.nominal_tarik - formData.nominal_tarik * 0.05)}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Tutup
                    </Button>
                    <Button variant="danger" onClick={handleTarikSubmit}>
                        Ya, Tarik
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
