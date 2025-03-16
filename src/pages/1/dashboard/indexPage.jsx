import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const IndexPage = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [tersedia, setTersedia] = useState(0);
    const [tidaktersedia, setTidakTersedia] = useState(0);

    useEffect(() => {
        if (!token) navigate("/");
    }, [navigate, token]);

    useEffect(() => {
        const fetchDriverAvailability = async () => {
            if (!token) {
                console.error("No token provided");
                return;
            }

            try {
                const response = await axios.get("http://localhost:3090/api/v1/driver/availability", {
                    headers: { Authorization: token },
                });
                console.log(response.data.data.available[0].available);
                setTersedia(response.data.data.available[0].available);
                setTidakTersedia(response.data.data.unavailable[0].unavailable);
            } catch (error) {
                console.error("Error fetching driver availability:", error.response?.status, error.response?.data);
            }
        };

        fetchDriverAvailability();
    }, [token]);

    const data = {
        labels: ["Tersedia", "Tidak Tersedia"],
        datasets: [
            {
                label: "Jumlah Driver",
                data: [tersedia, tidaktersedia],
                backgroundColor: ["#2196F3", "#FF7043"],
                borderColor: ["#ffffff"],
                borderWidth: 2,
            },
        ],
    };

    // Opsi Pie Chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                enabled: true,
            },
        },
    };
    return (
        <>
            <div className="row">
                <div className="col-lg-12 mb-4 order-0">
                    <div className="card">
                        <div className="d-flex align-items-end row">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">
                                        DASHBOARD DRIVER
                                    </h5>
                                    <blockquote className="blockquote mt-3">
                                    <p className="fw-bold">Pantau aktivitas dan kinerja pengemudi secara real-time dengan data yang akurat dan terintegrasi.</p>
                                </blockquote>
                                    <figcaption className="blockquote-footer">
                                        PT. Delapan Delapan Logistics, {(new Date().toLocaleDateString('id-ID', { month: 'long' }))} {(new Date().getFullYear())}
                                    </figcaption>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-4">
                                    <img aria-label='dsahboard icon image'
                                        src="/assets/img/illustrations/man-with-laptop-light.png"
                                        height="140"
                                        alt="View Badge User"
                                        data-app-dark-img="illustrations/man-with-laptop-dark.png"
                                        data-app-light-img="illustrations/man-with-laptop-light.png"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12 col-md-12 col-6 mb-6">
                    <div className="card h-100 pb-3">
                        <div className="card-body" style={{ height: "300px", position: "relative", padding: "0", overflow: "hidden" }}>
                            <h5 className="card-title text-primary" style={{ position: "absolute", top: "10px", left: "20px", zIndex: 10 }}>AKTIF & TIDAK AKTIF DRIVER</h5>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "calc(100% - 30px)", margin: "0 auto", position: "absolute", top: "30px" }}>
                                <Pie data={data} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
};
export default IndexPage;