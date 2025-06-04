import React, { useEffect, useState } from "react";
import axios from "axios";

function DaftarMerchandisePage() {
    const [merchandiseList, setMerchandiseList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMerchandise();
    }, []);

    const fetchMerchandise = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/merchandise", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMerchandiseList(res.data.data || []);
        } catch (err) {
            console.error("Gagal fetch merchandise:", err);
            setMerchandiseList([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredList = merchandiseList.filter((item) => {
        const keyword = searchQuery.toLowerCase();
        const regex = new RegExp(`\\b${keyword}`, "i");

        const nama = item.nama_merchandise || "";
        const kategori = item.kategori || "";
        const pegawai = item.pegawai?.nama_lengkap || "";

        if (searchBy === "nama") {
            return regex.test(nama);
        } else if (searchBy === "kategori") {
            return regex.test(kategori);
        } else if (searchBy === "pegawai") {
            return regex.test(pegawai);
        } else {
            return regex.test(nama) || regex.test(kategori) || regex.test(pegawai);
        }
    });

    return (
        <div className="overflow-x-auto px-5">
            <div className="min-w-full">
                <h3 className="text-4xl font-semibold mb-4">Daftar Merchandise</h3>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <input
                        type="text"
                        className="form-control border px-3 py-2 rounded w-full md:w-1/2"
                        placeholder="Cari merchandise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="form-select border px-3 py-2 rounded w-full md:w-1/3"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="all">Semua Field</option>
                        <option value="nama">Nama Merchandise</option>
                        <option value="kategori">Kategori</option>
                        <option value="pegawai">Pegawai</option>
                    </select>
                </div>

                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-sm text-center border">
                        <thead className="bg-green-100 text-gray-800 font-semibold">
                            <tr>
                                <th className="py-3 border">No</th>
                                <th className="py-3 border">Foto</th>
                                <th className="py-3 border">Nama</th>
                                <th className="py-3 border">Kategori</th>
                                <th className="py-3 border">Pegawai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-6 text-gray-500">Memuat data...</td>
                                </tr>
                            ) : filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-6 text-gray-500">Tidak ada merchandise ditemukan.</td>
                                </tr>
                            ) : (
                                filteredList.map((item, index) => (
                                    <tr key={item.id_merchandise} className="hover:bg-gray-50">
                                        <td className="py-2 border">{index + 1}</td>
                                        <td className="py-2 border">
                                            {item.foto_merchandise?.length > 0 ? (
                                                <img
                                                    src={`http://localhost:8000/storage/${item.foto_merchandise[0].foto_merchandise}`}
                                                    alt="foto"
                                                    className="w-16 h-16 object-cover rounded mx-auto"
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">Tidak ada foto</span>
                                            )}
                                        </td>
                                        <td className="py-2 border">{item.nama_merchandise}</td>
                                        <td className="py-2 border">{item.kategori}</td>
                                        <td className="py-2 border">{item.pegawai?.nama_lengkap || "-"}</td>
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

export default DaftarMerchandisePage;
