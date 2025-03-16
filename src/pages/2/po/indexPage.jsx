import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailPage from './DetailPage';
import AddPage from './addPage';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const [currentView, setCurrentView] = useState('index');

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [alokasiInit, setAlokasiInit] = useState(null);

    const [detailId, setDetailId] = useState(null);

    const [dataPO, setDataPO] = useState([]);


    const [formFilter, setFormFilter] = useState({
        id_alokasi: null,
        id_kantor: id_kantor,
        tanggal_awal: null,
        tanggal_akhir: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

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

    const handleAlokasiChange = (selectedOption) => {
        setSelectedAlokasi(selectedOption);
        setAlokasiInit(selectedOption.value);
        setFormFilter((prevState) => ({
            ...prevState,
            id_alokasi: selectedOption ? selectedOption.value : null
        }));
    };

    const handlePageChange = (page, id = null) => {
        if (id !== null) {
            setAlokasiInit(1);
            setDetailId(id);
        }
        setCurrentView(page);
    };

    const handleBackClick = () => {
        setCurrentView("index");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const getPO = async () => {
        if (!selectedAlokasi) {
            Swal.fire({
                title: 'Filter Data',
                text: 'Silahkan pilih alokasi terlebih dahulu',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
        }
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const queryParams = new URLSearchParams(formFilter).toString();
            const response = await axios.get(`http://localhost:3089/api/v1/po/filter?${queryParams}`, {
                headers: {
                    Authorization: token,
                }
            });
            if (response.data.data) {
                const data = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
                setDataPO(data);
            } else {
                setDataPO([]);
                console.log('No data found for the filters');
            }
        } catch (error) {
            setDataPO([]);
            console.error('Error fetching PO data:', error);
        }
    };

    return (
        <div>
            {currentView === 'index' && (
                <>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="divider text-start fw-bold">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Data Purchase Order</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <div className="">
                                Klik <button className="fw-bold btn btn-link p-0" onClick={() => handlePageChange('add')}>disini</button> untuk menambahkan Purchase Order.
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_lokasi" className="form-label">Alokasi</label>
                            <Select
                                id="id_lokasi"
                                name="id_lokasi"
                                value={selectedAlokasi}
                                onChange={handleAlokasiChange}
                                options={alokasiOption}
                                placeholder="Pilih Alokasi"
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_awal" className="form-label">Tanggal Awal</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_awal" name='tanggal_awal' onChange={handleChange} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_akhir" className="form-label">Tanggal Akhir</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_akhir" name='tanggal_akhir' onChange={handleChange} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">Tampilkan</label>
                            <button type="button" onClick={getPO} className="btn btn-primary w-100">TAMPILKAN</button>
                        </div>
                        <div className="col-lg-12 mt-3">
                            <div className="row">
                                <div className="col-md-12 mb-4 mb-md-0">
                                    <div className="accordion mt-3" id="accordion_po">
                                        {dataPO.map(itempo => (
                                            <div key={itempo.id_po} className="card accordion-item">
                                                <h2 className="accordion-header px-2" id={`heading${itempo.id_po}`}>
                                                    <button
                                                        type="button"
                                                        className={`accordion-button accordion-button-primary collapsed`}
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#accordion${itempo.id_po}`}
                                                        aria-expanded="false"
                                                        aria-controls={`accordion${itempo.id_po}`}
                                                    >
                                                        <span className='text-primary fw-bold' >{formatDate(itempo.tanggal_po)} | {itempo.nomor_po}</span>
                                                    </button>
                                                </h2>
                                                <div id={`accordion${itempo.id_po}`} className="accordion-collapse collapse" data-bs-parent="#accordion_po">
                                                    <div className="accordion-body" style={{ marginTop: "-15px" }} >
                                                        <div className="px-2">
                                                            <hr />
                                                            <div className="col-md-12 col-sm-12 mt-0 mt-md-3">
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Tanggal PO : {formatDate(itempo.tanggal_po)}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Kantor Cabang : {itempo.nama_kantor}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Customer : {itempo.customer}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Titik Muat : {itempo.titik_muat}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Titik Bongkar : {itempo.titik_bongkar}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Jam Standby : {itempo.jam_stand_by} WIB
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Total Muatan Ayam : {(itempo.jenis_muatan_json.ayam).toLocaleString('de-DE')}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Total Muatan Telur : {(itempo.jenis_muatan_json.telur).toLocaleString('de-DE')}
                                                                </p>
                                                                <p style={{ marginBottom: "2px" }}>
                                                                    Status PO : {itempo.status_po}
                                                                </p>
                                                                <button className="btn btn-link p-0 mt-3" onClick={() => handlePageChange('detail', itempo.id_po, itempo.id_kantor)}>
                                                                    <i className="tf-icons bx bx-edit me-2"></i> DETAIL
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {currentView === 'add' && <AddPage handlePageChange={handlePageChange} handleBackClick={handleBackClick} />}
            {currentView === 'detail' && <DetailPage handlePageChange={handlePageChange} detailId={detailId} alokasiInit={alokasiInit} handleBackClick={handleBackClick} />}
        </div>
    );
};

export default IndexPage;