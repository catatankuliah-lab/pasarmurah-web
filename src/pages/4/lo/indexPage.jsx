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
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        nomor_lo: "",
        tanggal_lo: "",
        nopol_mobil: "",
        nama_driver: "",
        titik_muat: "",
        status_lo: ""
    });
    const [tempFilters, setTempFilters] = useState(filters);

    const [currentView, setCurrentView] = useState('index');
    const [detailId, setDetailId] = useState(null);

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
            name: "Nama Kantor",
            selector: (row) => row.nama_kantor,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nomor LO",
            selector: (row) => row.nomor_lo,
            sortable: true,
            width: "200px",
        },
        {
            name: "Tanggal LO",
            selector: (row) => row.tanggal_lo,
            sortable: true,
            width: "200px",
        },
        {
            name: "Titik Muat",
            selector: (row) => row.titik_muat,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nopol Mobil",
            selector: (row) => row.nopol_mobil,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nama Driver",
            selector: (row) => row.nama_driver,
            sortable: true,
            width: "200px",
        },
        {
            name: "",
            selector: (row) => (
                <button onClick={() => handleDetailClick(row)} className="btn btn-link">
                    <i className="bx bx-zoom-in text-priamry"></i>
                </button>
            ),
            sortable: false,
            width: "100px",
            style: {
                textAlign: "center",
            },
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
    useEffect(() => {
        const filtered = data.filter((item) => {
            const matchNomorLO = item.nomor_lo.toLowerCase().includes(filters.nomor_lo.toLowerCase());
            const matchMuat = item.titik_muat.toLowerCase().includes(filters.titik_muat.toLowerCase());
            const matchNopolDriver = item.nopol_mobil.toLowerCase().includes(filters.nopol_mobil.toLowerCase());
            const matchNamaDriver = item.nama_driver.toLowerCase().includes(filters.nama_driver.toLowerCase());
            const itemDate = new Date(item.tanggal_po);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            const matchDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchNomorLO && matchMuat && matchNopolDriver && matchNamaDriver && matchDate;
        });

        setFilteredData(filtered);
    }, [filters, data]);



    const previewStyle = {
        height: 355,
        width: 355,
    };

    const loadData = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3091/api/v1/lo/kantor/${id_kantor}`,
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
    }, [currentPage, limit]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDetailClick = (row) => {
        if (row.id_lo !== null) {
            setDetailId(row.id_lo);
            setCurrentView('detail');
        }
    };

    const handleAddClick = () => setCurrentView('add');


    const handleBackClick = () => {
        setCurrentView("index");
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
                                        <span className="menu-header-text fs-6">Data LO</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <div className="">
                                Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleAddClick()}>disini</button> untuk menambahkan LO.
                            </div>
                        </div>
                        <div className="col-lg-12 mt-2">
                            <div className="mb-3">
                                <div className="divider text-start">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Filter Data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Input pencarian */}
                        <div className="col-lg-12 mb-3">
                            <div className="row">
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Nomor PO</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.nomor_lo}
                                        onChange={(e) => setTempFilters({ ...tempFilters, nomor_lo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Tanggal Awal</label>
                                    <input
                                        type="date"
                                        className="form-control text-uppercase"
                                        value={tempFilters.startDate}
                                        onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Tanggal Akhir</label>
                                    <input
                                        type="date"
                                        className="form-control text-uppercase"
                                        value={tempFilters.endDate}
                                        onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Titik Muat</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.titik_muat}
                                        onChange={(e) => setTempFilters({ ...tempFilters, titik_muat: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Nopol Mobil</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.nopol_mobil}
                                        onChange={(e) => setTempFilters({ ...tempFilters, nopol_mobil: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Nama Driver</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.nama_driver}
                                        onChange={(e) => setTempFilters({ ...tempFilters, nama_driver: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Proses</label>
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => setFilters(tempFilters)}
                                    >
                                        TAMPILKAN
                                    </button>
                                </div>
                            </div>
                        </div>
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
            {currentView === 'detail' && <DetailPage handlePageChanges={handlePageChanges} detailId={detailId} handleBackClick={handleBackClick} />}
        </div>
    );
};

export default IndexPage;