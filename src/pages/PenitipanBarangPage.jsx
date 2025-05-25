import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { X } from "lucide-react";

export default function PenitipanBarangPage() {
    const navigate = useNavigate();
    const [penitipList, setPenitipList] = useState([]);
    const [form, setForm] = useState({
        id_penitip: "",
        nama_barang: "",
        kategori_barang: "",
        deskripsi: "",
        harga_barang: "",
        nama_qc: "",
        punya_garansi: false,
        tanggal_garansi: "",
    });

    const [fotoBarang, setFotoBarang] = useState([]);
    const [previewImage, setPreviewImage] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchPenitip, setSearchPenitip] = useState("");
    const [filteredPenitip, setFilteredPenitip] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

    useEffect(() => {
        fetchPenitip();
    }, []);

    const fetchPenitip = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/penitip/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPenitipList(res.data.data || []);
        } catch (error) {
            console.error("Gagal ambil penitip:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setFotoBarang((prev) => [...prev, ...files]);
        setPreviewImage((prev) => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = [...fotoBarang];
        const updatedPreviews = [...previewImage];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setFotoBarang(updatedFiles);
        setPreviewImage(updatedPreviews);

        setCurrentSlide((prev) => {
            if (index === 0 || updatedPreviews.length === 0) return 0;
            if (prev >= updatedPreviews.length) return updatedPreviews.length - 1;
            return prev - 1;
        });
    };

    const handlePenitipSearch = (e) => {
        const keyword = e.target.value;
        setSearchPenitip(keyword);
        if (keyword.trim() === "") {
            setFilteredPenitip([]);
            setShowDropdown(false);
            return;
        }

        const filtered = penitipList.filter((p) =>
            p.nama_lengkap.toLowerCase().startsWith(keyword.toLowerCase())
        );
        setFilteredPenitip(filtered);
        setShowDropdown(true);
    };

    const handleSelectPenitip = (penitip) => {
        setForm({ ...form, id_penitip: penitip.id_penitip });
        setSearchPenitip(penitip.nama_lengkap);
        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ show: false, message: "", variant: "" });

        try {
            const token = localStorage.getItem("token");

            const data = new FormData();
            data.append("id_penitip", form.id_penitip);
            data.append("nama_barang", form.nama_barang);
            data.append("kategori_barang", form.kategori_barang);
            data.append("deskripsi", form.deskripsi);
            data.append("harga_barang", form.harga_barang);
            data.append("stock", 1);
            data.append("status_barang", "tersedia");
            data.append("tanggal_garansi", form.punya_garansi ? form.tanggal_garansi : "");

            fotoBarang.forEach((file) => {
                data.append("foto_barang[]", file);
            });

            const barangRes = await axios.post("http://localhost:8000/api/barang", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const id_barang = barangRes.data?.data?.id_barang;

            await axios.post(
                "http://localhost:8000/api/penitipan/store",
                {
                    id_penitip: form.id_penitip,
                    id_barang,
                    nama_qc: form.nama_qc,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            localStorage.setItem("penitipanSuccess", "Barang berhasil dititipkan!");
            navigate("/user/gudang/manajemen-barang");

            setForm({
                id_penitip: "",
                nama_barang: "",
                kategori_barang: "",
                deskripsi: "",
                harga_barang: "",
                nama_qc: "",
                punya_garansi: false,
                tanggal_garansi: "",
            });
            setFotoBarang([]);
            setPreviewImage([]);
            setCurrentSlide(0);
        } catch (error) {
            setAlert({
                show: true,
                message: error.response?.data?.message || "Terjadi kesalahan.",
                variant: "danger",
            });
        }

        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h3 className="text-2xl font-semibold mb-6">Tambah Barang Titipan</h3>

            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                {/* FOTO BARANG */}
                <Form.Group className="mb-6 text-center">
                    <Form.Label>Foto Barang</Form.Label>

                    {previewImage.length > 0 ? (
                        <div className="relative bg-black rounded overflow-hidden max-h-[450px] mb-2">
                            {/* Panah navigasi */}
                            {previewImage.length > 1 && (
                                <>
                                    {/* Panah kiri */}
                                    <button
                                        onClick={() =>
                                            setCurrentSlide((prev) =>
                                                prev === 0 ? previewImage.length - 1 : prev - 1
                                            )
                                        }
                                        className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-black/0 px-2 py-1 border-0"
                                    >
                                        <span className="text-black text-4xl">&#10094;</span>
                                    </button>

                                    {/* Panah kanan */}
                                    <button
                                        onClick={() =>
                                            setCurrentSlide((prev) =>
                                                prev === previewImage.length - 1 ? 0 : prev + 1
                                            )
                                        }
                                        className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-black/0 px-2 py-1 border-0"
                                    >
                                        <span className="text-black text-4xl">&#10095;</span>
                                    </button>
                                </>
                            )}

                            {/* Gambar utama */}
                            <div className="flex justify-center items-center bg-gray-100 h-[440px]">
                                <img
                                    src={previewImage[currentSlide]}
                                    alt={`Preview ${currentSlide + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(currentSlide)}
                                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Tombol Upload */}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                id="fotoInput"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="fotoInput"
                                className="absolute bottom-2 right-2 bg-green-600 text-white rounded-sm w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-green-700 text-lg"
                                title="Tambah Foto"
                            >
                                +
                            </label>
                        </div>
                    ) : (
                        <div className="w-full h-48 flex items-center justify-center border rounded bg-gray-100 text-gray-400 relative">
                            Preview
                            <div className="absolute bottom-2 right-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    id="fotoInput"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="fotoInput"
                                    className="bg-green-600 text-white rounded-sm w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-green-700 text-lg"
                                    title="Tambah Foto"
                                >
                                    +
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Counter jumlah foto */}
                    {previewImage.length > 0 && (
                        <div className="text-center text-muted mt-1">
                            {currentSlide + 1} / {previewImage.length}
                        </div>
                    )}
                </Form.Group>

                {/* FORM DATA */}
                <div className="grid grid-cols-1 gap-4">
                    <Form.Group className="mb-3 position-relative">
                        <Form.Label>Penitip</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cari nama penitip..."
                            value={searchPenitip}
                            onChange={handlePenitipSearch}
                            autoComplete="off"
                            required
                        />
                        {showDropdown && filteredPenitip.length > 0 && (
                            <div className="position-absolute bg-white border rounded shadow w-100 z-10 max-h-60 overflow-auto">
                                {filteredPenitip.map((p) => (
                                    <div
                                        key={p.id_penitip}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSelectPenitip(p)}
                                    >
                                        {p.nama_lengkap}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form.Group>


                    <Form.Group>
                        <Form.Label>Nama Barang</Form.Label>
                        <Form.Control
                            type="text"
                            name="nama_barang"
                            value={form.nama_barang}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Kategori Barang</Form.Label>
                        <Form.Select
                            name="kategori_barang"
                            value={form.kategori_barang}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Kategori</option>
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

                    {form.kategori_barang === "Elektronik & Gadget" && (
                        <>
                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Barang ini memiliki garansi"
                                    checked={form.punya_garansi}
                                    onChange={(e) => setForm({ ...form, punya_garansi: e.target.checked })}
                                />
                            </Form.Group>

                            {form.punya_garansi && (
                                <Form.Group>
                                    <Form.Label>Tanggal Berakhir Garansi</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="tanggal_garansi"
                                        value={form.tanggal_garansi}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            )}
                        </>
                    )}

                    <Form.Group>
                        <Form.Label>Deskripsi</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="deskripsi"
                            value={form.deskripsi}
                            onChange={handleChange}
                            rows={3}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Harga Barang</Form.Label>
                        <Form.Control
                            type="number"
                            name="harga_barang"
                            value={form.harga_barang}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Nama QC</Form.Label>
                        <Form.Control
                            type="text"
                            name="nama_qc"
                            value={form.nama_qc}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </div>

                <div className="text-center mt-5">
                    <Button type="submit" disabled={loading}>
                        {loading ? <Spinner size="sm" animation="border" /> : "Simpan & Titipkan"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
