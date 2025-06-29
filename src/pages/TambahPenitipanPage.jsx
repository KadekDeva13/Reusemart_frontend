import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/utils/api";

const TambahPenitipanPage = () => {
    const [penitipList, setPenitipList] = useState([]);
    const [hunterList, setHunterList] = useState([]);
    const [qcList, setQcList] = useState([]);
    const [searchHunter, setSearchHunter] = useState("");
    const [filteredHunter, setFilteredHunter] = useState([]);
    const [showHunterDropdown, setShowHunterDropdown] = useState(false);
    const [barangList, setBarangList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [step, setStep] = useState(() => {
        const saved = localStorage.getItem("penitipan_step");
        return saved ? parseInt(saved) : 1;
    });

    const navigate = useNavigate();

    const [form, setForm] = useState({
        id_penitip: "",
        id_hunter: "",
        id_qc: "",
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
        fetchHunter();
        fetchQcList();
    }, []);

    useEffect(() => {
        localStorage.setItem("penitipan_step", step.toString());
    }, [step]);

    useEffect(() => {
        const savedStep = localStorage.getItem("penitipan_step");
        if (savedStep) setStep(parseInt(savedStep));

        const savedForm = localStorage.getItem("penitipan_form");
        if (savedForm) {
            setForm((prev) => ({
                ...prev,
                ...JSON.parse(savedForm),
                id_hunter: localStorage.getItem("penitipan_id_hunter") || "",
            }));
        }

        const tempBarang = JSON.parse(localStorage.getItem("temp_barang_list") || "[]");
        setBarangList(tempBarang);

        window._fotoBarangCache = window._fotoBarangCache || [];
    }, []);

    useEffect(() => {
        if (step === 1 && form.id_hunter) {
            const hunter = hunterList.find((h) => h.id_pegawai === parseInt(form.id_hunter));
            if (hunter) {
                setSearchHunter(hunter.nama_lengkap);
            }
        }
    }, [step, form.id_hunter, hunterList]);


    const fetchPenitip = async () => {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/penitip/all", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setPenitipList(res.data.data || []);
    };

    const fetchHunter = async () => {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/pegawai/hunter", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setHunterList(res.data.data || []);
    };

    const fetchQcList = async () => {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/pegawai/qc", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setQcList(res.data.data || []);
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

            const res = await API.post(
                "/api/penitipan/full-store",
                {
                    id_penitip: form.id_penitip,
                    id_qc: form.id_qc,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const id_penitipan = res.data.data.id_penitipan;

            const fotoCache = window._fotoBarangCache || [];

            console.log("ID Pegawai (hunter) dikirim:", form.id_hunter);

            for (let i = 0; i < barangList.length; i++) {
                const barang = barangList[i];
                const formData = new FormData();
                formData.append("nama_barang", barang.nama_barang);
                formData.append("kategori_barang", barang.kategori_barang);
                formData.append("deskripsi", barang.deskripsi);
                formData.append("harga_barang", barang.harga_barang);
                formData.append("berat_barang", barang.berat_barang);
                formData.append("stock", barang.stock);
                formData.append("status_barang", barang.status_barang);

                formData.append("id_pegawai", form.id_hunter);

                if (barang.tanggal_garansi)
                    formData.append("tanggal_garansi", barang.tanggal_garansi);

                const fileSet = fotoCache[i] || [];
                fileSet.forEach((file) => {
                    formData.append("foto_barang[]", file);
                });

                await API.post(
                    `/api/penitipan/barang/${id_penitipan}`,
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
            localStorage.removeItem("penitipan_step");
            localStorage.removeItem("penitipan_form");
            localStorage.removeItem("penitipan_id_penitip");
            localStorage.removeItem("penitipan_id_hunter");
            localStorage.removeItem("temp_barang_list");
            localStorage.removeItem("edit_barang_index");
            window._fotoBarangCache = [];
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

                        <label className="block mb-2">Cari Hunter (Opsional):</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2 mb-4"
                            placeholder="Ketik nama hunter..."
                            value={searchHunter}
                            onChange={(e) => {
                                const keyword = e.target.value;
                                setSearchHunter(keyword);
                                if (!keyword.trim()) {
                                    setFilteredHunter(hunterList);
                                    setShowHunterDropdown(false);
                                    return;
                                }
                                const filtered = hunterList.filter((h) =>
                                    h.nama_lengkap.toLowerCase().includes(keyword.toLowerCase())
                                );
                                setFilteredHunter(filtered);
                                setShowHunterDropdown(true);
                            }}
                            onFocus={() => {
                                if (!searchHunter.trim()) {
                                    setFilteredHunter(hunterList);
                                } else {
                                    const filtered = hunterList.filter((h) =>
                                        h.nama_lengkap.toLowerCase().includes(searchHunter.toLowerCase())
                                    );
                                    setFilteredHunter(filtered);
                                }
                                setShowHunterDropdown(true);
                            }}
                            autoComplete="off"
                        />
                        {showHunterDropdown && filteredHunter.length > 0 && (
                            <div className="border rounded shadow bg-white max-h-40 overflow-auto mb-4">
                                {filteredHunter.map((h) => (
                                    <div
                                        key={h.id_pegawai}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSearchHunter(h.nama_lengkap);
                                            setFilteredHunter([]);
                                            setShowHunterDropdown(false);
                                            localStorage.setItem("penitipan_id_hunter", h.id_pegawai);
                                            setForm((prev) => ({
                                                ...prev,
                                                id_hunter: h.id_pegawai,
                                            }));
                                        }}
                                    >
                                        {h.nama_lengkap}
                                    </div>
                                ))}
                            </div>
                        )}

                        <label className="block mb-2">Pilih QC:</label>
                        <select
                            className="w-full border rounded p-2 mb-4"
                            value={form.id_qc}
                            onChange={(e) => setForm({ ...form, id_qc: e.target.value })}
                        >
                            <option value="">-- Pilih QC --</option>
                            {qcList.map((qc) => (
                                <option key={qc.id_pegawai} value={qc.id_pegawai}>
                                    {qc.nama_lengkap}
                                </option>
                            ))}
                        </select>


                        <button
                            onClick={() => {
                                // simpan sebelum lanjut
                                localStorage.setItem("penitipan_form", JSON.stringify({
                                    id_penitip: form.id_penitip,
                                    id_hunter: form.id_hunter,
                                    id_qc: form.id_qc,
                                }));
                                setStep(2);
                            }}
                            disabled={!form.id_penitip || !form.id_qc}
                        >
                            Lanjut ke Tambah Barang →
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Daftar Barang Titipan</h3>
                            <button
                                onClick={() => {
                                    // Simpan ke localStorage
                                    localStorage.setItem("penitipan_form", JSON.stringify({
                                        id_penitip: form.id_penitip,
                                        id_hunter: form.id_hunter,
                                        id_qc: form.id_qc,
                                    }));
                                    localStorage.removeItem("edit_barang_index");
                                    navigate(`/user/gudang/tambah-barang?id_penitipan=temp`);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                + Tambah Barang
                            </button>
                        </div>

                        <div className="bg-white rounded shadow overflow-x-auto">
                            <table className="w-full text-sm text-center border">
                                <thead className="bg-green-100 text-gray-800 font-semibold">
                                    <tr>
                                        <th className="py-3 border">No</th>
                                        <th className="py-3 border">Nama Barang</th>
                                        <th className="py-3 border">Kategori</th>
                                        <th className="py-3 border">Harga</th>
                                        <th className="py-3 border">Stok</th>
                                        <th className="py-3 border">Status</th>
                                        <th className="py-3 border">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {barangList.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-4 text-gray-500">
                                                Belum ada barang ditambahkan.
                                            </td>
                                        </tr>
                                    ) : (
                                        barangList.map((barang, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border py-2">{index + 1}</td>
                                                <td className="border py-2">{barang.nama_barang}</td>
                                                <td className="border py-2">{barang.kategori_barang}</td>
                                                <td className="border py-2">Rp {Number(barang.harga_barang).toLocaleString("id-ID")}</td>
                                                <td className="border py-2">{barang.stock}</td>
                                                <td className="border py-2 capitalize">{barang.status_barang}</td>
                                                <td className="border py-2 flex justify-center gap-2">
                                                    {/* Tombol Edit */}
                                                    <button
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                                                        onClick={() => {
                                                            // Simpan index ke localStorage agar bisa dipakai saat load halaman edit
                                                            localStorage.setItem("edit_barang_index", index);
                                                            navigate(`/user/gudang/tambah-barang?id_penitipan=temp`);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* Tombol Hapus */}
                                                    <button
                                                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                                        onClick={() => {
                                                            const confirmHapus = window.confirm("Yakin ingin menghapus barang ini?");
                                                            if (!confirmHapus) return;

                                                            const updatedList = barangList.filter((_, i) => i !== index);
                                                            setBarangList(updatedList);
                                                            localStorage.setItem("temp_barang_list", JSON.stringify(updatedList));
                                                        }}
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    const savedForm = localStorage.getItem("penitipan_form");
                                    if (savedForm) {
                                        setForm((prev) => ({
                                            ...prev,
                                            ...JSON.parse(savedForm),
                                            id_hunter: localStorage.getItem("penitipan_id_hunter") || "",
                                        }));
                                    }
                                    setStep(1);
                                }}
                            >
                                ← Kembali
                            </button>

                            <button
                                className="bg-blue-700 text-white px-6 py-2 rounded"
                                onClick={handleSubmit}
                                disabled={barangList.length === 0 || loading}
                            >
                                {loading ? "Menyimpan..." : "Submit Semua Barang"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TambahPenitipanPage;
