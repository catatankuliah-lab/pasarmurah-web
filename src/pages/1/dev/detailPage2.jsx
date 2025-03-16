import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const DetailPage = ({ detailId, handleBackClick }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [jeniskendaraanOption, setJenisKendaraanOption] = useState([]);
    const [statusArmadaOption, setStatusArmadaOption] = useState([
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
    }, [token, detailId, navigate]);

    const fetchJenisKendaraan = async () => {
        try {
            const response = await axios.get("http://localhost:3091/api/v1/driver", {
                headers: { Authorization: token },
            });
            const jenisKendaraan = response.data.data.map((item) => ({
                value: item.id_driver,
                label: item.nama_driver,
            }));
            setJenisKendaraanOption(jenisKendaraan);
        } catch (error) {
            console.error("Error fetching jenis kendaraan:", error);
        }
    };

    const fetchArmada = async () => {
        try {
            const response = await axios.get(`http://localhost:3091/api/v1/armada/${detailId}`, {
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
            await axios.put(`http://localhost:3091/api/v1/armada/${detailId}`, dataArmadaToSubmit, {
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
                            <span className="menu-header-text fs-6">Detail Armada</span>
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
                    untuk kembali ke menu utama Armada.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_armada" className="form-label">Nopol Armada</label>
                            <input className="form-control" type="text" id="nopol_armada" name='nopol_armada' placeholder="Nopol Armada" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_jenis_kendaraan" className="form-label">Driver Aktif</label>
                            <Select id="id_jenis_kendaraan" name="id_jenis_kendaraan"  onChange={handleJenisKendaraanChange} options={jeniskendaraanOption} placeholder="Pilih Driver"
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_armada" className="form-label">Nomor Rangka</label>
                            <input className="form-control" type="text" id="nopol_armada" name='nopol_armada' placeholder="Nomor Rangka" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_armada" className="form-label">Nomor Mesin</label>
                            <input className="form-control" type="text" id="nopol_armada" name='nopol_armada' placeholder="Nomor Mesin" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_jenis_kendaraan" className="form-label">Driver Utama</label>
                            <Select id="id_jenis_kendaraan" name="id_jenis_kendaraan"  onChange={handleJenisKendaraanChange} options={jeniskendaraanOption} placeholder="Pilih Driver"
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_jenis_kendaraan" className="form-label">Driver Serep</label>
                            <Select id="id_jenis_kendaraan" name="id_jenis_kendaraan"  onChange={handleJenisKendaraanChange} options={jeniskendaraanOption} placeholder="Pilih Driver"
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">Proses</label>
                            <button type="submit" className="btn btn-primary w-100">SIMPAN DATA</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DetailPage;
