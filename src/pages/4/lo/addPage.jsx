import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddPage = ({ handlePageChanges, handleBackClick }) => {

    const token = localStorage.getItem('token') || '';
    const id_kantor = localStorage.getItem('id_kantor') || '';
    const username = localStorage.getItem("username") || '';

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


    const fetchJumlahLO = async () => {
        try {
            const bulanSekarang = new Date().getMonth() + 1;
            const bulanFormatted = String(bulanSekarang).padStart(2, "0");
            const tahunSekarang = new Date().getFullYear();
            const response = await axios.get(`http://localhost:3091/api/v1/lo/jumlahlokantor/${id_kantor}`, {
                headers: {
                    Authorization: token
                }
            });
            let nomor = response.data.jumlahLO + 1;
            setNomoerLO(`LOBPM-${username}-${bulanFormatted}${tahunSekarang}-${nomor}`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchJumlahLO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        event.preventDefault();
        const formDataInsert = {
            id_kantor,
            nomor_lo: nomorLO,
            tanggal_lo: formData.tanggal_lo,
            titik_muat: formData.titik_muat,
            jenis_mobil: formData.jenis_mobil,
            nopol_mobil: formData.nopol_mobil,
            nama_driver: formData.nama_driver,
            telpon_driver: formData.telpon_driver,
            file_lo: "pasar.pdf",
            status_lo: "DIBUAT"
        };

        const response = await axios.post(`http://localhost:3091/api/v1/lo`, formDataInsert, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        });

        Swal.fire({
            title: "Data Loading Order",
            text: "Data Berhasil Ditambahkan",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            handlePageChanges(response.data.data);
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
                            <label htmlFor="nomor_po" className="form-label">Nomor LO</label>
                            <input className="form-control" type="text" id="nomor_po" name='nomor_po' placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={nomorLO || ""} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_lo" className="form-label">Tanggal LO</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_lo" name='tanggal_lo' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="titik_muat" className="form-label">Titik Muat</label>
                            <input className="form-control" type="text" id="titik_muat" name='titik_muat' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jenis_mobil" className="form-label">Jenis Mobil</label>
                            <input className="form-control" type="text" id="jenis_mobil" name='jenis_mobil' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nopol_mobil" className="form-label">Nopol Mobil</label>
                            <input className="form-control" type="text" id="nopol_mobil" name='nopol_mobil' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
                            <input className="form-control" type="text" id="nama_driver" name='nama_driver' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="telpon_driver" className="form-label">Telepon Driver</label>
                            <input className="form-control" type="text" id="telpon_driver" name='telpon_driver' placeholder="" onChange={handleChange} required />
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