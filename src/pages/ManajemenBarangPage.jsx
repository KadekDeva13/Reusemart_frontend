import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ManajemenBarangPage = () => {
    const location = useLocation();
    const [barangList, setBarangList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
        fetchBarang();
    }, []);

    useEffect(() => {
        const message = localStorage.getItem("penitipanSuccess");

        if (message) {
            toast.success(message, {
                position: "top-right",
                autoClose: 2000,
            });

            localStorage.removeItem("penitipanSuccess"); // supaya tidak muncul lagi
        }
    }, []);

    const fetchBarang = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/barang/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBarangList(res.data.barang || []);
        } catch (err) {
            console.error("Gagal mengambil data barang:", err);
        }
    };

    const handleEdit = (barang) => {
        console.log("Edit barang:", barang);
        // Implementasi modal detail menyusul
    };

    const filteredBarang = barangList.filter((item) => {
        const keyword = searchQuery.toLowerCase();
        const regex = new RegExp(`\\b${keyword}`, 'i');

        if (searchBy === "nama_barang") {
            return regex.test(item.nama_barang || "");
        } else if (searchBy === "kategori_barang") {
            return regex.test(item.kategori_barang || "");
        } else if (searchBy === "penitip") {
            return regex.test(item.penitip?.nama_lengkap || "");
        } else {
            return (
                regex.test(item.nama_barang || "") ||
                regex.test(item.kategori_barang || "") ||
                regex.test(item.penitip?.nama_lengkap || "")
            );
        }
    });

    return (
        <div className="overflow-x-auto px-5">
            <div className="min-w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-4xl font-semibold">Manajemen Barang</h2>
                    <button
                        onClick={() => navigate("/user/gudang/tambah-barang")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm mt-2 md:mt-0"
                    >
                        + Tambah Barang
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <input
                        type="text"
                        className="form-control border px-3 py-2 rounded w-full md:w-1/2"
                        placeholder="Cari barang..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="form-select border px-3 py-2 rounded w-full md:w-1/3"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="all">Semua Field</option>
                        <option value="nama_barang">Nama Barang</option>
                        <option value="kategori_barang">Kategori</option>
                        <option value="penitip">Nama Penitip</option>
                    </select>
                </div>

                <table className="w-full table-fixed text-center align-middle border border-gray-300 border-collapse text-sm bg-white">
                    <thead className="bg-green-100 font-semibold text-gray-700">
                        <tr>
                            <th className="w-[5%] border border-gray-300 px-3 py-3">No</th>
                            <th className="w-[10%] border border-gray-300 px-3 py-3">Foto</th>
                            <th className="w-[30%] border border-gray-300 px-3 py-3">Nama Barang</th>
                            <th className="w-[20%] border border-gray-300 px-3 py-3">Kategori</th>
                            <th className="w-[25%] border border-gray-300 px-3 py-3">Nama Penitip</th>
                            <th className="w-[10%] border border-gray-300 px-3 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBarang.length > 0 ? (
                            filteredBarang.map((item, index) => (
                                <tr key={item.id_barang} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-2 py-2">
                                        <img
                                            src={
                                                item.foto_barang?.[0]?.foto_barang
                                                    ? `http://localhost:8000/storage/${item.foto_barang[0].foto_barang}`
                                                    : "https://via.placeholder.com/40"
                                            }
                                            alt="Foto Barang"
                                            className="w-100 h-100 object-cover rounded mx-auto"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-2 py-2 text-left">
                                        <div className="font-semibold text-center">{item.nama_barang}</div>
                                        <div className="text-sm text-gray-500">{item.deskripsi}</div>
                                    </td>
                                    <td className="border border-gray-300 px-2 py-2">{item.kategori_barang}</td>
                                    <td className="border border-gray-300 px-2 py-2">{item.penitip?.nama_lengkap || "-"}</td>
                                    <td className="border border-gray-300 px-2 py-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm"
                                        >
                                            Edit Detail
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    Tidak ada data barang yang cocok.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManajemenBarangPage;
