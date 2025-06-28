import API from "@/utils/api";
import React, { useEffect, useState } from "react";
import ModalJadwalPengiriman from "../components/ModalJadwalPengiriman";

export default function PengirimanPengambilanPage() {
  const [transaksiList, setTransaksiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "danger" });
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

  useEffect(() => {
    fetchJadwal();
  }, []);
  

  const fetchJadwal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/gudang/transaksi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransaksiList(res.data || []);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAlert({ show: true, message: "Gagal memuat data.", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModalKurir = (trx) => {
    setSelectedTransaksi(trx);
    setShowModal(true);
  };

  const handleJadwalkanAmbilSendiri = async (trx) => {
    const konfirmasi = window.confirm(`Jadwalkan pengambilan mandiri untuk transaksi ${trx.id_transaksi}?`);
    if (!konfirmasi) return;
    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/api/gudang/transaksi/jadwalkan-ambil-sendiri/${trx.id_transaksi}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.alert("Pengambilan mandiri berhasil dijadwalkan.");
      fetchJadwal();
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal menjadwalkan.";
      window.alert(msg);
    }
  };

  return (
    <div className="p-6">
      <h4 className="text-xl font-bold mb-4">Atur Pengiriman & Pengambilan</h4>

      {alert.show && (
        <div className={`mb-4 p-3 rounded text-sm text-white ${alert.variant === "danger" ? "bg-red-500" : "bg-green-500"}`}>
          {alert.message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-green-100 text-gray-700 font-semibold text-center">
              <tr>
                <th className="w-[5%] border border-gray-300 px-3 py-3">No</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">Pembeli</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">Jenis Pengiriman</th>
                <th className="w-[20%] border border-gray-300 px-3 py-3">Status transaksi</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">Aksi</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">status pengiriman</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {transaksiList.length > 0 ? (
                transaksiList.map((trx, index) => (
                  <tr key={trx.id_transaksi}>
                    <td className="border border-gray-300 px-3 py-2">{trx.id_transaksi}</td>
                    <td className="border border-gray-300 px-3 py-2">{trx.pembeli?.nama_lengkap || "-"}</td>
                    <td className="border border-gray-300 px-3 py-2">{trx.jenis_pengiriman}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {trx.status_transaksi}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 space-x-2">
                      {trx.jenis_pengiriman?.toLowerCase() === "kurir" && (
                        <button
                          className={`text-white text-sm font-semibold px-3 py-1 rounded ${trx.status_transaksi === "dikirim"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-yellow-400 hover:bg-yellow-500"
                            }`}
                          onClick={() => {
                            if (trx.status_transaksi !== "dikirim") {
                              handleOpenModalKurir(trx);
                            }
                          }}
                          disabled={trx.status_transaksi === "belum selesai"}
                        >
                          {trx.status_transaksi === "dikirim"
                            ? new Date(trx.tanggal_dikirim).toLocaleDateString("id-ID")
                            : "Jadwalkan Kurir"}
                        </button>
                      )}

                      {trx.jenis_pengiriman?.toLowerCase() === "kurir" && (
                        <button
                          className={`text-white text-sm font-semibold px-3 py-1 rounded ${
                            trx.status_transaksi === "kurir sedang mengirim"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-yellow-400 hover:bg-yellow-500"
                          }`}
                          onClick={() => {
                            if (trx.status_transaksi !== "belum selesai") {
                              handleOpenModalKurir(trx);
                            }
                          }}
                          disabled={trx.status_transaksi === "belum selesai"}
                        >
                          {trx.status_transaksi === "belum selesai"
                            ? "belum selesai"
                            : "Jadwalkan Kurir"}
                        </button>
                      )}

                      {trx.jenis_pengiriman?.toLowerCase() === "ambil" && (
                        <button
                          className={`text-white text-sm font-semibold px-3 py-1 rounded ${
                            trx.status_transaksi === "disiapkan"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          onClick={() => {
                            if (trx.status_transaksi !== "") {
                              handleJadwalkanAmbilSendiri(trx);
                            }
                          }}
                          disabled={trx.status_transaksi === "belum selesai"}
                        >
                          {trx.status_transaksi === "disiapkan"
                            ? "disiapkan"
                            : "Jadwalkan Ambil"}
                        </button>
                      )}

                    </td>
                    <td>
                       <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {trx.status_pengiriman}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border border-gray-300 py-3 text-gray-600">
                    Tidak ada transaksi untuk dijadwalkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalJadwalPengiriman
        show={showModal}
        onHide={() => setShowModal(false)}
        transaksi={selectedTransaksi}
        onSuccess={fetchJadwal}
      />
    </div>
  );
}
