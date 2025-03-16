// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import './page-auth.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthWrapper } from './AuthWrapper';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3091/api/v1/login', formData);
            console.log(response.data);
            const id_role = response.data.data.id_role;
            const id_user = response.data.data.id_user;
            const token = response.data.token;
            localStorage.setItem('id_role', id_role);
            localStorage.setItem('id_user', id_user);
            localStorage.setItem('id_kantor', id_kantor);
            localStorage.setItem('token', token);
            Swal.fire({
                title: 'Login',
                text: `Login Berhasil, selamat datang ${response.data.data.nama_role}`,
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            }).then(() => {
                if (id_role != null) {
                    navigate(`/${id_role}/dashboard`);
                }
            });

        } catch (error) {
            console.error('Error Login :', error);
            Swal.fire({
                title: 'Login',
                text: `Login gagal, periksa kembali username dan password`,
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                position: 'center',
                timerProgressBar: true
            });
        }
    };

    return (
        <AuthWrapper>
            <h4 className="mb-2">Login !</h4>
            <p className="mt-3">Sistem Infomasi Operasional</p>
            <p className="mb-4 fw-bold" style={{ marginTop: "-10px" }} ><span style={{ color: "rgb(233,80,28)" }}>PT Delapan Delapan</span> <span style={{ color: "rgb(8,96,237)" }}> Logistics</span></p>
            <form className="mb-3">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        onChange={handleChange}
                        name="username"
                        placeholder="USERNAME"
                        autoFocus />
                </div>
                <div className="mb-3 form-password-toggle">
                    <div className="d-flex justify-content-between">
                        <label className="form-label" htmlFor="password">Password</label>
                    </div>
                    <div className="input-group input-group-merge">
                        <input
                            type="password"
                            autoComplete="true"
                            id="password"
                            onChange={handleChange}
                            className="form-control"
                            name="password"
                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                            aria-describedby="password" />
                        <span className="input-group-text cursor-pointer"></span>
                    </div>
                </div>
                <div className="mt-5">
                    <button className="btn btn-primary d-grid w-100" type="button" onClick={handleSubmit} >Login</button>
                </div>
            </form>
        </AuthWrapper >
    );
};

export default LoginPage;
