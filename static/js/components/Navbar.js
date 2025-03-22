// Navbar Component
const Navbar = ({ user, onLogout, navigateTo }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={() => navigateTo('landing')}>
          <i className="fas fa-heartbeat"></i>
          CardioHealth
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#" 
                onClick={() => navigateTo('landing')}
              >
                Home
              </a>
            </li>
            
            {!user ? (
              // Show these links when user is not logged in
              <>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={() => navigateTo('login')}
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={() => navigateTo('register')}
                  >
                    Register
                  </a>
                </li>
              </>
            ) : user.role === 'user' ? (
              // Show these links when user is logged in as a regular user
              <>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={() => navigateTo('userDashboard')}
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={() => navigateTo('predictionForm')}
                  >
                    Get Prediction
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={() => navigateTo('appointmentBooking')}
                  >
                    Book Appointment
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user-circle me-1"></i>
                    {user.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a 
                        className="dropdown-item" 
                        href="#" 
                        onClick={onLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // Show these links when user is logged in as a doctor
              <>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={() => navigateTo('doctorDashboard')}
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="#" 
                    onClick={() => navigateTo('patientHistory')}
                  >
                    Patient History
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user-md me-1"></i>
                    Dr. {user.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a 
                        className="dropdown-item" 
                        href="#" 
                        onClick={onLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
