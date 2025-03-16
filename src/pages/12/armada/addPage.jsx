import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const AddPage = ({ handleBackClick }) => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [navigate]);
    const [jeniskendaraanOption, setJenisKendaraanOption] = useState([]);
    const [selectedJenisKendaraan, setSelectedJenisKendaraan] = useState(null);


    const [formData, setFormData] = useState({
        id_jenis_kendaraan: "",
        nopol_armada: "",
        lokasi_terakhir: "",
        status_armada: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fetchJenisKendaraan = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get('http://localhost:3090/api/v1/jenis-kendaraan', {
                headers: {
                    Authorization: token
                }
            });
            console.log(response);
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_jenis_kendaraan,
                    label: dataitem.nama_jenis_kendaraan
                }));
                setJenisKendaraanOption(datafetch);
            } else {
                setJenisKendaraanOption([]);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Data Jenis Kendaraan',
                text: 'Data Jenis Kendaraan Tidak Ditemukan',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
            setJenisKendaraanOption([]);
        }
    };

    useEffect(() => {
        fetchJenisKendaraan();
    }, [token]);

    const handleJenisKendaraanChange = (selectedOption) => {
        setSelectedJenisKendaraan(selectedOption);
        setJenisKendaraanInit(selectedOption.value);
        setFormFilter((prevState) => ({
            ...prevState,
            id_jenis_kendaraan: selectedOption ? selectedOption.value : null
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSubmit = {
            ...formData,
            id_jenis_kendaraan: selectedJenisKendaraan.value,
            status_armada: "TERSEDIA",
        };
        try {
            console.log(dataToSubmit);
            const response = await axios.post(`http://localhost:3090/api/v1/armada`, dataToSubmit, {
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
                            <span className="menu-header-text fs-6">Tambah Armada</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Armada.
                </div>
            </div>
        
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_jenis_kendaraan" className="form-label">Jenis Kendaraan</label>
                            <Select id="id_jenis_kendaraan" name="id_jenis_kendaraan" value={selectedJenisKendaraan} onChange={handleJenisKendaraanChange} options={jeniskendaraanOption} placeholder="Pilih Jenis Kendaraan"
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_armada" className="form-label">Nopol Armada</label>
                            <input className="form-control" type="text" id="nopol_armada" name='nopol_armada' placeholder="Nopol Armada" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="lokasi_terakhir" className="form-label">Lokasi Terakhir</label>
                            <input className="form-control" type="text" id="lokasi_terakhir" name='lokasi_terakhir' placeholder="Lokasi Terakhir" onChange={handleChange} required />
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