import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalDetailOrganisasi from "../components/ModalDetailOrganisasi";

const DaftarOrganisasiPage = () => {
  const [organisasiList, setOrganisasiList] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
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
    item.nama_organisasi.toLowerCase().startsWith(search.toLowerCase())
  );

  const handleDetail = (organisasi) => {
    setSelectedOrganisasi(organisasi);
    setShowModal(true);
  };

  const handleEdit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8000/api/organisasi/update/${formData.id_organisasi}`,
        {
          nama_organisasi: formData.nama_organisasi,
          nama_penerima: formData.nama_penerima,
          email: formData.email,
          no_telepon: formData.no_telepon,
          alamat: formData.alamat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.message);
      fetchOrganisasi();
      setShowModal(false);
    } catch (error) {
      console.error("Gagal update data organisasi", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus organisasi ini?");
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8000/api/organisasi/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Organisasi berhasil dihapus");
      setShowModal(false);
      fetchOrganisasi();
    } catch (error) {
      console.error("Gagal menghapus organisasi", error);
      alert("Terjadi kesalahan saat menghapus organisasi.");
    }
  };

  return (
    <div className="overflow-x-auto px-5">
      <h2 className="text-center mb-4 display-5">Daftar Organisasi</h2>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Cari Nama Organisasi"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-full md:!w-1/3 !border !border-gray-300 !rounded-md !px-3 !py-2 !shadow-sm focus:!outline-none focus:!ring-2 bg-white"
        />
      </div>

      <table
        className="w-full table-fixed text-center align-middle border border-gray-300 border-collapse"
        style={{ backgroundColor: "white", fontSize: "0.95rem" }}
      >
        <thead className="bg-green-100 font-semibold text-gray-700">
          <tr>
            <th className="w-[5%] border border-gray-300 px-3 py-3">Nama Organisasi</th>
            <th className="w-[10%] border border-gray-300 px-3 py-3">Nomor Telepon</th>
            <th className="w-[25%] border border-gray-300 px-3 py-3">
              Detail Organisasi
            </th>
          
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id_organisasi} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-2 py-2 text-left">
                <div className="font-semibold">{item.nama_organisasi}</div>
                <div className="text-sm text-gray-500">{item.email || "-"}</div>
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {item.no_telepon || "-"}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                <button
                  onClick={() => handleDetail(item)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalDetailOrganisasi
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedOrganisasi}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DaftarOrganisasiPage;
