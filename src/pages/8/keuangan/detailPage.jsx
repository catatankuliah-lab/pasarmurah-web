import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const DetailPage = ({ detailId, handleBackClick }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [angsuranCicilanOption] = useState([
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
        { value: "17", label: "17" },
        { value: "18", label: "18" },
        { value: "19", label: "19" },
        { value: "20", label: "20" },
        { value: "21", label: "21" },
        { value: "22", label: "22" },
        { value: "23", label: "23" },
        { value: "24", label: "24" },
        { value: "25", label: "25" },
        { value: "26", label: "26" },
        { value: "27", label: "27" },
        { value: "28", label: "28" },
        { value: "29", label: "29" },
        { value: "30", label: "30" },
        { value: "31", label: "31" },
        { value: "32", label: "32" },
        { value: "33", label: "33" },
        { value: "34", label: "34" },
        { value: "35", label: "35" },
        { value: "36", label: "36" },
        { value: "37", label: "37" },
        { value: "38", label: "38" },
        { value: "39", label: "39" },
        { value: "40", label: "40" },
        { value: "41", label: "41" },
        { value: "42", label: "42" },
        { value: "43", label: "43" },
        { value: "44", label: "44" },
        { value: "45", label: "45" },
        { value: "46", label: "46" },
        { value: "47", label: "47" },
        { value: "48", label: "48" },
    ]);
    const [setSelectedAngsuranCicilan] = useState(null);
    const [cicilan, setCicilan] = useState([]);
    const [jeniskendaraanOption, setJenisKendaraanOption] = useState([]);
    const [statusArmadaOption] = useState([
        { value: "TERSEDIA", label: "TERSEDIA" },
        { value: "MUAT", label: "MUAT" },
        { value: "BONGKAR", label: "BONGKAR" },
        { value: "SELESAI", label: "SELESAI" },
    ]);
    const [selectedJenisKendaraan, setSelectedJenisKendaraan] = useState(null);
    const [selectedStatusArmada, setSelectedStatusArmada] = useState(null);
    const [armada, setArmada] = useState(null);

    const [formDataCicilan, setFormDataCicilan] = useState({
        id_armada: "",
        angsuran: "",
        tanggal_angsuran: "",
        besaran_angsuran: "",
        file_angsuran: "",
    });

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
        fetchJenisKendaraan();
        if (detailId) {
            fetchArmada();
            fetchRiwayatCicilan();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, detailId, navigate]);


    const fetchRiwayatCicilan = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3090/api/v1/cicilan/armada/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            console.log(response.data.data[0]);
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    angsuran: dataitem.angsuran,
                    tanggal_angsuran: dataitem.tanggal_angsuran,
                    besaran_angsuran: dataitem.besaran_angsuran,
                    file_angsuran: dataitem.file_angsuran
                }));
                setCicilan(datafetch);
                console.log(datafetch);
            } else {
                setCicilan([]);
            }
        } catch (error) {
            console.log(error);
            setCicilan([]);
        }
    };

    const fetchJenisKendaraan = async () => {
        try {
            const response = await axios.get("http://localhost:3090/api/v1/jenis-kendaraan", {
                headers: { Authorization: token },
            });
            const jenisKendaraan = response.data.data.map((item) => ({
                value: item.id_jenis_kendaraan,
                label: item.nama_jenis_kendaraan,
            }));
            setJenisKendaraanOption(jenisKendaraan);
        } catch (error) {
            console.error("Error fetching jenis kendaraan:", error);
        }
    };

    const fetchArmada = async () => {
        try {
            const response = await axios.get(`http://localhost:3090/api/v1/armada/${detailId}`, {
                headers: { Authorization: token },
            });
            console.log(response.data.data);
            setArmada(response.data.data);
        } catch (error) {
            console.error("Error fetching armada:", error);
        }
    };

    useEffect(() => {
        if (armada) {
            const initialJenisKendaraan = jeniskendaraanOption.find(
                (option) => option.value === armada.id_jenis_kendaraan
            );
            if (initialJenisKendaraan) {
                setSelectedJenisKendaraan(initialJenisKendaraan);
            }

            const initialStatusArmada = statusArmadaOption.find(
                (option) => option.value === armada.status_armada
            );
            if (initialStatusArmada) {
                setSelectedStatusArmada(initialStatusArmada);
            }
        }
    }, [armada, jeniskendaraanOption, statusArmadaOption]);

    const handleJenisKendaraanChange = (selectedOption) => {
        setSelectedJenisKendaraan(selectedOption);
    };

    const handleStatusArmadaChange = (selectedOption) => {
        setSelectedStatusArmada(selectedOption);
    };
    const handleAngsuranCicilanChange = (selectedOption) => {
        setSelectedAngsuranCicilan(selectedOption);
        setFormDataCicilan({
            ...formDataCicilan,
            angsuran: selectedOption ? selectedOption.value : "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataCicilan({
            ...formDataCicilan,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const datatoSubmit = new FormData();
        datatoSubmit.append("id_armada", detailId);
        datatoSubmit.append("angsuran", formDataCicilan.angsuran);
        datatoSubmit.append("tanggal_angsuran", formDataCicilan.tanggal_angsuran);
        datatoSubmit.append("besaran_angsuran", formDataCicilan.besaran_angsuran);
        datatoSubmit.append("file_angsuran", "bukti.jpg");
        console.log(Object.fromEntries(datatoSubmit.entries()));
        try {
            await axios.post(`http://localhost:3090/api/v1/cicilan`, datatoSubmit, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                }
            });
            Swal.fire({
                title: 'Data Cicilan Armada',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchRiwayatCicilan();
            });
        } catch (error) {
            console.error('Error submitting data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Gagal menambahkan data. Silakan coba lagi.',
                icon: 'error',
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail Cicilan Armada</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik{" "}
                    <button
                        className="fw-bold btn btn-link p-0"
                        onClick={() => handleBackClick()}
                    >
                        disini
                    </button>{" "}
                    untuk kembali ke menu utama Cicilan Armada.
                </div>
            </div>
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Informasi Armada</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="id_jenis_kendaraan" className="form-label">
                                Jenis Kendaraan
                            </label>
                            <Select
                                id="id_jenis_kendaraan"
                                name="id_jenis_kendaraan"
                                value={selectedJenisKendaraan}
                                onChange={handleJenisKendaraanChange}
                                options={jeniskendaraanOption}
                                placeholder="Pilih Jenis Kendaraan"
                                isDisabled
                            />
                        </div>

                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_armada" className="form-label">
                                Nopol Armada
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="nopol_armada"
                                name="nopol_armada"
                                value={armada?.nopol_armada || ""}
                                placeholder="Nopol Armada"
                                onChange={handleChange}
                                required
                                readOnly
                            />
                        </div>

                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="lokasi_terakhir" className="form-label">
                                Lokasi Terakhir
                            </label>
                            <input

                                className="form-control"
                                type="text"
                                id="lokasi_terakhir"
                                name="lokasi_terakhir"
                                value={armada?.lokasi_terakhir || ""}
                                placeholder="Lokasi Terakhir"
                                onChange={handleChange}
                                required
                                readOnly

                            />
                        </div>

                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="status_armada" className="form-label">
                                Status Armada
                            </label>
                            <Select
                                id="status_armada"
                                name="status_armada"
                                value={selectedStatusArmada}
                                onChange={handleStatusArmadaChange}
                                options={statusArmadaOption}
                                placeholder="Pilih Status Armada"
                                required
                                isDisabled
                            />
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <div className="divider text-start">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">Cicilan Armada</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {formDataCicilan && (
                        <div className="row">
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="angsuran" className="form-label">
                                    Pilih Angsuran
                                </label>
                                <Select
                                    type="text"
                                    id="angsuran"
                                    name="angsuran"
                                    placeholder="Pilih Angsuran"
                                    onChange={handleAngsuranCicilanChange}
                                    options={angsuranCicilanOption}
                                    required
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="tanggal_angsuran" className="form-label">
                                    Tanggal Angsuran
                                </label>
                                <input
                                    className="form-control text-uppercase"
                                    type="date"
                                    id="tanggal_angsuran"
                                    name="tanggal_angsuran"
                                    placeholder="Tanggal Angsuran"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label
                                    htmlFor="besaran_angsuran"
                                    className="form-label"
                                >
                                    Besaran Angsuran
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="besaran_angsuran"
                                    name="besaran_angsuran"
                                    placeholder="Besaran Angsuran"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label
                                    htmlFor="file_angsuran"
                                    className="form-label"
                                >
                                    File Angsuran
                                </label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="file_angsuran"
                                    name="file_angsuran"
                                    placeholder=""
                                    readOnly
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="" className="form-label">
                                    Proses
                                </label>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-primary w-100"
                                >
                                    SIMPAN PERUBAHAN
                                </button>
                            </div>
                            <div className="col-lg-12">
                                <div className="mb-3">
                                    <div className="divider text-start">
                                        <div className="divider-text">
                                            <span className="menu-header-text fs-6">Informasi Riwayat Cicilan Armada</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 mb-4 mb-md-0">
                                <div className="table-responsive text-nowrap">
                                    <table className="table" style={{ fontSize: "13px" }}>
                                        <thead>
                                            <tr>
                                                <th className='fw-bold' >No</th>
                                                <th className='fw-bold'>Angsuran</th>
                                                <th className='fw-bold'>Tanggal Angsuran</th>
                                                <th className='fw-bold'>Besaran Angsuran</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cicilan.length > 0 ? (
                                                cicilan.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.angsuran}</td>
                                                        <td>{item.tanggal_angsuran}</td>
                                                        <td>{item.besaran_angsuran}</td>
                                                        {/* <td> <button onClick={() => handleDetailClick()} className="btn btn-link">
                                                            <i className="bx bx-zoom-in text-priamry"></i>
                                                        </button></td> */}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="9" className="text-center">Data tidak tersedia</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

DetailPage.propTypes = {
    detailId: PropTypes.number.isRequired,
    idCustomerInit: PropTypes.number.isRequired,
    idArmadaInit: PropTypes.number.isRequired,
    idDriverInit: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired
};

export default DetailPage;
