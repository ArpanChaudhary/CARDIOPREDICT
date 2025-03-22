// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = React.useState('landing');
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Check if user is logged in on component mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('smartHealthcareUser');
    // Check for old storage key for backward compatibility
    const oldStoredUser = !storedUser ? localStorage.getItem('cardioHealthUser') : null;
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem('smartHealthcareUser');
      }
    } else if (oldStoredUser) {
      // If found data in old key, migrate it to the new key
      try {
        const userData = JSON.parse(oldStoredUser);
        setUser(userData);
        localStorage.setItem('smartHealthcareUser', oldStoredUser);
        localStorage.removeItem('cardioHealthUser');
      } catch (e) {
        console.error("Error migrating stored user data:", e);
        localStorage.removeItem('cardioHealthUser');
      }
    }
    
    setLoading(false);
  }, []);

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('smartHealthcareUser', JSON.stringify(userData));
    
    // Redirect to appropriate dashboard based on user role
    if (userData.role === 'doctor') {
      setCurrentPage('doctorDashboard');
    } else {
      setCurrentPage('userDashboard');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartHealthcareUser');
    // Also remove old key for completeness
    localStorage.removeItem('cardioHealthUser');
    setCurrentPage('landing');
  };

  // Handle page navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing navigateTo={navigateTo} />;
      case 'login':
        return <Auth isLogin={true} onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'register':
        return <Auth isLogin={false} onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'userDashboard':
        return user ? <UserDashboard user={user} navigateTo={navigateTo} /> : <Auth isLogin={true} onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'doctorDashboard':
        return user && user.role === 'doctor' ? <DoctorDashboard user={user} navigateTo={navigateTo} /> : <Auth isLogin={true} onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'predictionForm':
        return user ? <PredictionForm user={user} navigateTo={navigateTo} /> : <Auth isLogin={true} onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'appointmentBooking':
        return user ? <AppointmentBooking user={user} navigateTo={navigateTo} /> : <Auth isLogin={true} onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'patientHistory':
        return user && user.role === 'doctor' ? <PatientHistory user={user} navigateTo={navigateTo} /> : <Auth isLogin={true} onLogin={handleLogin} navigateTo={navigateTo} />;
      default:
        return <Landing navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        navigateTo={navigateTo}
      />
      
      <div className="content-wrapper">
        {renderContent()}
      </div>
      
      <Footer />
    </>
  );
};

// Render the App
ReactDOM.render(<App />, document.getElementById('root'));
