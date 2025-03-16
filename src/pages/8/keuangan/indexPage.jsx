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
    
    const jeniskendaraanInit = (id) => {
        console.log("Jenis kendaraan dipilih:", id);
    };    

    const [currentView, setCurrentView] = useState("index");
    const [detailId, setDetailId] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Untuk data hasil pencarian
    const [searchTerm, setSearchTerm] = useState(""); // State pencarian
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
            name: "NOPOL",
            selector: (row) => row.nopol_armada,
            sortable: true,
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
            const response = await axios.get(`http://localhost:3090/api/v1/armada`, {
                headers: { Authorization: token },
                params: { page, limit },
            });

            const fetchedData = Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data];
            setData(fetchedData);
            setFilteredData(fetchedData); // Set data awal ke filteredData juga
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
        // Filter data berdasarkan pencarian
        const filtered = data.filter(
            (item) =>
                item.nama_jenis_kendaraan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.nopol_armada.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.status_armada.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDetailClick = (row) => {
        if (row.id_armada !== null) {
            setDetailId(row.id_armada);
            setCurrentView("detail");
            jeniskendaraanInit(row.id_jenis_kendaraan); // Inisialisasi jenis kendaraan
        }
    };
    

    const handlePageChanges = (page, id = null) => {
        if (id !== null) {
            setDetailId(id);
        }
        setCurrentView(page);
    };

    const handleBackClick = () => {
        setCurrentView("index");
        loadData();
    };

    return (
        <div>
            {currentView === "index" && (
                <>
                    <div className="row">
                        {/* Input pencarian */}
                        <div className="col-lg-12 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari berdasarkan Nopol, Jenis kendaraan atau Status Armada.."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                    handlePageChanges={handlePageChanges}
                    detailId={detailId}
                    jeniskendaraanInit={jeniskendaraanInit}
                    handleBackClick={handleBackClick}
                />
            )}
        </div>
    );
};

export default IndexPage;
