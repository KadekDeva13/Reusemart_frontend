import React, { useEffect, useState } from "react";
import API from "@/utils/api";

const KonfirmasiPengambilanPage = () => {
  const [penitipanList, setPenitipanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/penitipan/show", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const belumDiambil = res.data.filter(
        (item) => item.status_perpanjangan !== "diambil"
      );
      setPenitipanList(belumDiambil);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setErrorMsg("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  const konfirmasiPengambilan = async (id_barang) => {
    try {
      setSuccessMsg("");
      setErrorMsg("");
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/api/penitipan/ambil-kembali/${id_barang}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMsg(res.data.message);
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal mengkonfirmasi.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Konfirmasi Pengambilan Barang oleh Penitip
      </h2>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600 mt-10">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-green-100 text-gray-700 font-semibold text-center">
              <tr>
                <th className="w-[5%] border border-gray-300 px-3 py-3">No</th>
                <th className="w-[25%] border border-gray-300 px-3 py-3">Nama Barang</th>
                <th className="w-[20%] border border-gray-300 px-3 py-3">Penitip</th>
                <th className="w-[20%] border border-gray-300 px-3 py-3">Tanggal Masuk</th>
                <th className="w-[20%] border border-gray-300 px-3 py-3">Batas Pengambilan</th>
                <th className="w-[15%] border border-gray-300 px-3 py-3">Status</th>
                <th className="w-[15%] border border-gray-300 px-3 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {penitipanList.length > 0 ? (
                penitipanList.flatMap((item, index) =>
                  item.barang && item.barang.length > 0
                    // eslint-disable-next-line no-unused-vars
                    ? item.barang.map((b, idx) => (
                        <tr key={`${item.id_penitipan}-${b.id_barang}`}>
                          <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                          <td className="border border-gray-300 px-3 py-2">{b.nama_barang}</td>
                          <td className="border border-gray-300 px-3 py-2">{item.penitip?.nama_lengkap}</td>
                          <td className="border border-gray-300 px-3 py-2">{item.tanggal_masuk}</td>
                          <td className="border border-gray-300 px-3 py-2">{item.batas_pengambilan}</td>
                          <td className="border border-gray-300 px-3 py-2">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {item.status_perpanjangan}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <button
                              onClick={() => konfirmasiPengambilan(b.id_barang)}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-1 rounded"
                            >
                              Konfirmasi Diambil
                            </button>
                          </td>
                        </tr>
                      ))
                    : [
                        <tr key={`no-barang-${item.id_penitipan}`}>
                          <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                          <td className="border border-gray-300 px-3 py-2 italic text-red-500">Tidak ditemukan</td>
                          <td className="border border-gray-300 px-3 py-2">{item.penitip?.nama_lengkap}</td>
                          <td className="border border-gray-300 px-3 py-2">{item.tanggal_masuk}</td>
                          <td className="border border-gray-300 px-3 py-2">{item.batas_pengambilan}</td>
                          <td className="border border-gray-300 px-3 py-2">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {item.status_perpanjangan}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">-</td>
                        </tr>
                      ]
                )
              ) : (
                <tr>
                  <td colSpan="7" className="text-gray-500 text-sm py-4">
                    Tidak ada data penitipan yang tersedia untuk dikonfirmasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KonfirmasiPengambilanPage;
