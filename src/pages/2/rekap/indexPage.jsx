import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';


const IndexPage = () => {
    const token = localStorage.getItem("token");
    const id_kantor = localStorage.getItem('id_kantor');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [navigate, token]);

    const [currentView] = useState("index");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        id_kantor: id_kantor,
        nomor_lo: "",
        titik_muat: "",
        nama_kabupaten_kota: "",
        nopol_mobil: "",
        nama_driver: "",
        titik_bongkar: "",
        startDate: "",
        endDate: "",
        status_lo: ""
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const [loading, setLoading] = useState(true);
    const [currentPage] = useState(1);

    const [kantorOption, setKantorOption] = useState([]);

    const [kabupatenOption, setKabupatenOption] = useState([]);

    const processedData = [];
    const groupedTotals = {};

    filteredData.forEach(row => {
        if (!groupedTotals[row.nomor_lo]) {
            groupedTotals[row.nomor_lo] = {
                nomor_lo: row.nomor_lo,
                nama_kantor: "",
                tanggal_lo: "",
                nopol_mobil: "",
                nama_driver: "",
                titik_muat: "",
                nama_kabupaten_kota: "",
                titik_bongkar: "",
                beras: 0,
                minyak: 0,
                terigu: 0,
                gula: 0
            };
        }

        groupedTotals[row.nomor_lo].beras += row.beras;
        groupedTotals[row.nomor_lo].minyak += row.minyak;
        groupedTotals[row.nomor_lo].terigu += row.terigu;
        groupedTotals[row.nomor_lo].gula += row.gula;

        processedData.push(row);
    });

    const finalResult = [];
    let currentNomorLO = null;

    processedData.forEach((row, index) => {
        if (currentNomorLO !== row.nomor_lo) {
            currentNomorLO = row.nomor_lo;
        }

        finalResult.push(row);

        const isLastRowOfGroup =
            index === processedData.length - 1 ||
            processedData[index + 1].nomor_lo !== row.nomor_lo;

        if (isLastRowOfGroup) {
            finalResult.push({
                nomor_lo: `Total ${row.nomor_lo}`,
                nama_kantor: "",
                tanggal_lo: "",
                nopol_mobil: "",
                nama_driver: "",
                titik_muat: "",
                nama_kabupaten_kota: "",
                titik_bongkar: "",
                beras: groupedTotals[row.nomor_lo].beras,
                minyak: groupedTotals[row.nomor_lo].minyak,
                terigu: groupedTotals[row.nomor_lo].terigu,
                gula: groupedTotals[row.nomor_lo].gula,
                isTotalRow: true
            });
        }
    });

    const columns = [
        {
            name: "Nomor LO",
            selector: (row) => row.nomor_lo,
            cell: (row) => row.isTotalRow ? <strong>Sub Total</strong> : row.nomor_lo,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nama Kantor",
            selector: (row) => row.nama_kantor,
            sortable: true,
            width: "200px",
            cell: (row) => row.nama_kantor,
        },
        {
            name: "Tanggal",
            selector: (row) => row.isTotalRow ? "" : formatDate(row.tanggal_lo),
            sortable: true,
            width: "110px",
        },
        {
            name: "Nopol",
            selector: (row) => row.nopol_mobil,
            sortable: true,
            width: "110px",
        },
        {
            name: "Driver",
            selector: (row) => row.nama_driver,
            sortable: true,
            width: "200px",
            cell: (row) => row.nama_driver,
        },
        {
            name: "Gudang",
            selector: (row) => row.titik_muat,
            sortable: true,
            width: "200px",
            cell: (row) => row.titik_muat,
        },
        {
            name: "Kabupaten/Kota Tujuan",
            selector: (row) => row.nama_kabupaten_kota,
            sortable: true,
            width: "300px",
            cell: (row) => row.nama_kabupaten_kota,
        },
        {
            name: "Detail Tujuan",
            selector: (row) => row.titik_bongkar,
            sortable: true,
            width: "300px",
            cell: (row) => row.titik_bongkar,
        },
        {
            name: "Beras",
            selector: (row) => row.isTotalRow
                ? <strong>{row.beras} pcs ({row.beras * 5} Kg)</strong>
                : `${row.beras} pcs (${row.beras * 5} Kg)`,
            sortable: true,
            width: "200px",
        },
        {
            name: "Minyak",
            selector: (row) => row.isTotalRow
                ? <strong>{row.minyak} pcs ({row.minyak * 2} Lt)</strong>
                : `${row.minyak} pcs (${row.minyak * 2} Lt)`,
            sortable: true,
            width: "200px",
        },
        {
            name: "Terigu",
            selector: (row) => row.isTotalRow
                ? <strong>{row.terigu} pcs ({row.terigu * 1} Kg)</strong>
                : `${row.terigu} pcs (${row.terigu * 1} Kg)`,
            sortable: true,
            width: "200px",
        },
        {
            name: "Gula",
            selector: (row) => row.isTotalRow
                ? <strong>{row.gula} pcs ({row.gula * 1} Kg)</strong>
                : `${row.gula} pcs (${row.gula * 1} Kg)`,
            sortable: true,
            width: "200px",
        }
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

    const loadData = async () => {
        setLoading(true);
        if (!token) {
            navigate("/");
        }

        try {
            const response = await axios.get("http://localhost:3091/api/v1/rekapall", {
                headers: { Authorization: token },
                params: {
                    id_kantor: filters.id_kantor,
                    nomor_lo: filters.nomor_lo,
                    titik_muat: filters.titik_muat,
                    nama_kabupaten_kota: filters.nama_kabupaten_kota,
                    nopol_mobil: filters.nopol_mobil,
                    nama_driver: filters.nama_driver,
                    titik_bongkar: filters.titik_bongkar,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    status_lo: filters.status_lo
                },
            });

            const fetchedData = Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data];

            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            fetchKabupaten();
            fetchKantor();
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]); // Fetch ulang data saat filter berubah


    useEffect(() => {
        const filtered = data.filter((item) => {
            const matchNomorLO = item.nomor_lo.toLowerCase().includes(filters.nomor_lo.toLowerCase());
            const matchTitikMuat = item.titik_muat.toLowerCase().includes(filters.titik_muat.toLowerCase());
            const matchKantor = filters.nama_kantor
                ? item.nama_kantor.toLowerCase() === filters.nama_kantor.toLowerCase()
                : true;

            const matchKabupatenKota = filters.nama_kabupaten_kota
                ? item.nama_kabupaten_kota.toLowerCase() === filters.nama_kabupaten_kota.toLowerCase()
                : true;
            const matchNopol = item.nopol_mobil.toLowerCase().includes(filters.nopol_mobil.toLowerCase());
            const matchDriver = item.nama_driver.toLowerCase().includes(filters.nama_driver.toLowerCase());
            const matchBongkar = item.titik_bongkar.toLowerCase().includes(filters.titik_bongkar.toLowerCase());
            const matchStatusLO = item.status_lo.toLowerCase().includes(filters.status_lo.toLowerCase());
            const itemDate = new Date(item.tanggal_lo);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            const matchDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchNomorLO && matchTitikMuat && matchKabupatenKota && matchNopol && matchDriver && matchBongkar && matchDate && matchStatusLO && matchKantor;
        });
        setFilteredData(filtered);
    }, [filters, data]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const fetchKabupaten = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get('http://localhost:3091/api/v1/kabupaten-kota', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_kabupaten_kota,
                    label: dataitem.nama_kabupaten_kota
                }));
                setKabupatenOption(datafetch);
            } else {
                setKabupatenOption([]);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Data Kabupaten/Kota',
                text: 'Data Kabupaten/Kota Tidak Ditemukan',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
            setKabupatenOption([]);
        }
    };

    const fetchKantor = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get('http://localhost:3091/api/v1/kantor', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_kantor,
                    label: dataitem.nama_kantor
                }));
                setKantorOption(datafetch);
            } else {
                setKantorOption([]);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Data Kantor',
                text: 'Data Kantor Tidak Ditemukan',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
            setKantorOption([]);
        }
    };

    const resetFilters = () => {
        setTempFilters({
            nama_kabupaten_kota: '',
            nama_kantor: '',
            nomor_lo: '',
            titik_muat: '',
            nopol_mobil: '',
            nama_driver: '',
            titik_bongkar: '',
            status_lo: '',
            startDate: null,
            endDate: null
        });
    
        // Opsional: Jika ingin langsung menghapus data yang difilter
        setFilteredData(data);
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
                                        <span className="menu-header-text fs-6">Data Rekap Penyaluran</span>
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
                                    <label htmlFor="" className="form-label">Nomor LO</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.nomor_lo}
                                        onChange={(e) => setTempFilters({ ...tempFilters, nomor_lo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Kantor</label>
                                    <Select
                                        value={kantorOption.find((option) => option.label === tempFilters.nama_kantor) || null}
                                        onChange={(selectedOption) =>
                                            setTempFilters({ ...tempFilters, nama_kantor: selectedOption ? selectedOption.label : '' })
                                        }
                                        options={kantorOption}
                                        placeholder="Kantor Cabang"
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
                                    <label htmlFor="" className="form-label">Titik Bongkar</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.titik_bongkar}
                                        onChange={(e) => setTempFilters({ ...tempFilters, titik_bongkar: e.target.value })}
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
                                <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Kabupaten/Kota</label>
                                    <Select
                                        value={kabupatenOption.find((option) => option.label === tempFilters.nama_kabupaten_kota) || null}
                                        onChange={(selectedOption) =>
                                            setTempFilters({ ...tempFilters, nama_kabupaten_kota: selectedOption ? selectedOption.label : '' })
                                        }
                                        options={kabupatenOption}
                                        placeholder="Kabupaten/Kota"
                                    />

                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="" className="form-label">Status LO</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempFilters.status_lo}
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
                                data={finalResult}
                                highlightOnHover
                                striped
                                progressPending={loading}
                                progressComponent={<span>Loading...</span>}
                                customStyles={customStyles}
                            />;
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default IndexPage;
