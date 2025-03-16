import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddPage = ({ handleBackClick }) => {

    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        id_role: "",
        username: "",
        password: "",
        status_user: "",
        id_user: "",
        nik: "",
        nama_driver: "",
        telpon_driver: "",
        nama_kontak_darurat_driver: "",
        telpon_kontak_darurat_driver: "",
        masa_berlaku_sim: "",
        foto_ktp_driver: "",
        foto_sim_driver: "",
        status_driver: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSubmit = {
            ...formData,
            id_role: 13,
            username: formData.nama_lengkap.replace(/[\s,.`]/g, '').toLowerCase(),
            password: formData.nama_lengkap.replace(/[\s,.`]/g, '').toLowerCase(),
            status_user: "AKTIF",
        };
        try {
            const response = await axios.post(`http://localhost:3090/api/v1/user`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data Driver',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                const dataToSubmitDriver = {
                    ...formData,
                    id_user: response.data.data.id_user,
                    nik: formData.nik,
                    nama_driver: formData.nama_lengkap,
                    telpon_driver: formData.telpon_driver,
                    nama_kontak_darurat_driver:
                        formData.nama_kontak_darurat_driver,
                    telpon_kontak_darurat_driver:
                        formData.telpon_kontak_darurat_driver,
                    masa_berlaku_sim: formData.masa_berlaku_sim,
                    foto_ktp_driver: formData.foto_ktp_driver,
                    foto_sim_driver: formData.foto_sim_driver,
                    status_driver: "TERSEDIA",
                };
                axios.post(
                    `http://localhost:3090/api/v1/driver`,
                    dataToSubmitDriver,
                    {
                        headers: {
                        Authorization: token,
                        },
                    }
                );
                handleBackClick();
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Gagal menambahkan data. Silakan coba lagi.',
                icon: 'error',
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Tambah Driver</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Driver.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nik" className="form-label">NIK</label>
                            <input className="form-control" type="text" id="nik" name='nik' placeholder="NIK" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_lengkap" className="form-label">Nama Lengkap</label>
                            <input className="form-control" type="text" id="nama_lengkap" name='nama_lengkap' placeholder="Nama Lengkap" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="telpon_driver" className="form-label">Telpon Driver</label>
                            <input className="form-control" type="number" id="telpon_driver" name='telpon_driver' placeholder="Telpon Driver" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_kontak_darurat_driver" className="form-label">Nama Kontak Darurat</label>
                            <input className="form-control" type="text" id="nama_kontak_darurat_driver" name='nama_kontak_darurat_driver' placeholder="Nama Kontak Darurat" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="telpon_kontak_darurat_driver" className="form-label">Telpon Kontak Darurat</label>
                            <input className="form-control" type="number" id="telpon_kontak_darurat_driver" name='telpon_kontak_darurat_driver' placeholder="Telpon Kontak Darurat" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="masa_berlaku_sim" className="form-label">Berkalu SIM</label>
                            <input className="form-control text-uppercase" type="date" id="masa_berlaku_sim" name='masa_berlaku_sim' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="foto_ktp_driver" className="form-label">Foto KTP</label>
                            <input className="form-control" type="file" id="foto_ktp_driver" name='foto_ktp_driver' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="foto_sim_driver" className="form-label">Foto SIM</label>
                            <input className="form-control" type="file" id="foto_sim_driver" name='foto_sim_driver' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">Proses</label>
                            <button type="submit" className="btn btn-primary w-100">SELANJUTNYA</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddPage.propTypes = {
    handlePageChanges: PropTypes.func.isRequired,
    handleBackClick: PropTypes.func.isRequired,
};

export default AddPage;