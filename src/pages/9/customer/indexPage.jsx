import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import AddPage from "./AddPage";
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
            name: "Nama Customer",
            selector: (row) => row.nama_customer,
            sortable: true,
            width: "400px",
        },
        {
            name: "Alamat Customer",
            selector: (row) => row.alamat_customer,
            sortable: true
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
            const response = await axios.get(`http://localhost:3090/api/v1/customer`, {
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
                item.alamat_customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.nama_customer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAddClick = () => setCurrentView("add");

    const handleDetailClick = (row) => {
        if (row.id_customer !== null) {
          setDetailId(row.id_customer);
          setCurrentView("detail");
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
                                        <span className="menu-header-text fs-6">Data Customer</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <div className="">
                                Klik{" "}
                                <button
                                    className="fw-bold btn btn-link p-0"
                                    onClick={() => handleAddClick()}
                                >
                                    disini
                                </button>{" "}
                                untuk menambahkan Customer.
                            </div>
                        </div>
                        {/* Input pencarian */}
                        <div className="col-lg-12 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari berdasarkan Nama Customer..."
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
            {currentView === "add" && (
                <AddPage
                    handlePageChanges={handlePageChanges}
                    handleBackClick={handleBackClick}
                />
            )}
            {currentView === "detail" && (
                <DetailPage
                    handlePageChanges={handlePageChanges}
                    detailId={detailId}
                    handleBackClick={handleBackClick}
                />
            )}
        </div>
    );
};

export default IndexPage;
