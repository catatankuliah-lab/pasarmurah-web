import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DetailPage from "./detailPage";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [navigate, token]);

    const [currentView, setCurrentView] = useState("index");
    const [detailId, setDetailId] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        nomor_po: "",
        customer: "",
        nopol_armada: "",
        nama_driver: "",
        startDate: "",
        endDate: "",
        status_po: ""
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit, setLimit] = useState(10);
    const [idCustomerInit, setIdCustomerInit] = useState(0);
    const [idArmadaInit, setIdArmadaInit] = useState(0);
    const [idDriverInit, setIdDriverInit] = useState(0);

    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "50px",
        },
        {
            name: "Nomor PO",
            selector: (row) => row.nomor_po,
            sortable: true,
            width: "200px",
        },
        {
            name: "Tanggal PO",
            selector: (row) => formatDate(row.tanggal_po),
            sortable: true,
            width: "150px",
        },
        {
            name: "Jam Stanby dan Muat",
            selector: (row) => `${row.jam_pemesanan_po} | ${row.jam_muat}`,
            sortable: true,
            width: "200px",
        },
        {
            name: "Customer",
            selector: (row) => row.nama_customer,
            sortable: true,
            width: "200px",
        },
        {
            name: "Origin to Destination",
            selector: (row) => `${row.alamat_customer} to ${row.destination}`,
            sortable: true,
            width: "200px",
        },
        {
            name: "Armada",
            selector: (row) => `${row.nopol_armada} (${row.nama_jenis_kendaraan})`,
            sortable: true,
            width: "200px",
        },
        {
            name: "Driver",
            selector: (row) => row.nama_driver,
            sortable: true,
            width: "200px",
        },
        {
            name: "Status PO",
            selector: (row) => row.status_po,
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
        table: { style: { backgroundColor: "transparent" } },
        headRow: {
            style: { backgroundColor: "transparent", borderBottom: "2px solid #ccc" },
        },
        rows: { style: { backgroundColor: "transparent" } },
        pagination: {
            style: {
                backgroundColor: "transparent",
                borderTop: "none",
                padding: "8px 0",
            },
        },
    };

    const loadData = async (page) => {
        setLoading(true);
        if (!token) {
            navigate("/");
        }

        try {
            const response = await axios.get("http://localhost:3090/api/v1/po", {
                headers: { Authorization: token },
                params: {
                    page,
                    limit,
                    nomor_po: filters.nomor_po,
                    customer: filters.customer,
                    nopol_armada: filters.nopol_armada,
                    nama_driver: filters.nama_driver,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    status_po: filters.status_po
                },
            });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit]);

    useEffect(() => {
        setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
        loadData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]); // Fetch ulang data saat filter berubah

    useEffect(() => {
        const filtered = data.filter((item) => {
            const matchNomorPO = item.nomor_po.toLowerCase().includes(filters.nomor_po.toLowerCase());
            const matchCustomer = item.nama_customer.toLowerCase().includes(filters.customer.toLowerCase());
            const matchNopolArmada = item.nopol_armada.toLowerCase().includes(filters.nopol_armada.toLowerCase());
            const matchNamaDriver = item.nama_driver.toLowerCase().includes(filters.nama_driver.toLowerCase());
            const matchStatusPO = item.status_po.toLowerCase().includes(filters.status_po.toLowerCase());

            const itemDate = new Date(item.tanggal_po);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            const matchDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchNomorPO && matchCustomer && matchNopolArmada && matchNamaDriver && matchDate && matchStatusPO;
        });

        setFilteredData(filtered);
    }, [filters, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDetailClick = (row) => {
        if (row !== null) {
            setDetailId(row.id_po);
            setIdCustomerInit(row.id_customer);
            setIdArmadaInit(row.id_armada);
            setIdDriverInit(row.id_driver);
            setCurrentView("detail");
        }
    };

    const handleBackClick = () => {
        setCurrentView("index");
        loadData();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    return (
        <div>
            {currentView === "index" && (
                <>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <div className="divider text-start fw-bold">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Data Purchase Order</span>
                                    </div>
                                </div>
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
                                        value={tempFilters.nomor_po}
                                        onChange={(e) => setTempFilters({ ...tempFilters, nomor_po: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Customer</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.customer}
                                        onChange={(e) => setTempFilters({ ...tempFilters, customer: e.target.value })}
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
                                    <label htmlFor="" className="form-label">Nopol Armada</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.nopol_armada}
                                        onChange={(e) => setTempFilters({ ...tempFilters, nopol_armada: e.target.value })}
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
                                    <label htmlFor="" className="form-label">Status PO</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.status_po}
                                        onChange={(e) => setTempFilters({ ...tempFilters, status_po: e.target.value })}
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
                        <div className="col-lg-12">
                            <DataTable
                                columns={columns}
                                data={filteredData} // Gunakan data yang sudah difilter
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
            {currentView === "detail" && (
                <DetailPage
                    detailId={detailId}
                    idCustomerInit={idCustomerInit}
                    idArmadaInit={idArmadaInit}
                    idDriverInit={idDriverInit}
                    handleBackClick={handleBackClick}
                />
            )}
        </div>
    );
};

export default IndexPage;
