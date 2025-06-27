import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaPen } from 'react-icons/fa';

const jabatanList = [
    'Admin',
    'Kurir',
    'CS',
    'Marketing',
    'Hunter',
    'Keuangan',
    'Pegawai Gudang',
    'Staff Penitipan',
    'IT Support',
    'Supervisor',
];

const genderList = ['Laki-laki', 'Perempuan'];

const TambahPegawaiPage = ({ setActivePage }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        email: '',
        jabatan: '',
        no_telepon: '',
        alamat: '',
        gender: '',
        tanggal_lahir: '',
        file: null,
    });

    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setFormData({ ...formData, file });
        }
    };

    const validate = () => {
        const err = {};
        if (!formData.nama_lengkap || formData.nama_lengkap.length < 3)
            err.nama_lengkap = 'Nama wajib diisi';
        if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = 'Email tidak valid';
        if (!formData.jabatan) err.jabatan = 'Jabatan wajib dipilih';
        if (!formData.no_telepon || !/^\d{10,}$/.test(formData.no_telepon))
            err.no_telepon = 'No telepon tidak valid';
        if (!formData.alamat) err.alamat = 'Alamat wajib diisi';
        if (!formData.gender) err.gender = 'Gender wajib dipilih';
        if (!formData.tanggal_lahir) err.tanggal_lahir = 'Tanggal lahir wajib diisi';
        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (Object.keys(err).length > 0) {
            setErrors(err);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();

            const id_jabatan = jabatanList.indexOf(formData.jabatan) + 1;

            data.append('nama_lengkap', formData.nama_lengkap);
            data.append('email', formData.email);
            data.append('id_jabatan', id_jabatan);
            data.append('no_telepon', formData.no_telepon);
            data.append('alamat', formData.alamat);
            data.append('gender', formData.gender);
            data.append('tanggal_lahir', formData.tanggal_lahir);
            data.append('password', 'Reusemart123'); // default password
            if (formData.file) {
                data.append('image_user', formData.file);
            }

            await axios.post('http://localhost:8000/api/pegawai/store', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Pegawai berhasil ditambahkan!');
            resetForm();
            navigate('/user/admin/')
        } catch (error) {
            console.error('Gagal tambah pegawai', error);
            if (error.response?.status === 422 && error.response.data?.errors) {
                console.table(error.response.data.errors);
                alert(
                    'Validasi gagal:\n' +
                    Object.entries(error.response.data.errors)
                        .map(([field, messages]) => `- ${field}: ${messages.join(', ')}`)
                        .join('\n')
                );
            } else {
                alert('Terjadi kesalahan saat menyimpan data.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            nama_lengkap: '',
            email: '',
            jabatan: '',
            no_telepon: '',
            alamat: '',
            gender: '',
            tanggal_lahir: '',
            file: null,
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        setPreview('');
        setErrors({});
    };

    const handleBack = () => {
        resetForm();
        navigate('/user/admin/');
    };

    return (
        <div className="w-full px-8 py-6 max-w-screen-xl mx-auto">
            <div className="w-full text-left">
                <button
                    onClick={handleBack}
                    className="mb-4 text-sm font-medium flex items-center bg-white border-none hover:border-none"
                >
                    <FaChevronLeft className="mr-3" />
                    Kembali ke Daftar Pegawai
                </button>
            </div>
            <h2 className=" mb-6 text-center display-5">Tambah Pegawai</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 flex justify-center">
                    <div className="relative group w-24 h-24">
                        <img
                            src={preview || 'https://via.placeholder.com/100'}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border shadow cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <FaPen className="text-white text-sm" />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                </div>

                <div>
                    <label>Nama Lengkap</label>
                    <input
                        type="text"
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.nama_lengkap && <p className="text-red-500 text-xs">{errors.nama_lengkap}</p>}
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                <div>
                    <label>Jabatan</label>
                    <select
                        name="jabatan"
                        value={formData.jabatan}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                    >
                        <option value="">-- Pilih Jabatan --</option>
                        {jabatanList.map((j) => (
                            <option key={j} value={j}>
                                {j}
                            </option>
                        ))}
                    </select>
                    {errors.jabatan && <p className="text-red-500 text-xs">{errors.jabatan}</p>}
                </div>

                <div>
                    <label>No Telepon</label>
                    <input
                        type="text"
                        name="no_telepon"
                        value={formData.no_telepon}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.no_telepon && <p className="text-red-500 text-xs">{errors.no_telepon}</p>}
                </div>

                <div className="col-span-2">
                    <label>Alamat</label>
                    <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    ></textarea>
                    {errors.alamat && <p className="text-red-500 text-xs">{errors.alamat}</p>}
                </div>

                <div>
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                    >
                        <option value="">-- Pilih Gender --</option>
                        {genderList.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                </div>

                <div>
                    <label>Tanggal Lahir</label>
                    <input
                        type="date"
                        name="tanggal_lahir"
                        value={formData.tanggal_lahir}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.tanggal_lahir && (
                        <p className="text-red-500 text-xs">{errors.tanggal_lahir}</p>
                    )}
                </div>

                <div className="col-span-2 flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
                        onClick={resetForm}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahPegawaiPage;
