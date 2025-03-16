import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const DetailPage = ({ detailId, handleBackClick }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

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
    const [formData, setFormData] = useState({
        id_jenis_kendaraan: "",
        nopol_armada: "",
        lokasi_terakhir: "",
        status_armada: "",
    });

    // Ambil data Jenis Kendaraan
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
        fetchJenisKendaraan();
        if (detailId) {
            fetchArmada();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, detailId, navigate]);

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
            setArmada(response.data.data);
        } catch (error) {
            console.error("Error fetching armada:", error);
        }
    };

    useEffect(() => {
        if (armada) {
            setFormData({
                id_jenis_kendaraan: armada.id_jenis_kendaraan,
                nopol_armada: armada.nopol_armada,
                lokasi_terakhir: armada.lokasi_terakhir,
                status_armada: armada.status_armada,
            });

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
        setFormData({
            ...formData,
            id_jenis_kendaraan: selectedOption ? selectedOption.value : "",
        });
    };

    const handleStatusArmadaChange = (selectedOption) => {
        setSelectedStatusArmada(selectedOption);
        setFormData({
            ...formData,
            status_armada: selectedOption ? selectedOption.value : "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Detail ID:", detailId);
        console.log("Data Armada:", formData);

        const dataArmadaToSubmit = new FormData();
        dataArmadaToSubmit.append("id_jenis_kendaraan", formData.id_jenis_kendaraan);
        dataArmadaToSubmit.append("nopol_armada", formData.nopol_armada);
        dataArmadaToSubmit.append("lokasi_terakhir", formData.lokasi_terakhir);
        dataArmadaToSubmit.append("status_armada", formData.status_armada);

        try {
            await axios.put(`http://localhost:3090/api/v1/armada/${detailId}`, dataArmadaToSubmit, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                title: "Data Armada",
                text: "Data Berhasil Diperbaharui",
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                handleBackClick();
            });
        } catch (error) {
            console.error("Error submitting data:", error);
            Swal.fire({
                title: "Error",
                text: "Gagal menambahkan data. Silakan coba lagi.",
                icon: "error",
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
                            <span className="menu-header-text fs-6">Detail Customer</span>
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
                    untuk kembali ke menu utama Customer.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Jenis Kendaraan */}
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
                            />
                        </div>

                        {/* Nopol Armada */}
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_armada" className="form-label">
                                Nopol Armada
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="nopol_armada"
                                name="nopol_armada"
                                value={formData.nopol_armada}
                                placeholder="Nopol Armada"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Lokasi Terakhir */}
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="lokasi_terakhir" className="form-label">
                                Lokasi Terakhir
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="lokasi_terakhir"
                                name="lokasi_terakhir"
                                value={formData.lokasi_terakhir}
                                placeholder="Lokasi Terakhir"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Status Armada */}
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
                            />
                        </div>

                        {/* Proses Selanjutnya */}
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">
                                Proses
                            </label>
                            <button type="submit" className="btn btn-primary w-100">
                                SELANJUTNYA
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

DetailPage.propTypes = {
    detailId: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired
};


export default DetailPage;
