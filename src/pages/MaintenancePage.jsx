import React from 'react'
import { Link } from 'react-router-dom'

export const MaintenancePage = () => {
    return (
        <>
            <div className="misc-wrapper text-center" style={{ marginTop: "100px" }} >
                <h2 className="mb-2 mx-2">404 Halaman tidak ditemukan!</h2>
                <p className="mb-4 mx-2">Maaf menu yang anda pilih tidak ditemukan, silahkan kembali ke menu Dashbaord</p>
                <Link aria-label='Go to Home Page' to="/" className="btn btn-primary">Go to Home Page</Link>
                <div className="mt-4">
                    <img
                        src="../assets/img/illustrations/girl-doing-yoga-light.png"
                        alt="girl-doing-yoga-light"
                        aria-label="Girl doing yoga light"
                        width="500"
                        className="img-fluid"
                        data-app-dark-img="illustrations/girl-doing-yoga-dark.png"
                        data-app-light-img="illustrations/girl-doing-yoga-light.png" />
                </div>
            </div>
        </>
    )
}
