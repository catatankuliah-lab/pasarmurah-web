import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import AddPage from './AddPage';
import DetailPage from './detailPage';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import QrScanner from "react-qr-scanner";

const IndexPage = () => {
    // Data dari localstorage
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [currentView, setCurrentView] = useState('index');
    const [detailId, setDetailId] = useState(null);
    const [alokasiInit, setAlokasiInit] = useState(null);

    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [result, setResult] = useState("");

    const [dtt, setIDDTT] = useState(0);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit, setLimit] = useState(10);

    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "50px",
        },
        {
            name: "NIK",
            selector: (row) => row.decrypted_nik,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nama Lengkap KPM",
            selector: (row) => row.nama_lengkap,
            sortable: true,
            width: "200px",
        },
        {
            name: "Provinsi",
            selector: (row) => row.nama_provinsi,
            sortable: true,
            width: "200px",
        },
        {
            name: "Kabupaten/Kota",
            selector: (row) => row.nama_kabupaten_kota,
            sortable: true,
            width: "200px",
        },
        {
            name: "Kecamatan",
            selector: (row) => row.nama_kecamatan,
            sortable: true,
            width: "200px",
        },
        {
            name: "Desa/Kelurahan",
            selector: (row) => row.nama_desa_kelurahan,
            sortable: true,
            width: "200px",
        },
        {
            name: "Alamat Lengkap KPM",
            selector: (row) => row.alamat_lengkap,
            sortable: true,
            width: "200px",
        },
        {
            name: "Jenis Penyaluran",
            selector: (row) => row.jenis_penyaluran,
            sortable: true,
            width: "200px",
        },
        {
            name: "Tanggal Penyaluran",
            selector: (row) => row.tanggal_penyaluran,
            sortable: true,
            width: "200px",
        },
        {
            name: "Jam Penyaluran",
            selector: (row) => row.waktu_penyaluran,
            sortable: true,
            width: "200px",
        },
        {
            name: "NIK Perwakilan",
            selector: (row) => row.nik_perwakilan,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nama Lengkap Perwakilan",
            selector: (row) => row.nama_perwakilan,
            sortable: true,
            width: "200px",
        },
        {
            name: "Alamat Perwakilan",
            selector: (row) => row.alamat_perwakilan,
            sortable: true,
            width: "200px",
        },
        {
            name: "Keterangan Perwakilan",
            selector: (row) => row.keterangan_perwakilan,
            sortable: true,
            width: "200px",
        }
        ,
        {
            name: "NIK Pengganti",
            selector: (row) => row.nik_pengganti,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nama Lengkap Pengganti",
            selector: (row) => row.nama_pengganti,
            sortable: true,
            width: "200px",
        },
        {
            name: "Alamat Pengganti",
            selector: (row) => row.alamat_pengganti,
            sortable: true,
            width: "200px",
        },
        {
            name: "Keterangan Pengganti",
            selector: (row) => row.keterangan_pergantian,
            sortable: true,
            width: "200px",
        },
    ];

    const customStyles = {
        table: {
            style: {
                backgroundColor: "transparent",
            },
        },
        headRow: {
            style: {
                backgroundColor: "transparent",
                borderBottom: "2px solid #ccc",
            },
        },
        rows: {
            style: {
                backgroundColor: "transparent",
            },
        },
        pagination: {
            style: {
                backgroundColor: "transparent",
                borderTop: "none",
                padding: "8px 0",
            },
        },
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

    const previewStyle = {
        height: 355,
        width: 355,
    };

    const handleScan = async (data) => {
        if (data) {
            setResult(data.text);
            setIsScannerVisible(false);
            console.log(data.text);
            const response = await axios.get(`http://localhost:3089/api/v1/januari-dtt/kode-dtt/${data.text}`, {
                headers: {
                    Authorization: token
                }
            });
            setIDDTT(response.data.data.id_dtt)
            console.log(response.data.data.id_dtt);
        }
    };

    const handleError = (err) => {
        console.error('Error with QR scanner: ', err);
    };

    const loadData = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3089/api/v1/januari-kpm/dtt/${dtt}`,
                {
                    headers: {
                        Authorization: token,
                    },
                    params: {
                        page,
                        limit,
                    },
                }
            );
            const fetchedData = Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data];
            setData(fetchedData);
            setTotalRecords(response.data.totalData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(currentPage);
    }, [currentPage, limit, dtt]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDetailClick = (row) => {
        if (row.id_rencana_salur !== null) {
            setDetailId(row.id_rencana_salur);
            setAlokasiInit(row.id_alokasi)
            setCurrentView('detail');
        }
    };

    const handleAddClick = () => setCurrentView('add');

    const handlePageChanges = (page, id = null, idalokasi) => {
        if (id !== null) {
            setDetailId(id);
            setAlokasiInit(idalokasi)
        }
        setCurrentView(page);
    };

    const handleBackClick = () => {
        setCurrentView("index");
    };

    const handleAlokasiChange = async (selectedOption) => {
        setSelectedAlokasi(selectedOption);
        setIsScannerVisible(true);
    };

    return (
        <div>
            {currentView === 'index' && (
                <>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <div className="divider text-start fw-bold">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Data Penyaluran</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <div className="">
                                Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleAddClick()}>disini</button> untuk menambahkan Penyaluran.
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-12">
                            <label htmlFor="id_lokasi" className="form-label">Alokasi</label>
                            <Select
                                id="id_lokasi"
                                name="id_lokasi"
                                value={selectedAlokasi}
                                onChange={handleAlokasiChange}
                                options={alokasiOption}
                                placeholder="Pilih Alokasi"
                                required
                            />
                        </div>
                        {isScannerVisible && (
                            <div className="row">
                                <div className="col-md-3 col-sm-12">
                                    <QrScanner
                                        delay={300}
                                        style={previewStyle}
                                        onError={handleError}
                                        onScan={handleScan}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="col-lg-12 mt-3">
                            <DataTable
                                columns={columns}
                                data={data}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRecords}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={(newPerPage) => setLimit(newPerPage)}
                                currentPage={currentPage}
                                highlightOnHover
                                striped
                                progressPending={loading}
                                progressComponent={<span>Loading...</span>}
                                customStyles={customStyles}
                            />
                        </div>
                    </div>
                </>
            )}
            {currentView === 'add' && <AddPage handlePageChanges={handlePageChanges} handleBackClick={handleBackClick} />}
            {currentView === 'detail' && <DetailPage handlePageChanges={handlePageChanges} detailId={detailId} handleBackClick={handleBackClick} alokasiInit={alokasiInit} />}
        </div>
    );
};

export default IndexPage;