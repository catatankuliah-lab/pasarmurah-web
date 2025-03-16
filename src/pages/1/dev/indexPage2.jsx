import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import AddPage from "./addPage2";
import DetailPage from "./detailPage2";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Data statis
    const staticData = [
        { id_armada: 1, nopol_armada: "E 9518 YZ", driver_aktif: "HERMAN", nomor_rangka: "MHKBU1234JP567890", nomor_mesin: "4G63-A123456", driver_utama: "HERMAN", ritase1: "1", driver_serep: "AJIB", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 2, nopol_armada: "E 9518 YZ", driver_aktif: "TAUPIK", nomor_rangka: "MHXAT5678KP123456", nomor_mesin: "1NZ-FE7890123", driver_utama: "TAUPIK", ritase1: "2", driver_serep: "AJIB", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 3, nopol_armada: "E 9278 YC", driver_aktif: "YAYAT", nomor_rangka: "MLTUV9876LP654321", nomor_mesin: "2GD-FTV4567890", driver_utama: "YAYAT", ritase1: "2", driver_serep: "AJIB", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 4, nopol_armada: "E 9359 YC", driver_aktif: "YAMAN", nomor_rangka: "MHKCA4567MP987654", nomor_mesin: "K15B-9876543", driver_utama: "YAMAN", ritase1: "3", driver_serep: "AJIB", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 5, nopol_armada: "E 9360 YC", driver_aktif: "IYAN", nomor_rangka: "MHYFG2345NP456789", nomor_mesin: "4JA1-6543210", driver_utama: "IYAN", ritase1: "3", driver_serep: "AJIB", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 6, nopol_armada: "E 9361 YC", driver_aktif: "CANDRA", nomor_rangka: "MLKZX6789QP123987", nomor_mesin: "2ZR-FE3456789", driver_utama: "CANDRA", ritase1: "3", driver_serep: "IBNU", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 7, nopol_armada: "E 9373 YC", driver_aktif: "ROSSY", nomor_rangka: "MHJWR3456RP654123", nomor_mesin: "1GD-FTV2345678", driver_utama: "ROSSY", ritase1: "2", driver_serep: "IBNU", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 8, nopol_armada: "E 9374 YC", driver_aktif: "SODIKIN", nomor_rangka: "MHTYU5678SP789012", nomor_mesin: "3SZ-VE1234567", driver_utama: "SODIKIN", ritase1: "2", driver_serep: "IBNU", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 9, nopol_armada: "E 9375 YC", driver_aktif: "FAJAR", nomor_rangka: "MHABC1234TP987321", nomor_mesin: "L15A-8765432", driver_utama: "FAJAR", ritase1: "1", driver_serep: "IBNU", ritase2: "2", status_driver: "AKTIF" },
        { id_armada: 10, nopol_armada: "E 9390 YC", driver_aktif: "PIPIN", nomor_rangka: "MLVWX6789UP654890", nomor_mesin: "4D56-7654321", driver_utama: "PIPIN", ritase1: "1", driver_serep: "IBNU", ritase2: "2", status_driver: "AKTIF" },

    ];
    const handleAddClick = () => setCurrentView("add");


    const filteredData = staticData.filter(
        (item) =>
            item.nopol_armada.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.driver_aktif.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { name: "No", selector: (row, index) => index + 1, width: "50px" },
        { name: "Nopol", selector: (row) => row.nopol_armada, width: "200px" },
        { name: "Driver Aktif", selector: (row) => row.driver_aktif },
        { name: "No Rangka", selector: (row) => row.nomor_rangka },
        { name: "No Mesin", selector: (row) => row.nomor_mesin },
        { name: "Driver Utama", selector: (row) => row.driver_utama },
        { name: "Ritase", selector: (row) => row.ritase1 },
        { name: "Driver Serep", selector: (row) => row.driver_serep },
        { name: "Ritase", selector: (row) => row.ritase2 },
        { name: "Status", selector: (row) => row.status_driver },
        {
            name: "",
            selector: (row) => (
                <button onClick={() => handleDetailClick(row)} className="btn btn-link">
                    <i className="bx bx-zoom-in text-primary"></i>
                </button>
            ),
            width: "100px",
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
    const handleDetailClick = (row) => {
        if (row.id_armada !== null) {
            setDetailId(row.id_armada);
            setCurrentView("detail");
            jeniskendaraanInit(row.id_jenis_kendaraan);
        }
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
                                        <span className="menu-header-text fs-6">Data Armada</span>
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
                                untuk menambahkan Armada.
                            </div>
                        </div>
                        <div className="col-lg-12 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari berdasarkan Nopol atau Status Armada.."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-12">
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                paginationServer
                                paginationTotalRows={staticData.length}
                                onChangePage={setCurrentPage}
                                onChangeRowsPerPage={setLimit}
                                currentPage={currentPage}
                                highlightOnHover
                                striped
                                customStyles={customStyles}
                            />
                        </div>
                    </div>
                </>
            )}
            {currentView === "detail" && (
                <DetailPage
                    detailId={detailId}
                    handleBackClick={handleBackClick}
                />
            )}
            {
                currentView === "add" && (
                    <AddPage
                        // handlePageChanges={handlePageChanges}
                        handleBackClick={handleBackClick}
                    />
                )
            }
        </div>
    );
};

export default IndexPage;
