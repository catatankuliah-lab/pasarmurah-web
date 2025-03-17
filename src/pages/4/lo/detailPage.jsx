import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Select from "react-select";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";


const DetailPage = ({
  detailId,
  handleBackClick,
}) => {

  // Data dari localstorage
  const token = localStorage.getItem("token");
  const id_kantor = localStorage.getItem("id_kantor");
  // const id_user = localStorage.getItem("id_user");
  // const nama_kantor = localStorage.getItem("nama_kantor");

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

  const [formDataMuatan, setFormDataMuatan] = useState({
    id_item_lo: "",
    id_lo: "",
    id_kabupaten_kota: "",
    titik_bongkar: "",
    beras: "",
    minyak: "",
    terigu: "",
    gula: "",
  });

  const [lo, setLO] = useState(null);

  const fetchLO = async () => {
    try {
      const response = await axios.get(`http://localhost:3091/api/v1/lo/${detailId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLO(response.data.data);
    } catch (error) {
      console.log(error);
      setLO([]);
    }
  };

  useEffect(() => {
    if (detailId) {
      fetchLO();
      fetchKabupaten();
      fetchItemLO();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailId]);

  useEffect(() => {
    if (lo) {
      setFormData((prevData) => ({
        ...prevData,
        nomor_lo: lo.nomor_lo || prevData.nomor_lo,
        tanggal_lo: lo.tanggal_lo || prevData.tanggal_lo,
        titik_muat: lo.titik_muat || prevData.titik_muat,
        jenis_mobil: lo.jenis_mobil || prevData.jenis_mobil,
        nopol_mobil: lo.nopol_mobil || prevData.nopol_mobil,
        nama_driver: lo.nama_driver || prevData.nama_driver,
        telpon_driver: lo.telpon_driver || prevData.telpon_driver,
      }));
    }
  }, [lo]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const dataLOtoSubmit = new FormData();
    dataLOtoSubmit.append("id_kantor", id_kantor);
    dataLOtoSubmit.append("nomor_lo", formData.nomor_lo);
    dataLOtoSubmit.append("tanggal_lo", formData.tanggal_lo);
    dataLOtoSubmit.append("titik_muat", formData.titik_muat);
    dataLOtoSubmit.append("jenis_mobil", formData.jenis_mobil);
    dataLOtoSubmit.append("nopol_mobil", formData.nopol_mobil);
    dataLOtoSubmit.append("nama_driver", formData.nama_driver);
    dataLOtoSubmit.append("telpon_driver", formData.telpon_driver);
    dataLOtoSubmit.append("file_lo", "pasar.pdf");
    dataLOtoSubmit.append("status_lo", "DIBUAT");
    try {
      await axios.put(
        `http://localhost:3091/api/v1/lo/${detailId}`,
        dataLOtoSubmit,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        title: "Data Loading Order",
        text: "Data Berhasil Diperbaharui",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        fetchLO();
        fetchItemLO();
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data. Silakan coba lagi.",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };
  const [muatan, setMuatan] = useState([]);
  const [muatanOption, setMuatanOption] = useState([]);
  const [selectedMuatan, setSelectedMuatan] = useState(null);

  const fetchKabupaten = async () => {
    try {
      const response = await axios.get('http://localhost:3091/api/v1/kabupaten-kota', {
        headers: {
          Authorization: token
        }
      });
      if (response.data.data.length != 0) {
        const datafetch = response.data.data.map(dataitem => ({
          value: dataitem.id_kabupaten_kota,
          label: dataitem.nama_kabupaten_kota,
        }));
        setMuatanOption(datafetch);
      } else {
        setMuatanOption([]);
      }
    } catch (error) {
      console.log(error);
      setMuatanOption([]);
    }
  };

  const handleMuatanChange = (selectedOption) => {
    setSelectedMuatan(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      id_kabupaten_kota: selectedOption.value
    }));
  };


  const fetchItemLO = async () => {
    try {
      const response = await axios.get(`http://localhost:3091/api/v1/muatan/lo/${detailId}`, {
        headers: {
          Authorization: token
        }
      });
      if (response.data.data.length !== 0) {
        const datafetch = response.data.data.map(dataitem => ({
          id_item_lo: dataitem.id_item_lo,
          id_kabupaten_kota: dataitem.id_kabupaten_kota,
          nama_kabupaten_kota: dataitem.nama_kabupaten_kota,
          titik_bongkar: dataitem.titik_bongkar,
          beras: dataitem.beras,
          minyak: dataitem.minyak,
          terigu: dataitem.terigu,
          gula: dataitem.gula,
          nomor_lo: dataitem.nomor_lo,
          tanggal_lo: dataitem.tanggal_lo,
          titik_muat: dataitem.titik_muat,
          nama_driver: dataitem.nama_driver,
          nopol_mobil: dataitem.nopol_mobil,
          telpon_driver: dataitem.telpon_driver
        }));
        setMuatan(datafetch);
      } else {
        setMuatan([]);
      }
    } catch (error) {
      console.log(error);
      setMuatan([]);
    }
  };

  const handleUpdateMuatan = async (event) => {
    event.preventDefault();
    const dataMuatantoSubmit = new FormData();
    dataMuatantoSubmit.append("id_lo", detailId);
    dataMuatantoSubmit.append("id_kabupaten_kota", selectedMuatan?.value || "");
    dataMuatantoSubmit.append("titik_bongkar", formDataMuatan.titik_bongkar || "");
    dataMuatantoSubmit.append("beras", formDataMuatan.beras || "0");
    dataMuatantoSubmit.append("minyak", formDataMuatan.minyak || "0");
    dataMuatantoSubmit.append("terigu", formDataMuatan.terigu || "0");
    dataMuatantoSubmit.append("gula", formDataMuatan.gula || "0");
    try {
      await axios.post(
        `http://localhost:3091/api/v1/muatan`,
        dataMuatantoSubmit,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        title: "Data Item LO",
        text: "Data Berhasil Diperbaharui",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        fetchItemLO();
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data. Silakan coba lagi.",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  const handleDelete = async (id_item_lo) => {
    try {
      await axios.delete(`http://localhost:3091/api/v1/muatan/${id_item_lo}`, {
        headers: { Authorization: token },
      });
      Swal.fire({
        title: "Data Item Rencana Salur",
        text: "Data Berhasil Dihapus",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      })
        .then(() => fetchItemLO());
    } catch (error) {
      console.error("Error deleting data:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data. Silakan coba lagi.",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${day}/${month}/${year}`;
  };

  const downloadPDF = async () => {
    const doc = new jsPDF('landscape', 'mm', 'a5');
    let maxWidthTibong = 69;
    let maxWidthTibongSJ = 50;

    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.addImage("../../../assets/ald.png", "PNG", 10, 5, 17, 15, null, 'FAST');
    doc.addImage("../../../assets/Pos.png", "PNG", 185, 5, 15, 15, null, 'FAST');

    doc.text("BERITA ACARA SERAH TERIMA BARANG GUDANG", pageWidth / 2, 10, { align: "center" });
    doc.text("BANTUAN OPERASI PASAR MURAH 2025", pageWidth / 2, 15, { align: "center" });
    doc.text(`NOMOR LO : ${lo.nomor_lo}`, pageWidth / 2, 20, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);

    doc.rect(10, 25.5, 37.5, 5);
    doc.rect(47.5, 25.5, 57.5, 5);
    doc.rect(105, 25.5, 37.5, 5);
    doc.rect(142.5, 25.5, 57.5, 5);

    doc.text("Tanggal", 12, 29);
    doc.text(`: ${formatDate(lo.tanggal_lo)}`, 49.5, 29);
    doc.text("Nama Driver", 107, 29);
    doc.text(`: ${lo.nama_driver}`, 144.5, 29);

    doc.rect(10, 30.5, 37.5, 5);
    doc.rect(47.5, 30.5, 57.5, 5);
    doc.rect(105, 30.5, 37.5, 5);
    doc.rect(142.5, 30.5, 57.5, 5);

    doc.text("Gudang Muat", 12, 34);
    doc.text(`: ${lo.titik_muat}`, 49.5, 34);
    doc.text("NOPOL", 107, 34);
    doc.text(`: ${lo.nopol_mobil}`, 144.5, 34);

    doc.rect(10, 40.5, 10, 7);
    doc.rect(20, 40.5, 72, 7);
    doc.rect(92, 40.5, 23, 7);
    doc.rect(115, 40.5, 23, 7);
    doc.rect(138, 40.5, 23, 7);
    doc.rect(161, 40.5, 23, 7);
    doc.rect(184, 40.5, 16.5, 7);

    doc.text("No.", 15, 45, { align: "center" });
    doc.text("Titik Drop", 56, 45, { align: "center" });
    doc.text("Beras", 103, 45, { align: "center" });
    doc.text("Minyak", 126, 45, { align: "center" });
    doc.text("Terigu", 149, 45, { align: "center" });
    doc.text("Gula", 172, 45, { align: "center" });
    doc.text("Ket", 192, 45, { align: "center" });

    doc.rect(10, 47.7, 10, 40);
    doc.rect(20, 47.7, 72, 40);
    doc.rect(92, 47.7, 23, 40);
    doc.rect(115, 47.7, 23, 40);
    doc.rect(138, 47.7, 23, 40);
    doc.rect(161, 47.7, 23, 40);
    doc.rect(184, 47.7, 16.5, 40);

    let yText1 = 52;
    let yText2 = 57;

    muatan.forEach((drop, index) => {
      doc.text(`${index+1}.`, 15, yText1, { align: "center" });
      let textTitikBongkar = `${drop.nama_kabupaten_kota} (${drop.titik_bongkar})`;
      let titikBongkarWrapped = doc.splitTextToSize(textTitikBongkar, maxWidthTibong);
      doc.text(titikBongkarWrapped, 22, yText1, { align: "left" });
      doc.text(`${drop.beras} Pcs`, 103, yText1, { align: "center" });
      doc.text(`(${drop.beras * 5} Kg)`, 103, yText2, { align: "center" });
      doc.text(`${drop.minyak} Pcs`, 126, yText1, { align: "center" });
      doc.text(`(${drop.minyak * 2} Ltr)`, 126, yText2, { align: "center" });
      doc.text(`${drop.terigu} Pcs`, 149, yText1, { align: "center" });
      doc.text(`(${drop.terigu} Kg)`, 149, yText2, { align: "center" });
      doc.text(`${drop.gula} Pcs`, 172, yText1, { align: "center" });
      doc.text(`(${drop.gula} Kg)`, 172, yText2, { align: "center" });
      doc.text("SESUAI", 192, yText1, { align: "center" });
      yText1 = yText1 + 11;
      yText2 = yText2 + 11;
    });

    doc.rect(10, 92.5, 63.3, 12);
    doc.rect(73.3, 92.5, 63.3, 12);
    doc.rect(136.6, 92.5, 63.4, 12);

    doc.text("Diserahkan Oleh", 42.5, 97, { align: "center" });
    doc.text("Admin Gudang", 42.5, 102, { align: "center" });

    doc.text("Diverifikasi Oleh", 105, 97, { align: "center" });
    doc.text("PT. POS Indonesia", 105, 102, { align: "center" });

    doc.text("Diterima Oleh", 169, 97, { align: "center" });
    doc.text("Driver", 169, 102, { align: "center" });

    doc.rect(10, 104.5, 63.3, 23);
    doc.rect(73.3, 104.5, 63.3, 23);
    doc.rect(136.6, 104.5, 63.4, 23);

    doc.rect(10, 127.5, 63.3, 10);
    doc.rect(73.3, 127.5, 63.3, 10);
    doc.rect(136.6, 127.5, 63.4, 10);

    doc.text(`${lo.nama_driver}`, 169, 133.5, { align: "center" });

    muatan.forEach((drop, index) => {
      doc.addPage();
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.addImage("../../../assets/ald.png", "PNG", 10, 5, 17, 15, null, 'FAST');
      doc.addImage("../../../assets/Pos.png", "PNG", 185, 5, 15, 15, null, 'FAST');

      doc.text("SURAT JALAN", pageWidth / 2, 10, { align: "center" });
      doc.text("BANTUAN OPERASI PASAR MURAH 2025", pageWidth / 2, 15, { align: "center" });
      doc.text(`NOMOR SURAT : ${drop.nomor_lo}-${index+1}`, pageWidth / 2, 20, { align: "center" });

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);

      doc.rect(10, 25.5, 37.5, 5);
      doc.rect(47.5, 25.5, 57.5, 5);
      doc.rect(105, 25.5, 37.5, 5);
      doc.rect(142.5, 25.5, 57.5, 5);

      doc.text("Nomor LO", 12, 29);
      doc.text(`: ${drop.nomor_lo}`, 49.5, 29);
      doc.text("Nama Driver", 107, 29);
      doc.text(`: ${drop.nama_driver}`, 144.5, 29);

      doc.rect(10, 30.5, 37.5, 5);
      doc.rect(47.5, 30.5, 57.5, 5);
      doc.rect(105, 30.5, 37.5, 5);
      doc.rect(142.5, 30.5, 57.5, 5);

      doc.text("Tanggal", 12, 34);
      doc.text(`: ${formatDate(drop.tanggal_lo)}`, 49.5, 34);
      doc.text("NOPOL", 107, 34);
      doc.text(`: ${drop.nopol_mobil}`, 144.5, 34);

      doc.rect(10, 35.5, 37.5, 5);
      doc.rect(47.5, 35.5, 57.5, 5);
      doc.rect(105, 35.5, 37.5, 5);
      doc.rect(142.5, 35.5, 57.5, 5);

      doc.text("Gudang Muat", 12, 39);
      doc.text(`: ${drop.titik_muat}`, 49.5, 39);
      doc.text("No.Hp Driver", 107, 39);
      doc.text(`: ${drop.telpon_driver}`, 144.5, 39);

      doc.rect(10, 40.5, 37.5, 5);
      doc.rect(47.5, 40.5, 57.5, 5);
      doc.rect(105, 40.5, 37.5, 5);
      doc.rect(142.5, 40.5, 57.5, 5);

      doc.text("Kabupaten/Kota", 12, 44);
      doc.text(`: ${drop.nama_kabupaten_kota}`, 49.5, 44);
      doc.text("Nama PIC", 107, 44);
      doc.text(": ", 144.5, 44);

      doc.rect(10, 50.5, 10, 7);
      doc.rect(20, 50.5, 52, 7);
      doc.rect(72, 50.5, 23, 7);
      doc.rect(95, 50.5, 23, 7);
      doc.rect(118, 50.5, 23, 7);
      doc.rect(141, 50.5, 23, 7);
      doc.rect(164, 50.5, 36.5, 7);

      doc.text("No.", 15, 55, { align: "center" });
      doc.text("Titik Drop", 46, 55, { align: "center" });
      doc.text("Beras", 83, 55, { align: "center" });
      doc.text("Minyak", 106, 55, { align: "center" });
      doc.text("Terigu", 129, 55, { align: "center" });
      doc.text("Gula", 152, 55, { align: "center" });
      doc.text("TTD & Nama Jelas", 182, 55, { align: "center" });

      doc.rect(10, 57.7, 10, 30);
      doc.rect(20, 57.7, 52, 30);
      doc.rect(72, 57.7, 23, 30);
      doc.rect(95, 57.7, 23, 30);
      doc.rect(118, 57.7, 23, 30);
      doc.rect(141, 57.7, 23, 30);
      doc.rect(164, 57.7, 36.5, 30);

      doc.text("1.", 15, 62, { align: "center" });
      let titikBongkarWrapped = doc.splitTextToSize(drop.titik_bongkar, maxWidthTibongSJ);
      doc.text(titikBongkarWrapped, 22, 62, { align: "left" });
      doc.text(`${drop.beras} Pcs`, 83, 62, { align: "center" });
      doc.text(`(${drop.beras*5} Kg)`, 83, 67, { align: "center" });
      doc.text(`${drop.minyak} Pcs`, 106, 62, { align: "center" });
      doc.text(`(${drop.minyak * 2} Ltr)`, 106, 67, { align: "center" });
      doc.text(`${drop.terigu} Pcs`, 129, 62, { align: "center" });
      doc.text(`(${drop.terigu} Kg)`, 129, 67, { align: "center" });
      doc.text(`${drop.gula} Pcs`, 153, 62, { align: "center" });
      doc.text(`(${drop.gula} Kg)`, 153, 67, { align: "center" });

      doc.rect(10, 92.5, 95, 12);
      doc.rect(105, 92.5, 95, 12);

      doc.text("Diserahkan Oleh", 57.5, 97, { align: "center" });
      doc.text("Admin Gudang", 57.5, 102, { align: "center" });

      doc.rect(10, 104.5, 95, 23);
      doc.rect(105, 104.5, 95, 23);

      doc.text("Diserahkan Oleh", 153, 97, { align: "center" });
      doc.text("Admin/PIC/Driver", 153, 102, { align: "center" });

      doc.rect(10, 127.5, 95, 10);
      doc.rect(105, 127.5, 95, 10);

      doc.text(`${drop.nama_driver}`, 153, 132, { align: "center" });
      doc.text(`${drop.telpon_driver}`, 153, 136, { align: "center" });

      doc.addPage();
      doc.addImage("../../../assets/ald.png", "PNG", 10, 5, 17, 15, null, 'FAST');
      doc.addImage("../../../assets/Pos.png", "PNG", 185, 5, 15, 15, null, 'FAST');
      doc.setFont("Helvetica", "bold");
      doc.text("BERITA ACARA SERAH TERIMA PENDISTRIBUSIAN", pageWidth / 2, 10, { align: "center" });
      doc.text("BANTUAN OPERASI PASAR MURAH 2025", pageWidth / 2, 15, { align: "center" });
      doc.text(`NOMOR SURAT : BASTP-${drop.nomor_lo}-${index + 1}`, pageWidth / 2, 20, { align: "center" });
      doc.setFont("Helvetica", "normal");
      let tanggalSekarang = new Date().getDate();
      let bulanSekarang = new Date().getMonth();
      let namaBulan = bulanIndo[bulanSekarang];
      let tahunSekarang = new Date().getFullYear();
      doc.text(`Pada hari ini, Tanggal ${tanggalSekarang} Bulan ${namaBulan} Tahun ${tahunSekarang}, Saya yang bertandatangan dibawah ini : `, 10, 30, { align: "left" });
      doc.text(`PIHAK I       : _____________________`, 10, 37, { align: "left" });
      doc.text(`Bertindak untuk dan atas nama PT. POS INDONESIA (PERSERO) KC._____________________`, 10, 44, { align: "left" });
      doc.text(`PIHAK II       : _____________________`, 10, 51, { align: "left" });
      doc.text(`Bertindak untuk dan atas nama Petugas Tiik Bagi ${drop.titik_bongkar}`, 10, 58, { align: "left" });
      let maxWidthBASTP = 190;
      let textTitikKeterangan = `PIHAK I telah mendistribusikan (Mengirimkan) Bantuan Operasi Pasar Subsidi melalui Driver ${drop.nama_driver} dengan Nopol Kendaraan ${drop.nopol_mobil} kepada PIHAK II`;
      let items = [];
      if (drop.beras > 0) {
        items.push(`${drop.beras} Pcs Beras dalam kemasan 5 Kg dengan total ${drop.beras * 5} Kg Beras`);
      }
      if (drop.minyak > 0) {
        items.push(`${drop.minyak} Pcs Minyak dalam kemasan 2 Liter dengan total ${drop.minyak * 2} Liter Minyak`);
      }
      if (drop.terigu > 0) {
        items.push(`${drop.terigu} Pcs Terigu dalam kemasan 1 Kg dengan total ${drop.terigu * 1} Kg Terigu`);
      }
      if (drop.gula > 0) {
        items.push(`${drop.gula} Pcs Gula dalam kemasan 1 Kg dengan total ${drop.gula * 1} Kg Gula`);
      }
      if (items.length > 0) {
        textTitikKeterangan += " sebanyak " + items.join(", ");
      }
      textTitikKeterangan += ` dalam keadaan baik. Adapun jika dikemudian hari terdapat kekurangan, kerusakan, dan atau bantuan tersebut ditemukan diperjualbelikan, dan seterusnya, akan menjadi tanggungjawab PIHAK II.`;
      let textKeteranganWrapped = doc.splitTextToSize(textTitikKeterangan, maxWidthBASTP);
      doc.text(textKeteranganWrapped, 10, 63, { align: "left" });
      let textHeight = doc.getTextDimensions(textKeteranganWrapped).h;
      let nextY = 63 + textHeight + 3;
      doc.text(`Demikian Berita Serah Terima ini dibuat untuk digunakan sebagaimana mestinya.`, 10, nextY, { align: "left" });
      nextY = nextY + 8;
      doc.text(`${drop.nama_kabupaten_kota}, ${tanggalSekarang} ${namaBulan} ${tahunSekarang}`, 200, nextY, { align: "right" });
      nextY = nextY + 8;
      doc.text("PIHAK I", 42.5, nextY, { align: "center" });
      doc.text("Mengetahui", 105, nextY, { align: "center" });
      doc.text("PIHAK II", 169, nextY, { align: "center" });
      nextY = nextY + 32;
      doc.text("__________________________", 42.5, nextY,{ align: "center" });
      doc.text("__________________________", 105, nextY, { align: "center" });
      doc.text("__________________________", 169, nextY, { align: "center" });
    });

    doc.save(`${lo.nomor_lo}.pdf`, {
      compression: "FAST",
    });

  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="mb-3">
          <div className="divider text-start fw-bold">
            <div className="divider-text">
              <span className="menu-header-text fs-6">
                Detail LO
              </span>
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
          untuk kembali ke menu utama LO.
        </div>
      </div>
      <div className="col-md-12 mt-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <div className="divider text-start">
                <div className="divider-text">
                  <span className="menu-header-text fs-6">Informasi LO</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="nomor_lo" className="form-label">Nomor LO</label>
            <input className="form-control" type="text" id="nomor_lo" name='nomor_lo' placeholder="88LOG-PO0000-000" onChange={handleChange} required readOnly value={formData.nomor_lo || ""} />
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="tanggal_lo" className="form-label">Tanggal LO</label>
            <input className="form-control text-uppercase" type="date" id="tanggal_lo" name='tanggal_lo' placeholder="" onChange={handleChange}
              value={formData.tanggal_lo || ""}
              required />
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="titik_muat" className="form-label">Titik Muat</label>
            <input className="form-control" type="text" id="titik_muat" name='titik_muat' placeholder="" onChange={handleChange} required value={formData.titik_muat || ""} />
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="jenis_mobil" className="form-label">Jenis Mobil</label>
            <input className="form-control" type="text" id="jenis_mobil" name='jenis_mobil' placeholder="" onChange={handleChange} required value={formData.jenis_mobil || ""} />
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="nopol_mobil" className="form-label">Nopol Mobil</label>
            <input className="form-control" type="text" id="nopol_mobil" name='nopol_mobil' placeholder="" onChange={handleChange} required value={formData.nopol_mobil || ""} />
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="nama_driver" className="form-label">Nama Driver</label>
            <input className="form-control" type="text" id="nama_driver" name='nama_driver' placeholder="" onChange={handleChange} required value={formData.nama_driver || ""} />
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="telpon_driver" className="form-label">Telpon Driver</label>
            <input className="form-control" type="text" id="telpon_driver" name='telpon_driver' placeholder="" onChange={handleChange} required value={formData.telpon_driver || ""} />
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

          <div className='row' >
            <div className="col-lg-12">
              <div className="mb-3">
                <div className="divider text-start">
                  <div className="divider-text">
                    <span className="menu-header-text fs-6">Rencana Muatan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {formDataMuatan && (
            <div className='row' >
              <div className="col-md-3 col-sm-12 col-sm-12 mb-3">
                <label htmlFor="id_kabupaten_kota" className="form-label">Kabupaten</label>
                <Select
                  id="id_kabupaten_kota"
                  name="id_kabupaten_kota"
                  value={selectedMuatan}
                  onChange={handleMuatanChange}
                  options={muatanOption}
                  placeholder="Pilih Kabupaten"
                  required
                />
              </div>
              <div className="col-md-3 col-sm-12 mb-3">
                <label htmlFor="Titik Bongkar" className="form-label">Titik Bongkar</label>
                <input className="form-control text-uppercase" type="text" id="titik_bongkar" name="titik_bongkar" placeholder="titik bongkar" required value={formDataMuatan.titik_bongkar} onChange={(e) => setFormDataMuatan({ ...formDataMuatan, titik_bongkar: e.target.value })} />
              </div>
              <div className="col-md-3 col-sm-12 mb-3">
                <label htmlFor="beras" className="form-label">Beras</label>
                <input className="form-control text-uppercase" type="text" id="beras" name="beras" placeholder="beras" required value={formDataMuatan.beras} onChange={(e) => setFormDataMuatan({ ...formDataMuatan, beras: e.target.value })} />
              </div>
              <div className="col-md-3 col-sm-12 mb-3">
                <label htmlFor="minyak" className="form-label">Minyak</label>
                <input className="form-control text-uppercase" type="text" id="minyak" name="minyak" placeholder="Minyak" required value={formDataMuatan.minyak} onChange={(e) => setFormDataMuatan({ ...formDataMuatan, minyak: e.target.value })} />
              </div>
              <div className="col-md-3 col-sm-12 mb-3">
                <label htmlFor="terigu" className="form-label">Terigu</label>
                <input className="form-control text-uppercase" type="text" id="terigu" name="terigu" placeholder="Terigu" required value={formDataMuatan.terigu} onChange={(e) => setFormDataMuatan({ ...formDataMuatan, terigu: e.target.value })} />
              </div>
              <div className="col-md-3 col-sm-12 mb-3">
                <label htmlFor="gula" className="form-label">Gula</label>
                <input className="form-control text-uppercase" type="text" id="gula" name="gula" placeholder="Gula" required value={formDataMuatan.gula} onChange={(e) => setFormDataMuatan({ ...formDataMuatan, gula: e.target.value })} />
              </div>
            </div>
          )}
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="" className="form-label">
              Proses
            </label>
            <button
              type="button"
              onClick={handleUpdateMuatan}
              className="btn btn-primary w-100"
            >
              SIMPAN DATA
            </button>
          </div>
          <div className="col-md-3 col-sm-12 mb-3">
            <label htmlFor="" className="form-label">
              Proses
            </label>
            <button
              type="button"
              onClick={downloadPDF}
              className="btn btn-primary w-100"
            >
              DOWNLOAD
            </button>
          </div>
          <div className="col-lg-12 mt-2">
            <div className="mb-3">
              <div className="divider text-start">
                <div className="divider-text">
                  <span className="menu-header-text fs-6">
                    Item Rencana Muatan
                  </span>
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
                    <th>Kabupaten</th>
                    <th>Titik Bongkar</th>
                    <th>Beras</th>
                    <th>Minyak</th>
                    <th>Terigu</th>
                    <th>Gula</th>
                    <th>Proses</th>
                  </tr>
                </thead>
                <tbody>
                  {muatan.length > 0 ? (
                    muatan.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.nama_kabupaten_kota}</td>
                        <td>{item.titik_bongkar}</td>
                        <td>{item.beras} ({(item.beras * 5)} Kg)</td>
                        <td>{item.minyak} ({(item.minyak * 2)} Lt)</td>
                        <td>{item.terigu} ({(item.terigu * 1)} Kg)</td>
                        <td>{item.gula} ({(item.gula * 1)} Kg)</td>
                        <td className="text-center">
                          <button onClick={() => handleDelete(item.id_item_lo)} className="border-0 bg-transparent text-danger">
                            <i className="bx bx-minus-circle"></i>
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
        </div>
      </div>
    </div>
  );
};

DetailPage.propTypes = {
  handlePageChanges: PropTypes.func.isRequired,
  detailId: PropTypes.number.isRequired,
  handleBackClick: PropTypes.func.isRequired
};

export default DetailPage;
