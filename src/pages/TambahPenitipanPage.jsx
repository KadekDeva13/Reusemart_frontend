import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TambahPenitipanPage = () => {
    const [step, setStep] = useState(1);
    const [penitipList, setPenitipList] = useState([]);
    const [barangList, setBarangList] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id_penitip: "",
        nama_qc: "",
        nama_barang: "",
        kategori_barang: "",
        deskripsi: "",
        harga_barang: "",
        stock: 1,
        status_barang: "tersedia",
        tanggal_garansi: "",
        foto_barang: [],
    });

    useEffect(() => {
        fetchPenitip();
    }, []);

    const fetchPenitip = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/penitip/all", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setPenitipList(res.data.data || []);
    };

    const handleBarangAdd = () => {
        if (!form.nama_barang) return alert("Isi nama barang");
        setBarangList([...barangList, { ...form }]);
        setForm((prev) => ({
            ...prev,
            nama_barang: "",
            kategori_barang: "",
            deskripsi: "",
            harga_barang: "",
            stock: 1,
            status_barang: "tersedia",
            tanggal_garansi: "",
            foto_barang: [],
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // 1. Buat penitipan
            const res = await axios.post(
                "http://localhost:8000/api/penitipan/full-store",
                {
                    id_penitip: form.id_penitip,
                    nama_qc: form.nama_qc,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const id_penitipan = res.data.data.id_penitipan;

            // 2. Simpan barang satu per satu
            for (const barang of barangList) {
                const formData = new FormData();
                formData.append("nama_barang", barang.nama_barang);
                formData.append("kategori_barang", barang.kategori_barang);
                formData.append("deskripsi", barang.deskripsi);
                formData.append("harga_barang", barang.harga_barang);
                formData.append("stock", barang.stock);
                formData.append("status_barang", barang.status_barang);
                if (barang.tanggal_garansi)
                    formData.append("tanggal_garansi", barang.tanggal_garansi);
                for (let foto of barang.foto_barang) {
                    formData.append("foto_barang[]", foto);
                }

                await axios.post(
                    `http://localhost:8000/api/penitipan/barang/${id_penitipan}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            alert("Penitipan dan semua barang berhasil ditambahkan.");
            navigate("/user/gudang/penitipan-daftar");
        } catch (err) {
            console.error("Gagal submit penitipan:", err);
            alert("Gagal menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    const handleFotoChange = (e) => {
        setForm({ ...form, foto_barang: Array.from(e.target.files) });
    };

    return (
        <div className="overflow-x-auto px-5">
            <div className="min-w-full">
                <h2 className="text-2xl font-bold mb-4">Tambah Penitipan Barang</h2>

                {step === 1 && (
                    <>
                        <label className="block mb-2">Pilih Penitip:</label>
                        <select
                            className="w-full border rounded p-2 mb-4"
                            value={form.id_penitip}
                            onChange={(e) => setForm({ ...form, id_penitip: e.target.value })}
                        >
                            <option value="">-- Pilih Penitip --</option>
                            {penitipList.map((p) => (
                                <option key={p.id_penitip} value={p.id_penitip}>
                                    {p.nama_lengkap}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-2">Nama QC:</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mb-4"
                            value={form.nama_qc}
                            onChange={(e) => setForm({ ...form, nama_qc: e.target.value })}
                        />

                        <button
                            onClick={() => setStep(2)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            disabled={!form.id_penitip || !form.nama_qc}
                        >
                            Lanjut ke Tambah Barang →
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                                <input
                                    type="text"
                                    placeholder="Nama Barang"
                                    className="w-full border p-2 rounded"
                                    value={form.nama_barang}
                                    onChange={(e) => setForm({ ...form, nama_barang: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Barang</label>
                                <select
                                    name="kategori_barang"
                                    value={form.kategori_barang}
                                    onChange={(e) => setForm({ ...form, kategori_barang: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <input
                                    type="text"
                                    placeholder="Deskripsi"
                                    className="w-full border p-2 rounded"
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                                <input
                                    type="number"
                                    placeholder="Harga"
                                    className="w-full border p-2 rounded"
                                    value={form.harga_barang}
                                    onChange={(e) => setForm({ ...form, harga_barang: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                <input
                                    type="number"
                                    placeholder="Stok"
                                    className="w-full border p-2 rounded"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Garansi (opsional)</label>
                                <input
                                    type="date"
                                    className="w-full border p-2 rounded"
                                    value={form.tanggal_garansi}
                                    onChange={(e) => setForm({ ...form, tanggal_garansi: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Barang</label>
                                <input
                                    type="file"
                                    multiple
                                    className="w-full border p-2 rounded"
                                    onChange={handleFotoChange}
                                />
                            </div>

                        </div>


                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setStep(1)}
                            >
                                ← Kembali
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={handleBarangAdd}
                            >
                                + Tambah Barang ke Daftar
                            </button>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-bold mb-2">Daftar Barang Ditambahkan:</h4>
                            {barangList.length === 0 ? (
                                <p className="text-gray-500">Belum ada barang.</p>
                            ) : (
                                <ul className="list-disc pl-5">
                                    {barangList.map((b, i) => (
                                        <li key={i}>{b.nama_barang} - {b.kategori_barang}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mt-6 text-right">
                            <button
                                className="bg-blue-700 text-white px-6 py-2 rounded"
                                onClick={handleSubmit}
                                disabled={barangList.length === 0 || loading}
                            >
                                {loading ? "Menyimpan..." : "✅ Submit Semua"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TambahPenitipanPage;
