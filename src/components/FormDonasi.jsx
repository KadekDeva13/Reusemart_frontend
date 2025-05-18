import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ModalPilihBarangDonasi from "./ModalPilihBarangDonasi";

function FormDonasi() {
  const [showModal, setShowModal] = useState(false);
  const [barangDipilih, setBarangDipilih] = useState(null);
  const [tanggalDonasi, setTanggalDonasi] = useState("");

  const handleSubmit = () => {
    console.log({ barangDipilih, tanggalDonasi });
  };

  return (
    <div className="p-5 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Form Donasi</h2>

      <div className="mb-3">
        <label className="block mb-1">Barang yang Dipilih:</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="form-control"
            value={barangDipilih ? barangDipilih.nama_barang : ""}
            disabled
          />
          <Button onClick={() => setShowModal(true)}>Pilih Barang</Button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block mb-1">Tanggal Donasi:</label>
        <input
          type="date"
          className="form-control"
          value={tanggalDonasi}
          onChange={(e) => setTanggalDonasi(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => { setBarangDipilih(null); setTanggalDonasi(""); }}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={!barangDipilih || !tanggalDonasi}>
          Kirim
        </Button>
      </div>

      <ModalPilihBarangDonasi
        show={showModal}
        handleClose={() => setShowModal(false)}
        onBarangSelected={(barang) => setBarangDipilih(barang)}
      />
    </div>
  );
}

export default FormDonasi;