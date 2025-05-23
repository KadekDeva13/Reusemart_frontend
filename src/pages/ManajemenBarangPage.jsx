import React, { useEffect, useState } from "react";
import axios from "axios";

const ManajemenBarangPage = () => {
    const [barangList, setBarangList] = useState([]);

    useEffect(() => {
        fetchBarang();
    }, []);

    const fetchBarang = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/barang/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Data barang dari API:", res.data);
            setBarangList(res.data.barang || []);
        } catch (err) {
            console.error("Gagal mengambil data barang:", err);
        }
    };

    const handleEdit = (barang) => {
        console.log("Edit barang:", barang);
        // implementasi modal bisa menyusul
    };

    return (
        <div className="overflow-x-auto px-5">
            <h2 className="text-center mb-4 display-5">Manajemen Barang</h2>

            <table
                className="w-full table-fixed text-center align-middle border border-gray-300 border-collapse text-sm"
                style={{ backgroundColor: "white" }}
            >
                <thead className="bg-green-100 font-semibold text-gray-700">
                    <tr>
                        <th className="w-[5%] border border-gray-300 px-3 py-3">No</th>
                        {/* <th className="w-[10%] border border-gray-300 px-3 py-3">Foto</th> */}
                        <th className="w-[25%] border border-gray-300 px-3 py-3">Nama Barang</th>
                        <th className="w-[20%] border border-gray-300 px-3 py-3">Kategori</th>
                        <th className="w-[15%] border border-gray-300 px-3 py-3">Status</th>
                        <th className="w-[10%] border border-gray-300 px-3 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {barangList.length > 0 ? (
                        barangList.map((item, index) => (
                            <tr key={item.id_barang} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
                                {/* <td className="border border-gray-300 px-2 py-2">
                                    <img
                                        src={
                                            item.foto_barang?.[0]?.url_foto
                                                ? `http://localhost:8000/storage/${item.foto_barang[0].url_foto}`
                                                : "https://via.placeholder.com/40"
                                        }
                                        alt="Foto Barang"
                                        className="w-10 h-10 object-cover rounded mx-auto"
                                    />
                                </td> */}
                                <td className="border border-gray-300 px-2 py-2 text-left">
                                    <div className="font-semibold">{item.nama_barang}</div>
                                    <div className="text-sm text-gray-500">{item.deskripsi}</div>
                                </td>
                                <td className="border border-gray-300 px-2 py-2">{item.kategori_barang}</td>
                                <td className="border border-gray-300 px-2 py-2">{item.status_barang}</td>
                                <td className="border border-gray-300 px-2 py-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4 text-gray-500">
                                Tidak ada data barang.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManajemenBarangPage;
