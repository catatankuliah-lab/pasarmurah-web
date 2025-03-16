import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';

const AddPage = ({ handleBackClick }) => {

    const token = localStorage.getItem('token');

    const [origin, setOrigin] = useState("");
    const [nomorPO, setNomoerPO] = useState("");

    const [customerOption, setCustomerOption] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const handleCustomerChange = async (selectedOption) => {
        setSelectedCustomer(selectedOption);
        setOrigin(selectedOption.alamat);
    };

    const [armadaOption, setArmadaOption] = useState([]);
    const [selectedArmada, setSelectedArmada] = useState(null);
    const handleArmadaChange = async (selectedOption) => {
        setSelectedArmada(selectedOption);
    };

    const [driverOption, setDriverOption] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const handleDriverChange = async (selectedOption) => {
        setSelectedDriver(selectedOption);
    };

    const [formData, setFormData] = useState({
        nomor_po: "",
        tanggal_po: "",
        jam_pemesanan_po: "",
        jam_muat: "",
        id_customer: "",
        id_armada: "",
        id_driver: "",
        destination: "",
        status_po: "PROSES KAS JALAN"
    });

    const fetchCustomer = async () => {
        try {
            const response = await axios.get('http://localhost:3090/api/v1/customer', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_customer,
                    label: dataitem.nama_customer,
                    alamat: dataitem.alamat_customer,
                }));
                setCustomerOption(datafetch);
            } else {
                setCustomerOption([]);
            }
        } catch (error) {
            console.log(error);
            setCustomerOption([]);
        }
    };

    useEffect(() => {
        fetchCustomer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchArmada = async () => {
        try {
            const response = await axios.get('http://localhost:3090/api/v1/armadas', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_armada,
                    label: dataitem.nopol_armada + ' (' + dataitem.nama_jenis_kendaraan + ')'
                }));
                setArmadaOption(datafetch);
            } else {
                setArmadaOption([]);
            }
        } catch (error) {
            console.log(error);
            setArmadaOption([]);
        }
    };

    useEffect(() => {
        fetchArmada();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDriver = async () => {
        try {
            const response = await axios.get('http://localhost:3090/api/v1/drivers', {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    value: dataitem.id_driver,
                    label: dataitem.nama_driver
                }));
                setDriverOption(datafetch);
            } else {
                setDriverOption([]);
            }
        } catch (error) {
            console.log(error);
            setDriverOption([]);
        }
    };

    useEffect(() => {
        fetchDriver();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchJumlahPO = async () => {
        try {
            const bulanSekarang = new Date().getMonth() + 1;
            const bulanFormatted = String(bulanSekarang).padStart(2, "0");
            const tahunSekarang = new Date().getFullYear();
            const response = await axios.get(`http://localhost:3090/api/v1/po/jumlahpobulanan/${bulanSekarang}`, {
                headers: {
                    Authorization: token
                }
            });
            let nomor = "";
            if (response.data.jumlahPO < 10) {
                nomor = `00${response.data.jumlahPO + 1}`
            } else if (response.data.jumlahPO < 100) {
                nomor = `0${response.data.jumlahPO + 1}`
            } else {
                nomor = `${response.data.jumlahPO + 1}`
            }
            setNomoerPO(`88LOG-PO${bulanFormatted}${tahunSekarang}-${nomor}`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchJumlahPO();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSubmit = {
            ...formData,
            id_armada: selectedArmada.value,
            id_customer: selectedCustomer.value,
            id_driver: selectedDriver.value,
            nomor_po: nomorPO
        };
        try {
            const hasil = await axios.post(`http://localhost:3090/api/v1/po`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data PO',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                const dataToSubmitKasJalan = {
                    ...formData,
                    id_po: hasil.data.data.id_po,
                    jenis_kas_jalan:"REGULER",
                    jarak_isi:"0",
                    jarak_kosong:"0",
                    jam_tunggu:"0",
                    gaji_driver:"0",
                    e_toll:"0",
                    keterangan_rute:" ",
                    tonase:"0",
                    status_kas_jalan:"DIBUAT",
                };
                axios.post(
                    `http://localhost:3090/api/v1/kas_jalan`,
                    dataToSubmitKasJalan,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                const dataToSubmitKasJalanKosongan = {
                    ...formData,
                    id_po: hasil.data.data.id_po,
                    jenis_kas_jalan:"KOSONGAN",
                    jarak_isi:"0",
                    jarak_kosong:"0",
                    jam_tunggu:"0",
                    gaji_driver:"0",
                    e_toll:"0",
                    keterangan_rute:" ",
                    tonase:"0",
                    status_kas_jalan:"DIBUAT",
                };
                axios.post(
                    `http://localhost:3090/api/v1/kas_jalan`,
                    dataToSubmitKasJalanKosongan,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
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

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Tambah Purchase Order</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Purchase Order.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <form id="form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="nomor_po" className="form-label">Nomor PO</label>
                            <input className="form-control" type="text" id="nomor_po" name='nomor_po' placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={nomorPO || ""} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="tanggal_po" className="form-label">Tanggal PO</label>
                            <input className="form-control text-uppercase" type="date" id="tanggal_po" name='tanggal_po' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jam_pemesanan_po" className="form-label">Jam Stanby</label>
                            <input className="form-control" type="time" id="jam_pemesanan_po" name='jam_pemesanan_po' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="jam_muat" className="form-label">Jam Muat</label>
                            <input className="form-control" type="time" id="jam_muat" name='jam_muat' onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_customer" className="form-label">Customer</label>
                            <Select
                                id="id_customer"
                                name="id_customer"
                                value={selectedCustomer}
                                onChange={handleCustomerChange}
                                options={customerOption}
                                placeholder="Pilih Customer"
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="telpon_kontak_darurat_driver" className="form-label">Origin</label>
                            <input className="form-control text-uppercase" type="text" readOnly value={origin} />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="destination" className="form-label">Destination</label>
                            <input className="form-control" type="text" id="destination" name='destination' placeholder="" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_armada" className="form-label">Armada</label>
                            <Select
                                id="id_armada"
                                name="id_armada"
                                value={selectedArmada}
                                onChange={handleArmadaChange}
                                options={armadaOption}
                                placeholder="Pilih Armada"
                                required
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                            <label htmlFor="id_driver" className="form-label">Driver</label>
                            <Select
                                id="id_driver"
                                name="id_driver"
                                value={selectedDriver}
                                onChange={handleDriverChange}
                                options={driverOption}
                                placeholder="Pilih Driver"
                                required
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

AddPage.propTypes = {
    handlePageChanges: PropTypes.func.isRequired,
    handleBackClick: PropTypes.func.isRequired,
};

export default AddPage;