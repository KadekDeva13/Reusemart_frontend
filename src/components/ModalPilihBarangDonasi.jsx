import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import API from "@/utils/api";

function ModalPilihBarangDonasi({ show, handleClose, onBarangSelected, kategoriDonasi }) {
  const [barangDonasiList, setBarangDonasiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      fetchBarangDonasi();
    }
  }, [show]);

  const fetchBarangDonasi = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/barang/donasi", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Kategori-Barang": kategoriDonasi,
        },
      });

      setBarangDonasiList(res.data);
    } catch (error) {
      console.error("Gagal mengambil data barang donasi", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Pilih Barang Donasi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-2">Memuat data barang...</p>
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {barangDonasiList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    Tidak ada barang yang cocok dengan kategori request donasi.
                  </td>
                </tr>
              ) : (
                barangDonasiList.map((barang, index) => (
                  <tr key={barang.id_barang}>
                    <td>{index + 1}</td>
                    <td>{barang.nama_barang}</td>
                    <td>{barang.kategori_barang}</td>
                    <td className="text-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-1.5 px-3 rounded"
                        onClick={() => {
                          onBarangSelected(barang);
                          handleClose();
                        }}
                      >
                        Pilih
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ModalPilihBarangDonasi;
