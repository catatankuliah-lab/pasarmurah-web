import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import AddPage from './addPage';
import DetailPage from './detailPage';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    // Data dari localstorage
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');
    const id_gudang = localStorage.getItem('id_gudang');

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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const columns = [
        {
            name: 'No',
            selector: (row, index) => index + 1,
            sortable: false,
            width: '50px',
        },
        {
            name: 'Tanggal DO',
            selector: row => row.tanggal_do,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Nomor DO',
            selector: row => row.nomor_do,
            sortable: true,
        },
        {
            name: '',
            selector: (row) => (
                <button
                    onClick={() => handleDetailClick(row)}
                    className="btn btn-link" data-bs-toggle="modal" data-bs-target="#modaldopdf"
                >
                    <i className="bx bx-printer text-priamry"></i>
                </button>
            ),
            sortable: false,
            width: '70px',
            style: {
                textAlign: 'center',
            },
        }
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
        let link = "januari";
        if (selectedAlokasi == null) {
            link = "januari";
        } else if (selectedAlokasi.value == 1) {
            link = "januari";
        } else {
            link = "februari";
        }
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/${link}-do/gudang/${id_gudang}`, {
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

    const Modal = ({ visible, row }) => {
        let link = "januari";
        if (row == null) {
            link = "januari";
        } else {
            if (row.id_alokasi == 1) {
                link = "januari";
            } else {
                link = "februari";
            }
        }

        if (!visible) return null;
        return (
            <div class="modal modal-lg fade" id="modaldopdf" tabindex="-1" aria-labelledby="modaldopdf" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5 fw-bold " id="modaldopdf">{row.nomor_do}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <iframe
                                src={`http://localhost:3089/api/v1/${link}-do/${row.path_do}`}
                                width="100%"
                                height="700px"
                                title="PDF DO Viewer"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleDetailClick = (row) => {
        setSelectedRow(row);
        setIsModalVisible(true);
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
                                        <span className="menu-header-text fs-6">Data Doc Out</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <div className="">
                                Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleAddClick()}>disini</button> untuk menambahkan Doc Out.
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
                        <div className="col-12">
                            <Modal
                                visible={isModalVisible}
                                onClose={() => setIsModalVisible(false)}
                                row={selectedRow}
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