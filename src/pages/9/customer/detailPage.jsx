import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const DetailPage = ({ detailId, handleBackClick }) => {
    const inputRef = useRef(null);

    // Data dari localstorage
    const token = localStorage.getItem('token');

    const [customer, setCustomer] = useState(null);

    const [formData, setFormData] = useState({
        nama_customer: "",
        alamat_customer: "",
        penanggung_jawab_customer: "",
        nomor_penanggung_jawab_customer: "",
        jumlah_order: ""
    });

    // Fetch data driver saat component dimount atau detailId berubah
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get( `http://localhost:3090/api/v1/customer/${detailId}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setCustomer(response.data.data);
            } catch (error) {
                console.log(error);
                setCustomer([]);
            }
        };
        if (detailId) {
            fetchCustomer();
        }
    }, [detailId, token]);

    // Update formData ketika driver berhasil di-fetch
    useEffect(() => {
        if (customer) {
            setFormData((prevData) => ({
                nama_customer:customer.nama_customer || prevData.nama_customer,
                alamat_customer:customer.alamat_customer || prevData.alamat_customer,
                penanggung_jawab_customer:customer.penanggung_jawab_customer || prevData.penanggung_jawab_customer,
                nomor_penanggung_jawab_customer:customer.nomor_penanggung_jawab_customer || prevData.nomor_penanggung_jawab_customer,
                jumlah_order:customer.jumlah_order || prevData.jumlah_order
            }));
        }
    }, [customer]);

    // Handle perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleUpdate = async (event) => {
        event.preventDefault();
        const dataCustomerToSubmit = new FormData();
        dataCustomerToSubmit.append('nama_customer', formData.nama_customer);
        dataCustomerToSubmit.append('alamat_customer', formData.alamat_customer);
        dataCustomerToSubmit.append('penanggung_jawab_customer', formData.penanggung_jawab_customer);
        dataCustomerToSubmit.append('nomor_penanggung_jawab_customer', formData.nomor_penanggung_jawab_customer);
        dataCustomerToSubmit.append('jumlah_order', formData.jumlah_order);
        try {
            await axios.put(`http://localhost:3090/api/v1/customer/${detailId}`, dataCustomerToSubmit, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
            Swal.fire({
                title: 'Data Customer',
                text: 'Data Berhasil Diperbaharui',
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
                            <span className="menu-header-text fs-6">Detail Customer</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik{" "}
                    <button
                        className="fw-bold btn btn-link p-0"
                        onClick={() => handleBackClick()}
                    >
                        disini
                    </button>{" "}
                    untuk kembali ke menu utama Customer.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <div className="row">
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_customer" className="form-label">
                            Nama Customer
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="nama_customer"
                            name="nama_customer"
                            placeholder="Nama Customer"
                            ref={inputRef}
                            value={formData.nama_customer}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="alamat_customer" className="form-label">
                            Alamat Customer
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="alamat_customer"
                            name="alamat_customer"
                            placeholder="Alamat Customer"
                            value={formData.alamat_customer}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="penanggung_jawab_customer" className="form-label">
                            Penanggung Jawab Customer
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="penanggung_jawab_customer"
                            name="penanggung_jawab_customer"
                            placeholder="Penanggung Jawab Customer"
                            value={formData.penanggung_jawab_customer}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label
                            htmlFor="nomor_penanggung_jawab_customer"
                            className="form-label"
                        >
                            Nomor Penanggung Jawab Customer
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="nomor_penanggung_jawab_customer"
                            name="nomor_penanggung_jawab_customer"
                            placeholder="Nomor Penanggung Jawab Customer"
                            value={formData.nomor_penanggung_jawab_customer}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label
                            htmlFor="jumlah_order"
                            className="form-label"
                        >
                            Jumlah Order
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="jumlah_order"
                            name="jumlah_order"
                            placeholder="Jumlah Order"
                            value={formData.jumlah_order}
                            onChange={handleChange}
                            required
                            readOnly
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="" className="form-label">
                            Proses
                        </label>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="btn btn-primary w-100"
                        >
                            SIMPAN PERUBAHAN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

DetailPage.propTypes = {
    handlePageChanges: PropTypes.func.isRequired,
    detailId: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired
};

export default DetailPage;