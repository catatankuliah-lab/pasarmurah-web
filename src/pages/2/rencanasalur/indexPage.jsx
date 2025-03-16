import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import AddPage from './AddPage';
import DetailPage from './detailPage';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit, setLimit] = useState(10);

    const columns = [
        {
            name: 'No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '50px',
        },
        {
            name: 'Kode Rencana Salur',
            selector: row => row.kode_rencana_salur,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Nama Kantor',
            selector: row => row.nama_kantor,
            sortable: true,
        },
        {
            name: '',
            selector: (row) => (
                <button
                    onClick={() => handleDetailClick(row)}
                    className="btn btn-link"
                >
                    <i className="bx bx-zoom-in text-priamry"></i>
                </button>
            ),
            sortable: false,
            width: '100px',
            style: {
                textAlign: 'center',
            },
        },
    ];

    const customStyles = {
        table: {
            style: {
                backgroundColor: 'transparent',
            },
        },
        headRow: {
            style: {
                backgroundColor: 'transparent',
                borderBottom: '2px solid #ccc',
            },
        },
        rows: {
            style: {
                backgroundColor: 'transparent',
            },
        },
        pagination: {
            style: {
                backgroundColor: 'transparent',
                borderTop: 'none',
                padding: '8px 0',
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

    const loadData = async (page) => {
        setLoading(true);
        let linkrencanasalur = "januari";
        if (selectedAlokasi == null) {
            linkrencanasalur = "januari";
        } else if (selectedAlokasi.value == 1) {
            linkrencanasalur = "januari";
        } else {
            linkrencanasalur = "februari";
        }
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/${linkrencanasalur}-rencana-salur/kantor/${id_kantor}`, {
                headers: {
                    Authorization: token
                },
                params: {
                    page,
                    limit,
                },
            });
            const fetchedData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
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
    }, [currentPage, limit]);

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
                                        <span className="menu-header-text fs-6">Data Rencana Salur</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <div className="">
                                Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleAddClick()}>disini</button> untuk menambahkan Rencana Salur.
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
                                required
                            />
                        </div>
                        <div className="col-lg-12">
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