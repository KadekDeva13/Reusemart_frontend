import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DaftarPenitipanPage() {
    const [penitipanList, setPenitipanList] = useState([]);
    const [search, setSearch] = useState("");
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

    const filteredList = penitipanList.filter((item) =>
        item.penitip?.nama_lengkap?.toLowerCase().includes(search.toLowerCase())
    );

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
                    <button
                        onClick={() => navigate("/user/gudang/penitipan/tambah")}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        + Tambah Penitipan
                    </button>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <input
                        type="text"
                        placeholder="Cari nama penitip..."
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={fetchPenitipan}
                        className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        🔄 Refresh
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-sm text-center border">
                        <thead className="bg-green-100 text-gray-800 font-semibold">
                            <tr>
                                <th className="py-3 border">No</th>
                                <th className="py-3 border">Nama Penitip</th>
                                <th className="py-3 border">Tanggal Masuk</th>
                                <th className="py-3 border">Jumlah Barang</th>
                                <th className="py-3 border">Aksi</th>
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
                                        <td className="py-2 border">
                                            {item.barang?.length > 0 ? (
                                                `${item.barang.length} barang`
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
