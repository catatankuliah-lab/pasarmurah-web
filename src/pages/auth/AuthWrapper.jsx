import React from 'react'
import './page-auth.css'
export const AuthWrapper = ({ children }) => {
    return (
        <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">
                    <div className="card">
                        <div className="card-body">
                            <div className="app-brand justify-content-center mt-3">
                                <span className="app-brand-logo demo">
                                    <img src="/assets/img/logos/logo.png" alt="sneat-logo" width={"300px"} />
                                </span>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
