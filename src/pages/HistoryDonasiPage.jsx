import React, { useEffect, useState } from "react";
import ModalKonfirmasiDonasi from "../components/ModalKonfirmasiDonasi";
import API from "@/utils/api";

export default function HistoryDonasiPage() {
  const [historyList, setHistoryList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedDonasi, setSelectedDonasi] = useState(null);

    useEffect(() => {
        fetchHistory();
        // fetchBarang();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/api/donasi/riwayat", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHistoryList(res.data);
        } catch (error) {
            console.error("Gagal mengambil data history donasi", error);
        } finally {
            setLoading(false);
        }
    };

    // const fetchBarang = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const res = await axios.get("http://localhost:8000/api/barang/terjual", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         setBarangList(res.data);
    //     } catch (error) {
    //         console.error("Gagal mengambil data barang", error);
    //     }
    // };

    const handleUpdate = ({ id_donasi, tanggal_donasi }) => {
        setHistoryList((prev) =>
            prev.map((item) =>
                item.id_donasi === id_donasi ? { ...item, tanggal_donasi } : item
            )
        );
        fetchHistory();
    };

    const filteredData = historyList.filter((item) =>
        item.organisasi?.nama_organisasi?.toLowerCase().startsWith(search.toLowerCase())
    );

    return (
        <div className="overflow-x-auto px-5">
            <h2 className="text-center mb-4 display-5">History Donasi</h2>

            {loading ? (
                <p className="text-center font-medium text-gray-500">Memuat data...</p>
            ) : (
                <>
                    <div className="flex justify-end mb-3">
                        <input
                            type="text"
                            placeholder="Cari Nama Organisasi"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="!w-full md:!w-1/3 !border !border-gray-300 !rounded-md !px-3 !py-2 !shadow-sm focus:!outline-none focus:!ring-2"
                        />
                    </div>

                    <table
                        bordered="true"
                        hover="true"
                        responsive="true"
                        className="request-donasi-table w-full text-center align-middle fixed-table"
                    >
                        <thead className="table-success">
                            <tr>
                                <th className="col-organisasi">Nama Organisasi</th>
                                <th className="col-penerima">Nama Penerima</th>
                                <th className="col-barang">Nama Barang</th>
                                <th className="col-status">Status Donasi</th>
                                <th className="col-tanggal">Tanggal Donasi</th>
                                <th className="col-tanggal"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={item.id_donasi}>
                                    <td className="col-organisasi">{item.organisasi?.nama_organisasi || "-"}</td>
                                    <td className="col-penerima">{item?.nama_penerima || "-"}</td>
                                    <td className="col-barang">{item.barang?.nama_barang || "-"}</td>
                                    <td className="col-status">{item.status_donasi}</td>
                                    <td className="col-tanggal">{item.tanggal_donasi}</td>
                                    <td>
                                        {item.status_donasi === "disiapkan" && (
                                            <button
                                                className="btn bg-blue-500 text-white hover:bg-blue-600"
                                                onClick={() => {
                                                    setSelectedDonasi(item);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Update
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {selectedDonasi && (
                <ModalKonfirmasiDonasi
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    request={selectedDonasi}
                    mode="update"
                    onUpdateTanggal={handleUpdate}
                />
            )}
        </div>
    );
}
