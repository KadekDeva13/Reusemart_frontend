import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import API from "@/utils/api";

export default function PenitipanBarangPage() {
    const navigate = useNavigate();
    const { id_barang } = useParams();
    const [searchParams] = useSearchParams();
    const readonly = searchParams.get("readonly") === "true";
    const [editModeAktif, setEditModeAktif] = useState(!readonly);
    const idPenitipanQuery = searchParams.get("id_penitipan");
    const isEditMode = Boolean(id_barang);
    const isTempMode = idPenitipanQuery === "temp";

    const [form, setForm] = useState({
        nama_barang: "",
        kategori_barang: "",
        deskripsi: "",
        harga_barang: "",
        punya_garansi: false,
        tanggal_garansi: "",
    });

    const [fotoBarang, setFotoBarang] = useState([]);
    const [previewImage, setPreviewImage] = useState([]);
    const [fotoHapus, setFotoHapus] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) fetchBarangDetail(id_barang);
    }, []);

    useEffect(() => {
        if (isTempMode) {
            const tempList = JSON.parse(localStorage.getItem("temp_barang_list") || "[]");
            const editIndex = localStorage.getItem("edit_barang_index");

            if (editIndex !== null) {
                const barangToEdit = tempList[parseInt(editIndex, 10)];

                if (barangToEdit) {
                    setEditModeAktif(true);
                    setForm({
                        nama_barang: barangToEdit.nama_barang,
                        kategori_barang: barangToEdit.kategori_barang,
                        deskripsi: barangToEdit.deskripsi,
                        harga_barang: barangToEdit.harga_barang,
                        berat_barang: barangToEdit.berat_barang,
                        punya_garansi: barangToEdit.punya_garansi || false,
                        tanggal_garansi: barangToEdit.tanggal_garansi || "",
                    });

                    // Atur ulang preview image
                    setPreviewImage(barangToEdit.foto_preview || []);

                    const fotoCache = window._fotoBarangCache?.[editIndex];
                    if (fotoCache) {
                        setFotoBarang(fotoCache);
                    }
                }
            }
        }
    }, []);


const fetchBarangDetail = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get(`/api/barang/detail-barang/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const b = res.data.data;

    setForm({
      nama_barang: b.nama_barang,
      kategori_barang: b.kategori_barang,
      deskripsi: b.deskripsi,
      harga_barang: b.harga_barang,
      berat_barang: b.berat_barang,
      punya_garansi: Boolean(b.tanggal_garansi),
      tanggal_garansi: b.tanggal_garansi || "",
    });

    setPreviewImage(
      b.foto_barang.map((f) => ({
        id: f.id_foto,
        url: `${API.defaults.baseURL}/storage/${f.foto_barang}`,
      }))
    );
  } catch (err) {
    console.error("Gagal ambil detail barang:", err);
  }
};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setFotoBarang((prev) => [...prev, ...files]);
        setPreviewImage((prev) => [...prev, ...previews]);
    };

    const handleRemoveImage = (index) => {
        const image = previewImage[index];
        if (image?.id) setFotoHapus((prev) => [...prev, image.id]);
        setPreviewImage((prev) => prev.filter((_, i) => i !== index));

        const oldFotoBaruCount = previewImage.filter((i) => i.file).length;
        const startIndex = previewImage.length - oldFotoBaruCount;
        const uploadIndex = index - startIndex;
        if (uploadIndex >= 0) {
            const updatedFiles = [...fotoBarang];
            updatedFiles.splice(uploadIndex, 1);
            setFotoBarang(updatedFiles);
        }

        setCurrentSlide((prev) => {
            if (index === 0 || previewImage.length <= 1) return 0;
            return prev >= previewImage.length - 1 ? previewImage.length - 2 : prev;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...form,
                stock: 1,
                status_barang: "tersedia",
                tanggal_garansi: form.punya_garansi ? form.tanggal_garansi : "",
            };

            const fotoPreviews = fotoBarang.map((file) => ({
                url: URL.createObjectURL(file),
                fileName: file.name,
            }));

            if (isTempMode) {
                const prev = JSON.parse(localStorage.getItem("temp_barang_list") || "[]");
                const editIndex = localStorage.getItem("edit_barang_index");

                const fotoPreviews = fotoBarang.map((file) => ({
                    url: URL.createObjectURL(file),
                    fileName: file.name,
                }));

                const newBarang = { ...data, foto_preview: fotoPreviews };

                let updatedList;

                if (editIndex !== null) {
                    // 🔁 Mode edit: ganti data di index tersebut
                    const index = parseInt(editIndex, 10);
                    updatedList = [...prev];
                    updatedList[index] = newBarang;

                    // Hapus index dari localStorage setelah selesai
                    localStorage.removeItem("edit_barang_index");

                    alert("Barang berhasil diperbarui di daftar sementara.");
                } else {
                    // ➕ Mode tambah: tambahkan barang baru
                    updatedList = [...prev, newBarang];
                    alert("Barang berhasil ditambahkan ke daftar sementara.");
                }

                // Simpan list ke localStorage
                localStorage.setItem("temp_barang_list", JSON.stringify(updatedList));

                // Simpan file asli ke cache (untuk upload nanti)
                window._fotoBarangCache = window._fotoBarangCache || [];

                if (editIndex !== null) {
                    // Ganti cache lama kalau edit
                    window._fotoBarangCache[parseInt(editIndex)] = fotoBarang;
                } else {
                    // Tambah cache baru kalau tambah
                    window._fotoBarangCache.push(fotoBarang);
                }

                // Pindah step dan navigasi
                localStorage.setItem("penitipan_step", "2");
                navigate("/user/gudang/penitipan-tambah");
                return;
            }

            else if (isEditMode) {
                const token = localStorage.getItem("token");
                const formData = new FormData();
                formData.append("nama_barang", form.nama_barang);
                formData.append("kategori_barang", form.kategori_barang);
                formData.append("deskripsi", form.deskripsi);
                formData.append("harga_barang", form.harga_barang);
                formData.append("berat_barang", form.berat_barang);
                formData.append("stock", 1);
                formData.append("status_barang", "tersedia");
                formData.append("tanggal_garansi", form.punya_garansi ? form.tanggal_garansi : "");
                fotoBarang.forEach((file) => formData.append("foto_barang[]", file));
                fotoHapus.forEach((id) => formData.append("foto_hapus[]", id));

                await API.post(`/api/barang/update/${id_barang}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                localStorage.setItem("penitipanSuccess", "Barang berhasil diperbarui!");
                navigate(-1);
            } else {
                const token = localStorage.getItem("token");
                const id_penitip = localStorage.getItem("penitipan_id_penitip");
                const id_hunter = localStorage.getItem("penitipan_id_hunter");
                if (!id_penitip || !id_hunter) {
                    alert("Data penitipan belum lengkap. Silakan ulangi dari awal.");
                    setLoading(false);
                    return;
                }

                const formData = new FormData();
                formData.append("id_penitip", id_penitip);
                formData.append("id_pegawai", id_hunter); // Hunter masuk ke id_pegawai
                formData.append("nama_barang", form.nama_barang);
                formData.append("kategori_barang", form.kategori_barang);
                formData.append("deskripsi", form.deskripsi);
                formData.append("harga_barang", form.harga_barang);
                formData.append("berat_barang", form.berat_barang);
                formData.append("stock", 1);
                formData.append("status_barang", "tersedia");
                formData.append("tanggal_garansi", form.punya_garansi ? form.tanggal_garansi : "");
                fotoBarang.forEach((file) => formData.append("foto_barang[]", file));

                await API.post("/api/barang/store", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                localStorage.setItem("penitipanSuccess", "Barang berhasil dititipkan!");
                navigate(-1)
            }
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-4">
                {readonly && (
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Kembali ke Detail Penitipan
                    </Button>
                )}
            </div>
            <div className="flex justify-between items-center mb-4">

                <h3 className="text-2xl font-semibold">
                    {isTempMode
                        ? editModeAktif
                            ? "Edit Barang Titipan"
                            : "Tambah Barang Titipan"
                        : editModeAktif
                            ? "Edit Barang Titipan"
                            : "Detail Barang Titipan"
                    }
                </h3>
                {readonly && (
                    <div className="text-right">
                        {editModeAktif ? (
                            <Button variant="outline-danger" onClick={() => setEditModeAktif(false)}>
                                Batal Edit
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={() => setEditModeAktif(true)}>
                                Edit Data Barang
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <Form onSubmit={handleSubmit}>
                {/* FOTO */}
                <Form.Group className="mb-6 text-center">
                    <Form.Label>Foto Barang</Form.Label>

                    {previewImage.length > 0 ? (
                        <div className="relative bg-black rounded overflow-hidden max-h-[450px] mb-2">
                            {previewImage.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentSlide((prev) =>
                                                prev === 0 ? previewImage.length - 1 : prev - 1
                                            )
                                        }
                                        className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-black/0 px-2 py-1 border-0"
                                    >
                                        <span className="text-black text-4xl">&#10094;</span>
                                    </button>
                                    <button
                                        type="button"
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

                            <div className="flex justify-center items-center bg-gray-100 h-[440px]">
                                <img
                                    src={previewImage[currentSlide]?.url || ""}
                                    alt={`Preview ${currentSlide + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                                {(editModeAktif || !readonly) && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(currentSlide)}
                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {(editModeAktif || !readonly) && (
                                <>
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
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-48 flex items-center justify-center border rounded bg-gray-100 text-gray-400 relative">
                            Preview
                            {(editModeAktif || !readonly) && (
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
                                    >
                                        +
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                    {previewImage.length > 0 && (
                        <div className="text-center text-muted mt-1">
                            {currentSlide + 1} / {previewImage.length}
                        </div>
                    )}
                </Form.Group>

                {/* FORM FIELD */}
                <div className="grid grid-cols-1 gap-4">
                    <Form.Group>
                        <Form.Label>Nama Barang</Form.Label>
                        <Form.Control
                            type="text"
                            name="nama_barang"
                            value={form.nama_barang}
                            onChange={handleChange}
                            readOnly={readonly && !editModeAktif}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Kategori Barang</Form.Label>
                        <Form.Select
                            name="kategori_barang"
                            value={form.kategori_barang}
                            onChange={handleChange}
                            disabled={readonly && !editModeAktif}
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
                                    onChange={(e) =>
                                        setForm({ ...form, punya_garansi: e.target.checked })
                                    }
                                    disabled={readonly && !editModeAktif}
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
                                        readOnly={readonly && !editModeAktif}
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
                            readOnly={readonly && !editModeAktif}
                            rows={3}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Harga Barang</Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Rp</InputGroup.Text>
                            <Form.Control
                                type="number"
                                name="harga_barang"
                                value={form.harga_barang}
                                onChange={handleChange}
                                readOnly={readonly && !editModeAktif}
                                required
                            />
                        </InputGroup>
                    </Form.Group>


                    <Form.Group>
                        <Form.Label>Berat Barang (kg)</Form.Label>
                        <Form.Control
                            type="number"
                            name="berat_barang"
                            value={form.berat_barang}
                            onChange={handleChange}
                            readOnly={readonly && !editModeAktif}
                            required
                        />
                    </Form.Group>
                </div>

                {(!readonly || editModeAktif) && (
                    <div className="text-center mt-5">
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <Spinner size="sm" animation="border" />
                            ) : isEditMode ? (
                                "Update Barang"
                            ) : (
                                "Simpan & Titipkan"
                            )}
                        </Button>
                    </div>
                )}

            </Form>
        </div>
    );
}
