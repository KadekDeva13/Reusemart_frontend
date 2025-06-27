import React, { useState } from "react";
import axios from "axios";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);
};

const FilterKurirPage = () => {
  const [idKurir, setIdKurir] = useState("2"); 
  const [bulan, setBulan] = useState("5");
  const [tahun] = useState(new Date().getFullYear());
  const [dataBarang, setDataBarang] = useState([]);
  co

  const fetchLaporanKurir = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/api/laporan/kurir?id_kurir=${idKurir}&bulan=${bulan}&tahun=${tahun}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDataBarang(res.data.data || []);
    } catch (error) {
      alert("Gagal memuat laporan pengiriman kurir.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Laporan Pengiriman Kurir</h2>

      <div className="flex flex-col lg:flex-row gap-4 items-start mb-6">
        <select
          className="border px-3 py-2 rounded text-sm bg-white text-gray-800"
          value={idKurir}
          onChange={(e) => setIdKurir(e.target.value)}
        >
          <option value="2">Fahmy Junaidi Putra</option>
        </select>

        <select
          className="border px-3 py-2 rounded text-sm bg-white text-gray-800"
          value={bulan}
          onChange={(e) => setBulan(Number(e.target.value))}
        >
          <option value="5">Mei</option>
        </select>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          onClick={fetchLaporanKurir}
        >
          🔍 Tampilkan Laporan
        </button>
      </div>

      {dataBarang.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="border px-3 py-2">No</th>
                <th className="border px-3 py-2">Nama Barang</th>
                <th className="border px-3 py-2">Tanggal Kirim</th>
                <th className="border px-3 py-2">Kurir</th>
                <th className="border px-3 py-2">Status Barang</th>
                <th className="border px-3 py-2">Ongkir</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dataBarang.map((item, index) => (
                <tr key={index}>
                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2">{item.nama_barang}</td>
                  <td className="border px-3 py-2">
                    {item.tanggal_kirim || "-"}
                  </td>
                  <td className="border px-3 py-2">{item.nama_kurir}</td>
                  <td className="border px-3 py-2">{item.status_barang}</td>
                  <td className="border px-3 py-2">
                    {formatRupiah(item.ongkir || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        idKurir && (
          <p className="text-gray-500 text-sm">Tidak ada data pengiriman.</p>
        )
      )}
    </div>
  );
};

export default FilterKurirPage;
