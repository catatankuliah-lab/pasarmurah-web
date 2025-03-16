import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import UploadlPage from './uploadPage';

const IndexPage = () => {
    // Data dari localstorage
    const token = localStorage.getItem("token");
    const id_kantor = localStorage.getItem("id_kantor");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const [alokasiOption, setAlokasiOption] = useState([]);
    const [selectedAlokasi, setSelectedAlokasi] = useState(null);

    const [provinsiOption, setProvinsiOption] = useState([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState("");

    const [kabupatenOption, setKabupatenOption] = useState([]);
    const [selectedKabupaten, setSelectedKabupaten] = useState("");

    const [kecamatanOption, setKecamatanOption] = useState([]);
    const [selectedKecamatan, setSelectedKecamatan] = useState("");

    const [desaKelurahanOption, setDesaKelurahanOption] = useState([]);
    const [selectedDesaKelurahan, setSelectedDesaKelurahan] = useState(null);

    const [dtt, setDTT] = useState("Kode DTT");

    const [kpm, setKPM] = useState(null);

    const [totalKPM, setTotalKPM] = useState(0);

    const [qrImage, setQrImage] = useState("");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit, setLimit] = useState(10);

    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "50px",
        },
        {
            name: "NIK",
            selector: (row) => row.decrypted_nik,
            sortable: true,
            width: "200px",
        },
        {
            name: "Nama Lengkap KPM",
            selector: (row) => row.nama_lengkap,
            sortable: true,
            width: "300px",
        },
        ,
        {
            name: "Alamat Lengkap KPM",
            selector: (row) => row.alamat_lengkap,
            sortable: true,
        },
    ];

    const customStyles = {
        table: {
            style: {
                backgroundColor: "transparent",
            },
        },
        headRow: {
            style: {
                backgroundColor: "transparent",
                borderBottom: "2px solid #ccc",
            },
        },
        rows: {
            style: {
                backgroundColor: "transparent",
            },
        },
        pagination: {
            style: {
                backgroundColor: "transparent",
                borderTop: "none",
                padding: "8px 0",
            },
        },
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

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
        const fetchProvinsiOptions = async () => {
            try {
                const response = await axios.get("http://localhost:3089/api/v1/provinsi", {
                    headers: {
                        Authorization: token,
                    },
                });
                const dataprovinsi = response.data.data.map((provinsiall) => ({
                    value: provinsiall.id_provinsi,
                    label: provinsiall.nama_provinsi,
                }));
                setProvinsiOption(dataprovinsi);
            } catch (error) {
                console.error("Error fetching", error);
            }
        };
        fetchProvinsiOptions();
    }, []);

    const handleProvinsiChange = (selectedOption) => {
        setSelectedProvinsi(selectedOption);
    };

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
        const fetchKabupatenOptions = async (provinsiID) => {
            try {
                const response = await axios.get(
                    `http://localhost:3089/api/v1/kabupatenkota/${provinsiID.value}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                const datakabupatenkota = response.data.data.map(
                    (kabupatenkotaall) => ({
                        value: kabupatenkotaall.id_kabupaten_kota,
                        label: kabupatenkotaall.nama_kabupaten_kota,
                    })
                );
                setKabupatenOption(datakabupatenkota);
            } catch (error) {
                console.error("Error fetching", error);
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
            navigate("/");
        }
        const fetchKecamatanOptions = async (kabupatenID) => {
            try {
                const response = await axios.get(
                    `http://localhost:3089/api/v1/kecamatan/${kabupatenID.value}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                const datakecamatan = response.data.data.map((kecamatanall) => ({
                    value: kecamatanall.id_kecamatan,
                    label: kecamatanall.nama_kecamatan,
                }));
                setKecamatanOption(datakecamatan);
            } catch (error) {
                console.error("Error fetching", error);
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
            navigate("/");
        }
        const fetchDesaKelurahanOptions = async (kecamatanID) => {
            try {
                const response = await axios.get(
                    `http://localhost:3089/api/v1/desaKelurahan/${kecamatanID.value}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                const datadesakelurahan = response.data.data.map(
                    (desakelurahanall) => ({
                        value: desakelurahanall.id_desa_kelurahan,
                        label: desakelurahanall.nama_desa_kelurahan,
                    })
                );
                setDesaKelurahanOption(datadesakelurahan);
            } catch (error) {
                console.error("Error fetching", error);
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
            navigate("/");
        }
        const fetchDTT = async (desaKelurahanID) => {
            try {
                let link = "januari";
                if (selectedAlokasi.value == "1") {
                    link = "januari";
                } else if (selectedAlokasi.value == "2") {
                    link = "februari";
                } else {
                    link = "januari";
                }
                const response = await axios.get(
                    `http://localhost:3089/api/v1/${link}-dtt/desakelurahan/${desaKelurahanID.value}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setDTT(response.data.data);
            } catch (error) {
                console.error("Error fetching", error);
                setDTT(null);
            }
        };
        if (selectedDesaKelurahan) {
            fetchDTT(selectedDesaKelurahan);
        }
    }, [selectedDesaKelurahan]);

    const loadData = async (page) => {
        setLoading(true);
        let id_dtt = dtt.id_dtt;
        let linkrencanasalur = "januari";
        if (selectedAlokasi == null) {
            linkrencanasalur = "januari";
        } else if (selectedAlokasi.value == 1) {
            linkrencanasalur = "januari";
        } else {
            linkrencanasalur = "februari";
        }
        if (!token) {
            navigate("/");
        }
        try {
            const response = await axios.get(
                `http://localhost:3089/api/v1/${linkrencanasalur}-kpm/dtt/${id_dtt}`,
                {
                    headers: {
                        Authorization: token,
                    },
                    params: {
                        page,
                        limit,
                    },
                }
            );
            const fetchedData = Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data];
            setData(fetchedData);
            setTotalRecords(response.data.totalData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(currentPage);
    }, [currentPage, limit, dtt]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const generateQRCode = async (textqr) => {
        try {
            return await QRCode.toDataURL(textqr); // Kembalikan hasil QR code
        } catch (err) {
            console.error("Error generating QR code", err);
            return null;
        }
    };

    const downloadPDF = async () => {
        setLoading(true);
        let id_dtt = dtt.id_dtt;
        let linkrencanasalur =
            selectedAlokasi?.value === 1 ? "januari" : "februari";
        if (!token) {
            navigate("/");
        }
        try {
            // Fetch data dari API
            const response = await axios.get(
                `http://localhost:3089/api/v1/${linkrencanasalur}-kpm/download/${id_dtt}`,
                {
                    headers: { Authorization: token },
                }
            );
            setKPM(response.data.data);
            setTotalKPM(response.data.total);
            const doc = new jsPDF("potrait", "mm", "a4");

            // Generate QR Code
            let qr = await generateQRCode(dtt.kode_dtt);

            // HALAMAN 1

            doc.addImage(qr, "PNG", 7, 7, 25, 25, null, "FAST");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);

            let headetBaris = "BERITA ACARA SERAH TERIMA (BAST)";
            doc.text(
                `${headetBaris}`,
                (doc.internal.pageSize.width - doc.getTextWidth(headetBaris)) / 2,
                15
            );
            headetBaris = "PENERIMA BANTUAN PANGAN PEMERINTAH - JANUARI 2025";
            doc.text(
                `${headetBaris}`,
                (doc.internal.pageSize.width - doc.getTextWidth(headetBaris)) / 2,
                25
            );

            doc.line(10, 35, 200, 35);

            doc.text(
                `${dtt.kode_dtt}`,
                (doc.internal.pageSize.width - doc.getTextWidth(dtt.kode_dtt)) / 2,
                45
            );

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            //Tabel Header
            //kananbari1
            doc.rect(10, 55, 35, 10);
            doc.rect(45, 55, 60, 10);
            //kiribaris1
            doc.rect(105, 55, 35, 10);
            doc.rect(140, 55, 60, 10);
            //kananbaris2
            doc.rect(10, 65, 35, 10);
            doc.rect(45, 65, 60, 10);
            //kiribaris2
            doc.rect(105, 65, 35, 10);
            doc.rect(140, 65, 60, 10);
            //kananbaris3
            doc.rect(10, 75, 35, 10);
            doc.rect(45, 75, 60, 10);
            //kiribaris3
            doc.rect(105, 75, 35, 10);
            doc.rect(140, 75, 60, 10);

            // Buat Isi Tabel Header
            doc.setFont("helvetica", "normal");
            doc.text("Provinsi", 12, 61);
            doc.text("Kabupaten/Kota", 12, 71);
            doc.text("Kecamatan", 12, 81);

            doc.text(`: ${dtt.nama_provinsi}`, 46, 61);
            doc.text(`: ${dtt.nama_kabupaten_kota}`, 46, 71);
            doc.text(`: ${dtt.nama_kecamatan}`, 46, 81);

            doc.text("Kelurahan/Desa", 107, 61);
            doc.text("Jumlah KPM", 107, 71);
            doc.text("Jumlah KG", 107, 81);

            doc.text(`: ${dtt.nama_desa_kelurahan}`, 142, 61);
            doc.text(`: ${response.data.total.toLocaleString("id-ID")}`, 142, 71);
            doc.text(
                `: ${(response.data.total * 10).toLocaleString("id-ID")}`,
                142,
                81
            );

            //tabel pernyataan
            doc.rect(10, 90, 190, 10);
            doc.setFontSize(10);

            //isi tabel pernyataan
            doc.text(
                "Paket Bantuan Pangan diterima dan disalurkan kepada KPM dibantu oleh pejabat setempat dan Pendamping KPM",
                12,
                96
            );

            doc.rect(10, 105, 190, 10);

            doc.text("* Nama Jelas TTD dan Stampel Jika Ada", 12, 111);
            doc.text("KUNINGAN,", 130, 111);

            doc.rect(10, 115, 95, 50);
            doc.rect(105, 115, 95, 50);

            doc.text("Aparat Setempat", 43.5, 120);
            doc.text("PT. Delapan Delapan Logistics", 128.5, 120);

            doc.rect(10, 175, 10, 10);
            doc.rect(20, 175, 65, 10);
            doc.rect(85, 175, 65, 10);
            doc.rect(150, 175, 50, 10);

            doc.text("No", 12, 181);
            doc.text("Nama Pendamping", 35, 181);
            doc.text("No.Telpon Pedamping", 100, 181);
            doc.text("TTD Pedamping", 162, 181);

            doc.rect(10, 185, 10, 15);
            doc.rect(20, 185, 65, 15);
            doc.rect(85, 185, 65, 15);
            doc.rect(150, 185, 50, 15);

            doc.rect(10, 200, 10, 15);
            doc.rect(20, 200, 65, 15);
            doc.rect(85, 200, 65, 15);
            doc.rect(150, 200, 50, 15);

            doc.rect(10, 215, 10, 15);
            doc.rect(20, 215, 65, 15);
            doc.rect(85, 215, 65, 15);
            doc.rect(150, 215, 50, 15);

            doc.rect(10, 230, 10, 15);
            doc.rect(20, 230, 65, 15);
            doc.rect(85, 230, 65, 15);
            doc.rect(150, 230, 50, 15);

            doc.rect(10, 245, 10, 15);
            doc.rect(20, 245, 65, 15);
            doc.rect(85, 245, 65, 15);
            doc.rect(150, 245, 50, 15);

            doc.addImage(
                "/assets/img/logos/footer_bapanas.png",
                10,
                280,
                40,
                10,
                null,
                "FAST"
            );
            doc.addImage(
                "/assets/img/logos/footer_bulog.png",
                35,
                280,
                40,
                10,
                null,
                "FAST"
            );
            doc.addImage(
                "/assets/img/logos/footer_88.png",
                70,
                280,
                40,
                10,
                null,
                "FAST"
            );

            //HALAMAN 2
            const data = response.data.data;

            let xPage = 110;
            let tableX = 10;
            let tableY = 110;
            let textX = 10;
            let textY = 115;
            let alamatLengkap = "";
            let alamat1 = "";
            let alamat2 = "";
            let alamat3 = "";

            // Iterasi menggunakan for loop
            for (let i = 0; i < data.length; i++) {

                if (xPage == 110) {
                    doc.addPage("a4", "portrait");

                    // HEADER HALAMAN 2
                    doc.addImage(qr, "PNG", 7, 7, 25, 25, null, "FAST");
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(12);
                    headetBaris = "DATA TANDA TERIMA (DTT)";
                    doc.text(
                        `${headetBaris}`,
                        (doc.internal.pageSize.width - doc.getTextWidth(headetBaris)) / 2,
                        15
                    );
                    headetBaris = "PENERIMA BANTUAN PANGAN PEMERINTAH - JANUARI 2025";
                    doc.text(
                        `${headetBaris}`,
                        (doc.internal.pageSize.width - doc.getTextWidth(headetBaris)) / 2,
                        25
                    );
                    doc.line(10, 35, 200, 35);
                    doc.text(
                        `${dtt.kode_dtt}`,
                        (doc.internal.pageSize.width - doc.getTextWidth(dtt.kode_dtt)) / 2,
                        45
                    );
                    doc.setFont("helvetica", "normal");
                    //Tabel Header
                    //kananbari1
                    doc.rect(10, 55, 35, 10);
                    doc.rect(45, 55, 60, 10);
                    //kiribaris1
                    doc.rect(105, 55, 35, 10);
                    doc.rect(140, 55, 60, 10);
                    //kananbaris2
                    doc.rect(10, 65, 35, 10);
                    doc.rect(45, 65, 60, 10);
                    //kiribaris2
                    doc.rect(105, 65, 35, 10);
                    doc.rect(140, 65, 60, 10);
                    //kananbaris3
                    doc.rect(10, 75, 35, 10);
                    doc.rect(45, 75, 60, 10);
                    //kiribaris3
                    doc.rect(105, 75, 35, 10);
                    doc.rect(140, 75, 60, 10);
                    //kananbaris4
                    doc.rect(10, 85, 35, 10);
                    doc.rect(45, 85, 60, 10);
                    //kiribaris4
                    doc.rect(105, 85, 35, 10);
                    doc.rect(140, 85, 60, 10);
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text("Provinsi", 12, 61);
                    doc.text("Kabupaten/Kota", 12, 71);
                    doc.text("Kecamatan", 12, 81);
                    doc.text("Kelurahan/Desa", 12, 91);
                    doc.text("Tempat Serah", 107, 61);
                    doc.text("Tanggal Serah", 107, 71);
                    doc.text("Jumlah KPM", 107, 81);
                    doc.text("Halaman", 107, 91);
                    doc.text(`: ${dtt.nama_provinsi}`, 46, 61);
                    doc.text(`: ${dtt.nama_kabupaten_kota}`, 46, 71);
                    doc.text(`: ${dtt.nama_kecamatan}`, 46, 81);
                    doc.text(`: ${dtt.nama_desa_kelurahan}`, 46, 91);
                    doc.text(`: ${dtt.nama_desa_kelurahan}`, 141, 61);
                    doc.text(":", 141, 71);
                    doc.text(`: ${response.data.total.toLocaleString("id-ID")}`, 141, 81);
                    doc.text(":", 141, 91);
                    doc.setFontSize(10);

                    //HEADER DTT KIRI
                    doc.rect(10, 100, 75, 10);
                    doc.text("DATA KPM", 50, 107);

                    doc.rect(85, 100, 20, 10);
                    doc.text("TTD", 91, 107);

                    //HEADER DTT KANAN
                    doc.rect(105, 100, 75, 10);
                    doc.text("DATA KPM", 145, 107);

                    doc.rect(180, 100, 20, 10);
                    doc.text("TTD", 186, 107);

                    // FOOTER HALAMAN 2
                    doc.addImage(
                        "/assets/img/logos/footer_bapanas.png",
                        10,
                        280,
                        40,
                        10,
                        null,
                        "FAST"
                    );
                    doc.addImage(
                        "/assets/img/logos/footer_bulog.png",
                        35,
                        280,
                        40,
                        10,
                        null,
                        "FAST"
                    );
                    doc.addImage(
                        "/assets/img/logos/footer_88.png",
                        70,
                        280,
                        40,
                        10,
                        null,
                        "FAST"
                    );
                    tableX = 10;
                    textX = 10;

                    //KONTEN DTT 0
                    doc.rect(tableX, tableY, 75, 20);
                    doc.setFontSize(8);
                    doc.setFont("helvetica", "bold");
                    doc.text(`${data[i].nama_lengkap}`, textX + 2, textY - 1);
                    doc.setFont("helvetica", "normal");
                    doc.text(`${data[i].decrypted_nik}`, textX + 2, textY + 3);
                    doc.setFontSize(8);

                    alamatLengkap = data[i].alamat_lengkap;
                    if (doc.getTextWidth(alamatLengkap) <= 40) {
                        alamat1 = alamatLengkap.substring(0, 40);
                        alamat2 = "";
                        alamat3 = "";
                    } else if (doc.getTextWidth(alamatLengkap) <= 80) {
                        alamat1 = alamatLengkap.substring(0, 40);
                        alamat2 = alamatLengkap.substring(41, 80);
                        alamat3 = "";
                    } else {
                        alamat1 = alamatLengkap.substring(0, 40);
                        alamat2 = alamatLengkap.substring(41, 80);
                        alamat3 = alamatLengkap.substring(81, 120);
                    }

                    doc.text(`${alamat1}`, textX + 2, textY + 7);
                    doc.text(`${alamat2}`, textX + 2, textY + 10);
                    doc.text(`${alamat3}`, textX + 2, textY + 13);

                    doc.rect(tableX + 75, tableY, 20, 20);
                    doc.text(`${i + 1}`, textX + 77, textY);
                    xPage = xPage + 10;
                } else if (xPage <= 260) {
                    if (i % 2 == 0) {
                        tableX = 10;
                        textX = 10;

                        //KONTEN DTT KIRI
                        doc.rect(tableX, tableY, 75, 20);

                        doc.setFontSize(8);
                        doc.setFont("helvetica", "bold");
                        doc.text(`${data[i].nama_lengkap}`, textX + 2, textY - 1);
                        doc.setFont("helvetica", "normal");
                        doc.text(`${data[i].decrypted_nik}`, textX + 2, textY + 3);

                        doc.setFontSize(8);
                        alamatLengkap = data[i].alamat_lengkap;

                        if (doc.getTextWidth(alamatLengkap) <= 40) {
                            alamat1 = alamatLengkap.substring(0, 40);
                            alamat2 = "";
                            alamat3 = "";
                        } else if (doc.getTextWidth(alamatLengkap) <= 80) {
                            alamat1 = alamatLengkap.substring(0, 40);
                            alamat2 = alamatLengkap.substring(41, 80);
                            alamat3 = "";
                        } else {
                            alamat1 = alamatLengkap.substring(0, 40);
                            alamat2 = alamatLengkap.substring(41, 80);
                            alamat3 = alamatLengkap.substring(81, 120);
                        }

                        doc.text(`${alamat1}`, textX + 2, textY + 7);
                        doc.text(`${alamat2}`, textX + 2, textY + 10);
                        doc.text(`${alamat3}`, textX + 2, textY + 13);

                        doc.rect(tableX + 75, tableY, 20, 20);
                        doc.text(`${i + 1}`, textX + 77, textY);
                    } else {
                        tableX = 105;
                        textX = 105;

                        //KONTEN DTT KANAN
                        doc.rect(tableX, tableY, 75, 20);

                        doc.setFontSize(8);
                        doc.setFont("helvetica", "bold");
                        doc.text(`${data[i].nama_lengkap}`, textX + 2, textY - 1);
                        doc.setFont("helvetica", "normal");
                        doc.text(`${data[i].decrypted_nik}`, textX + 2, textY + 3);

                        doc.setFontSize(8);
                        alamatLengkap = data[i].alamat_lengkap;
                        if (doc.getTextWidth(alamatLengkap) <= 40) {
                            alamat1 = alamatLengkap.substring(0, 40);
                            alamat2 = "";
                            alamat3 = "";
                        } else if (doc.getTextWidth(alamatLengkap) <= 80) {
                            alamat1 = alamatLengkap.substring(0, 40);
                            alamat2 = alamatLengkap.substring(41, 80);
                            alamat3 = "";
                        } else {
                            alamat1 = alamatLengkap.substring(0, 40);
                            alamat2 = alamatLengkap.substring(41, 80);
                            alamat3 = alamatLengkap.substring(81, 120);
                        }

                        doc.text(`${alamat1}`, textX + 2, textY + 7);
                        doc.text(`${alamat2}`, textX + 2, textY + 10);
                        doc.text(`${alamat3}`, textX + 2, textY + 13);

                        doc.rect(tableX + 75, tableY, 20, 20);
                        doc.text(`${i + 1}`, textX + 77, textY);

                        tableY = tableY + 20;
                        textY = textY + 20;
                    }
                    xPage = xPage + 10;
                } else {
                    xPage = 110.1;
                    tableX = 10;
                    tableY = 110;
                    textX = 10;
                    textY = 115;
                    doc.addPage("a4", "portrait");

                    // HEADER HALAMAN 2
                    doc.addImage(qr, "PNG", 7, 7, 25, 25, null, "FAST");
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(12);
                    headetBaris = "DATA TANDA TERIMA (DTT)";
                    doc.text(
                        `${headetBaris}`,
                        (doc.internal.pageSize.width - doc.getTextWidth(headetBaris)) / 2,
                        15
                    );
                    headetBaris = "PENERIMA BANTUAN PANGAN PEMERINTAH - JANUARI 2025";
                    doc.text(
                        `${headetBaris}`,
                        (doc.internal.pageSize.width - doc.getTextWidth(headetBaris)) / 2,
                        25
                    );
                    doc.line(10, 35, 200, 35);
                    doc.text(
                        `${dtt.kode_dtt}`,
                        (doc.internal.pageSize.width - doc.getTextWidth(dtt.kode_dtt)) / 2,
                        45
                    );
                    doc.setFont("helvetica", "normal");
                    //Tabel Header
                    //kananbari1
                    doc.rect(10, 55, 35, 10);
                    doc.rect(45, 55, 60, 10);
                    //kiribaris1
                    doc.rect(105, 55, 35, 10);
                    doc.rect(140, 55, 60, 10);
                    //kananbaris2
                    doc.rect(10, 65, 35, 10);
                    doc.rect(45, 65, 60, 10);
                    //kiribaris2
                    doc.rect(105, 65, 35, 10);
                    doc.rect(140, 65, 60, 10);
                    //kananbaris3
                    doc.rect(10, 75, 35, 10);
                    doc.rect(45, 75, 60, 10);
                    //kiribaris3
                    doc.rect(105, 75, 35, 10);
                    doc.rect(140, 75, 60, 10);
                    //kananbaris4
                    doc.rect(10, 85, 35, 10);
                    doc.rect(45, 85, 60, 10);
                    //kiribaris4
                    doc.rect(105, 85, 35, 10);
                    doc.rect(140, 85, 60, 10);
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "normal");
                    doc.text("Provinsi", 12, 61);
                    doc.text("Kabupaten/Kota", 12, 71);
                    doc.text("Kecamatan", 12, 81);
                    doc.text("Kelurahan/Desa", 12, 91);
                    doc.text("Tempat Serah", 107, 61);
                    doc.text("Tanggal Serah", 107, 71);
                    doc.text("Jumlah KPM", 107, 81);
                    doc.text("Halaman", 107, 91);
                    doc.text(`: ${dtt.nama_provinsi}`, 46, 61);
                    doc.text(`: ${dtt.nama_kabupaten_kota}`, 46, 71);
                    doc.text(`: ${dtt.nama_kecamatan}`, 46, 81);
                    doc.text(`: ${dtt.nama_desa_kelurahan}`, 46, 91);
                    doc.text(`: ${dtt.nama_desa_kelurahan}`, 141, 61);
                    doc.text(":", 141, 71);
                    doc.text(`: ${response.data.total.toLocaleString("id-ID")}`, 141, 81);
                    doc.text(":", 141, 91);
                    doc.setFontSize(10);

                    //HEADER DTT KIRI
                    doc.rect(10, 100, 75, 10);
                    doc.text("DATA KPM", 50, 107);

                    doc.rect(85, 100, 20, 10);
                    doc.text("TTD", 91, 107);

                    //HEADER DTT KANAN
                    doc.rect(105, 100, 75, 10);
                    doc.text("DATA KPM", 145, 107);

                    doc.rect(180, 100, 20, 10);
                    doc.text("TTD", 186, 107);

                    // FOOTER HALAMAN 2
                    doc.addImage(
                        "/assets/img/logos/footer_bapanas.png",
                        10,
                        280,
                        40,
                        10,
                        null,
                        "FAST"
                    );
                    doc.addImage(
                        "/assets/img/logos/footer_bulog.png",
                        35,
                        280,
                        40,
                        10,
                        null,
                        "FAST"
                    );
                    doc.addImage(
                        "/assets/img/logos/footer_88.png",
                        70,
                        280,
                        40,
                        10,
                        null,
                        "FAST"
                    );
                    tableX = 10;
                    textX = 10;

                    //KONTEN DTT 0
                    doc.rect(tableX, tableY, 75, 20);
                    doc.setFontSize(8);
                    doc.setFont("helvetica", "bold");
                    doc.text(`${data[i].nama_lengkap}`, textX + 2, textY - 1);
                    doc.setFont("helvetica", "normal");
                    doc.text(`${data[i].decrypted_nik}`, textX + 2, textY + 3);
                    doc.setFontSize(8);

                    alamatLengkap = data[i].alamat_lengkap;
                    if (doc.getTextWidth(alamatLengkap) <= 40) {
                        alamat1 = alamatLengkap.substring(0, 40);
                        alamat2 = "";
                        alamat3 = "";
                    } else if (doc.getTextWidth(alamatLengkap) <= 80) {
                        alamat1 = alamatLengkap.substring(0, 40);
                        alamat2 = alamatLengkap.substring(41, 80);
                        alamat3 = "";
                    } else {
                        alamat1 = alamatLengkap.substring(0, 40);
                        alamat2 = alamatLengkap.substring(41, 80);
                        alamat3 = alamatLengkap.substring(81, 120);
                    }

                    doc.text(`${alamat1}`, textX + 2, textY + 7);
                    doc.text(`${alamat2}`, textX + 2, textY + 10);
                    doc.text(`${alamat3}`, textX + 2, textY + 13);

                    doc.rect(tableX + 75, tableY, 20, 20);
                    doc.text(`${i + 1}`, textX + 77, textY);
                }
            }

            //HALAMAN 3
            doc.addPage("a4", "portrait");

            doc.addImage(
                "/assets/img/logos/footer_88.png",
                10,
                10,
                50,
                20,
                null,
                "FAST"
            );

            doc.setFont("helvetica", "bold"); // Jenis Font: helvetica, gaya: normal
            doc.setFontSize(12);

            doc.text("BERITA ACARA SERAH TERIMA (BAST)", 70, 20);
            doc.text("PENERIMA BANTUAN PANGAN PEMERINTAH PERWAKILAN", 50, 25);
            doc.text("JANUARI 2025", 95, 30);

            doc.line(10, 40, 200, 40);

            doc.text(
                `${dtt.kode_dtt}`,
                (doc.internal.pageSize.width - doc.getTextWidth(dtt.kode_dtt)) / 2,
                50
            );

            doc.setFont("helvetica", "normal");

            doc.rect(10, 55, 35, 10);
            doc.rect(45, 55, 60, 10);
            //kiribaris1
            doc.rect(105, 55, 35, 10);
            doc.rect(140, 55, 60, 10);
            //kananbaris2
            doc.rect(10, 65, 35, 10);
            doc.rect(45, 65, 60, 10);
            //kiribaris2
            doc.rect(105, 65, 35, 10);
            doc.rect(140, 65, 60, 10);

            doc.setFontSize(10);

            doc.setFont("helvetica", "normal");
            doc.text("Provinsi", 12, 61);
            doc.text("Kabupaten/Kota", 12, 71);

            doc.text("Kecamatan", 107, 61);
            doc.text("Kelurahan/Desa", 107, 71);

            doc.text(`: ${dtt.nama_provinsi}`, 46, 61);
            doc.text(`: ${dtt.nama_kabupaten_kota}`, 46, 71);

            doc.text(`: ${dtt.nama_kecamatan}`, 141, 61);
            doc.text(`: ${dtt.nama_desa_kelurahan}`, 141, 71);

            doc.rect(10, 80, 190, 20);

            //isi tabel pernyataan
            doc.setFontSize(10);
            doc.text(
                "Kami yang bertanda tangan dibawah ini adalah sebagai perwakilan KPM yang ditunjuk oleh aparat setempat",
                12,
                86
            );
            doc.text(
                "menyatakan  dengan sebenar-benarnya bahwa kami telah menerima paket bantuan pangan Pemerintah dengan kondisi",
                12,
                91
            );
            doc.text("dan kualitas baik.", 12, 96);

            doc.rect(10, 105, 10, 20);
            doc.rect(20, 105, 40, 20);
            doc.rect(60, 105, 70, 10);
            doc.rect(60, 115, 35, 10);
            doc.rect(95, 115, 35, 10);
            doc.rect(130, 105, 40, 20);
            doc.rect(170, 105, 30, 20);

            doc.text("No", 12, 115);
            doc.text("Nama KPM", 30, 115);
            doc.text("Berhalangan hadir", 25, 120);
            doc.text("Perwakilan KPM", 82, 112);
            doc.text("Nama Lengkap", 66, 122);
            doc.text("Nomor Telpon", 101, 122);
            doc.text("Sebab Diwakilkan", 136, 115);
            doc.text("Tanda Tangan", 174, 115);
            doc.text("Perwakilan KPM", 172, 120);

            doc.rect(10, 125, 10, 15);
            doc.rect(20, 125, 40, 15);
            doc.rect(60, 125, 35, 15);
            doc.rect(95, 125, 35, 15);
            doc.rect(130, 125, 40, 15);
            doc.rect(170, 125, 30, 15);

            doc.rect(10, 140, 10, 15);
            doc.rect(20, 140, 40, 15);
            doc.rect(60, 140, 35, 15);
            doc.rect(95, 140, 35, 15);
            doc.rect(130, 140, 40, 15);
            doc.rect(170, 140, 30, 15);

            doc.rect(10, 155, 10, 15);
            doc.rect(20, 155, 40, 15);
            doc.rect(60, 155, 35, 15);
            doc.rect(95, 155, 35, 15);
            doc.rect(130, 155, 40, 15);
            doc.rect(170, 155, 30, 15);

            doc.rect(10, 170, 10, 15);
            doc.rect(20, 170, 40, 15);
            doc.rect(60, 170, 35, 15);
            doc.rect(95, 170, 35, 15);
            doc.rect(130, 170, 40, 15);
            doc.rect(170, 170, 30, 15);

            doc.rect(10, 185, 10, 15);
            doc.rect(20, 185, 40, 15);
            doc.rect(60, 185, 35, 15);
            doc.rect(95, 185, 35, 15);
            doc.rect(130, 185, 40, 15);
            doc.rect(170, 185, 30, 15);

            doc.rect(10, 205, 160, 10);
            doc.rect(170, 205, 30, 10);

            doc.text("Jumlah", 12, 211);

            doc.text(
                " Demikian Berita Acara ini dibuat dengan sebenar-benarnya untuk dapat digunakan sebagaimana mestinya.",
                10,
                221
            );

            doc.rect(10, 225, 190, 10);

            doc.text("* Nama Jelas TTD dan Stampel Jika Ada", 12, 231);
            doc.text("KUNINGAN,", 130, 231);

            doc.rect(10, 240, 95, 30);
            doc.rect(105, 240, 95, 30);

            doc.text("Aparat Setempat", 43.5, 247);
            doc.text("PT. Delapan Delapan Logistics", 128.5, 247);

            doc.addImage(
                "/assets/img/logos/footer_bapanas.png",
                10,
                280,
                40,
                10,
                null,
                "FAST"
            );
            doc.addImage(
                "/assets/img/logos/footer_bulog.png",
                35,
                280,
                40,
                10,
                null,
                "FAST"
            );
            doc.addImage(
                "/assets/img/logos/footer_88.png",
                70,
                280,
                40,
                10,
                null,
                "FAST"
            );

            //HALAMAN 4
            doc.addPage("a4", "portrait");

            doc.addImage(
                "/assets/img/logos/footer_88.png",
                10,
                10,
                50,
                20,
                null,
                "FAST"
            );

            doc.setFont("helvetica", "bold"); // Jenis Font: helvetica, gaya: normal
            doc.setFontSize(12);

            doc.text("BERITA ACARA SERAH TERIMA (BAST)", 70, 20);
            doc.text("PENERIMA BANTUAN PANGAN PEMERINTAH PENGGANTI", 50, 25);
            doc.text("JANUARI 2025", 95, 30);

            doc.line(10, 40, 200, 40);

            doc.text(
                `${dtt.kode_dtt}`,
                (doc.internal.pageSize.width - doc.getTextWidth(dtt.kode_dtt)) / 2,
                50
            );

            doc.setFont("helvetica", "normal");

            doc.rect(10, 55, 35, 10);
            doc.rect(45, 55, 60, 10);
            //kiribaris1
            doc.rect(105, 55, 35, 10);
            doc.rect(140, 55, 60, 10);
            //kananbaris2
            doc.rect(10, 65, 35, 10);
            doc.rect(45, 65, 60, 10);
            //kiribaris2
            doc.rect(105, 65, 35, 10);
            doc.rect(140, 65, 60, 10);

            doc.setFontSize(10);

            doc.setFont("helvetica", "normal");
            doc.text("Provinsi", 12, 61);
            doc.text("Kabupaten/Kota", 12, 71);

            doc.text("Kecamatan", 107, 61);
            doc.text("Kelurahan/Desa", 107, 71);

            doc.text(`: ${dtt.nama_provinsi}`, 46, 61);
            doc.text(`: ${dtt.nama_kabupaten_kota}`, 46, 71);

            doc.text(`: ${dtt.nama_kecamatan}`, 141, 61);
            doc.text(`: ${dtt.nama_desa_kelurahan}`, 141, 71);

            doc.rect(10, 80, 190, 20);

            //isi tabel pernyataan
            doc.setFontSize(10);
            doc.text(
                "Kami yang bertanda tangan dibawah ini adalah sebagai pengganti KPM yang ditunjuk oleh aparat setempat",
                12,
                86
            );
            doc.text(
                "menyatakan  dengan sebenar-benarnya bahwa kami telah menerima paket bantuan pangan Pemerintah dengan kondisi",
                12,
                91
            );
            doc.text("dan kualitas baik.", 12, 96);

            doc.rect(10, 105, 10, 20);
            doc.rect(20, 105, 40, 20);
            doc.rect(60, 105, 70, 10);
            doc.rect(60, 115, 35, 10);
            doc.rect(95, 115, 35, 10);
            doc.rect(130, 105, 40, 20);
            doc.rect(170, 105, 30, 20);

            doc.text("No", 12, 115);
            doc.text("Nama KPM", 30, 115);
            doc.text("Berhalangan hadir", 25, 120);
            doc.text("Pengganti KPM", 82, 112);
            doc.text("Nama Lengkap", 66, 122);
            doc.text("Nomor Telpon", 101, 122);
            doc.text("Sebab Penggantian", 135.5, 115);
            doc.text("Tanda Tangan", 174, 115);
            doc.text("Pengganti KPM", 173, 120);

            doc.rect(10, 125, 10, 15);
            doc.rect(20, 125, 40, 15);
            doc.rect(60, 125, 35, 15);
            doc.rect(95, 125, 35, 15);
            doc.rect(130, 125, 40, 15);
            doc.rect(170, 125, 30, 15);

            doc.rect(10, 140, 10, 15);
            doc.rect(20, 140, 40, 15);
            doc.rect(60, 140, 35, 15);
            doc.rect(95, 140, 35, 15);
            doc.rect(130, 140, 40, 15);
            doc.rect(170, 140, 30, 15);

            doc.rect(10, 155, 10, 15);
            doc.rect(20, 155, 40, 15);
            doc.rect(60, 155, 35, 15);
            doc.rect(95, 155, 35, 15);
            doc.rect(130, 155, 40, 15);
            doc.rect(170, 155, 30, 15);

            doc.rect(10, 170, 10, 15);
            doc.rect(20, 170, 40, 15);
            doc.rect(60, 170, 35, 15);
            doc.rect(95, 170, 35, 15);
            doc.rect(130, 170, 40, 15);
            doc.rect(170, 170, 30, 15);

            doc.rect(10, 185, 10, 15);
            doc.rect(20, 185, 40, 15);
            doc.rect(60, 185, 35, 15);
            doc.rect(95, 185, 35, 15);
            doc.rect(130, 185, 40, 15);
            doc.rect(170, 185, 30, 15);

            doc.rect(10, 205, 160, 10);
            doc.rect(170, 205, 30, 10);

            doc.text("Jumlah", 12, 211);

            doc.text(
                " Demikian Berita Acara ini dibuat dengan sebenar-benarnya untuk dapat digunakan sebagaimana mestinya.",
                10,
                221
            );

            doc.rect(10, 225, 190, 10);

            doc.text("* Nama Jelas TTD dan Stampel Jika Ada", 12, 231);
            doc.text("KUNINGAN,", 130, 231);

            doc.rect(10, 240, 95, 30);
            doc.rect(105, 240, 95, 30);

            doc.text("Aparat Setempat", 43.5, 247);
            doc.text("PT. Delapan Delapan Logistics", 128.5, 247);

            doc.addImage(
                "/assets/img/logos/footer_bapanas.png",
                10,
                280,
                40,
                10,
                null,
                "FAST"
            );
            doc.addImage(
                "/assets/img/logos/footer_bulog.png",
                35,
                280,
                40,
                10,
                null,
                "FAST"
            );
            doc.addImage(
                "/assets/img/logos/footer_88.png",
                70,
                280,
                40,
                10,
                null,
                "FAST"
            );
            doc.save(`${dtt.kode_dtt}.pdf`, { compression: "FAST" });
        } catch (error) {
            console.error("Error fetching data:", error);
            setKPM(null);
            setKPM(0);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDFUndangan = async () => {
        setLoading(true);
        let id_dtt = dtt.id_dtt;
        let linkrencanasalur =
            selectedAlokasi?.value === 1 ? "januari" : "februari";
        if (!token) {
            navigate("/");
        }
        try {
            const response = await axios.get(
                `http://localhost:3089/api/v1/${linkrencanasalur}-kpm/download/${id_dtt}`,
                {
                    headers: { Authorization: token },
                }
            );
            setKPM(response.data.data);
            setTotalKPM(response.data.total);

            console.log(response.data.data);

            const today = new Date();
            const tanggalSekarang = today.toISOString().split("T")[0];

            const doc = new jsPDF('potrait', 'mm', 'a5');

            const pageWidth = doc.internal.pageSize.getWidth();

            const data = response.data.data;

            let qr = await generateQRCode(dtt.kode_dtt);
            let idkpm = "";

            for (let i = 0; i < data.length; i++) {
                doc.setFontSize(10);
                doc.setFont("helvetica", "bold");

                doc.text("PT DELAPAN DELAPAN LOGISTICS", pageWidth / 2, 10, null, null, 'center');

                doc.setFontSize(7);
                doc.setFont("helvetica", "normal");
                doc.text("Jl. Raya Sidaraja – Lebaksiuh No. 81 Blok Jati Kidul Dusun Manis RT. 001 RW. 001", pageWidth / 2, 15, null, null, 'center');

                doc.text("Desa Sidaraja Kecamatan Ciawigebang Kabupaten Kuningan – JAWA BARAT (45911)", pageWidth / 2, 18, null, null, 'center');
                doc.text("Kontak Person : WA 082-217-740-459, Email : delapandelapanlogistics@gmail.com", pageWidth / 2, 21, null, null, 'center');

                doc.setFontSize(8)
                doc.setLineWidth(0.5);
                doc.line(10, 25, 138, 25,);

                doc.text(`${dtt.nama_kabupaten_kota}, ${formatDate(tanggalSekarang)}`, pageWidth - 10, 35, { align: 'right' });

                doc.text("Nomor ", 10, 45);
                doc.text(`: ${i + 1}`, 25, 45);
                doc.text("Lampiran", 10, 49);
                doc.text(": -", 25, 49);
                doc.text("Perihal", 10, 53);
                doc.text(": Undangan", 25, 53);

                doc.text("Kepada Yth. ", 80, 45);
                doc.text(`${data[i].nama_lengkap}`, 80, 49);
                doc.text(`${data[i].alamat_lengkap}`, 80, 53);
                doc.text("di", 80, 57);
                doc.text(`${dtt.nama_kabupaten_kota}`, 80, 61);

                doc.text("Mengharap kahadiran Bapak/Ibu/Saudara untuk mengambil Bantuan Pangan Pemerintah berupa 1 (Satu)", 10, 70);
                doc.text("Karung Beras Seberat 10Kg pada :", 10, 74);

                doc.text("Tanggal", 10, 81);
                doc.text(`: ${formatDate(tanggalSekarang)}`, 35, 81);
                doc.text("Jam", 10, 85);
                doc.text(": 08:00 WIB sd Selesai", 35, 85);
                doc.text("Tempat", 10, 89);
                doc.text(`: ${dtt.nama_desa_kelurahan}`, 35, 89);
                doc.text("Keperluan", 10, 93);
                doc.text(`: Mengambil Paket Bantuan Stunting Januari Oktober 2025`, 35, 93);
                doc.text("Persyaratan", 10, 97);
                doc.text(": 1. Membawa Undangan ini", 35, 97);
                doc.text(": 2. Membawa Foto Copy KTP dan KK", 35, 101);

                doc.text("Demikian atas kehadirannya disampaikan terima kasih.", 10, 111);

                idkpm = (data[i].id_kpm).toString();
                qr = await generateQRCode(idkpm);
                doc.addImage(qr, "PNG", 25, 127, 25, 25, null, "FAST");

                doc.text("Hormat Kami,", 100, 126);
                doc.addImage(
                    "/assets/img/logos/footer_88.png",
                    80,
                    130,
                    60,
                    18,
                    null,
                    "FAST"
                );
                doc.text("PT. DELAPAN DELAPAN LOGISTICS", 85, 157);

                if (i == data.length - 1) {
                    console.log("terakhir");
                } else {
                    doc.addPage();
                }

            }
            doc.save(`UNDANGAN - ${dtt.kode_dtt}.pdf`, { compression: "FAST" });
        } catch (error) {
            console.error("Error fetching data:", error);
            setKPM(null);
            setKPM(0);
        } finally {
            setLoading(false);
        }
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
            {currentView === 'index' && (
                <>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <div className="divider text-start fw-bold">
                                    <div className="divider-text">
                                        <span className="menu-header-text fs-6">
                                            Data Rencana Salur
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
                                untuk menambahkan Rencana Salur.
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
                            <label htmlFor="id_provinsi" className="form-label">
                                Provinsi
                            </label>
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
                            <label htmlFor="id_kabupaten_kota" className="form-label">
                                Kabupaten/Kota
                            </label>
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
                            <label htmlFor="id_kecamatan" className="form-label">
                                Kecamatan
                            </label>
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
                            <label htmlFor="id_dtt" className="form-label">
                                Desa/Kelurahan
                            </label>
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
                            <label htmlFor="kode_dtt" className="form-label">
                                Kode DTT
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                id="kode_dtt"
                                name="kode_dtt"
                                placeholder="Kode DTT"
                                value={dtt.kode_dtt}
                                required
                                readOnly
                            />
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">
                                Proses
                            </label>
                            <button onClick={downloadPDF} className="btn btn-primary w-100">
                                DOWNLOAD DTT
                            </button>
                        </div>
                        <div className="col-md-3 col-sm-12 mb-3">
                            <label htmlFor="" className="form-label">
                                Proses
                            </label>
                            <button onClick={downloadPDFUndangan} className="btn btn-primary w-100">
                                DOWNLOAD UNDANGAN
                            </button>
                        </div>
                        <div className="col-lg-12 mt-3">
                            <DataTable
                                columns={columns}
                                data={data}
                                pagination
                                paginationServer
                                paginationTotalRows={totalRecords}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={(newPerPage) => setLimit(newPerPage)}
                                currentPage={currentPage}
                                highlightOnHover
                                striped
                                progressPending={loading}
                                progressComponent={<span>Loading...</span>}
                                customStyles={customStyles}
                            />
                        </div>
                    </div>
                </>
            )}
            {currentView === 'upload' && <UploadlPage handleBackClick={handleBackClick} />}
        </div>
    );
};

export default IndexPage;
