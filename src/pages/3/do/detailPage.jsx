import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Swal from 'sweetalert2';

const DetailPage = ({ handlePageChanges, detailId, handleBackClick, alokasiInit }) => {
    const inputRef = useRef(null);

    // Data dari localstorage
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');
    const id_user = localStorage.getItem('id_user');
    const nama_kantor = localStorage.getItem('nama_kantor');

    const [ietmRencanaSalur, setIetmRencanaSalur] = useState([]);

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null)

    const [provinsiOption, setProvinsiOption] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState(null);

    const [kabupatenOption, setKabupatenOption] = useState([]);
    const [selectedKabupaten, setSelectedKabupaten] = useState('');

    const [kecamatanOption, setKecamatanOption] = useState([]);
    const [selectedKecamatan, setSelectedKecamatan] = useState('');

    const [desaKelurahanOption, setDesaKelurahanOption] = useState([]);
    const [selectedDesaKelurahan, setSelectedDesaKelurahan] = useState(null);

    const [gudangOption, setGudangOption] = useState([]);
    const [selectedGudang, setSelectedGudang] = useState(null);

    const [dtt, setDTT] = useState(0);

    const fetchItemRencanaSalur = async () => {
        if (!token) {
            navigate('/');
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/januari-item-rencana-salur/rencana-salur/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    id_item_rencana_salur: dataitem.id_item_rencana_salur,
                    id_rencana_salur: dataitem.id_rencana_salur,
                    id_alokasi: dataitem.id_alokasi,
                    id_gudang: dataitem.id_gudang,
                    id_dtt: dataitem.id_dtt,
                    tanggal_rencana_salur: dataitem.tanggal_rencana_salur,
                    bulan_alokasi: dataitem.bulan_alokasi,
                    tahun_alokasi: dataitem.tahun_alokasi,
                    nama_gudang: dataitem.nama_gudang,
                    kode_dtt: dataitem.kode_dtt,
                    status_dtt: dataitem.status_dtt,
                    nama_desa_kelurahan: dataitem.nama_desa_kelurahan,
                    nama_kecamatan: dataitem.nama_kecamatan,
                    nama_kabupaten_kota: dataitem.nama_kabupaten_kota,
                    nama_provinsi: dataitem.nama_provinsi,
                    kpm_jumlah: dataitem.kpm_jumlah
                }));
                setIetmRencanaSalur(datafetch);
            } else {
                setIetmRencanaSalur([]);
            }
        } catch (error) {
            console.log(error);
            setIetmRencanaSalur([]);
        }
    };

    useEffect(() => {
        fetchItemRencanaSalur();
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
                if (response.data.data.length != 0) {
                    const datafetch = response.data.data.map(dataitem => ({
                        value: dataitem.id_alokasi,
                        label: dataitem.bulan_alokasi + " " + dataitem.tahun_alokasi
                    }));
                    setAlokasiOption(datafetch);
                } else {
                    setAlokasiOption([]);
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: 'Data Alokasi',
                    text: 'Data Alokasi Tidak Ditemukan',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000,
                    position: 'center',
                    timerProgressBar: true
                });
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

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        const fetchProvinsiOptions = async () => {
            try {
                const response = await axios.get('http://localhost:3089/api/v1/provinsi', {
                    headers: {
                        Authorization: token
                    }
                });
                const dataprovinsi = response.data.data.map(provinsiall => ({
                    value: provinsiall.id_provinsi,
                    label: provinsiall.nama_provinsi
                }));
                setProvinsiOption(dataprovinsi);
            } catch (error) {
                console.error('Error fetching', error);
            }
        };
        fetchProvinsiOptions();
    }, []);

    const handleProvinsiChange = (selectedOption) => {
        setSelectedProvinsi(selectedOption);
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        const fetchKabupatenOptions = async (provinsiID) => {
            try {
                const response = await axios.get(`http://localhost:3089/api/v1/kabupatenkota/${provinsiID.value}`, {
                    headers: {
                        Authorization: token
                    }
                });
                const datakabupatenkota = response.data.data.map(kabupatenkotaall => ({
                    value: kabupatenkotaall.id_kabupaten_kota,
                    label: kabupatenkotaall.nama_kabupaten_kota
                }));
                setKabupatenOption(datakabupatenkota);
            } catch (error) {
                console.error('Error fetching', error);
            }
        };
        if (selectedProvinsi) {
            fetchKabupatenOptions(selectedProvinsi);
        }
    }, [selectedProvinsi]);

    const handleKabupatenChange = (selectedOption) => {
        setSelectedKabupaten(selectedOption);
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        const fetchKecamatanOptions = async (kabupatenID) => {
            try {
                const response = await axios.get(`http://localhost:3089/api/v1/kecamatan/${kabupatenID.value}`, {
                    headers: {
                        Authorization: token
                    }
                });
                const datakecamatan = response.data.data.map(kecamatanall => ({
                    value: kecamatanall.id_kecamatan,
                    label: kecamatanall.nama_kecamatan
                }));
                setKecamatanOption(datakecamatan);
            } catch (error) {
                console.error('Error fetching', error);
            }
        };
        if (selectedKabupaten) {
            fetchKecamatanOptions(selectedKabupaten);
        }
    }, [selectedKabupaten]);

    const handleKecamatanChange = (selectedOption) => {
        setSelectedKecamatan(selectedOption);
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        const fetchDesaKelurahanOptions = async (kecamatanID) => {
            try {
                const response = await axios.get(`http://localhost:3089/api/v1/desaKelurahan/${kecamatanID.value}`, {
                    headers: {
                        Authorization: token
                    }
                });
                const datadesakelurahan = response.data.data.map(desakelurahanall => ({
                    value: desakelurahanall.id_desa_kelurahan,
                    label: desakelurahanall.nama_desa_kelurahan
                }));
                setDesaKelurahanOption(datadesakelurahan);
            } catch (error) {
                console.error('Error fetching', error);
                setDesaKelurahanOption([]);
            }
        };
        if (selectedKecamatan) {
            fetchDesaKelurahanOptions(selectedKecamatan);
        }
    }, [selectedKecamatan]);

    const handleDesaKelurahanChange = (selectedOption) => {
        setSelectedDesaKelurahan(selectedOption);
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        const fetchGudang = async () => {
            try {
                const response = await axios.get('http://localhost:3089/api/v1/gudang', {
                    headers: {
                        Authorization: token
                    }
                });
                if (response.data.data.length != 0) {
                    const datafetch = response.data.data.map(dataitem => ({
                        value: dataitem.id_gudang,
                        label: dataitem.nama_gudang
                    }));
                    setGudangOption(datafetch);
                } else {
                    setGudangOption([]);
                }
            } catch (error) {
                console.log(error);
                setGudangOption([]);
            }
        };
        fetchGudang();
    }, [token]);

    const handleGudangChange = (selectedOption) => {
        setSelectedGudang(selectedOption);
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        const fetchDTT = async (desaKelurahanID) => {
            try {
                let linkdtt = "januari-dtt";
                if (selectedAlokasi.value == "1") {
                    linkdtt = "januari-dtt";
                } else if (selectedAlokasi.value == "2") {
                    linkdtt = "februari-dtt";
                } else {
                    linkdtt = "januari-dtt";
                }
                const response = await axios.get(`http://localhost:3089/api/v1/${linkdtt}/desakelurahan/${desaKelurahanID.value}`, {
                    headers: {
                        Authorization: token
                    }
                });
                setDTT(response.data.data.kpm_jumlah);
            } catch (error) {
                console.error('Error fetching', error);
                setDTT(null);
            }
        };
        if (selectedDesaKelurahan) {
            fetchDTT(selectedDesaKelurahan);
        }
    }, [selectedDesaKelurahan]);

    const [formDataRencanaSalur, setFormDataRencanaSalur] = useState({
        id_rencana_salur: "",
        id_alokasi: "",
        id_gudang: "",
        id_dtt: "",
        tanggal_rencana_salur: "",
        kategori: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataRencanaSalur({
            ...formDataRencanaSalur,
            [name]: value
        });
    };

    const handleAdd = async (event) => {
        event.preventDefault();
        if (!token) {
            navigate('/');
        }
        const dataToSubmit = {
            rencanaSalur: {
                ...formDataRencanaSalur,
                id_rencana_salur: detailId,
                id_alokasi: selectedAlokasi.value,
                id_gudang: selectedGudang.value,
                id_dtt: selectedDesaKelurahan.value,
                kategori: "CREATE"
            },
            logData: {
                id_user,
                kategori_item: "CREATE",
                tanggal_log: new Date().toISOString(),
            },
        };

        try {
            await axios.post(`http://localhost:3089/api/v1/januari-item-rencana-salur-with-log`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data Item Rencana Salur',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchItemRencanaSalur();
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

    const handleDelete = async (id_item_rencana_salur, id_rencana_salur) => {
        if (!token) {
            navigate('/');
        }
        const dataToSubmit = {
            rencanaSalur: {
                ...formDataRencanaSalur,
                id_item_rencana_salur: id_item_rencana_salur,
                id_rencana_salur: id_rencana_salur,
                kategori: "DELETED",
            },
            logData: {
                id_item_rencana_salur_log: id_item_rencana_salur,
                id_rencana_salur: id_rencana_salur,
                id_user,
                tanggal_log: new Date().toISOString(),
                kategori_item: "DELETED",
            },
        };

        try {
            await axios.put(`http://localhost:3089/api/v1/januari-item-rencana-salur-with-log/delete`, dataToSubmit, {
                headers: {
                    Authorization: token,
                },
            });
            Swal.fire({
                title: 'Data Item Rencana Salur',
                text: 'Data berhasil dihapus!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchItemRencanaSalur();
            });
        } catch (error) {
            Swal.fire({
                title: 'Data Item Rencana Salur',
                text: 'Data berhasil dihapus!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchItemRencanaSalur();
            });
        }
    };

    const calculateTotals = (data) => {
        // Mengelompokkan data berdasarkan tanggal_rencana_salur
        const groupedData = data.reduce((acc, item) => {
            const tanggal = item.tanggal_rencana_salur;
            if (!acc[tanggal]) {
                acc[tanggal] = { items: [], total: 0 };
            }
            acc[tanggal].items.push(item);
            acc[tanggal].total += parseInt(item.kpm_jumlah, 10);
            return acc;
        }, {});

        return groupedData;
    };

    const totalOverall = ietmRencanaSalur.reduce(
        (acc, item) => acc + parseInt(item.kpm_jumlah, 10),
        0
    );

    const groupedData = calculateTotals(ietmRencanaSalur);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail Doc Out</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Doc Out.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <div className="row">
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_kantor" className="form-label">Kantor Cabang</label>
                        <input className="form-control" type="text" id="nama_kantor" name='nama_kantor' placeholder="Kantor Cabang" value={nama_kantor} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_alokasi" className="form-label">Status Alokasi</label>
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
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_provinsi" className="form-label">Provinsi</label>
                        <Select
                            id="id_provinsi"
                            name="id_provinsi"
                            value={selectedProvinsi}
                            onChange={handleProvinsiChange}
                            options={provinsiOption}
                            placeholder="Pilih Provinsi"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_kabupaten_kota" className="form-label">Kabupaten/Kota</label>
                        <Select
                            id="id_kabupaten_kota"
                            name="id_kabupaten_kota"
                            value={selectedKabupaten}
                            onChange={handleKabupatenChange}
                            options={kabupatenOption}
                            placeholder="Pilih Kabupaten/Kota"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_kecamatan" className="form-label">Kecamatan</label>
                        <Select
                            id="id_kecamatan"
                            name="id_kecamatan"
                            value={selectedKecamatan}
                            onChange={handleKecamatanChange}
                            options={kecamatanOption}
                            placeholder="Pilih Kecamatan"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_dtt" className="form-label">Desa/Kelurahan</label>
                        <Select
                            id="id_dtt"
                            name="id_dtt"
                            value={selectedDesaKelurahan}
                            onChange={handleDesaKelurahanChange}
                            options={desaKelurahanOption}
                            placeholder="Pilih Desa/Kelurahan"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="kpm_jumlah" className="form-label">Jumlah KPM</label>
                        <input className="form-control" type="text" id="kpm_jumlah" name='kpm_jumlah' placeholder="Jumlah KPM" value={dtt} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_gudang" className="form-label">Gudang</label>
                        <Select
                            id="id_gudang"
                            name="id_gudang"
                            value={selectedGudang}
                            onChange={handleGudangChange}
                            options={gudangOption}
                            placeholder="Pilih Gudang"
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="tanggal_rencana_salur" className="form-label">Tanggal Rencana Salur</label>
                        <input className="form-control text-uppercase" type="date" id="tanggal_rencana_salur" name='tanggal_rencana_salur' placeholder="Tanggal Rencana Salur" onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="" className="form-label">Proses</label>
                        <button type="button" onClick={handleAdd} className="btn btn-primary w-100">TAMBAHKAN</button>
                    </div>
                    <div className="col-lg-12 mt-2">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Item Rencana Salur</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 mb-4 mb-md-0">
                        <div className="table-responsive text-nowrap">
                            <table className="table" style={{ fontSize: "13px" }}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Tanggal</th>
                                        <th>Gudang Bulog</th>
                                        <th>Provinsi</th>
                                        <th>Kabupaten/Kota</th>
                                        <th>Kecamatan</th>
                                        <th>Desa/Kelurahan</th>
                                        <th>Jumlah KPM</th>
                                        <th>Jumlah Kg</th>
                                        <th>Proses</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(groupedData).map((tanggal, index) => (
                                        <React.Fragment key={index}>
                                            {groupedData[tanggal].items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{formatDate(item.tanggal_rencana_salur)}</td>
                                                    <td>{item.nama_gudang}</td>
                                                    <td>{item.nama_provinsi}</td>
                                                    <td>{item.nama_kabupaten_kota}</td>
                                                    <td>{item.nama_kecamatan}</td>
                                                    <td>{item.nama_desa_kelurahan}</td>
                                                    <td style={{ textAlign: 'right' }}>{parseInt(item.kpm_jumlah).toLocaleString('id-ID')}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {(parseInt(item.kpm_jumlah) * 10).toLocaleString('id-ID')} Kg
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button
                                                            className="btn btn-link"
                                                            onClick={() =>
                                                                handleDelete(item.id_item_rencana_salur, item.id_rencana_salur)
                                                            }
                                                        >
                                                            <i className="bx bx-minus-circle text-danger"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Total untuk tanggal */}
                                            <tr>
                                                <td colSpan="7" className="text-start fw-bold">
                                                    Subtotal Tanggal {formatDate(tanggal)}
                                                </td>
                                                <td className="fw-bold" style={{ textAlign: 'right' }}>{(groupedData[tanggal].total).toLocaleString('id-ID')}</td>
                                                <td className="fw-bold" style={{ textAlign: 'right' }}>
                                                    {(groupedData[tanggal].total * 10).toLocaleString('id-ID')} Kg
                                                </td>
                                                <td colSpan="3"></td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                    {/* Total keseluruhan */}
                                    {ietmRencanaSalur.length > 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-start fw-bold">
                                                Total Keseluruhan
                                            </td>
                                            <td className="fw-bold" style={{ textAlign: 'right' }}>{totalOverall.toLocaleString('id-ID')}</td>
                                            <td className="fw-bold" style={{ textAlign: 'right' }}>
                                                {(totalOverall * 10).toLocaleString('id-ID')} Kg
                                            </td>
                                            <td colSpan="3"></td>
                                        </tr>
                                    )}
                                    {ietmRencanaSalur.length === 0 && (
                                        <tr>
                                            <td colSpan="10" className="text-center">
                                                Tidak ada data tersedia.
                                            </td>
                                        </tr>
                                    )}
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
    handlePageChanges: PropTypes.func.isRequired,
    detailId: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired,
    alokasiInit: PropTypes.number.isRequired,
};

export default DetailPage;