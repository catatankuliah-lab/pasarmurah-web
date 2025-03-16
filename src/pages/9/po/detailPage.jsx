import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Swal from "sweetalert2";


const DetailPage = ({ detailId, idCustomerInit, idArmadaInit, idDriverInit, handleBackClick }) => {
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        nomor_po: "",
        tanggal_po: "",
        jam_pemesanan_po: "",
        jam_muat: "",
        id_customer: "",
        id_armada: "",
        id_driver: "",
        destination: "",
        status_po: ""
    });

    const [formDataReguler, setFormDataReguler] = useState({
        jarak_isi: "",
        jarak_kosong: "",
        jam_tunggu: "",
        gaji_driver: "",
        e_toll: "",
        keterangan_rute: "",
        tonase: "",
        rasio_perkalian: "",
        rasio_perkalian_kosong: ""
    });

    const [formDataKosongan, setFormDataKosongan] = useState({
        jarak_isi: "",
        jarak_kosong: "",
        jam_tunggu: "",
        gaji_driver: "",
        e_toll: "",
        keterangan_rute: "",
        tonase: "",
        rasio_perkalian: "",
        rasio_perkalian_kosong: ""
    });

    const [po, setPO] = useState(null);

    const [customerOption, setCustomerOption] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [origin, setOrigin] = useState("");
    useEffect(() => {
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
        fetchCustomer();
    }, [token]);

    useEffect(() => {
        if (customerOption.length > 0 && idCustomerInit) {
            const initialValue = customerOption.find(option => option.value === idCustomerInit) || null;
            setSelectedCustomer(initialValue);
            setOrigin(initialValue.alamat);
        }
    }, [customerOption, idCustomerInit]);

    const handleCustomerChange = (selectedOption) => {
        setSelectedCustomer(selectedOption);
        setOrigin(selectedOption.alamat);
        setFormData((prevData) => ({
            ...prevData,
            id_customer: selectedOption.value // Pastikan id_customer diperbarui
        }));
    };
    

    const [armadaOption, setArmadaOption] = useState([]);
    const [selectedArmada, setSelectedArmada] = useState(null);
    useEffect(() => {
        const fetchArmada = async () => {
            try {
                const response = await axios.get('http://localhost:3090/api/v1/armada', {
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
        fetchArmada();
    }, [token]);
    useEffect(() => {
        if (armadaOption.length > 0 && idArmadaInit) {
            const initialValue = armadaOption.find(option => option.value === idArmadaInit) || null;
            setSelectedArmada(initialValue);
        }
    }, [armadaOption, idArmadaInit]);
    const handleArmadaChange = (selectedOption) => {
        setSelectedArmada(selectedOption);
        setFormData(prevData => ({
            ...prevData,
            id_armada: selectedOption.value // Menyimpan ID Armada ke dalam formData
        }));
    };
    

    const [driverOption, setDriverOption] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    useEffect(() => {
        const fetchArmada = async () => {
            try {
                const response = await axios.get('http://localhost:3090/api/v1/driver', {
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
        fetchArmada();
    }, [token]);
    useEffect(() => {
        if (driverOption.length > 0 && idDriverInit) {
            const initialValue = driverOption.find(option => option.value === idDriverInit) || null;
            setSelectedDriver(initialValue);
        }
    }, [driverOption, idDriverInit]);
    const handleDriverChange = (selectedOption) => {
        setSelectedDriver(selectedOption);
        setFormData(prevData => ({
            ...prevData,
            id_driver: selectedOption.value // Menyimpan ID Driver ke dalam formData
        }));
    };
    

    useEffect(() => {
        const fetchPO = async () => {
            try {
                const response = await axios.get(`http://localhost:3090/api/v1/po/${detailId}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setPO(response.data.data);
            } catch (error) {
                console.log(error);
                setPO([]);
            }
        };
        if (detailId) {
            fetchPO();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailId]);

    // Update formData ketika po berhasil di-fetch
    useEffect(() => {
        if (po) {
            po.kas_jalan = typeof po.kas_jalan === "string" ? JSON.parse(po.kas_jalan) : po.kas_jalan;
            console.log(po.kas_jalan);
            setFormData((prevData) => ({
                nomor_po: po.nomor_po || prevData.nomor_po,
                tanggal_po: po.tanggal_po || prevData.tanggal_po,
                jam_pemesanan_po: po.jam_pemesanan_po || prevData.jam_pemesanan_po,
                jam_muat: po.jam_muat || prevData.jam_muat,
                id_customer: po.id_customer || prevData.id_customer,
                id_armada: po.id_armada || prevData.id_armada,
                id_driver: po.id_driver || prevData.id_driver,
                destination: po.destination || prevData.destination,
                status_po: po.status_po || prevData.status_po,
            }));
            if (po.kas_jalan.REGULER) {
                setFormDataReguler(() => ({
                    jarak_isi: po.kas_jalan.REGULER.jarak_isi || "0",
                    jarak_kosong: po.kas_jalan.REGULER.jarak_kosong || "0",
                    jam_tunggu: po.kas_jalan.REGULER.jam_tunggu || "0",
                    gaji_driver: po.kas_jalan.REGULER.gaji_driver || "0",
                    e_toll: po.kas_jalan.REGULER.e_toll || "0",
                    keterangan_rute: po.kas_jalan.REGULER.keterangan_rute || "",
                    tonase: po.kas_jalan.REGULER.tonase || "0",
                    status_kas_jalan: po.kas_jalan.REGULER.status_kas_jalan || "",
                    rasio_perkalian: po.rasio_perkalian || "",
                    rasio_perkalian_kosong: po.rasio_perkalian_kosong || ""
                }));
            } else {
                setFormDataReguler(() => ({
                    jarak_isi: "0",
                    jarak_kosong: "0",
                    jam_tunggu: "0",
                    gaji_driver: "0",
                    e_toll: "0",
                    keterangan_rute: "",
                    tonase: "0",
                    rasio_perkalian: "0",
                    rasio_perkalian_kosong: "0"
                }));
            }
            if (po.kas_jalan.KOSONGAN) {
                setFormDataKosongan(() => ({
                    jarak_isi: po.kas_jalan.KOSONGAN.jarak_isi || "0",
                    jarak_kosong: po.kas_jalan.KOSONGAN.jarak_kosong || "0",
                    jam_tunggu: po.kas_jalan.KOSONGAN.jam_tunggu || "0",
                    gaji_driver: po.kas_jalan.KOSONGAN.gaji_driver || "0",
                    e_toll: po.kas_jalan.KOSONGAN.e_toll || "0",
                    keterangan_rute: po.kas_jalan.KOSONGAN.keterangan_rute || "",
                    tonase: po.kas_jalan.KOSONGAN.tonase || "0",
                    status_kas_jalan: po.kas_jalan.KOSONGAN.status_kas_jalan || "",
                    rasio_perkalian: po.rasio_perkalian || "",
                    rasio_perkalian_kosong: po.rasio_perkalian_kosong || ""
                }));
            } else {
                setFormDataKosongan(() => ({
                    jarak_isi: "0",
                    jarak_kosong: "0",
                    jam_tunggu: "0",
                    gaji_driver: "0",
                    e_toll: "0",
                    keterangan_rute: "",
                    tonase: "0",
                    rasio_perkalian: "0",
                    rasio_perkalian_kosong: "0"
                }));
            }
        }
    }, [po]);

    // Handle perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const dataPOtoSubmit = new FormData();
        dataPOtoSubmit.append("nomor_po", formData.nomor_po);
        dataPOtoSubmit.append("tanggal_po", formData.tanggal_po);
        dataPOtoSubmit.append("jam_pemesanan_po", formData.jam_pemesanan_po);
        dataPOtoSubmit.append("jam_muat", formData.jam_muat);
        dataPOtoSubmit.append("id_customer", formData.id_customer);
        dataPOtoSubmit.append("id_armada", formData.id_armada);
        dataPOtoSubmit.append("id_driver", formData.id_driver);
        dataPOtoSubmit.append("destination", formData.destination);
        dataPOtoSubmit.append('status_po', formData.status_po);

        try {
            await axios.put(`http://localhost:3090/api/v1/po/${detailId}`, dataPOtoSubmit, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                title: "Data PO",
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

    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail Driver</span>
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
                    untuk kembali ke menu utama Driver.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Purchase Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nomor_po" className="form-label">Nomor PO</label>
                        <input className="form-control" type="text" id="nomor_po" name='nomor_po' placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={formData.nomor_po || ""} />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="tanggal_po" className="form-label">Tanggal PO</label>
                        <input className="form-control text-uppercase" type="date" id="tanggal_po" name='tanggal_po' placeholder="" onChange={handleChange}
                            value={formData.tanggal_po || ""}
                            required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jam_pemesanan_po" className="form-label">Jam Stanby</label>
                        <input className="form-control" type="time" id="jam_pemesanan_po" name='jam_pemesanan_po' onChange={handleChange} value={formData.jam_pemesanan_po || ""}
                            required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jam_muat" className="form-label">Jam Muat</label>
                        <input className="form-control" type="time" id="jam_muat" name='jam_muat' onChange={handleChange} value={formData.jam_muat || ""} required />
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
                        <input className="form-control" type="text" id="destination" name='destination' placeholder="" onChange={handleChange} value={formData.destination || ""} required />
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
                    <div className="col-md-3 col-sm-12 mb-3 d-none">
                        <input className="form-control" type="text" id="status_po" name='status_po' placeholder="" onChange={handleChange} value={formData.status_po || ""} required hidden/>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="" className="form-label">
                            Proses
                        </label>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="btn btn-primary w-100"
                        >
                            SIMPAN PERUBAHAN
                        </button>
                    </div>
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Kas Jalan Reguler</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formDataReguler && (
                            <div className="row">
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="jarak_isi" className="form-label">Jarak Isi (KM)</label>
                                    <input className="form-control" type="text" id="jarak_isi" name="jarak_isi" placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={formDataReguler.jarak_isi.toLocaleString('id-ID') || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="solar_isi" className="form-label">Solar Isi</label>
                                    <input className="form-control" type="text" id="solar_isi" name="solar_isi" placeholder="Rp.0,00" onChange={handleChange} required readOnly value={formatRupiah(formDataReguler.jarak_isi * ((parseFloat(formDataReguler.rasio_perkalian)) + (70 * parseFloat(formDataReguler.tonase) / 1000)))} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="jarak_kosong" className="form-label">Jarak Kosong (KM)</label>
                                    <input className="form-control" type="text" id="jarak_kosong" name="jarak_kosong" placeholder="0" onChange={handleChange} required readOnly value={formDataReguler.jarak_kosong.toLocaleString('id-ID') || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="solar_kosong" className="form-label">Solar Kosong</label>
                                    <input className="form-control" type="text" id="solar_kosong" name="solar_kosong" placeholder="Rp.0,00" onChange={handleChange} required readOnly value={formatRupiah(parseFloat(formDataReguler.jarak_kosong) * (parseFloat(formDataReguler.rasio_perkalian_kosong)))} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="jam_tunggu" className="form-label">Jam Tunggu (Jam)</label>
                                    <input className="form-control" type="text" id="jam_tunggu" name="jam_tunggu" placeholder="0" onChange={handleChange} required readOnly value={formDataReguler.jam_tunggu || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="solar_tunggu" className="form-label">Solar Tunggu</label>
                                    <input className="form-control" type="text" id="solar_tunggu" name="solar_tunggu" placeholder="Rp.0,00" onChange={handleChange} required readOnly value={formatRupiah(parseInt(formDataReguler.jam_tunggu) * 11000)} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="gaji_driver" className="form-label">Gaji Driver</label>
                                    <input className="form-control" type="text" id="gaji_driver" name="gaji_driver" placeholder="0" onChange={handleChange} required readOnly value={formatRupiah(formDataReguler.gaji_driver) || formatRupiah(0)} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="e_toll" className="form-label">E-Toll</label>
                                    <input className="form-control" type="text" id="e_toll" name="e_toll" placeholder="0" onChange={handleChange} required readOnly value={formatRupiah(formDataReguler.e_toll) || formatRupiah(0)} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="tonase" className="form-label">Tonase (Kg)</label>
                                    <input className="form-control" type="text" id="tonase" name="tonase" placeholder="0" onChange={handleChange} required readOnly value={parseInt(formDataReguler.tonase).toLocaleString('id-ID') || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="kas_jalan" className="form-label">Kas Jalan</label>
                                    <input className="form-control" type="text" id="kas_jalan" name="kas_jalan" placeholder="0" onChange={handleChange} required readOnly value={formatRupiah((parseInt(formDataReguler.jam_tunggu) * 11000) + (formDataReguler.jarak_isi * ((parseFloat(formDataReguler.rasio_perkalian)) + (70 * parseFloat(formDataReguler.tonase) / 1000))) + (parseFloat(formDataReguler.jarak_kosong) * (parseFloat(formDataReguler.rasio_perkalian_kosong))) + (parseFloat(formDataReguler.gaji_driver)) + (parseFloat(formDataReguler.e_toll)))} />
                                </div>
                            </div>
                        )}
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Kas Jalan Kosongan (To Garasi)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formDataKosongan && (
                            <div className="row">
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="jarak_isi" className="form-label">Jarak Isi (KM)</label>
                                    <input className="form-control" type="text" id="jarak_isi" name="jarak_isi" placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={formDataKosongan.jarak_isi.toLocaleString('id-ID') || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="solar_isi" className="form-label">Solar Isi</label>
                                    <input className="form-control" type="text" id="solar_isi" name="solar_isi" placeholder="Rp.0,00" onChange={handleChange} required readOnly value={formatRupiah(formDataKosongan.jarak_isi * ((parseFloat(formDataKosongan.rasio_perkalian)) + (70 * parseFloat(formDataKosongan.tonase) / 1000)))} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="jarak_kosong" className="form-label">Jarak Kosong (KM)</label>
                                    <input className="form-control" type="text" id="jarak_kosong" name="jarak_kosong" placeholder="0" onChange={handleChange} required readOnly value={formDataKosongan.jarak_kosong.toLocaleString('id-ID') || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="solar_kosong" className="form-label">Solar Kosong</label>
                                    <input className="form-control" type="text" id="solar_kosong" name="solar_kosong" placeholder="Rp.0,00" onChange={handleChange} required readOnly value={formatRupiah(parseFloat(formDataKosongan.jarak_kosong) * (parseFloat(formDataKosongan.rasio_perkalian_kosong)))} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="jam_tunggu" className="form-label">Jam Tunggu (Jam)</label>
                                    <input className="form-control" type="text" id="jam_tunggu" name="jam_tunggu" placeholder="0" onChange={handleChange} required readOnly value={formDataKosongan.jam_tunggu || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="solar_tunggu" className="form-label">Solar Tunggu</label>
                                    <input className="form-control" type="text" id="solar_tunggu" name="solar_tunggu" placeholder="Rp.0,00" onChange={handleChange} required readOnly value={formatRupiah(parseInt(formDataKosongan.jam_tunggu) * 11000)} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="gaji_driver" className="form-label">Gaji Driver</label>
                                    <input className="form-control" type="text" id="gaji_driver" name="gaji_driver" placeholder="0" onChange={handleChange} required readOnly value={formatRupiah(formDataKosongan.gaji_driver) || formatRupiah(0)} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="e_toll" className="form-label">E-Toll</label>
                                    <input className="form-control" type="text" id="e_toll" name="e_toll" placeholder="0" onChange={handleChange} required readOnly value={formatRupiah(formDataKosongan.e_toll) || formatRupiah(0)} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="tonase" className="form-label">Tonase (Kg)</label>
                                    <input className="form-control" type="text" id="tonase" name="tonase" placeholder="0" onChange={handleChange} required readOnly value={parseInt(formDataKosongan.tonase).toLocaleString('id-ID') || "0"} />
                                </div>
                                <div className="col-md-3 col-sm-12 mb-3">
                                    <label htmlFor="kas_jalan" className="form-label">Kas Jalan</label>
                                    <input className="form-control" type="text" id="kas_jalan" name="kas_jalan" placeholder="0" onChange={handleChange} required readOnly value={formatRupiah((parseInt(formDataKosongan.jam_tunggu) * 11000) + (formDataKosongan.jarak_isi * ((parseFloat(formDataKosongan.rasio_perkalian)) + (70 * parseFloat(formDataKosongan.tonase) / 1000))) + (parseFloat(formDataKosongan.jarak_kosong) * (parseFloat(formDataKosongan.rasio_perkalian_kosong))) + (parseFloat(formDataKosongan.gaji_driver)) + (parseFloat(formDataKosongan.e_toll)))} />
                                </div>
                            </div>
                        )}
                    <div className="col-lg-12">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Titik Bongkar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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