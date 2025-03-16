import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import QrScanner from "react-qr-scanner";

const AddPage = ({ handlePageChanges, handleBackClick }) => {

    const token = localStorage.getItem('token') || '';
    const id_user = localStorage.getItem('id_user') || '';
    const id_kantor = localStorage.getItem('id_kantor') || '';

    const [result, setResult] = useState("");
    const [kpm, setKPM] = useState(null);

    const [selectedPenyaluran, setSelectedPenyaluran] = useState(null);


    const handlePenyaluranChange = (selectedOption) => {
        setSelectedPenyaluran(selectedOption);
    };

    const [formData, setFormData] = useState({
        id_kantor: "",
        nomor_lo: "",
        tanggal_lo: "",
        titik_muat: "",
        jenis_mobil: "",
        nopol_mobil: "",
        nama_driver: "",
        telpon_driver: "",
        file_lo: "",
        status_lo: "",

    });

    const [nomorLO, setNomoerLO] = useState("");


    // const fetchJumlahLO = async () => {
    //     try {
    //         const bulanSekarang = new Date().getMonth() + 1;
    //         const bulanFormatted = String(bulanSekarang).padStart(2, "0");
    //         const tahunSekarang = new Date().getFullYear();
    //         const response = await axios.get(`http://localhost:3091/api/v1/po/jumlahpobulanan/${bulanSekarang}`, {
    //             headers: {
    //                 Authorization: token
    //             }
    //         });
    //         let nomor = "";
    //         if (response.data.jumlahPO < 10) {
    //             nomor = `00${response.data.jumlahPO + 1}`
    //         } else if (response.data.jumlahPO < 100) {
    //             nomor = `0${response.data.jumlahPO + 1}`
    //         } else {
    //             nomor = `${response.data.jumlahPO + 1}`
    //         }
    //         setNomoerLO(`88LOG-PO${bulanFormatted}${tahunSekarang}-${nomor}`);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };


    // const handleFileChange = (event, setFile, setPreview, kpm, lokasi, type) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const img = new Image();
    //             img.src = e.target.result;
    //             img.onload = () => {
    //                 const canvas = document.createElement("canvas");
    //                 const ctx = canvas.getContext("2d");

    //                 // Set canvas size to image dimensions
    //                 canvas.width = img.width;
    //                 canvas.height = img.height;

    //                 // Draw image on canvas
    //                 ctx.drawImage(img, 0, 0);

    //                 // Add timestamp and location text
    //                 const boxHeight = 150;
    //                 ctx.globalAlpha = 0.7;
    //                 ctx.fillStyle = "black";
    //                 ctx.fillRect(0, img.height - boxHeight, img.width, boxHeight);

    //                 ctx.globalAlpha = 1;
    //                 ctx.fillStyle = "white";
    //                 ctx.font = "30px Arial";

    //                 // Add timestamp
    //                 const timestamp = new Date().toLocaleString("id-ID");
    //                 ctx.fillText(`Waktu: ${timestamp}`, 20, img.height - boxHeight + 60);

    //                 // Add location details if available
    //                 if (lokasi) {
    //                     ctx.fillText(`${lokasi.desa}, ${lokasi.kecamatan}, ${lokasi.kabupaten}`, 20, img.height - boxHeight + 100);
    //                     ctx.fillText(`${lokasi.provinsi}`, 20, img.height - boxHeight + 120);
    //                 }

    //                 // Convert canvas to image and set preview
    //                 const finalImage = canvas.toDataURL("image/jpeg", 0.7); // Compress to 70%
    //                 setPreview(finalImage);

    //                 // Convert data URL to Blob
    //                 const blob = dataURLtoBlob(finalImage);

    //                 // Determine file name based on type
    //                 const nik = kpm?.decrypted_nik || "unknown_nik";
    //                 const newFileName =
    //                     type === "ktp"
    //                         ? `ktp_${nik}.jpg`
    //                         : `kpm_${nik}.jpg`;

    //                 // Create new File object
    //                 const newFile = new File([blob], newFileName, { type: "image/jpeg" });
    //                 setFile(newFile);
    //             };
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // // Helper function to convert data URL to Blob
    // const dataURLtoBlob = (dataURL) => {
    //     const arr = dataURL.split(',');
    //     const mime = arr[0].match(/:(.*?);/)[1];
    //     const bstr = atob(arr[1]);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);
    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new Blob([u8arr], { type: mime });
    // };

    const previewStyle = {
        height: 355,
        width: 355,
    };

    // const handleScan = (data) => {
    //     if (data) {
    //         setResult(data.text);
    //         fetchKPM(data.text);
    //         setIsScannerVisible(false);
    //     }
    // };

    // const handleError = (err) => {
    //     console.error('Error with QR scanner: ', err);
    // };

    // const handleAlokasiChange = async (selectedOption) => {
    //     setSelectedAlokasi(selectedOption);
    //     setIsScannerVisible(true);
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        event.preventDefault();
        const formDataInsert = new FormData();
        formDataInsert.append('id_kantor', id_kantor);
        formDataInsert.append('nomor_lo', "NOMORLO");
        formDataInsert.append('tanggal_lo', formData.tanggal_lo);
        formDataInsert.append('titik_muat', formData.titik_muat);
        formDataInsert.append('jenis_mobil', formData.jenis_mobil);
        formDataInsert.append('nopol_mobil', formData.nopol_mobil);
        formDataInsert.append('nama_driver', formData.nama_driver);
        formDataInsert.append('telpon_driver', formData.telpon_driver);
        formDataInsert.append('file_lo', "pasar.pdf");
        formDataInsert.append('status_lo', "DIBUAT");

        console.log([...formDataInsert.entries()]);

        const result = await axios.post(`http://localhost:3091/api/v1/lo`, formDataInsert, {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data',
            }
        });
        Swal.fire({
            title: 'Data Penyaluran',
            text: 'Data Berhasil Ditambahkan',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
        }).then(() => {
            handleBackClick();
            
        });
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Tambah LO</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama LO.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nomor_po" className="form-label">Nomor PO</label>
                            <input className="form-control" type="text" id="nomor_po" name='nomor_po' placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={nomorLO || ""} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_lo" className="form-label">Tanggal LO</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_lo" name='tanggal_lo' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="titik_muat" className="form-label">Titik Muat</label>
                            <input className="form-control text-uppercase" type="text" id="titik_muat" name='titik_muat' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jenis_mobil" className="form-label">Jenis Mobil</label>
                            <input className="form-control text-uppercase" type="text" id="jenis_mobil" name='jenis_mobil' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_mobil" className="form-label">Nopol Mobil</label>
                            <input className="form-control text-uppercase" type="text" id="nopol_mobil" name='nopol_mobil' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
                            <input className="form-control text-uppercase" type="text" id="nama_driver" name='nama_driver' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="telpon_driver" className="form-label">Telepon Driver</label>
                            <input className="form-control text-uppercase" type="text" id="telpon_driver" name='telpon_driver' placeholder="" onChange={handleChange} required />
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

AddPage.propTypes = {
    handlePageChanges: PropTypes.func.isRequired,
    handleBackClick: PropTypes.func.isRequired,
};

export default AddPage;