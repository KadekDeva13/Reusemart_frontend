import React, { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaPen } from "react-icons/fa";

const jabatanList = [
  "Admin",
  "Kurir",
  "CS",
  "Marketing",
  "Hunter",
  "Keuangan",
  "Teknisi Gudang",
  "Staff Penitipan",
  "IT Support",
  "Supervisor",
];

const ModalDetailPegawai = ({ show, onClose, data, onEdit, onDelete,onResetPassword }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  if (!data) return null;

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({
        ...data,
        id_jabatan: data.id_jabatan || 1,
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFormData({ ...formData, image_user: imageURL, file });
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.nama_lengkap || formData.nama_lengkap.length < 3) {
      err.nama_lengkap = "Nama minimal 3 huruf";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = "Format email tidak valid";
    }
    if (!formData.no_telepon || !/^\d{10,}$/.test(formData.no_telepon)) {
      err.no_telepon = "No telepon minimal 10 digit angka";
    }
    if (!formData.alamat) {
      err.alamat = "Alamat wajib diisi";
    }
    if (parseInt(formData.id_jabatan) === 5 && !formData.komisi_hunter) {
      err.komisi_hunter = "Komisi wajib diisi untuk Hunter";
    }
    return err;
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onEdit(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="font-semibold">Detail Pegawai</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="w-full max-w-3xl mx-auto">
          {/* Foto Pegawai */}
          <div className="flex justify-center mb-6">
            <div className="relative group w-24 h-24">
              <img
                src={
                  (isEditing ? formData.image_user : data.image_user) ||
                  "https://via.placeholder.com/150"
                }
                alt="Foto Pegawai"
                className={`w-24 h-24 rounded-full object-cover border shadow ${
                  isEditing ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (isEditing) fileInputRef.current.click();
                }}
              />
              {isEditing && (
                <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <FaPen className="text-white text-base" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Detail / Edit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {[
              { label: "Nama Lengkap", key: "nama_lengkap" },
              { label: "Email", key: "email" },
              { label: "Jabatan", key: "id_jabatan" },
              { label: "No Telepon", key: "no_telepon" },
              { label: "Alamat", key: "alamat", span: 2 },
              { label: "Gender", key: "gender" },
              { label: "Tanggal Lahir", key: "tanggal_lahir" },
              ...(parseInt(formData.id_jabatan) === 5 ||
              parseInt(data.id_jabatan) === 5
                ? [{ label: "Komisi Hunter", key: "komisi_hunter" }]
                : []),
            ].map(({ label, key, span }) => (
              <div key={key} className={span ? "md:col-span-2" : ""}>
                <label className="block text-gray-500 font-medium mb-1">
                  {label}
                </label>

                {key === "id_jabatan" && isEditing ? (
                  <select
                    name="id_jabatan"
                    value={formData.id_jabatan}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {jabatanList.map((j, index) => (
                      <option key={index} value={index + 1}>
                        {j}
                      </option>
                    ))}
                  </select>
                ) : ["gender", "tanggal_lahir"].includes(key) && isEditing ? (
                  <input
                    type="text"
                    value={data[key]}
                    disabled
                    className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                ) : isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      errors[key]
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-green-400"
                    }`}
                  />
                ) : (
                  <p className="border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-gray-900">
                    {key === "id_jabatan"
                      ? jabatanList[(data.id_jabatan || 1) - 1]
                      : data[key]}
                  </p>
                )}

                {errors[key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {isEditing ? (
          <>
            <Button
              variant="danger"
              onClick={() => onResetPassword(data.email)}
            >
              Reset Password
            </Button>

            <Button variant="secondary" onClick={handleCancel}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Simpan
            </Button>
          </>
        ) : (
          <>
            <Button variant="danger" onClick={() => onDelete(data.id_pegawai)}>
              Hapus
            </Button>
            <Button
              variant="warning"
              onClick={() => onResetPassword(data.email)}
            >
              Reset Password
            </Button>
            <Button variant="primary" onClick={handleEditToggle}>
              Edit
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetailPegawai;
