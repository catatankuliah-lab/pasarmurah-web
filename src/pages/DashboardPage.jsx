export const DashboardPage = () => {
    return (
        <>
            <div className="row">
                <div className="col-lg-12 mb-4 order-0">
                    <div className="card">
                        <div className="d-flex align-items-end row">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">
                                        Hehehehe, Semangatttttt! 🦾
                                    </h5>
                                    <blockquote className="blockquote mt-4">
                                        <p className="fw-bold" >Otot Kawat, Tulang Punggung</p>
                                    </blockquote>
                                    <figcaption className="blockquote-footer">
                                        pineaple, {(new Date().toLocaleDateString('id-ID', { month: 'long' }))} {(new Date().getFullYear())}
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
            <div className="row d-none">
                <div className="col-lg-6 col-md-12 col-6 mb-6">
                    <div className="card h-100">
                        <div className="card-body">.
                            <div className="row">
                                <div className="col-md-8">
                                    <p className="mb-3 fw-bold ms-auto">Jawa Barat</p>
                                    <h4 className="card-title mb-3">1.000 KPM</h4>
                                    <small className="">disalurkan dari 2.000 KPM</small>
                                </div>
                                <div className="col-md-4">
                                    <img src="/assets/img/maptender/jb.png" width={"100%"} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div><div className="col-lg-6 col-md-12 col-6 mb-6">
                    <div className="card h-100">
                        <div className="card-body">.
                            <div className="row">
                                <div className="col-md-8">
                                    <p className="mb-3 fw-bold ms-auto">Jawa Timur</p>
                                    <h4 className="card-title mb-3">1.500 KPM</h4>
                                    <small className="">disalurkan dari 2.000 KPM</small>
                                </div>
                                <div className="col-md-4">
                                    <img src="/assets/img/maptender/jt.png" width={"100%"} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};