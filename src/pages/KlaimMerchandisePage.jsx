import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "@/utils/api";

export default function KlaimMerchandisePage() {
    const [merchandiseList, setMerchandiseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [poin, setPoin] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");

        try {
            const [merchRes, userRes] = await Promise.all([
                API.get("/api/merchandise", {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
                API.get("/api/pembeli/profile", {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);
            console.log("merchRes.data =", merchRes.data);
            setMerchandiseList(merchRes.data.data);
            setPoin(userRes.data.poin_sosial);
        } catch (err) {
            toast.error("Gagal memuat data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleKlaim = async (id_merchandise) => {
        try {
            await API.post("/api/merchandise/klaim", { id_merchandise });
            toast.success("Klaim berhasil!");
            fetchData(); // refresh data
        } catch (err) {
            toast.error(err.response?.data?.message || "Klaim gagal");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500 border-solid"></div>
            </div>
        );
    }

    return (
        <div className="px-4 py-10 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Tukar Poin dengan Merchandise</h2>
            <p className="text-center text-gray-500 mb-6">
                Poin kamu: <span className="font-semibold text-green-600">{poin}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {merchandiseList.map((item) => {
                    const cukupPoin = poin >= item.poin_penukaran;
                    const stokTersedia = item.stock > 0;

                    return (
                        <div
                            key={item.id_merchandise}
                            className="border rounded-xl shadow-sm overflow-hidden flex flex-col"
                        >
                            <img
                                src={item.gambar || "/images/default-merchandise.png"}
                                alt={item.nama_merchandise}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-lg font-semibold mb-1">{item.nama_merchandise}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Poin dibutuhkan: <span className="font-bold">{item.poin_penukaran}</span><br />
                                    Stok: {item.stock}
                                </p>
                                <button
                                    onClick={() => handleKlaim(item.id_merchandise)}
                                    disabled={!cukupPoin || !stokTersedia}
                                    className={`mt-auto px-4 py-2 text-sm rounded-lg font-medium text-white
                    ${cukupPoin && stokTersedia
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-gray-400 cursor-not-allowed"}`}
                                >
                                    Klaim
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
