import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UploadPage = (handleBackClick) => {
    // Data dari localstorage
    const token = localStorage.getItem("token");
    const id_kantor = localStorage.getItem("id_kantor");
    const nama_kantor = localStorage.getItem("nama_kantor");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);

    const [dttOption, setDTTOption] = useState([]);
    const [selectedDTT, setSelectedDTT] = useState(null);

    const [file, setFile] = useState(null);

    const handleFileChange = (e, setFileFunction) => {
        setFileFunction(e.target.files[0]);
    };

    const fetchAlokasi = async () => {
        if (!token) {
            navigate("/");
        }
        try {
            const response = await axios.get("http://localhost:3089/api/v1/alokasi", {
                headers: {
                    Authorization: token,
                },
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map((dataitem) => ({
                    value: dataitem.id_alokasi,
                    label: dataitem.bulan_alokasi + " " + dataitem.tahun_alokasi,
                }));
                setAlokasiOption(datafetch);
            } else {
                setAlokasiOption([]);
            }
        } catch (error) {
            console.log(error);
            setAlokasiOption([]);
        }
    };

    useEffect(() => {
        fetchAlokasi();
    }, []);

    const handleAlokasiChange = async (selectedOption) => {
        setSelectedAlokasi(selectedOption);
    };

    const uploadDTT = async () => {
        event.preventDefault();
        const formDataInsert = new FormData();
        formDataInsert.append('id_dtt', selectedDTT.value);
        formDataInsert.append('file_dtt', file);

        try {
            let link = "januari";
            if (selectedAlokasi.value == 1) {
                link = "januari";
            } else if (selectedAlokasi.value == 2) {
                link = "februari";
            } else {
                link = "januari";
            }
            await axios.put(`http://localhost:3089/api/v1/${link}-dtt/upload/${selectedDTT.value}`, formDataInsert, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                }
            });
            Swal.fire({
                title: 'Data DTT',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                handleBackClick();
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

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
        const fetchDTTOptions = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3089/api/v1/januari-dtt`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                const datadtt = response.data.data.map(
                    (dttall) => ({
                        value: dttall.id_dtt,
                        label: dttall.kode_dtt,
                    })
                );
                setDTTOption(datadtt);
            } catch (error) {
                console.error("Error fetching", error);
                setDTTOption([]);
            }
        };
        if (selectedAlokasi) {
            fetchDTTOptions(selectedAlokasi);
        }
    }, [selectedAlokasi]);

    const handleDTTChange = (selectedOption) => {
        setSelectedDTT(selectedOption);
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
            <div className="row">
                <div className="col-lg-12">
                    <div className="mb-3">
                        <div className="divider text-start fw-bold">
                            <div className="divider-text">
                                <span className="menu-header-text fs-6">
                                    Data DTT dan Undangan
                                </span>
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
                        untuk kembali ke menu utama DTT dan Undangan.
                    </div>
                </div>
                <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                    <label htmlFor="id_lokasi" className="form-label">
                        Alokasi
                    </label>
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
                <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                    <label htmlFor="id_dtt" className="form-label">
                        Kode DTT
                    </label>
                    <Select
                        id="id_dtt"
                        name="id_dtt"
                        value={selectedDTT}
                        onChange={handleDTTChange}
                        options={dttOption}
                        placeholder="Pilih Kode DTT"
                        required
                    />
                </div>
                <div className="col-md-3 col-sm-12 mb-3">
                    <label htmlFor="file_dtt" className="form-label">File Doc Out</label>
                    <input className="form-control" type="file" id="file_dtt" name='file_dtt' placeholder="File Doc Out" onChange={(e) => handleFileChange(e, setFile)} required />
                </div>
                <div className="col-md-3 col-sm-12 mb-3">
                    <label htmlFor="" className="form-label">
                        Proses
                    </label>
                    <button onClick={uploadDTT} className="btn btn-primary w-100">
                        UPLOAD DTT
                    </button>
                </div>
            </div>
        </div>
    );
};
UploadPage.propTypes = {
    handleBackClick: PropTypes.func.isRequired
};
export default UploadPage;
