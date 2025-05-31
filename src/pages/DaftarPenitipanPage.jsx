import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DaftarPenitipanPage() {
    const [penitipanList, setPenitipanList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState("all");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPenitipan();
    }, []);

    const fetchPenitipan = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/penitipan/show-all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPenitipanList(res.data || []);
            console.log("Data penitipan:", res.data);
        } catch (err) {
            console.error("Gagal fetch data penitipan:", err);
            setPenitipanList([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredList = penitipanList.filter((item) => {
        const keyword = searchQuery.toLowerCase();
        const regex = new RegExp(`\\b${keyword}`, "i");

        const namaPenitip = item.penitip?.nama_lengkap || "";
        const daftarNamaBarang = item.barang?.map((b) => b.nama_barang).join(" ") || "";

        if (searchBy === "penitip") {
            return regex.test(namaPenitip);
        } else if (searchBy === "barang") {
            return regex.test(daftarNamaBarang);
        } else {
            return (
                regex.test(namaPenitip) ||
                regex.test(daftarNamaBarang)
            );
        }
    });


    function formatTanggal(tanggal) {
        if (!tanggal) return "-";
        const d = new Date(tanggal);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${d.getFullYear()}`;
    }

    return (
        <div className="overflow-x-auto px-5">
            <div className="min-w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-4xl font-semibold">Daftar Penitipan</h3>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <input
                        type="text"
                        className="form-control border px-3 py-2 rounded w-full md:w-1/2"
                        placeholder="Cari penitipan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="form-select border px-3 py-2 rounded w-full md:w-1/3"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="all">Semua Field</option>
                        <option value="penitip">Nama Penitip</option>
                        <option value="barang">Nama Barang</option>
                    </select>
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-sm text-center border">
                        <thead className="bg-green-100 text-gray-800 font-semibold">
                            <tr>
                                <th className="py-3 border">No</th>
                                <th className="py-3 border">Nama Penitip</th>
                                <th className="py-3 border">Tanggal Masuk</th>
                                <th className="py-3 border">Barang</th>
                                <th className="py-3 border"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-6 text-gray-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-6 text-gray-500">
                                        Tidak ada data penitipan.
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((item, index) => (
                                    <tr key={item.id_penitipan} className="hover:bg-gray-50">
                                        <td className="py-2 border">{index + 1}</td>
                                        <td className="py-2 border">{item.penitip?.nama_lengkap || "-"}</td>
                                        <td className="py-2 border">{formatTanggal(item.tanggal_masuk)}</td>
                                        <td className="py-2 border text-left">
                                            {item.barang?.length > 0 ? (
                                                <ul className="list-disc list-inside text-sm text-gray-700">
                                                    {item.barang.map((b, i) => (
                                                        <li key={i}>{b.nama_barang}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                                    Belum ada barang
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-2 border">
                                            <button
                                                onClick={() =>
                                                    navigate(`/user/gudang/penitipan-detail/${item.id_penitipan}`)
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                                            >
                                                Detail Penitipan
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DaftarPenitipanPage;
