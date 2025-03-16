import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddPage = ({ handleBackClick }) => {

    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        nama_customer: "",
        alamat_customer: "",
        penanggung_jawab_customer: "",
        nomor_penanggung_jawab_customer: "",
        jumlah_order: ""
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
            jumlah_order: "0",
        };
        try {
            console.log(dataToSubmit);
            const response = await axios.post(`http://localhost:3090/api/v1/customer`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data Customer',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
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
                            <span className="menu-header-text fs-6">Tambah Customer</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Customer.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_customer" className="form-label">Nama Customer</label>
                            <input className="form-control" type="text" id="nama_customer" name='nama_customer' placeholder="Nama Customer" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="alamat_customer" className="form-label">Alamat Customer</label>
                            <input className="form-control" type="text" id="alamat_customer" name='alamat_customer' placeholder="Alamat Customer" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="penanggung_jawab_customer" className="form-label">Penanggung Jawab Customer</label>
                            <input className="form-control" type="text" id="penanggung_jawab_customer" name='penanggung_jawab_customer' placeholder="Penanggung Jawab Customer" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nomor_penanggung_jawab_customer" className="form-label">Nomor Penanggung Jawab Customer</label>
                            <input className="form-control" type="text" id="nomor_penanggung_jawab_customer" name='nomor_penanggung_jawab_customer' placeholder="Nomor Penanggung Jawab Customer" onChange={handleChange} required />
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