import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { X } from "lucide-react";

export default function PenitipanBarangPage() {
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
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

    useEffect(() => {
        fetchPenitip();
    }, []);

    const fetchPenitip = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/penitip/all");
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
        const previews = files.map(file => URL.createObjectURL(file));
        setFotoBarang(prev => [...prev, ...files]);
        setPreviewImage(prev => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = [...fotoBarang];
        const updatedPreviews = [...previewImage];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setFotoBarang(updatedFiles);
        setPreviewImage(updatedPreviews);
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

            fotoBarang.forEach(file => {
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
                "http://localhost:8000/api/penitipan-barang",
                {
                    id_penitip: form.id_penitip,
                    id_barang,
                    nama_qc: form.nama_qc,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setAlert({ show: true, message: "Barang berhasil dititipkan.", variant: "success" });
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
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h3 className="text-lg font-semibold mb-6 text-center">Form Tambah Barang & Penitipan</h3>

            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri: Carousel Foto */}
                    <div>
                        <Form.Group className="mb-3 text-center">
                            <Form.Label>Foto Barang</Form.Label>

                            {previewImage.length > 0 ? (
                                <Carousel
                                    showThumbs={false}
                                    showStatus={false}
                                    renderArrowPrev={(onClickHandler, hasPrev) =>
                                        hasPrev && (
                                            <button
                                                type="button"
                                                onClick={onClickHandler}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                                            >
                                                <span className="text-black text-2xl">&#10094;</span>
                                            </button>
                                        )
                                    }
                                    renderArrowNext={(onClickHandler, hasNext) =>
                                        hasNext && (
                                            <button
                                                type="button"
                                                onClick={onClickHandler}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                            >
                                                <span className="text-black text-2xl">&#10095;</span>
                                            </button>
                                        )
                                    }
                                >

                                    {previewImage.map((src, idx) => (
                                        <div key={idx} className="relative">
                                            <img src={src} alt={`Preview ${idx}`} className="object-contain h-64 rounded" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center border rounded bg-gray-100 text-gray-400">
                                    Preview
                                </div>
                            )}

                            <Form.Control
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="mt-2"
                            />
                        </Form.Group>
                    </div>

                    {/* Kolom Kanan: Form Data */}
                    <div>
                        <Form.Group className="mb-3">
                            <Form.Label>Penitip</Form.Label>
                            <Form.Select name="id_penitip" value={form.id_penitip} onChange={handleChange} required>
                                <option value="">Pilih Penitip</option>
                                {penitipList.map((p) => (
                                    <option key={p.id_penitip} value={p.id_penitip}>
                                        {p.nama_lengkap}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nama Barang</Form.Label>
                            <Form.Control
                                type="text"
                                name="nama_barang"
                                value={form.nama_barang}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
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
                                <Form.Group className="mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        label="Barang ini memiliki garansi"
                                        checked={form.punya_garansi}
                                        onChange={(e) => setForm({ ...form, punya_garansi: e.target.checked })}
                                    />
                                </Form.Group>

                                {form.punya_garansi && (
                                    <Form.Group className="mb-3">
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

                        <Form.Group className="mb-3">
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

                        <Form.Group className="mb-3">
                            <Form.Label>Harga Barang</Form.Label>
                            <Form.Control
                                type="number"
                                name="harga_barang"
                                value={form.harga_barang}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
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
                </div>

                <div className="text-center mt-4">
                    <Button type="submit" disabled={loading}>
                        {loading ? <Spinner size="sm" animation="border" /> : "Simpan & Titipkan"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
