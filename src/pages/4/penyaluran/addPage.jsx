import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import QrScanner from "react-qr-scanner";

const AddPage = ({ handlePageChanges, handleBackClick }) => {

    const token = localStorage.getItem('token') || '';
    const id_user = localStorage.getItem('id_user') || '';

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [isScannerVisible, setIsScannerVisible] = useState(false);
    const [result, setResult] = useState("");
    const [kpm, setKPM] = useState(null);

    const [selectedPenyaluran, setSelectedPenyaluran] = useState(null);

    const penyaluranOptions = [
        { value: 'Normal', label: 'Normal' },
        { value: 'Perwakilan', label: 'Perwakilan' },
        { value: 'Pengganti', label: 'Pengganti' }
    ];

    const handlePenyaluranChange = (selectedOption) => {
        setSelectedPenyaluran(selectedOption);
    };

    const [formData, setFormData] = useState({
        id_penyaluran: "",
        id_dtt: "",
        id_kpm: "",
        jenis_penyaluran: "",
        file_ktp: "",
        file_kpm: "",
        id_user: "",
        tanggal_penyaluran: "",
        waktu_penyaluran: "",
        nik_perwakilan: "",
        nama_perwakilan: "",
        alamat_perwakilan: "",
        nik_pengganti: "",
        nama_pengganti: "",
        alamat_pengganti: "",
        keterangan_perwakilan: "",
        keterangan_pergantian: "",
    });

    const [formDataSPTJM, setFormDataSPTJM] = useState({
        id_penyaluran: "",
        kode_sptjm: ""
    });

    const [fileKTP, setFileKTP] = useState(null);
    const [fileKPM, setFileKPM] = useState(null);
    const [previewKTP, setPreviewKTP] = useState(null);
    const [previewKPM, setPreviewKPM] = useState(null);
    const [lokasi, setLokasi] = useState(null);

    const fetchLocationInIndonesian = async (latitude, longitude) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const address = data.address;
            setLokasi({
                desa: address.village || address.hamlet || "",
                kecamatan: address.suburb || address.town || address.city_district || "",
                kabupaten: address.city || address.county || "",
                provinsi: address.state || "",
            });
        } catch (error) {
            console.error("Gagal mendapatkan lokasi:", error);
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchLocationInIndonesian(latitude, longitude);
                },
                (error) => {
                    console.error("Gagal mendapatkan lokasi:", error);
                }
            );
        } else {
            console.error("Geolocation tidak didukung di browser ini.");
        }
    };

    useEffect(() => {
        handleGetLocation();
    }, []);

    const handleFileChange = (event, setFile, setPreview, kpm, lokasi, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    // Set canvas size to image dimensions
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0);

                    // Add timestamp and location text
                    const boxHeight = 150;
                    ctx.globalAlpha = 0.7;
                    ctx.fillStyle = "black";
                    ctx.fillRect(0, img.height - boxHeight, img.width, boxHeight);

                    ctx.globalAlpha = 1;
                    ctx.fillStyle = "white";
                    ctx.font = "30px Arial";

                    // Add timestamp
                    const timestamp = new Date().toLocaleString("id-ID");
                    ctx.fillText(`Waktu: ${timestamp}`, 20, img.height - boxHeight + 60);

                    // Add location details if available
                    if (lokasi) {
                        ctx.fillText(`${lokasi.desa}, ${lokasi.kecamatan}, ${lokasi.kabupaten}`, 20, img.height - boxHeight + 100);
                        ctx.fillText(`${lokasi.provinsi}`, 20, img.height - boxHeight + 120);
                    }

                    // Convert canvas to image and set preview
                    const finalImage = canvas.toDataURL("image/jpeg", 0.7); // Compress to 70%
                    setPreview(finalImage);

                    // Convert data URL to Blob
                    const blob = dataURLtoBlob(finalImage);

                    // Determine file name based on type
                    const nik = kpm?.decrypted_nik || "unknown_nik";
                    const newFileName =
                        type === "ktp"
                            ? `ktp_${nik}.jpg`
                            : `kpm_${nik}.jpg`;

                    // Create new File object
                    const newFile = new File([blob], newFileName, { type: "image/jpeg" });
                    setFile(newFile);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    // Helper function to convert data URL to Blob
    const dataURLtoBlob = (dataURL) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const previewStyle = {
        height: 355,
        width: 355,
    };

    const handleScan = (data) => {
        if (data) {
            setResult(data.text);
            fetchKPM(data.text);
            setIsScannerVisible(false);
        }
    };

    const handleError = (err) => {
        console.error('Error with QR scanner: ', err);
    };

    const fetchAlokasi = async () => {
        try {
            const response = await axios.get('http://localhost:3089/api/v1/alokasi', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_alokasi,
                    label: `${dataitem.bulan_alokasi} ${dataitem.tahun_alokasi}`
                }));
                setAlokasiOption(datafetch);
            } else {
                setAlokasiOption([]);
            }
        } catch (error) {
            console.log('Error fetching alokasi: ', error);
            setAlokasiOption([]);
        }
    };

    useEffect(() => {
        fetchAlokasi();
    }, []);

    const fetchKPM = async (idkpm) => {
        console.log('Fetching KPM for ID:', idkpm);
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/januari-kpm/kpm/${idkpm}`, {
                headers: {
                    Authorization: token
                }
            });
            setKPM(response.data.data[0]);
        } catch (error) {
            console.log('Error fetching KPM: ', error);
        }
    };

    const handleAlokasiChange = async (selectedOption) => {
        setSelectedAlokasi(selectedOption);
        setIsScannerVisible(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const hanldeSubmit = async () => {

        let today = new Date();
        let tanggal_penyaluran = today.toISOString().split('T')[0];
        let hours = today.getHours().toString().padStart(2, '0');
        let minutes = today.getMinutes().toString().padStart(2, '0');
        let waktu_penyaluran = `${hours}:${minutes}`;

        const formDataInsert = new FormData();
        formDataInsert.append('id_dtt', kpm.id_dtt);
        formDataInsert.append('id_kpm', kpm.id_kpm);
        formDataInsert.append('jenis_penyaluran', selectedPenyaluran.value);
        formDataInsert.append('id_user', id_user);
        formDataInsert.append('tanggal_penyaluran', tanggal_penyaluran);
        formDataInsert.append('waktu_penyaluran', waktu_penyaluran);
        formDataInsert.append('nik_perwakilan', formData.nik_perwakilan);
        formDataInsert.append('nama_perwakilan', formData.nama_perwakilan);
        formDataInsert.append('alamat_perwakilan', formData.alamat_perwakilan);
        formDataInsert.append('nik_pengganti', formData.nik_pengganti);
        formDataInsert.append('nama_pengganti', formData.nama_pengganti);
        formDataInsert.append('alamat_pengganti', formData.alamat_pengganti);
        formDataInsert.append('keterangan_perwakilan', formData.keterangan_perwakilan);
        formDataInsert.append('keterangan_pergantian', formData.keterangan_pergantian);
        formDataInsert.append('file_ktp', fileKTP);
        formDataInsert.append('file_kpm', fileKPM);

        const result = await axios.post(`http://localhost:3089/api/v1/januari-penyaluran`, formDataInsert, {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data',
            }
        });
        if (selectedPenyaluran.value == "Pengganti") {
            const dataToSubmit = {
                ...formDataSPTJM,
                id_penyaluran: result.data.result,
                kode_sptjm: `SPTJM-${kpm.kode_dtt}`
            };
            await axios.post(`http://localhost:3089/api/v1/januari-sptjm`, dataToSubmit, {
                headers: {
                    'Authorization': token,
                }
            });
        }
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
                            <span className="menu-header-text fs-6">Tambah Penyaluran</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Penyaluran.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <div className="row">
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_alokasi" className="form-label">Alokasi</label>
                        <Select
                            id="id_alokasi"
                            name="id_alokasi"
                            value={selectedAlokasi}
                            onChange={handleAlokasiChange}
                            options={alokasiOption}
                            placeholder="Pilih Alokasi"
                            required
                        />
                    </div>
                    {isScannerVisible && (
                        <div className="row">
                            <div className="col-md-3 col-sm-12">
                                <QrScanner
                                    delay={300}
                                    style={previewStyle}
                                    onError={handleError}
                                    onScan={handleScan}
                                />
                            </div>
                        </div>
                    )}
                    {kpm && (
                        <div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="nik" className="form-label">NIK</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="nik"
                                    name="nik"
                                    placeholder="NIK"
                                    value={kpm.decrypted_nik || ""}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="nama_lengkap" className="form-label">Nama Lengkap</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="nama_lengkap"
                                    name="nama_lengkap"
                                    placeholder="Nama Lengkap"
                                    value={kpm.nama_lengkap || ""}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="provinsi" className="form-label">Provinsi</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="provinsi"
                                    name="provinsi"
                                    placeholder="Provinsi"
                                    value={kpm.nama_provinsi || ""}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="kabupaten_kota" className="form-label">Kabupaten/Kota</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="kabupaten_kota"
                                    name="kabupaten_kota"
                                    placeholder="Kabupaten/Kota"
                                    value={kpm.nama_kabupaten_kota || ""}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="kecamatan" className="form-label">Kecamatan</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="kecamatan"
                                    name="kecamatan"
                                    placeholder="Kecamatan"
                                    value={kpm.nama_kecamatan || ""}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="desa_kelurahan" className="form-label">Desa/Kelurahan</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="desa_kelurahan"
                                    name="desa_kelurahan"
                                    placeholder="Desa/Kelurahan"
                                    value={kpm.nama_desa_kelurahan || ""}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="alamat_lengkap" className="form-label">Alamat Lengkap</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="alamat_lengkap"
                                    name="alamat_lengkap"
                                    placeholder="Alamat Lengkap"
                                    value={kpm.alamat_lengkap || ""}
                                    required
                                    readOnly
                                />
                            </div>
                            {/* Foto KTP */}
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="file_ktp" className="form-label">Foto KTP</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="file_ktp"
                                    name="file_ktp"
                                    onChange={(e) => handleFileChange(e, setFileKTP, setPreviewKTP, kpm, lokasi, "ktp")}
                                />
                                {previewKTP && (
                                    <div className='mt-3'>
                                        <img src={previewKTP} alt="Preview KTP" style={{ maxWidth: "100%" }} />
                                    </div>
                                )}
                            </div>

                            {/* Foto KPM */}
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="file_kpm" className="form-label">Foto KPM</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="file_kpm"
                                    name="file_kpm"
                                    onChange={(e) => handleFileChange(e, setFileKPM, setPreviewKPM, kpm, lokasi, "kpm")}
                                />
                                {previewKPM && (
                                    <div className='mt-3'>
                                        <img src={previewKPM} alt="Preview KPM" style={{ maxWidth: "100%" }} />
                                    </div>
                                )}
                            </div>
                            <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                                <label htmlFor="jenis_penyaluran" className="form-label">Jenis Penyaluran</label>
                                <Select
                                    id="jenis_penyaluran"
                                    name="jenis_penyaluran"
                                    value={selectedPenyaluran}
                                    onChange={handlePenyaluranChange}
                                    options={penyaluranOptions}
                                    placeholder="Pilih Jenis Penyaluran"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    {selectedPenyaluran?.value === 'Perwakilan' && (
                        <div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="nik_perwakilan" className="form-label">NIK Perwakilan</label>
                                <input className="form-control" type="text" id="nik_perwakilan" name='nik_perwakilan' placeholder="NIK Perwakilan" onChange={handleChange} required />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="nama_perwakilan" className="form-label">Nama Perwakilan</label>
                                <input className="form-control" type="text" id="nama_perwakilan" name='nama_perwakilan' placeholder="Nama Perwakilan" onChange={handleChange} required />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="alamat_perwakilan" className="form-label">Alamat Perwakilan</label>
                                <input className="form-control" type="text" id="alamat_perwakilan" name='alamat_perwakilan' placeholder="Alamat Perwakilan" onChange={handleChange} required />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="keterangan_perwakilan" className="form-label">Keterangan Perwakilan</label>
                                <input className="form-control" type="text" id="keterangan_perwakilan" name='keterangan_perwakilan' placeholder="Keterangan Perwakilan" onChange={handleChange} required />
                            </div>
                        </div>
                    )}
                    {selectedPenyaluran?.value === 'Pengganti' && (
                        <div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="nik_pengganti" className="form-label">NIK Pengganti</label>
                                <input className="form-control" type="text" id="nik_pengganti" name='nik_pengganti' placeholder="NIK Pengganti" onChange={handleChange} required />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="nama_pengganti" className="form-label">Nama Pengganti</label>
                                <input className="form-control" type="text" id="nama_pengganti" name='nama_pengganti' placeholder="Nama Pengganti" onChange={handleChange} required />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="alamat_pengganti" className="form-label">Alamat Pengganti</label>
                                <input className="form-control" type="text" id="alamat_pengganti" name='alamat_pengganti' placeholder="Alamat Pengganti" onChange={handleChange} required />
                            </div>
                            <div className="col-md-3 col-sm-12 mb-3">
                                <label htmlFor="keterangan_pergantian" className="form-label">Keterangan Pengganti</label>
                                <input className="form-control" type="text" id="keterangan_pergantian" name='keterangan_pergantian' placeholder="Keterangan Pengganti" onChange={handleChange} required />
                            </div>
                        </div>
                    )}
                    {fileKTP && fileKPM && (
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">Proses</label>
                            <button type="button" className="btn btn-primary w-100" onClick={hanldeSubmit} >
                                SIMPAN DATA
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

AddPage.propTypes = {
    handlePageChanges: PropTypes.func.isRequired,
    handleBackClick: PropTypes.func.isRequired,
};

export default AddPage;