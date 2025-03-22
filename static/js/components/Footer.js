// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 text-lg-start">
            <div className="d-flex align-items-center">
              <i className="fas fa-heartbeat me-2 text-info"></i>
              <span className="fw-bold">CardioHealth</span>
            </div>
            <p className="text-muted small mt-2 mb-0">
              Helping you take care of your heart health with advanced AI prediction.
            </p>
          </div>
          <div className="col-lg-6 text-lg-end mt-3 mt-lg-0">
            <div className="d-flex justify-content-lg-end justify-content-center">
              <p className="text-muted small mb-0 me-3">
                &copy; {currentYear} CardioHealth. All Rights Reserved.
              </p>
              <div className="social-icons">
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
