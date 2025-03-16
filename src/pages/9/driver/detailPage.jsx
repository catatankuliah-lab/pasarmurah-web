import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const DetailPage = ({ detailId, handleBackClick }) => {
    const inputRef = useRef(null);

    // Data dari localstorage
    const token = localStorage.getItem('token');

    const [driver, setDriver] = useState(null);

    const [formData, setFormData] = useState({
        id_role: "",
        username: "",
        password: "",
        status_user: "",
        id_user: "",
        nik: "",
        nama_driver: "",
        telpon_driver: "",
        nama_kontak_darurat_driver: "",
        telpon_kontak_darurat_driver: "",
        alamat_driver: "",
        status_driver: "",
        id_vendor: "",
        id_jenis_mobil: "",
        masa_berlaku_sim: "",
    });

    // Fetch data driver saat component dimount atau detailId berubah
    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await axios.get( `http://localhost:3090/api/v1/driver/${detailId}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                setDriver(response.data.data);
            } catch (error) {
                console.log(error);
                setDriver([]);
            }
        };
        if (detailId) {
            fetchDriver();
        }
    }, [detailId, token]);

    // Update formData ketika driver berhasil di-fetch
    useEffect(() => {
        if (driver) {
            setFormData((prevData) => ({
                id_role: driver.id_role || prevData.id_role,
                username: driver.username || prevData.username,
                password: driver.password || prevData.password,
                status_user: driver.status_user || prevData.status_user,
                id_user: driver.id_user || prevData.id_user,
                nik: driver.nik || prevData.nik,
                nama_driver: driver.nama_driver || prevData.nama_driver,
                telpon_driver: driver.telpon_driver || prevData.telpon_driver,
                nama_kontak_darurat_driver: driver.nama_kontak_darurat_driver || prevData.nama_kontak_darurat_driver,
                telpon_kontak_darurat_driver: driver.telpon_kontak_darurat_driver || prevData.telpon_kontak_darurat_driver,
                alamat_driver: driver.alamat_driver || prevData.alamat_driver,
                status_driver: driver.status_driver || prevData.status_driver,
                id_vendor: driver.id_vendor || prevData.id_vendor,
                id_jenis_mobil: driver.id_jenis_mobil || prevData.id_jenis_mobil,
                masa_berlaku_sim: driver.masa_berlaku_sim || prevData.masa_berlaku_sim
            }));
            console.log();
        }
    }, [driver]);

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
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nik" className="form-label">
                            NIK
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="nik"
                            name="nik"
                            placeholder=""
                            readOnly
                            ref={inputRef}
                            value={formData.nik}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="nama_driver" className="form-label">
                            Nama Lengkap
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="nama_driver"
                            name="nama_driver"
                            placeholder="Nama Lengkap"
                            readOnly
                            value={formData.nama_driver}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label htmlFor="telpon_driver" className="form-label">
                            Telpon Driver
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="telpon_driver"
                            name="telpon_driver"
                            placeholder="Telpon Driver"
                            readOnly
                            value={formData.telpon_driver}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label
                            htmlFor="nama_kontak_darurat_driver"
                            className="form-label"
                        >
                            Nama Kontak Darurat
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="nama_kontak_darurat_driver"
                            name="nama_kontak_darurat_driver"
                            placeholder="Nama Kontak Darurat"
                            readOnly
                            value={formData.nama_kontak_darurat_driver}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label
                            htmlFor="telpon_kontak_darurat_driver"
                            className="form-label"
                        >
                            Telpon Kontak Darurat
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="telpon_kontak_darurat_driver"
                            name="telpon_kontak_darurat_driver"
                            placeholder="Telpon Kontak Darurat"
                            readOnly
                            value={formData.telpon_kontak_darurat_driver}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label
                            htmlFor="masa_berlaku_sim"
                            className="form-label"
                        >
                            Masa Berlaku SIM
                        </label>
                        <input
                            className="form-control text-uppercase"
                            type="date"
                            id="masa_berlaku_sim"
                            name="masa_berlaku_sim"
                            placeholder=""
                            readOnly
                            value={formData.masa_berlaku_sim}
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label
                            htmlFor="foto_ktp_driver"
                            className="form-label"
                        >
                            Foto KTP
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            id="foto_ktp_driver"
                            name="foto_ktp_driver"
                            placeholder=""
                            readOnly
                            required
                        />
                    </div>
                    <div className="col-md-3 col-sm-12 mb-3">
                        <label
                            htmlFor="foto_sim_driver"
                            className="form-label"
                        >
                            Foto SIM
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            id="foto_sim_driver"
                            name="foto_sim_driver"
                            placeholder=""
                            readOnly
                            required
                        />
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