import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Select from "react-select";
import Swal from "sweetalert2";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { XCircle } from "lucide-react";


const DetailPage = ({
  handlePageChanges,
  detailId,
  handleBackClick,
  alokasiInit,
}) => {
  const inputRef = useRef(null);

  // Data dari localstorage
  const token = localStorage.getItem("token");
  const id_kantor = localStorage.getItem("id_kantor");
  const id_user = localStorage.getItem("id_user");
  const nama_kantor = localStorage.getItem("nama_kantor");

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

  const [ietmRencanaSalur, setIetmRencanaSalur] = useState([]);

  const [alokasiOption, setAlokasiOption] = useState([]);
  const [selectedAlokasi, setSelectedAlokasi] = useState(null);

  const [provinsiOption, setProvinsiOption] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);

  const [kabupatenOption, setKabupatenOption] = useState([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");

  const [kecamatanOption, setKecamatanOption] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  const [desaKelurahanOption, setDesaKelurahanOption] = useState([]);
  const [selectedDesaKelurahan, setSelectedDesaKelurahan] = useState(null);

  const [gudangOption, setGudangOption] = useState([]);
  const [selectedGudang, setSelectedGudang] = useState(null);

  const [dtt, setDTT] = useState(0);
  const [lo, setLO] = useState(null);
  useEffect(() => {
    const fetchLO = async () => {
      console.log(detailId);
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
        title: "Data LO",
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
        text: "Gagal memperbarui data. Silakan coba lagi.",
        icon: "error",
        showConfirmButton: true,
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

  const handleChangeQuillMuatan = (value) => {
    setFormDataMuatan((prevData) => ({
      ...prevData,
      titik_bongkar: value,
    }));
  };

  const fetchItemLO = async () => {
    if (!token) {
      navigate('/');
    }
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
          gula: dataitem.gula
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
    dataMuatantoSubmit.append("beras", formDataMuatan.beras || "");
    dataMuatantoSubmit.append("minyak", formDataMuatan.minyak || "");
    dataMuatantoSubmit.append("terigu", formDataMuatan.terigu || "");
    dataMuatantoSubmit.append("gula", formDataMuatan.gula || "");
    console.log([...dataMuatantoSubmit.entries()]);
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
        text: "Data Berhasil Ditambahkan",
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
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${day}/${month}/${year}`;
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
    const doc = new jsPDF("landscape", "mm", "a4");

    // Generate QR Code
    let qr = await generateQRCode(ietmRencanaSalur[0].kode_rencana_salur);

    doc.addImage(qr, "PNG", 7, 7, 25, 25, null, "FAST");

    // Menambahkan teks di tengah halaman

    const pageWidth = doc.internal.pageSize.getWidth(); // Lebar halaman
    const pageHeight = doc.internal.pageSize.getHeight(); // Tinggi halaman

    // Menambahkan teks yang diatur di tengah halaman
    doc.setFontSize(12); // Mengatur ukuran font menjadi 8 (ukuran standar jsPDF adalah 16)
    doc.setFont("helvetica", "bold");

    doc.text("RENCANA SALUR ", pageWidth / 2, 15, null, null, "center");
    doc.text(
      "PENERIMA BANTUAN PANGAN PEMERINTAH – JANUARI 2025 ",
      pageWidth / 2,
      25,
      null,
      null,
      "center"
    );

    doc.line(10, 35, 285, 35);

    doc.text(
      `${ietmRencanaSalur[0].kode_rencana_salur}`,
      pageWidth / 2,
      43,
      null,
      null,
      "center"
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10); // Mengatur ukuran font menjadi 8 (ukuran standar jsPDF adalah 16)

    doc.text(
      "Kami yang bertanda tangan dibawah adalah sebagai pembuat rencana salur yang menyatakan dengan sebenar – benarnya bahwa kami telah membuat rencana salur.",
      10,
      55,
      null,
      null,
      "left"
    );

    // doc.text("sebenar – benarnya bahwa kami telah membuat rencana salur.", 10, 80, null, null, 'left');

    doc.setFontSize(8);
    // Menambahkan Tabel
    doc.rect(10, 60, 10, 10);
    doc.rect(20, 60, 35, 10);
    doc.rect(55, 60, 35, 10);
    doc.rect(90, 60, 35, 10);
    doc.rect(125, 60, 35, 10);
    doc.rect(160, 60, 39, 10);
    doc.rect(199, 60, 42, 10);
    doc.rect(241, 60, 22, 10);
    doc.rect(263, 60, 22, 10);

    // buat isi tabel header
    doc.text("No.", 12, 66);
    doc.text("Tanggal", 22, 66);
    doc.text("Gudang Bulog", 57, 66);
    doc.text("Provinsi", 92, 66);
    doc.text("Kabupaten", 127, 66);
    doc.text("Kecamatan", 162, 66);
    doc.text("Desa/Kelurahan", 201, 66);
    doc.text("KPM", 260, 66, { align: "right" });
    doc.text("Kg", 282, 66, { align: "right" });

    let tableY = 70;
    let textY = 76;
    let pageY = 70;
    let namaDesa = "";
    let namaDesa1 = "";
    let namaDesa2 = "";

    for (let i = 0; i < ietmRencanaSalur.length; i++) {
      console.log(`nomor ${i + 1} : ${tableY}`);

      // Menambahkan Tabel
      doc.rect(10, tableY, 10, 10);
      doc.rect(20, tableY, 35, 10);
      doc.rect(55, tableY, 35, 10);
      doc.rect(90, tableY, 35, 10);
      doc.rect(125, tableY, 35, 10);
      doc.rect(160, tableY, 39, 10);
      doc.rect(199, tableY, 42, 10);
      doc.rect(241, tableY, 22, 10);
      doc.rect(263, tableY, 22, 10);

      // buat isi tabel
      doc.text(`${i + 1}`, 12, textY);
      doc.text(
        `${formatDate(ietmRencanaSalur[i].tanggal_rencana_salur)}`,
        22,
        textY
      );
      doc.text(`${ietmRencanaSalur[i].nama_gudang}`, 57, textY);
      doc.text(`${ietmRencanaSalur[i].nama_provinsi}`, 92, textY);
      doc.text(`${ietmRencanaSalur[i].nama_kabupaten_kota}`, 127, textY);
      doc.text(`${ietmRencanaSalur[i].nama_kecamatan}`, 162, textY);

      namaDesa = ietmRencanaSalur[i].nama_desa_kelurahan;
      if (doc.getTextWidth(namaDesa) <= 30) {
        namaDesa1 = namaDesa.substring(0, 30);

        doc.text(`${namaDesa1}`, 201, textY);
        doc.text(`${namaDesa2}`, 201, textY);
      } else {
        namaDesa1 = namaDesa.substring(0, 30);
        namaDesa2 = namaDesa.substring(31, 60);

        doc.text(`${namaDesa1}`, 201, textY - 1.5);
        doc.text(`${namaDesa2}`, 201, textY + 1.5);
      }

      doc.text(
        `${ietmRencanaSalur[i].kpm_jumlah.toLocaleString("id-ID")}`,
        260,
        textY,
        {
          align: "right",
        }
      );
      doc.text(
        `${(ietmRencanaSalur[i].kpm_jumlah * 10).toLocaleString("id-ID")}`,
        282,
        textY,
        { align: "right" }
      );
      if (i + 1 == ietmRencanaSalur.length) {
        //tabel total
        doc.rect(10, tableY + 10, 231, 10);
        doc.rect(241, tableY + 10, 22, 10);
        doc.rect(263, tableY + 10, 22, 10);
        // total
        doc.setFont("helvetica", "bold");
        doc.text("Total :", 12, textY + 11);
        doc.text(`${totalOverall.toLocaleString("id-ID")}`, 260, textY + 11, {
          align: "right",
        });
        doc.text(
          `${(totalOverall * 10).toLocaleString("id-ID")}`,
          282,
          textY + 11,
          {
            align: "right",
          }
        );
      }
      textY = textY + 10;
      tableY = tableY + 10;
    }

    // tabel ttd
    doc.setFont("helvetica", "normal");

    doc.rect(10, 145, 91.6, 15);
    doc.rect(101.6, 145, 91.6, 15);
    doc.rect(193.2, 145, 91.6, 15);
    doc.rect(10, 160, 91.6, 30);
    doc.rect(101.6, 160, 91.6, 30);
    doc.rect(193.2, 160, 91.6, 30);
    doc.rect(10, 190, 91.6, 15);
    doc.rect(101.6, 190, 91.6, 15);
    doc.rect(193.2, 190, 91.6, 15);

    // ttd
    doc.text("Diserahkan Oleh", 55, 151, { align: "center" });
    doc.text("Diverifikasi Oleh", 145, 151, { align: "center" });
    doc.text("Diterima Oleh", 240, 151, { align: "center" });
    doc.text("PT. Delapan Delapan Logistics", 55, 156, { align: "center" });
    doc.text("KPU Kabupaten Tasikmalaya", 145, 156, { align: "center" });
    doc.text("Diver", 240, 156, { align: "center" });
    doc.text("Nama Lengkap", 55, 197, { align: "center" });
    doc.text("Telp.", 34, 202, { align: "center" });
    doc.text("Nama Lengkap", 145, 197, { align: "center" });
    doc.text("Telp.", 124, 202, { align: "center" });
    doc.text("Nama Lengkap", 240, 197, { align: "center" });
    doc.text("Telp.", 219, 202, { align: "center" });

    doc.save(`${ietmRencanaSalur[0].kode_rencana_salur}.pdf`, {
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
                            <XCircle size={20} />
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
  handleBackClick: PropTypes.func.isRequired,
  alokasiInit: PropTypes.number.isRequired,
};

export default DetailPage;
