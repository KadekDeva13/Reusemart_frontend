import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import NotaPenitipanBarang from "../component/NotaPenitipan/NotaPenitipanBarang";

function DetailPenitipanPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [penitipan, setPenitipan] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showEditModal, setShowEditModal] = useState(false);
    const [formEdit, setFormEdit] = useState({
        tanggal_masuk: "",
        tanggal_akhir: "",
        id_qc: "",
    });
    const [qcList, setQcList] = useState([]);


    useEffect(() => {
        fetchDetail();
        fetchQCList();
    }, []);

    const fetchDetail = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8000/api/penitipan/show-detail/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPenitipan(res.data.data);
            console.log("ID dari useParams:", id);
            console.log("Detail penitipan:", res.data);
        } catch (err) {
            console.error("Gagal ambil detail penitipan:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQCList = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8000/api/pegawai/qc", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQcList(res.data.data);
        } catch (err) {
            console.error("Gagal ambil pegawai QC:", err);
        }
    };

    const formatTanggal = (tanggal) => {
        if (!tanggal) return "-";
        const d = new Date(tanggal);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${d.getFullYear()}`;
    };

    const handleDownload = async () => {
        const blob = await pdf(<NotaPenitipanBarang data={penitipan} />).toBlob();
        saveAs(blob, `Nota_Penitipan_${penitipan.id_penitipan}.pdf`);
    };

    const handleDelete = async () => {
        const konfirmasi = window.confirm("Yakin ingin menghapus penitipan ini beserta semua barangnya?");
        if (!konfirmasi) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8000/api/penitipan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Penitipan berhasil dihapus.");
            navigate("/user/gudang/penitipan-daftar");
        } catch (err) {
            console.error("Gagal menghapus penitipan:", err);
            alert("Terjadi kesalahan saat menghapus penitipan.");
        }
    };


    return (
        <div className="overflow-x-auto px-5">
            <div className="min-w-full">
                <div className="mb-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded mb-4"
                    >
                        ← Kembali
                    </button>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Detail Penitipan</h3>

                    {loading ? (
                        <p className="text-gray-500">Memuat data...</p>
                    ) : !penitipan ? (
                        <p className="text-red-500">Data penitipan tidak ditemukan.</p>
                    ) : (
                        <>
                            <div className="bg-white rounded shadow p-4 mb-6 relative">
                                <p><span className="font-semibold">Nama Penitip:</span> {penitipan.penitip?.nama_lengkap || "-"}</p>
                                <p><span className="font-semibold">Tanggal Masuk:</span> {formatTanggal(penitipan.tanggal_masuk)}</p>
                                <p><span className="font-semibold">Tanggal Akhir:</span> {formatTanggal(penitipan.tanggal_akhir)}</p>
                                <p><span className="font-semibold">Pegawai QC:</span> P{penitipan.pegawaiqc?.id_pegawai} - {penitipan.pegawaiqc?.nama_lengkap || "-"}</p>
                                <div className="absolute bottom-2 right-4">
                                    <button
                                        onClick={handleDownload}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow"
                                    >
                                        Cetak Nota
                                    </button>

                                    {/* <button
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow"
                                    >
                                        Hapus Penitipan
                                    </button> */}

                                    <button
                                        onClick={() => {
                                            setFormEdit({
                                                tanggal_masuk: penitipan.tanggal_masuk || "",
                                                tanggal_akhir: penitipan.tanggal_akhir || "",
                                                id_qc: penitipan.pegawaiqc?.id_pegawai || "",
                                            });
                                            setShowEditModal(true);
                                        }}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded shadow mr-2"
                                    >
                                        Edit
                                    </button>


                                </div>
                            </div>

                            <div className="bg-white rounded shadow overflow-x-auto">
                                <table className="w-full text-base text-center border">
                                    <thead className="bg-green-100 text-gray-800 font-semibold">
                                        <tr>
                                            <th className="py-3 border">No</th>
                                            <th className="py-3 border">Nama Barang</th>
                                            <th className="py-3 border">Kategori</th>
                                            <th className="py-3 border">Harga</th>
                                            <th className="py-3 border">Status</th>
                                            <th className="py-3 border">Foto Utama</th>
                                            <th className="py-3 border"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {penitipan.barang?.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-4 text-gray-500">
                                                    Belum ada barang.
                                                </td>
                                            </tr>
                                        ) : (
                                            penitipan.barang.map((barang, index) => (
                                                <tr key={barang.id_barang} className="hover:bg-gray-50">
                                                    <td className="py-2 border">{index + 1}</td>
                                                    <td className="py-2 border">{barang.nama_barang}</td>
                                                    <td className="py-2 border">{barang.kategori_barang}</td>
                                                    <td className="py-2 border">
                                                        Rp {barang.harga_barang?.toLocaleString("id-ID")}
                                                    </td>
                                                    <td className="py-2 border capitalize">{barang.status_barang}</td>
                                                    <td className="py-2 border">
                                                        {barang.foto_barang?.length > 0 ? (
                                                            <div className="flex flex-wrap justify-center gap-2">
                                                                {barang.foto_barang.map((foto, i) => (
                                                                    <img
                                                                        key={i}
                                                                        src={`http://localhost:8000/storage/${foto.foto_barang}`}
                                                                        alt={`foto-${i}`}
                                                                        className="w-24 h-24 object-cover rounded"
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm italic">Tidak ada foto</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 border">
                                                        <button
                                                            onClick={() => navigate(`/user/gudang/edit-barang/${barang.id_barang}?readonly=true`)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            Detail
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow">
                        <h4 className="text-lg font-semibold mb-4">Edit Penitipan</h4>
                        <div className="mb-3">
                            <label className="block mb-1 font-medium">Tanggal Masuk</label>
                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2"
                                value={formEdit.tanggal_masuk}
                                onChange={(e) =>
                                    setFormEdit({ ...formEdit, tanggal_masuk: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1 font-medium">Tanggal Akhir</label>
                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2"
                                value={formEdit.tanggal_akhir}
                                onChange={(e) =>
                                    setFormEdit({ ...formEdit, tanggal_akhir: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Pegawai QC</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formEdit.id_qc}
                                onChange={(e) =>
                                    setFormEdit({ ...formEdit, id_qc: e.target.value })
                                }
                            >
                                <option value="">-- Pilih Pegawai QC --</option>
                                {qcList.map((qc) => (
                                    <option key={qc.id_pegawai} value={qc.id_pegawai}>
                                        {qc.nama_lengkap}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("token");
                                        await axios.put(
                                            `http://localhost:8000/api/penitipan/${id}`,
                                            {
                                                tanggal_masuk: formEdit.tanggal_masuk,
                                                tanggal_akhir: formEdit.tanggal_akhir,
                                                id_qc: formEdit.id_qc,
                                            },
                                            {
                                                headers: { Authorization: `Bearer ${token}` },
                                            }
                                        );
                                        alert("Penitipan berhasil diperbarui.");
                                        setShowEditModal(false);
                                        fetchDetail(); // refresh
                                    } catch (err) {
                                        console.error("Gagal update penitipan:", err);
                                        alert("Gagal menyimpan perubahan.");
                                    }
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default DetailPenitipanPage;
