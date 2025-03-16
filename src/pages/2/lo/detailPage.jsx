import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Swal from 'sweetalert2';
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

const DetailPage = ({ handlePageChanges, detailId, handleBackClick, alokasiInit, doInit }) => {
    const inputRef = useRef(null);

    // Data dari localstorage
    const token = localStorage.getItem('token');
    const id_kantor = localStorage.getItem('id_kantor');
    const id_gudang = localStorage.getItem('id_gudang');
    const id_user = localStorage.getItem('id_user');
    const nama_kantor = localStorage.getItem('nama_kantor');
    const nama_gudang = localStorage.getItem('nama_gudang');

    const [ietmLO, setIetmLO] = useState([]);

    const [lo, setLO] = useState(null);

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

    const [doOption, setDOOption] = useState([]);
    const [selectedDO, setSelectedDO] = useState(null);

    const [dtt, setDTT] = useState(0);

    const [formDataRencanaSalur, setFormDataRencanaSalur] = useState({
        id_lo: "",
        id_alokasi: "",
        id_gudang: "",
        id_dtt: "",
        tanggal_lo: "",
        kategori: "",
    });

    const [formDataItemLO, setFormDataItemLO] = useState({
        id_lo: "",
        nomor_item_lo: "",
        id_desa_kelurahan: "",
        tonase: ""
    });

    const fetchLO = async () => {
        if (!token) {
            navigate('/');
        }
        let link = "januari";
        if (selectedAlokasi == null) {
            link = "januari";
        } else if (selectedAlokasi.value == 1) {
            link = "januari";
        } else {
            link = "februari";
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/${link}-lo/lo/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            setLO(response.data.data);
        } catch (error) {
            console.log(error);
            setLO([]);
        }
    };

    useEffect(() => {
        fetchLO();
    }, [token, detailId]);

    const fetchItemLO = async () => {
        if (!token) {
            navigate('/');
        }
        let link = "januari";
        if (selectedAlokasi == null) {
            link = "januari";
        } else if (selectedAlokasi.value == 1) {
            link = "januari";
        } else {
            link = "februari";
        }
        try {
            const response = await axios.get(`http://localhost:3089/api/v1/${link}-item-lo/lo/${detailId}`, {
                headers: {
                    Authorization: token
                }
            });
            if (response.data.data.length != 0) {
                const datafetch = response.data.data.map(dataitem => ({
                    id_item_lo: dataitem.id_item_lo,
                    id_lo: dataitem.id_lo,
                    id_alokasi: dataitem.id_alokasi,
                    id_gudang: dataitem.id_gudang,
                    id_dtt: dataitem.id_dtt,
                    tanggal_lo: dataitem.tanggal_lo,
                    bulan_alokasi: dataitem.bulan_alokasi,
                    tahun_alokasi: dataitem.tahun_alokasi,
                    nama_gudang: dataitem.nama_gudang,
                    kode_lo: dataitem.kode_lo,
                    nama_desa_kelurahan: dataitem.nama_desa_kelurahan,
                    nama_kecamatan: dataitem.nama_kecamatan,
                    nama_kabupaten_kota: dataitem.nama_kabupaten_kota,
                    nama_provinsi: dataitem.nama_provinsi,
                    tonase: dataitem.tonase,
                    nomor_lo: dataitem.nomor_lo
                }));
                setIetmLO(datafetch);
            } else {
                setIetmLO([]);
            }
        } catch (error) {
            console.log(error);
            setIetmLO([]);
        }
    };

    useEffect(() => {
        fetchItemLO();
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
        let link = "januari";
        if (selectedAlokasi == null) {
            link = "januari";
        } else if (selectedAlokasi.value == 1) {
            link = "januari";
        } else {
            link = "februari";
        }
        const fetchDO = async () => {
            try {
                const response = await axios.get(`http://localhost:3089/api/v1/${link}-do/agudang/${id_gudang}`, {
                    headers: {
                        Authorization: token
                    }
                });
                const datafatch = response.data.data.map(itemdata => ({
                    value: itemdata.id_do,
                    label: itemdata.nomor_do
                }));
                setDOOption(datafatch);
            } catch (error) {
                console.error('Error fetching', error);
                setDOOption([]);
            }
        };
        if (selectedAlokasi) {
            fetchDO();
        }
    }, [selectedAlokasi]);

    useEffect(() => {
        if (doOption.length > 0 && doInit) {
            const initialValue = doOption.find(option => option.value === doInit) || null;
            setSelectedDO(initialValue);
        }
    }, [doOption, doInit]);

    const handleDOChange = (selectedOption) => {
        setSelectedDO(selectedOption);
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
        const fetchDTT = async (desaKelurahanID) => {
            try {
                let linkdtt = "januari";
                if (selectedAlokasi.value == "1") {
                    linkdtt = "januari";
                } else if (selectedAlokasi.value == "2") {
                    linkdtt = "februari";
                } else {
                    linkdtt = "januari";
                }
                const response = await axios.get(`http://localhost:3089/api/v1/${linkdtt}-dtt/desakelurahan/${desaKelurahanID.value}`, {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataRencanaSalur({
            ...formDataRencanaSalur,
            [name]: value
        });
    };

    const handleChangeTonase = (e) => {
        const { name, value } = e.target;
        setFormDataItemLO({
            ...formDataItemLO,
            [name]: value
        });
    };

    const handleAdd = async (event) => {
        event.preventDefault();
        if (!token) {
            navigate('/');
        }

        let link = "januari";
        if (selectedAlokasi.value == 1) {
            link = "januari";
        } else if (selectedAlokasi.value == 2) {
            link = "februari";
        } else {
            link = "januari";
        }

        const dataToSubmit = {
            ...formDataItemLO,
            id_lo: detailId,
            nomor_item_lo: `${lo.nomor_lo}-${parseInt(ietmLO.length) + 1}`,
            id_desa_kelurahan: selectedDesaKelurahan.value,
        };


        try {
            await axios.post(`http://localhost:3089/api/v1/${link}-item-lo`, dataToSubmit, {
                headers: {
                    Authorization: token
                }
            });
            Swal.fire({
                title: 'Data Item Loading Order',
                text: 'Data Berhasil Ditambahkan',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchItemLO();
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

    const handleDelete = async (id_item_lo) => {
        if (!token) {
            navigate('/');
        }

        let link = "januari";
        if (selectedAlokasi.value == 1) {
            link = "januari";
        } else if (selectedAlokasi.value == 2) {
            link = "februari";
        } else {
            link = "januari";
        }

        try {
            await axios.delete(`http://localhost:3089/api/v1/${link}-item-lo/${id_item_lo}`, {
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
                fetchItemLO();
            });
        } catch (error) {
            Swal.fire({
                title: 'Data Item Rencana Salur',
                text: 'Data berhasil dihapus!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                fetchItemLO();
            });
        }
    };

    const calculateTotals = (data) => {
        // Mengelompokkan data berdasarkan tanggal_lo
        const groupedData = data.reduce((acc, item) => {
            const tanggal = item.tanggal_lo;
            if (!acc[tanggal]) {
                acc[tanggal] = { items: [], total: 0 };
            }
            acc[tanggal].items.push(item);
            acc[tanggal].total += parseInt(item.tonase, 10);
            return acc;
        }, {});

        return groupedData;
    };

    const totalOverall = ietmLO.reduce(
        (acc, item) => acc + parseInt(item.tonase, 10),
        0
    );

    const groupedData = calculateTotals(ietmLO);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formattedDate = lo?.tanggal_lo ? new Date(lo.tanggal_lo).toISOString().split("T")[0] : "";

    const handleFileChange = (e, setFileFunction) => {
        setFileFunction(e.target.files[0]);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const formDataInsert = new FormData();
        formDataInsert.append('id_alokasi', selectedAlokasi.value);
        formDataInsert.append('id_kantor', id_kantor);
        formDataInsert.append('id_gudang', id_gudang);
        formDataInsert.append('nama_kantor', nama_kantor);
        formDataInsert.append('nama_gudang', nama_gudang);
        formDataInsert.append('nomor_do', formData.nomor_do);
        formDataInsert.append('tanggal_do', formData.tanggal_do);
        formDataInsert.append('file_do', file);
        formDataInsert.append('status_do', "UPLOAD");

        try {
            let link = "januari";
            if (selectedAlokasi.value == 1) {
                link = "januari";
            } else if (selectedAlokasi.value == 2) {
                link = "februari";
            } else {
                link = "januari";
            }
            await axios.post(`http://localhost:3089/api/v1/${link}-do`, formDataInsert, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                }
            });
            Swal.fire({
                title: 'Data Doc Out',
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

    const generateQRCode = async (textqr) => {
        try {
            return await QRCode.toDataURL(textqr); // Kembalikan hasil QR code
        } catch (err) {
            console.error("Error generating QR code", err);
            return null;
        }
    };

    const downlaodPDFLO = async () => {
        const doc = new jsPDF('landscape', 'mm', 'a5');

        let qr = await generateQRCode(lo.nomor_lo);

        doc.addImage("/assets/img/logos/footer_88.png", "PNG", 10, 5, 55, 15, null, 'FAST');
        doc.addImage(qr, "PNG", 182, 3, 20, 20, null, 'FAST');

        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        doc.text("BERITA ACARA SERAH TERIMA BARANG", pageWidth / 2, 10, null, null, 'center');
        doc.text("BANTUAN PANGAN CADANGAN BERAS 2024", pageWidth / 2, 15, null, null, 'center');
        doc.text("PENYERAHAN BARANG DARI GUDANG", pageWidth / 2, 20, null, null, 'center');

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.rect(10, 25, 47.5, 7);
        doc.rect(57.5, 25, 47.5, 7);
        doc.rect(105, 25, 47.5, 7);
        doc.rect(152.5, 25, 47.5, 7);

        // ISI TABEL 
        doc.text("Nomor LO", 12, 29);
        doc.text(`: ${lo.nomor_lo}`, 59.5, 29);
        doc.text("Gudang Pengirim", 107, 29);
        doc.text(`: ${nama_gudang}`, 154.5, 29);

        // tabel ke-dua
        doc.rect(10, 32, 47.5, 7);
        doc.rect(57.5, 32, 47.5, 7);
        doc.rect(105, 32, 47.5, 7);
        doc.rect(152.5, 32, 47.5, 7);

        // ISI TABEL 
        doc.text("Tanggal Penyerahan", 12, 36.5);
        doc.text(`: ${formatDate(lo.tanggal_lo)}`, 59.5, 36.5);
        doc.text("Driver/Nopol", 107, 36.5);
        doc.text(`: ${lo.nama_driver} / ${lo.nopol}`, 154.5, 36.5);

        // tabel ke-tiga
        doc.rect(10, 43, 10, 13);
        doc.rect(20, 43, 57.5, 13);
        doc.rect(77.5, 43, 20, 13);
        doc.rect(97.5, 43, 15, 13);
        doc.rect(112.5, 43, 15, 13);
        doc.rect(127.5, 43, 15, 13);
        doc.rect(142.5, 43, 57.5, 13);

        // ISI TABEL - Menempatkan teks di tengah setiap kotak
        doc.text("No.", 15, 50.5, { align: 'center' }); // Kolom No.
        doc.text("ITEM", 48.75, 50.5, { align: 'center' }); // Kolom ITEM
        // Menambahkan teks multi-line langsung tanpa variabel
        doc.text(doc.splitTextToSize("Jumlah Diserahkan (Kg)", 18), 87.5, 47, { align: 'center' }); // Kolom Jumlah Diserahkan (Kg)
        doc.text("Kondisi", 105, 50.5, { align: 'center' }); // Kolom Kondisi

        // Menambahkan teks multi-line langsung tanpa variabel
        doc.text(doc.splitTextToSize("Koll (Bags)", 13), 120, 48.5, { align: 'center' }); // Kolom Jumlah Diserahkan (Kg)
        doc.text(doc.splitTextToSize("Cek Isi (Y/N)", 13), 135, 48.5, { align: 'center' }); // Kolom Jumlah Diserahkan (Kg)

        // Kolom lainnya
        doc.text("Desa/Kecamatan", 171.25, 50.5, { align: 'center' }); // Kolom Desa/Kecamatan

        let xTable = 10;
        let yTable = 56;
        let xText = 14;
        let yText = 60.5;

        for (let i = 0; i < ietmLO.length; i++) {
            // tabel ke-empat
            doc.rect(10, yTable, 10, 7);
            doc.rect(20, yTable, 57.5, 7);
            doc.rect(77.5, yTable, 20, 7);
            doc.rect(97.5, yTable, 15, 7);
            doc.rect(112.5, yTable, 15, 7);
            doc.rect(127.5, yTable, 15, 7);
            doc.rect(142.5, yTable, 57.5, 7);

            // isi tabel item
            doc.text(`${i + 1}`, 14, yText);
            doc.text("Beras Bantuan Pangan Kemasan 10 Kg", 22, yText);
            doc.text(`${(ietmLO[i].tonase).toLocaleString('id-ID')}`, 87, yText, { align: 'center' });
            doc.text("Baik", 105, yText, { align: 'center' });
            doc.text(`${(ietmLO[i].tonase / 10).toLocaleString('id-ID')}`, 120, yText, { align: 'center' });
            doc.text("Y", 135, yText, { align: 'center' });
            doc.text(`${(ietmLO[i].nama_desa_kelurahan)} / ${(ietmLO[i].nama_kecamatan)}`, 145, yText);

            yTable = yTable + 7;
            yText = yText + 7;
        }
        // tabel ke-lima
        doc.rect(10, yTable, 67.5, 7);
        doc.rect(77.5, yTable, 20, 7);
        doc.rect(97.5, yTable, 15, 7);
        doc.rect(112.5, yTable, 15, 7);
        doc.rect(127.5, yTable, 15, 7);
        doc.rect(142.5, yTable, 57.5, 7);

        // isi tabel item
        doc.text("Jumlah Total", 12, yText);
        doc.text(`${(parseInt(totalOverall)).toLocaleString('id-ID')}`, 87, yText, { align: "center" });
        doc.text("", 105, yText, { align: "center" });
        doc.text(`${(parseInt(totalOverall) / 10).toLocaleString('id-ID')}`, 120, yText, { align: "center" });
        doc.text("", 135, yText, { align: "center" });
        doc.text("", 145, yText);


        doc.text("Pihak yang menyerahkan dan pihak yang menerima telah sepakat bahwa jumlah dan kondisi barang sesuai dengan rincian diatas", 10, yText + 10);

        // ttd
        doc.text("Diserahkan Oleh", 40, yText + 15, { align: "center" });
        doc.text("Bulog", 40, yText + 20, { align: "center" });
        doc.text("Diverifikasi Oleh", 107, yText + 15, { align: "center" });
        doc.text("PT. Delapan Delapan Logistics", 107, yText + 20, { align: "center" });
        doc.text("Diterima Oleh", 171, yText + 15, { align: "center" });
        doc.text("Driver", 171, yText + 20, { align: "center" });

        // garis
        doc.line(10, yTable + 45, 70, yTable + 45);
        doc.line(75, yTable + 45, 140, yTable + 45);
        doc.line(145, yTable + 45, 200, yTable + 45);

        // Telpon
        doc.text(``, 10, yText + 38);
        doc.text(`${lo.pic}`, 75, yText + 38);
        doc.text(`${lo.nama_driver}`, 145, yText + 38);

        // Telpon
        doc.text("Telp.", 10, yText + 45);
        doc.text("Telp.", 75, yText + 45);
        doc.text(`Telp. ${lo.telpon_driver}`, 145, yText + 45);

        // Halaman 2
        for (let i = 0; i < ietmLO.length; i++) {
            if (i == ietmLO.length) {
                console.log();
            } else {
                doc.addPage();
                doc.setLineWidth(0.3);
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");

                doc.addImage("/assets/img/logos/footer_88.png", "PNG", 10, 5, 55, 15, null, 'FAST');
                doc.addImage(qr, "PNG", 182, 3, 20, 20, null, 'FAST');

                const pageWidth = doc.internal.pageSize.getWidth();
                doc.text("SURAT JALAN TRANSPORTER (SJT)", pageWidth / 2, 10, null, null, 'center');
                doc.text("BANTUAN PANGAN CADANGAN BERAS 2024", pageWidth / 2, 15, null, null, 'center');
                doc.text(`${ietmLO[i].nomor_item_lo}`, pageWidth / 2, 20, null, null, 'center');

                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");

                doc.rect(10, 27, 47.5, 5);
                doc.rect(57.5, 27, 47.5, 5);
                doc.rect(105, 27, 47.5, 5);
                doc.rect(152.5, 27, 47.5, 5);

                // ISI TABEL 
                doc.text("Nomor LO", 12, 30.5);
                doc.text(`: ${lo.nomor_lo}`, 59.5, 30.5);
                doc.text("Nama Driver", 107, 30.5);
                doc.text(`: ${lo.nama_driver}`, 154.5, 30.5);

                // TABEL
                doc.rect(10, 32, 47.5, 5);
                doc.rect(57.5, 32, 47.5, 5);
                doc.rect(105, 32, 47.5, 5);
                doc.rect(152.5, 32, 47.5, 5);

                // ISI TABEL 
                doc.text("Tanggal", 12, 35.5);
                doc.text(`: ${formatDate(lo.tanggal_lo)}`, 59.5, 35.5);
                doc.text("Nopol", 107, 35.5);
                doc.text(`: ${lo.nopol}`, 154.5, 35.5);

                // TABEL
                doc.rect(10, 37, 47.5, 5);
                doc.rect(57.5, 37, 47.5, 5);
                doc.rect(105, 37, 47.5, 5);
                doc.rect(152.5, 37, 47.5, 5);

                // ISI TABEL 
                doc.text("Gudang Bulog", 12, 40.5);
                doc.text(`: ${nama_gudang}`, 59.5, 40.5);
                doc.text("Nama Checker", 107, 40.5);
                doc.text(`: ${lo.checker}`, 154.5, 40.5);

                // TABEL
                doc.rect(10, 42, 47.5, 5);
                doc.rect(57.5, 42, 47.5, 5);
                doc.rect(105, 42, 47.5, 5);
                doc.rect(152.5, 42, 47.5, 5);

                // ISI TABEL 
                doc.text("Tujuan (Kecamatan)", 12, 45.5);
                doc.text(`: ${ietmLO[i].nama_kecamatan}`, 59.5, 45.5);
                doc.text("No Telp ", 107, 45.5);
                doc.text(`: ${lo.telpon_driver}`, 154.5, 45.5);


                // TABEL
                doc.rect(10, 47, 47.5, 5);
                doc.rect(57.5, 47, 47.5, 5);
                doc.rect(105, 47, 47.5, 5);
                doc.rect(152.5, 47, 47.5, 5);

                // ISI TABEL 
                doc.text("Surat Jalan Bulog", 12, 50.5);
                doc.text(`: ${lo.nomor_so}`, 59.5, 50.5);
                doc.text("No Doc Out ", 107, 50.5);
                doc.text(`: `, 154.5, 50.5);

                // tabel 
                doc.rect(10, 55, 10, 14);
                doc.rect(20, 55, 55, 14);
                doc.rect(75, 55, 20, 14);
                doc.rect(95, 55, 20, 7);
                doc.rect(115, 62, 20, 7);
                doc.rect(95, 62, 20, 7);
                doc.rect(115, 55, 20, 7);
                doc.rect(135, 55, 20, 14);
                doc.rect(155, 55, 45, 14);

                // isi tabel
                doc.text("No", 15, 63, { align: "center" });                      // Tengah di kolom No
                doc.text("Nama Desa/Kelurahan", 47.5, 63, { align: "center" });   // Tengah di kolom Nama Desa/Kelurahan
                doc.text("Jumlah PBP", 85, 63, { align: "center" });              // Tengah di kolom Jumlah PBP
                doc.text("Kuantitas", 105, 60, { align: "center" });              // Tengah di kolom Kuantitas (atas)
                doc.text("(Karung)", 105, 66, { align: "center" });               // Tengah di kolom Kuantitas (bawah)
                doc.text("Berat", 125, 60, { align: "center" });                  // Tengah di kolom Berat (atas)
                doc.text("(Kg)", 125, 66, { align: "center" });                   // Tengah di kolom Berat (bawah)
                doc.text("Ket", 145, 63, { align: "center" });                    // Tengah di kolom Ket
                doc.text("Tanda Tangan & Nama Jelas", 177.5, 63, { align: "center" });

                // tabel 
                doc.rect(10, 69, 10, 30);
                doc.rect(20, 69, 55, 30);
                doc.rect(75, 69, 20, 30);
                doc.rect(95, 69, 20, 30);
                doc.rect(115, 69, 20, 30);
                doc.rect(135, 69, 20, 30);
                doc.rect(155, 69, 45, 30);

                // isi tabel
                doc.text("1", 15, 73, { align: "center" });
                doc.text(`${ietmLO[i].nama_desa_kelurahan}`, 22, 73);
                doc.text(`${(ietmLO[i].tonase / 10).toLocaleString('id-ID')}`, 85, 73, { align: "center" });
                doc.text(`${(ietmLO[i].tonase / 10).toLocaleString('id-ID')}`, 105, 73, { align: "center" });
                doc.text(`${(ietmLO[i].tonase).toLocaleString('id-ID')}`, 125, 73, { align: "center" });
                doc.text("", 145, 73, { align: "center" });
                doc.text("", 177.5, 73, { align: "center" });

                // tabel
                doc.rect(10, 105, 95, 10);
                doc.rect(105, 105, 95, 10);
                doc.rect(10, 115, 95, 20);
                doc.rect(105, 115, 95, 20);
                doc.rect(10, 135, 95, 10);
                doc.rect(105, 135, 95, 10);

                // isi tabel
                doc.text("Diserahkan Oleh", 55, 109, { align: "center" });
                doc.text("Admin Gudang", 55, 113, { align: "center" });
                doc.text("Diterima Oleh", 153, 109, { align: "center" });
                doc.text("Admin/Driver/Checker", 153, 113, { align: "center" });

                // garis
                doc.line(12, 140, 100, 140);

                doc.text("Nip : ", 12, 143)
            }
        }
        doc.save(`${lo.nomor_lo}.pdf`);
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="mb-3">
                    <div className="divider text-start fw-bold">
                        <div className="divider-text">
                            <span className="menu-header-text fs-6">Detail Loading Order</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="">
                    Klik <button className="fw-bold btn btn-link p-0" onClick={() => handleBackClick()}>disini</button> untuk kembali ke menu utama Loading Order.
                </div>
            </div>
            <div className="col-md-12 mt-3">
                <div className="row">
                    <div className="col-lg-12 mt-2">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Loading Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_kantor" className="form-label">Kantor Cabang</label>
                        <input className="form-control" type="text" id="nama_kantor" name='nama_kantor' placeholder="Kantor Cabang" value={nama_kantor} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_gudang" className="form-label">Gudang Bulog</label>
                        <input className="form-control" type="text" id="nama_gudang" name='nama_gudang' placeholder="Kantor Cabang" value={nama_gudang} required readOnly />
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
                        <label htmlFor="nomor_lo" className="form-label">Nomor LO</label>
                        <input className="form-control" type="text" id="nomor_lo" name='nomor_lo' placeholder="Nomor LO" value={lo?.nomor_lo} onChange={handleChange} required readOnly />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="tanggal_lo" className="form-label">Tanggal LO</label>
                        <input className="form-control text-uppercase" type="date" id="tanggal_lo" name='tanggal_lo' ref={inputRef} defaultValue={formattedDate} placeholder="Tanggal Rencana Salur" onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nomor_so" className="form-label">Nomor SO</label>
                        <input className="form-control" type="text" id="nomor_so" name='nomor_so' placeholder="Lokasi Terakhir" ref={inputRef} defaultValue={lo?.nomor_so || ""} onChange={handleChange} />
                    </div>
                    <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                        <label htmlFor="id_do" className="form-label">Nomor DO</label>
                        <Select
                            id="id_do"
                            name="id_do"
                            value={selectedDO}
                            onChange={handleDOChange}
                            options={doOption}
                            placeholder="Pilih Nomor DO"
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
                        <input className="form-control" type="text" id="nama_driver" name='nama_driver' placeholder="Nama Driver" ref={inputRef} defaultValue={lo?.nama_driver || ""} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="telpon_driver" className="form-label">Telpon Driver</label>
                        <input className="form-control" type="text" id="telpon_driver" name='telpon_driver' placeholder="Telpon Driver" ref={inputRef} defaultValue={lo?.telpon_driver || ""} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nopol" className="form-label">Nopol Mobil</label>
                        <input className="form-control" type="text" id="nopol" name='nopol' placeholder="E 88 LOG" ref={inputRef} defaultValue={lo?.nopol || ""} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="pic" className="form-label">Nama PIC</label>
                        <input className="form-control" type="text" id="pic" name='pic' placeholder="Nama PIC" ref={inputRef} defaultValue={lo?.pic || ""} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="checker" className="form-label">Nama Checker</label>
                        <input className="form-control" type="text" id="checker" name='checker' placeholder="Nama Checker" ref={inputRef} defaultValue={lo?.checker || ""} onChange={handleChange} required />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="file_do" className="form-label">File Loading Order</label>
                        <input className="form-control" type="file" id="file_do" name='file_do' placeholder="File Loading Order" onChange={(e) => handleFileChange(e, setFile)} required />
                    </div>
                    <div className="col-lg-12 mt-2">
                        <div className="mb-3">
                            <div className="divider text-start">
                                <div className="divider-text">
                                    <span className="menu-header-text fs-6">Informasi Item Loading Order</span>
                                </div>
                            </div>
                        </div>
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
                                        <th>Provinsi</th>
                                        <th>Kabupaten/Kota</th>
                                        <th>Kecamatan</th>
                                        <th>Desa/Kelurahan</th>
                                        <th>Jumlah KPM</th>
                                        <th>Jumlah Kg</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(groupedData).map((tanggal, index) => (
                                        <React.Fragment key={index}>
                                            {groupedData[tanggal].items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{formatDate(item.tanggal_lo)}</td>
                                                    <td>{item.nama_provinsi}</td>
                                                    <td>{item.nama_kabupaten_kota}</td>
                                                    <td>{item.nama_kecamatan}</td>
                                                    <td>{item.nama_desa_kelurahan}</td>
                                                    <td style={{ textAlign: 'right' }}>{(parseInt(item.tonase) / 10).toLocaleString('id-ID')}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        {(parseInt(item.tonase)).toLocaleString('id-ID')} Kg
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                    {/* Total keseluruhan */}
                                    {ietmLO.length > 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-start fw-bold">
                                                Total Keseluruhan
                                            </td>
                                            <td className="fw-bold" style={{ textAlign: 'right' }}>{(totalOverall / 10).toLocaleString('id-ID')}</td>
                                            <td className="fw-bold" style={{ textAlign: 'right' }}>
                                                {(totalOverall).toLocaleString('id-ID')} Kg
                                            </td>
                                            <td colSpan="3"></td>
                                        </tr>
                                    )}
                                    {ietmLO.length === 0 && (
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
                    <div className="col-md-3 col-sm-12 mb-3 mt-3">
                        <label htmlFor="" className="form-label">Proses</label>
                        <button type="button" onClick={downlaodPDFLO} className="btn btn-primary w-100">DOWNLOAD PDF</button>
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