import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const organisasiBelum = () => {
  const navigate = useNavigate();
  const [organisasiList, setOrganisasiList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrganisasi, setSelectedOrganisasi] = useState(null);

  useEffect(() => {
    fetchOrganisasi();
  }, []);

  const fetchOrganisasi = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/organisasi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrganisasiList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data organisasi", err);
    }
  };

  

  const filteredData = organisasiList.filter((item) =>
    item.id_organisasi != 1
  );

  return (
    <div className="overflow-x-auto px-5">
      <h2 className="text-center mb-4 display-5">Daftar Organisasi</h2>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Cari Nama Organisasi"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-full md:!w-1/3 !border !border-gray-300 !rounded-md !px-3 !py-2 !shadow-sm focus:!outline-none focus:!ring-2"
        />
      </div>

      <table
        className="w-full table-fixed text-center align-middle border border-gray-300 border-collapse"
        style={{ backgroundColor: "white", fontSize: "0.95rem" }}
      >
        <thead className="bg-green-100 font-semibold text-gray-700">
          <tr>
            <th className="w-[5%] border border-gray-300 px-3 py-3">No</th>
            <th className="w-[10%] border border-gray-300 px-3 py-3">Logo</th>
            <th className="w-[25%] border border-gray-300 px-3 py-3">
              Nama Organisasi
            </th>
            <th className="w-[20%] border border-gray-300 px-3 py-3">
              No Telepon
            </th>
            <th className="w-[20%] border border-gray-300 px-3 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id_organisasi} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-2 py-2">
                <img
                  src={
                    item.image_user
                      ? `http://localhost:8000/storage/${item.image_user}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="Logo Organisasi"
                  className="w-10 h-10 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="border border-gray-300 px-2 py-2 text-left">
                <div className="font-semibold">{item.nama_organisasi}</div>
                <div className="text-sm text-gray-500">{item.email || "-"}</div>
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {item.no_telepon || "-"}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                <div className="text-sm text-gray-500">{item.id_organisasi || "-"}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default organisasiBelum;
