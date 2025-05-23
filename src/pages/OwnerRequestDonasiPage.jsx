import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OwnerRequestDonasiPage.css";
import ModalPilihBarangDonasi from "../components/ModalPilihBarangDonasi";
import ModalKonfirmasiDonasi from "../components/ModalKonfirmasiDonasi";

const OwnerRequestDonasiPage = () => {
  const [donasiList, setDonasiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalPilih, setShowModalPilih] = useState(false);
  const [showModalKonfirmasi, setShowModalKonfirmasi] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [barangDipilih, setBarangDipilih] = useState(null);

  useEffect(() => {
    fetchDonasiDiminta();
  }, []);

  const fetchDonasiDiminta = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/donasi/diminta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonasiList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data donasi diminta", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePilihBarang = (item) => {
    setSelectedRequest(item);
    setShowModalPilih(true);
    setBarangDipilih(null);
  };

  const handleBarangSelected = (barang) => {
    setBarangDipilih(barang);
    setShowModalPilih(false);
    setShowModalKonfirmasi(true);
  };

  const handleKirimDonasi = async ({ barang, request, tanggal }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/api/kirim/{id_donasi}`,
        {
          id_donasi: request.id_donasi,
          id_barang: barang.id_barang,
          tanggal_donasi: tanggal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDonasiDiminta(); // Refresh data setelah donasi berhasil
    } catch (error) {
      console.error("Gagal mengirim donasi", error);
    } finally {
      setSelectedRequest(null);
      setBarangDipilih(null);
      setShowModalKonfirmasi(false);
    }
  };

  return (
    <div className="overflow-x-auto px-5">
      <h2 className="text-center mb-4 display-5">Request Donasi</h2>

      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : (
        <table
          bordered="true"
          className="request-donasi-table w-full text-center align-middle fixed-table"
        >
          <thead>
            <tr>
              <th className="col-organisasi">Nama Organisasi</th>
              <th className="col-barang">Nama barang</th>
              <th className="col-pesan">Pesan Request</th>
              <th className="col-aksi"></th>
            </tr>
          </thead>
          <tbody>
            {donasiList.map((item) => (
              <tr key={item.id_donasi}>
                <td className="col-organisasi">
                  {item.organisasi?.nama_organisasi || "-"}
                </td>
                <td className="col-barang">
                  {item.nama_barang || "-"}
                </td>
                <td className="col-pesan">{item.pesan_request || "-"}</td>
                <td className="col-aksi">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => handlePilihBarang(item)}
                  >
                    Pilih Barang
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedRequest && (
        <ModalPilihBarangDonasi
          show={showModalPilih}
          handleClose={() => setShowModalPilih(false)}
          onBarangSelected={handleBarangSelected}
        />
      )}

      {barangDipilih && selectedRequest && (
        <ModalKonfirmasiDonasi
          show={showModalKonfirmasi}
          handleClose={() => setShowModalKonfirmasi(false)}
          barang={barangDipilih}
          request={selectedRequest}
          onKirim={handleKirimDonasi}
        />
      )}
    </div>
  );
};

export default OwnerRequestDonasiPage;
