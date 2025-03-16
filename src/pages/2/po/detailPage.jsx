import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Swal from 'sweetalert2';

const DetailPage = ({ detailId, alokasiInit, handleBackClick }) => {

    console.clear();

    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');

    const [jenisMobilOption, setJenisMobilOption] = useState([
        { value: "CDE", label: "CDE" },
        { value: "CDD", label: "CDD" },
        { value: "CDDL", label: "CDDL" },
        { value: "CDE R", label: "CDE R" },
        { value: "CDD R", label: "CDD R" },
        { value: "CDDL R", label: "CDDL R" }
    ]);
    const [selectedJenisMobil, setSelectedJenisMobil] = useState(null);
    const handleJenisMobilChange = (selectedOption) => {
        setSelectedJenisMobil(selectedOption);
    };

    const [jenisMuatanOption, setJenisMuatanOption] = useState([
        { value: "AYAM", label: "AYAM" },
        { value: "TELUR", label: "TELUR" },
        { value: "MIX", label: "MIX" }
    ]);
    const [selectedJenisMuatan, setSelectedJenisMuatan] = useState(null);
    const handleJenisMuatanChange = (selectedOption) => {
        setSelectedJenisMuatan(selectedOption);
    };

    const inputRef = useRef(null);

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);
    const [po, setPO] = useState([]);
    const [itemPO, setItemPO] = useState([]);

    const [formDataPO, setFormDataPO] = useState({
        "id_alokasi": "",
        "id_kantor": "",
        "nomor_po": "",
        "tanggal_po": "",
        "customer": "",
        "titik_muat": "",
        "titik_bongkar": "",
        "jam_stand_by": "",
        "status_po": ""
    });

    const fetchPO = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/po/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            console.log(response.data.data);
            setPO(response.data.data);
        } catch (error) {
            console.log(error);
            setPO([]);
        }
    };

    useEffect(() => {
        fetchPO();
    }, [token, detailId]);

    const fetchItemPO = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/itempo/po/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length !== 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    nomor_po: dataitem.nomor_po,
                    tanggal_po: dataitem.tanggal_po,
                    id_item_po: dataitem.id_item_po,
                    id_po: dataitem.id_po,
                    jenis_mobil: dataitem.jenis_mobil,
                    nopol_mobil: dataitem.nopol_mobil,
                    nama_driver: dataitem.nama_driver,
                    telpon_driver: dataitem.telpon_driver,
                    jenis_muatan: dataitem.jenis_muatan,
                    jumlah_muatan: dataitem.jumlah_muatan
                }));
                setItemPO(datafetch);
            } else {
                setItemPO([]);
            }
        } catch (error) {
            console.log(error);
            setItemPO([]);
        }
    };

    useEffect(() => {
        fetchItemPO();
    }, [token, detailId]);

    useEffect(() => {
        const fetchAlokasi = async () => {
            if (!token) {
                navigate('/');
            }
            try {
                const response = await axios.get('http://localhost:3089/api/v1/alokasi', {
                    headers: {
                        Authorization: token
                    }
                });
                if (response.data.data.length !== 0) {
                    const datafetch = response.data.data.map(dataitem => ({
                        value: dataitem.id_alokasi,
                        label: dataitem.keterangan_alokasi
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
        fetchAlokasi();
    }, [token]);

    useEffect(() => {
        if (alokasiOption.length > 0 && alokasiInit) {
            const initialValue = alokasiOption.find(option => option.value === alokasiInit) || null;
            setSelectedAlokasi(initialValue);
        }
    }, [alokasiOption, alokasiInit]);

    const handleAlokasiChange = (selectedOption) => {
        setSelectedAlokasi(selectedOption);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formattedDate = po?.tanggal_po ? new Date(po.tanggal_po).toISOString().split("T")[0] : "";

    const totalByJenisMuatan = itemPO.reduce((acc, item) => {
        if (!acc[item.jenis_muatan]) {
            acc[item.jenis_muatan] = 0;
        }
        acc[item.jenis_muatan] += item.jumlah_muatan;
        return acc;
    }, {});

    const [formData, setFormData] = useState({
        id_po: detailId,
        jenis_mobil: "",
        nopol_mobil: "",
        nama_driver: "",
        telpon_driver: "",
        jenis_muatan: "",
        jumlah_muatan: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddItemPO = async (event) => {
        event.preventDefault();
        const dataToSubmit = {
            ...formData,
            jenis_mobil: selectedJenisMobil.value,
            jenis_muatan: selectedJenisMuatan.value
        };
        console.log(dataToSubmit);
        try {
            const response = await axios.post(`http://localhost:3089/api/v1/itempo`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data Item Purchase Order',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchItemPO();
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
                <div className="divider text-start fw-bold">
                    <div className="divider-text">
                        <span className="menu-header-text fs-6">Detail Purchase Order</span>
                    </div>
                </div>
            </div>
            <div className="col-lg-12 mb-3">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Purchase Order.
                </div>
            </div>
            <div className="col-md-12">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="divider text-start">
                            <div className="divider-text">
                                <span className="menu-header-text fs-6">Informasi Purchase Order</span>
                            </div>
                        </div>
                    </div>
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
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nomor_po" className="form-label">Nomor PO</label>
                        <input className="form-control" type="text" id="nomor_po" name='nomor_po' placeholder="Nomor PO" value={po?.nomor_po} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="tanggal_po" className="form-label">Tanggal PO</label>
                        <input className="form-control text-uppercase" type="date" id="tanggal_po" name='tanggal_po' ref={inputRef} defaultValue={formattedDate} placeholder="Tanggal Rencana Salur" required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="customer" className="form-label">Customer</label>
                        <input className="form-control" type="text" id="customer" name='customer' placeholder="Nomor PO" value={po?.customer} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="titik_muat" className="form-label">Titik Muat</label>
                        <input className="form-control" type="text" id="titik_muat" name='titik_muat' placeholder="Nomor PO" value={po?.titik_muat} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="titik_bongkar" className="form-label">Titik Bongkar</label>
                        <input className="form-control" type="text" id="titik_bongkar" name='titik_bongkar' placeholder="Nomor PO" value={po?.titik_bongkar} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jam_stand_by" className="form-label">Jam Standby</label>
                        <input className="form-control" type="text" id="jam_stand_by" name='jam_stand_by' placeholder="00:00" value={`${po?.jam_stand_by} WIB`} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="status_po" className="form-label">Status</label>
                        <input className="form-control" type="text" id="status_po" name='status_po' placeholder="Nomor PO" value={po?.status_po} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="" className="form-label">Proses</label>
                        <button type="button" onClick={handleJenisMobilChange} className="btn btn-primary w-100">SIMPAN DATA</button>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="" className="form-label">Proses</label>
                        <button type="button" onClick={handleJenisMobilChange} className="btn btn-primary w-100">DOWNLOAD</button>
                    </div>
                    <div className="col-lg-12 mt-2">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Item Purchase Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="jenis_mobil" className="form-label">Jenis Mobil</label>
                        <Select
                            id="jenis_mobil"
                            name="jenis_mobil"
                            value={selectedJenisMobil}
                            onChange={handleJenisMobilChange}
                            options={jenisMobilOption}
                            placeholder="Pilih Jenis Mobil"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nopol_mobil" className="form-label">Nopol Mobil</label>
                        <input className="form-control" type="text" id="nopol_mobil" name='nopol_mobil' placeholder="Nopol Mobil" required onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
                        <input className="form-control" type="text" id="nama_driver" name='nama_driver' placeholder="Nama Driver" required onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="telpon_driver" className="form-label">Telpon Driver</label>
                        <input className="form-control" type="text" id="telpon_driver" name='telpon_driver' placeholder="Telpon Driver" required onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="jenis_muatan" className="form-label">Jenis Muatan</label>
                        <Select
                            id="jenis_muatan"
                            name="jenis_muatan"
                            value={selectedJenisMuatan}
                            onChange={handleJenisMuatanChange}
                            options={jenisMuatanOption}
                            placeholder="Pilih Jenis Muatan"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="jumlah_muatan" className="form-label">Jumlah Muatan</label>
                        <input className="form-control" type="text" id="jumlah_muatan" name='jumlah_muatan' placeholder="Jumlah Muatan" required onChange={handleInputChange} />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="" className="form-label">Proses</label>
                        <button type="button" onClick={handleAddItemPO} className="btn btn-primary w-100">TAMBAHKAN</button>
                    </div>
                    <div className="col-md-12 mb-4 mb-md-0 mt-3">
                        <div className="table-responsive text-nowrap">
                            <table className="table" style={{ fontSize: "13px" }}>
                                <thead>
                                    <tr>
                                        <th className='fw-bold' >No</th>
                                        <th className='fw-bold'>Jenis Mobil</th>
                                        <th className='fw-bold'>Nopol Mobil</th>
                                        <th className='fw-bold'>Nama Driver</th>
                                        <th className='fw-bold'>Telpon Driver</th>
                                        <th className='fw-bold'>Jenis Muatan</th>
                                        <th className='fw-bold'>Jumlah</th>
                                        <th className='fw-bold'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemPO.length > 0 ? (
                                        itemPO.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.jenis_mobil}</td>
                                                <td>{item.nopol_mobil}</td>
                                                <td>{item.nama_driver}</td>
                                                <td>{item.telpon_driver}</td>
                                                <td>{item.jenis_muatan}</td>
                                                <td>{item.jumlah_muatan.toLocaleString('id-ID')}</td>
                                                <td>
                                                    <button className="btn text-danger btn-link" onClick={() => handlePageChange('detail', item.id_po)}>
                                                        <i className="tf-icons bx bx-minus-circle me-2"></i>
                                                    </button>
                                                </td>
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
                    {/* Menampilkan total per jenis muatan */}
                    <div className="col-md-12">
                        <div className="table-responsive text-nowrap">
                            <table className="table" style={{ fontSize: "13px" }}>
                                <thead style={{ fontWeight: "bold" }}>
                                    <tr>
                                        <th className='fw-bold'>Total Muatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(totalByJenisMuatan).map((jenis, index) => (
                                        <tr key={index}>
                                            <td>{jenis} <span >{totalByJenisMuatan[jenis].toLocaleString('id-ID')}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

DetailPage.propTypes = {
    detailId: PropTypes.number.isRequired,
    alokasiInit: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired
};

export default DetailPage;