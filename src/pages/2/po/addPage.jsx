import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';


const AddPage = ({ handlePageChange, handleBackClick }) => {
    // Data dari localstorage
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);

    const [nomorPO, setNomorPO] = useState(null);

    const [formData, setFormData] = useState({
        id_alokasi: "",
        id_kantor: "",
        nomor_po: "",
        tanggal_po: "",
        customer: "",
        titik_muat: "",
        titik_bongkar: "",
        jam_stand_by: "",
        status_po: ""
    });


    const fetchAlokasi = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get('http://localhost:3089/api/v1/alokasi', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_alokasi,
                    label: dataitem.keterangan_alokasi
                }));
                setAlokasiOption(datafetch);
            } else {
                setAlokasiOption([]);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Data Alokasi',
                text: 'Data Alokasi Tidak Ditemukan',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
            setAlokasiOption([]);
        }
    };

    useEffect(() => {
        fetchAlokasi();
    }, [token]);

    const handleAlokasiChange = async (selectedOption) => {
        setSelectedAlokasi(selectedOption);
        let nomorpo = 0;
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/po/jumlah/kantor/${id_kantor}`, {
                headers: {
                    Authorization: token
                }
            });
            console.log(response.data.data);
            nomorpo = parseInt(response.data.data.jumlah_po) + 1;
            if (nomorpo < 10) {
                nomorpo = "000" + nomorpo;
            } else if (nomorpo < 100) {
                nomorpo = "00" + nomorpo;
            } else if (nomorpo < 1000) {
                nomorpo = "0" + nomorpo;
            }
            setNomorPO(`PO-STNG0${selectedOption.value}0${id_kantor}-${nomorpo}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
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
            id_alokasi: selectedAlokasi.value,
            id_kantor: id_kantor,
            nomor_po: nomorPO,
            status_po: "DIBUAT"
        };
        try {
            const response = await axios.post(`http://localhost:3089/api/v1/po`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data Purchase Order',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                handlePageChange(
                    "detail",
                    response.data.data.result
                );
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
                            <span className="menu-header-text fs-6">Tambah Purchase Order</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Purchase Order.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_alokasi" className="form-label">Alokasi</label>
                            <Select
                                id="id_alokasi"
                                name="id_alokasi"
                                value={selectedAlokasi}
                                onChange={handleAlokasiChange}
                                options={alokasiOption}
                                placeholder="Pilih Alokasi"
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nomor_po" className="form-label">Nomor PO</label>
                            <input className="form-control" type="text" id="nomor_po" name='nomor_po' value={nomorPO == null ? "" : nomorPO} placeholder="Nomor PO" required readOnly />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_po" className="form-label">Tanggal PO</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_po" name='tanggal_po' placeholder="" onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="customer" className="form-label">Customer</label>
                            <input className="form-control" type="text" id="customer" name='customer' placeholder="Nomor PO" onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="titik_muat" className="form-label">Titik Muat</label>
                            <input className="form-control" type="text" id="titik_muat" name='titik_muat' placeholder="Titik Muat" onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="titik_bongkar" className="form-label">Titik Bongkar</label>
                            <input className="form-control" type="text" id="titik_bongkar" name='titik_bongkar' placeholder="Titik Bongkar" onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jam_stand_by" className="form-label">Jam Standby</label>
                            <input className="form-control" type="time" id="jam_stand_by" name='jam_stand_by' placeholder="00:00" onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">Proses</label>
                            <button type="button" onClick={handleSubmit} className="btn btn-primary w-100">SELANJUTNYA</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddPage.propTypes = {
    handlePageChange: PropTypes.func.isRequired,
    handleBackClick: PropTypes.func.isRequired,
};

export default AddPage;