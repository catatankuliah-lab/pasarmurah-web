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
    const nama_kantor = localStorage.getItem('nama_kantor');
    const nama_gudang = localStorage.getItem('nama_gudang');

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);

    const [doOption, setDOOption] = useState([]);
    const [selectedDO, setSelectedDO] = useState(null);

    const [kodeLO, setKodeLO] = useState("");
    const [detailId, setDetailId] = useState(null);

    const [formData, setFormData] = useState({
        id_alokasi: "",
        id_do: "",
        id_gudang: "",
        nomor_lo: "",
        nomor_so: "",
        tanggal_lo: "",
        nama_driver: "",
        telpon_driver: "",
        nopol: "",
        pic: "",
        checker: "",
        file_lo: "",
        status_lo: ""
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
            setAlokasiOption([]);
        }
    };

    useEffect(() => {
        fetchAlokasi();
    }, []);

    const handleAlokasiChange = async (selectedOption) => {
        setSelectedAlokasi(selectedOption);
        let link = "januari";
        if (selectedOption.value == 1) {
            link = "januari";
        } else {
            link = "februari";
        }
        let nomorlo = 0;
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/${link}-lo/jumlah/gudang/${id_gudang}`, {
                headers: {
                    Authorization: token
                }
            });
            nomorlo = parseInt(response.data.totalLO) + 1;
            if (nomorlo < 10) {
                nomorlo = "000" + nomorlo;
            } else if (nomorlo < 100) {
                nomorlo = "00" + nomorlo;
            } else if (nomorlo < 1000) {
                nomorlo = "0" + nomorlo;
            }
            setKodeLO(`LO-88LOG0${selectedOption.value}0${id_kantor}0${id_gudang}-${nomorlo}`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        let link = "januari";
        if (selectedAlokasi == null) {
            link = "januari";
        } else if (selectedAlokasi.value == 1) {
            link = "januari";
        } else {
            link = "februari";
        }
        const fetchdata = async () => {
            try {
                const response = await axios.get(`http://localhost:3089/api/v1/${link}-do/agudang/${id_gudang}`, {
                    headers: {
                        Authorization: token
                    }
                });
                const datafatch = response.data.data.map(itemdata => ({
                    value: itemdata.id_do,
                    label: itemdata.nomor_do
                }));
                setDOOption(datafatch);
            } catch (error) {
                console.error('Error fetching', error);
                setDOOption([]);
            }
        };
        if (selectedAlokasi) {
            fetchdata();
        }
    }, [selectedAlokasi]);

    const handleDOChange = (selectedOption) => {
        setSelectedDO(selectedOption);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let link = "januari";
        if (selectedAlokasi == null) {
            link = "januari";
        } else if (selectedAlokasi.value == 1) {
            link = "januari";
        } else {
            link = "februari";
        }
        let id_do = "";
        if (selectedDO == null) {
            id_do = "";
        } else {
            id_do = selectedDO.value;
        }
        const dataToSubmit = {
            ...formData,
            id_alokasi: selectedAlokasi.value,
            id_do: id_do,
            id_gudang,
            nomor_lo: kodeLO,
            status_lo: "CREATED"
        };
        try {
            const response = await axios.post(`http://localhost:3089/api/v1/${link}-lo`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            console.log(response.data.data);
            Swal.fire({
                title: 'Data Loading Order',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                handlePageChanges(
                    "detail",
                    response.data.data,
                    selectedAlokasi.value,
                    selectedDO.value
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
                            <span className="menu-header-text fs-6">Tambah Loading Order</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Loading Order.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_kantor" className="form-label">Kantor Cabang</label>
                            <input className="form-control" type="text" id="nama_kantor" name='nama_kantor' placeholder="Kantor Cabang" value={nama_kantor} required readOnly />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_gudang" className="form-label">Gudang Bulog</label>
                            <input className="form-control" type="text" id="nama_gudang" name='nama_gudang' placeholder="Kantor Cabang" value={nama_gudang} required readOnly />
                        </div>
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
                            <label htmlFor="nomor_lo" className="form-label">Nomor LO</label>
                            <input className="form-control" type="text" id="nomor_lo" name='nomor_lo' placeholder="Nomor LO" value={kodeLO} onChange={handleChange} required readOnly />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nomor_so" className="form-label">Nomor SO</label>
                            <input className="form-control" type="text" id="nomor_so" name='nomor_so' placeholder="Nomor SO" onChange={handleChange} />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_do" className="form-label">Nomor DO</label>
                            <Select
                                id="id_do"
                                name="id_do"
                                value={selectedDO}
                                onChange={handleDOChange}
                                options={doOption}
                                placeholder="Pilih Nomor DO"
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_lo" className="form-label">Tanggal LO</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_lo" name='tanggal_lo' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
                            <input className="form-control" type="text" id="nama_driver" name='nama_driver' placeholder="Nama Driver" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="telpon_driver" className="form-label">Telpon Driver</label>
                            <input className="form-control" type="text" id="telpon_driver" name='telpon_driver' placeholder="Telpon Driver" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol" className="form-label">Nopol Mobil</label>
                            <input className="form-control" type="text" id="nopol" name='nopol' placeholder="E 88 LOG" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="pic" className="form-label">Nama PIC</label>
                            <input className="form-control" type="text" id="pic" name='pic' placeholder="Nama PIC" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="checker" className="form-label">Nama Checker</label>
                            <input className="form-control" type="text" id="checker" name='checker' placeholder="Nama Checker" onChange={handleChange} required />
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