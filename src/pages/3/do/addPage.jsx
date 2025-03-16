import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';


const AddPage = ({ handlePageChanges, handleBackClick }) => {
    // Data dari localstorage
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');
    const id_gudang = localStorage.getItem('id_gudang');
    const id_user = localStorage.getItem('id_user');
    const nama_gudang = localStorage.getItem('nama_gudang');
    const nama_kantor = localStorage.getItem('nama_kantor');

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);

    const [file, setFile] = useState(null);

    const [formData, setFormData] = useState(null);

    const fetchAlokasi = async () => {
        try {
            const response = await axios.get('http://localhost:3089/api/v1/alokasi', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_alokasi,
                    label: dataitem.bulan_alokasi + " " + dataitem.tahun_alokasi
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
    }, []);

    const handleAlokasiChange = async (selectedOption) => {
        setSelectedAlokasi(selectedOption);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e, setFileFunction) => {
        setFileFunction(e.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataInsert = new FormData();
        formDataInsert.append('id_alokasi', selectedAlokasi.value);
        formDataInsert.append('id_kantor', id_kantor);
        formDataInsert.append('id_gudang', id_gudang);
        formDataInsert.append('nama_kantor', nama_kantor);
        formDataInsert.append('nama_gudang', nama_gudang);
        formDataInsert.append('nomor_do', formData.nomor_do);
        formDataInsert.append('tanggal_do', formData.tanggal_do);
        formDataInsert.append('file_do', file);
        formDataInsert.append('status_do', "UPLOAD");

        try {
            let link = "januari";
            if (selectedAlokasi.value == 1) {
                link = "januari";
            } else if (selectedAlokasi.value == 2) {
                link = "februari";
            } else {
                link = "januari";
            }
            await axios.post(`http://localhost:3089/api/v1/${link}-do`, formDataInsert, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                }
            });
            Swal.fire({
                title: 'Data Doc Out',
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
                            <span className="menu-header-text fs-6">Tambah Doc Out</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Doc Out.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_alokasi" className="form-label">Status Alokasi</label>
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
                            <label htmlFor="tanggal_do" className="form-label">Tanggal Doc Out</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_do" name='tanggal_do' placeholder="Tanggal Rencana Salur" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nomor_do" className="form-label">Nomor Doc Out</label>
                            <input className="form-control" type="text" id="nomor_do" name='nomor_do' placeholder="Nomor Doc Out" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="file_do" className="form-label">File Doc Out</label>
                            <input className="form-control" type="file" id="file_do" name='file_do' placeholder="File Doc Out" onChange={(e) => handleFileChange(e, setFile)} required />
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