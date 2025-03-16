import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';


const AddPage = ({ handlePageChanges, handleBackClick }) => {
    // Data dari localstorage
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');
    const id_user = localStorage.getItem('id_user');
    const nama_kantor = localStorage.getItem('nama_kantor');

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [kodeRencanaSalur, setKodeRencanaSalur] = useState("");
    const [detailId, setDetailId] = useState(null);

    const [formData, setFormData] = useState({
        id_alokasi: "",
        id_kantor: "",
        kode_rencana_salur: "",
        status_rencana_salur: "",
    });

    const [logData, setLogData] = useState({
        id_user: "",
        kategori: "",
    });

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
        let nomorrencanasalur = 0;
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/januari-rencana-salur/jumlah/kantor/${id_kantor}`, {
                headers: {
                    Authorization: token
                }
            });
            nomorrencanasalur = parseInt(response.data.totalRencanaSalur) + 1;
            setKodeRencanaSalur("RS-88LOG0" + selectedOption.value + "0" + id_kantor + "-" + nomorrencanasalur);
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
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSubmit = {
            rencanaSalur: {
                ...formData,
                id_alokasi: selectedAlokasi.value,
                id_kantor,
                kode_rencana_salur: kodeRencanaSalur,
                status_rencana_salur: "CREATED",
            },
            logData: {
                id_user,
                kategori: "CREATE",
                tanggal_log: new Date().toISOString(),
            },
        };
        try {
            const response = await axios.post(`http://localhost:3089/api/v1/januari-rencana-salur`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data Rencana Salur',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                handlePageChanges(
                    "detail",
                    response.data.data.id_rencana_salur,
                    selectedAlokasi.value
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
                            <span className="menu-header-text fs-6">Tambah Rencana Salur</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Rencana Salur.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_kantor" className="form-label">Kantor Cabang</label>
                            <input className="form-control" type="text" id="nama_kantor" name='nama_kantor' placeholder="Kantor Cabang" value={nama_kantor} required readOnly />
                        </div>
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
                            <label htmlFor="kode_rencana_salur" className="form-label">Kode Rencana Salur</label>
                            <input className="form-control" type="text" id="kode_rencana_salur" name='kode_rencana_salur' placeholder="Kode Rencana Salur" value={kodeRencanaSalur} required readOnly />
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