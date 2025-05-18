import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModalDetailPegawai from "../components/ModalDetailPegawai";

const DaftarPegawaiPage = () => {
  const navigate = useNavigate();
  const [pegawaiList, setPegawaiList] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/pegawai/daftar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPegawaiList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pegawai", err);
    }
  };

  const filteredData = pegawaiList.filter((item) =>
    item.nama_lengkap.toLowerCase().startsWith(search.toLowerCase())
  );

  const handleDetail = (pegawai) => {
    setSelectedPegawai(pegawai);
    setShowModal(true);
  };

  const handleEdit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:8000/api/pegawai/update/${formData.id_pegawai}`,
        {
          nama_lengkap: formData.nama_lengkap,
          email: formData.email,
          no_telepon: formData.no_telepon,
          alamat: formData.alamat,
          id_jabatan: formData.id_jabatan,
          komisi_hunter:
            parseInt(formData.id_jabatan) === 5 ? formData.komisi_hunter : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.message);
      fetchPegawai();
      setShowModal(false);
    } catch (error) {
      console.error("Gagal update data pegawai", error);
      if (error.response?.status === 422 && error.response.data?.errors) {
        console.table(error.response.data.errors);
        alert(
          "Validasi gagal:\n" +
            Object.entries(error.response.data.errors)
              .map(([field, messages]) => `- ${field}: ${messages.join(", ")}`)
              .join("\n")
        );
      } else {
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus pegawai ini?");
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/pegawai/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Pegawai berhasil dihapus");
      setShowModal(false);
      fetchPegawai();
    } catch (error) {
      console.error("Gagal menghapus pegawai", error);
      alert("Terjadi kesalahan saat menghapus pegawai.");
    }
  };

  const handleResetPassword = async (email) => {
    const konfirmasi = window.confirm(`Yakin ingin reset password untuk ${email}?`);
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/admin/reset-password/pegawai",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      console.error("Gagal reset password", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mereset password."
      );
    }
  };

  return (
    <div className="overflow-x-auto px-5">
      <h2 className="text-center mb-4 display-5">Daftar Pegawai</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <button
          onClick={() => navigate("/user/admin/tambah-pegawai")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Tambah Pegawai
        </button>
        <input
          type="text"
          placeholder="Cari Nama Pegawai"
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
            <th className="w-[10%] border border-gray-300 px-3 py-3">Foto</th>
            <th className="w-[25%] border border-gray-300 px-3 py-3">
              Nama Pegawai
            </th>
            <th className="w-[20%] border border-gray-300 px-3 py-3">
              Jabatan
            </th>
            <th className="w-[20%] border border-gray-300 px-3 py-3">
              No Telepon
            </th>
            <th className="w-[20%] border border-gray-300 px-3 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id_pegawai} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-2 py-2">
                <img
                  src={
                    item.image_user
                      ? `http://localhost:8000/storage/${item.image_user}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="Foto Pegawai"
                  className="w-10 h-10 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="border border-gray-300 px-2 py-2 text-left">
                <div className="font-semibold">{item.nama_lengkap}</div>
                <div className="text-sm text-gray-500">{item.email}</div>
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {item.jabatan?.nama_jabatan || "-"}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {item.no_telepon}
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

      <ModalDetailPegawai
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedPegawai}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
      />
    </div>
  );
};

export default DaftarPegawaiPage;
