import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/utils/api";

const TambahMerchandisePage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nama_merchandise: "",
        poin_penukaran: 0,
        stock: 0,
    });
    const [fotoList, setFotoList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFotoChange = (e) => {
        const files = Array.from(e.target.files);
        setFotoList(files);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await API.post(
                "/api/merchandise/tambah",
                form,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const id_merchandise = res.data.data.id_merchandise;

            for (let i = 0; i < fotoList.length; i++) {
                const formData = new FormData();
                formData.append("foto_merchandise", fotoList[i]);

                await API.post(
                    `/api/merchandise/${id_merchandise}/upload-foto`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            alert("Berhasil menambahkan merchandise.");
            navigate("/user/admin/merchandise-daftar");
        } catch (err) {
            console.error("Gagal menambah merchandise:", err);
            alert("Terjadi kesalahan saat menyimpan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-5">
            <h2 className="text-2xl font-bold mb-6">Tambah Merchandise</h2>

            <label className="block mb-2 font-semibold">Nama Merchandise</label>
            <input
                type="text"
                className="w-full border p-2 rounded mb-4 bg-white"
                value={form.nama_merchandise}
                onChange={(e) =>
                    setForm({ ...form, nama_merchandise: e.target.value })
                }
            />

            <label className="block mb-2 font-semibold">Poin Penukaran</label>
            <input
                type="number"
                min="0"
                className="w-full border p-2 rounded mb-4 bg-white"
                value={form.poin_penukaran}
                onChange={(e) =>
                    setForm({
                        ...form,
                        poin_penukaran: parseInt(e.target.value) || 0,
                    })
                }
            />

            <label className="block mb-2 font-semibold">Stok Merchandise</label>
            <input
                type="number"
                min="0"
                className="w-full border p-2 rounded mb-4 bg-white"
                value={form.stock}
                onChange={(e) =>
                    setForm({
                        ...form,
                        stock: parseInt(e.target.value) || 0,
                    })
                }
            />

            <label className="block mb-2 font-semibold">Foto Merchandise</label>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFotoChange}
                className="mb-4 bg-white"
            />

            <div className="flex gap-2 flex-wrap mb-4">
                {fotoList.map((file, idx) => (
                    <div key={idx} className="w-20 h-20 border rounded overflow-hidden">
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${idx}`}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
                {loading ? "Menyimpan..." : "Simpan Merchandise"}
            </button>
        </div>
    );
};

export default TambahMerchandisePage;
