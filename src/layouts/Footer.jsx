const Footer = () => {
  return (
    <footer className="content-footer footer bg-footer-theme">
      <div className="container-xxl justify-content-between py-2">
        <div className="mb-2 mb-md-0 fw-medium text-primary">
          ©
          {(new Date().getFullYear())}
          <span>&nbsp; PT. Delapan Delapan Logistics x Kalaitu.Dev</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;