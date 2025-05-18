import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalDetailOrganisasi = ({ show, onClose, data, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    if (!data) return null;

    const handleEditToggle = () => {
        if (!isEditing) {
            setFormData(data);
            setErrors({});
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const err = {};
        if (!formData.nama_organisasi || formData.nama_organisasi.length < 3)
            err.nama_organisasi = "Nama organisasi wajib diisi";
        if (!formData.no_telepon || !/^\d{10,}$/.test(formData.no_telepon))
            err.no_telepon = "No telepon tidak valid";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
            err.email = "Email tidak valid";
        if (!formData.alamat)
            err.alamat = "Alamat wajib diisi";
        return err;
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

    const handleClose = () => {
        setIsEditing(false);
        setErrors({});
        onClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Detail Organisasi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {[
                        { label: 'Nama Organisasi', key: 'nama_organisasi' },
                        { label: 'Email', key: 'email' },
                        { label: 'No Telepon', key: 'no_telepon' },
                        { label: 'Alamat', key: 'alamat' },
                        { label: 'Nama Penerima', key: 'nama_penerima' },
                    ].map(({ label, key, disabled }) => (
                        <Form.Group key={key} className="mb-3">
                            <Form.Label>{label}</Form.Label>
                            {isEditing && !disabled ? (
                                <Form.Control
                                    type="text"
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors[key]}
                                />
                            ) : (
                                <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
                                    {data[key] || "-"}
                                </div>
                            )}
                            {errors[key] && (
                                <Form.Text className="text-danger">{errors[key]}</Form.Text>
                            )}
                        </Form.Group>
                    ))}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {isEditing ? (
                    <>
                        <Button variant="secondary" onClick={handleCancel}>Batal</Button>
                        <Button variant="primary" onClick={handleSave}>Simpan</Button>
                    </>
                ) : (
                    <>
                        <Button variant="danger" onClick={() => onDelete(data.id_organisasi)}>Hapus</Button>
                        <Button variant="primary" onClick={handleEditToggle}>Edit</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetailOrganisasi;
