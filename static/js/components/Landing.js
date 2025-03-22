// Landing Page Component
const Landing = ({ navigateTo }) => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-white">
                Take Control of Your <span className="text-info">Heart Health</span>
              </h1>
              <p className="lead mb-4">
                Advanced AI-powered prediction system for cardiovascular disease risk assessment and easy doctor appointment booking.
              </p>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-info btn-lg" 
                  onClick={() => navigateTo('register')}
                >
                  Get Started
                </button>
                <button 
                  className="btn btn-outline-light btn-lg" 
                  onClick={() => navigateTo('login')}
                >
                  Log In
                </button>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center mt-5 mt-lg-0">
              <svg width="400" height="300" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                <path d="M300 50 L350 150 L450 150 L370 220 L400 320 L300 260 L200 320 L230 220 L150 150 L250 150 Z" fill="none" stroke="#0dcaf0" strokeWidth="8" />
                <path d="M70 180 Q150 120 200 170 T330 190 T460 140 T530 220" fill="none" stroke="#0dcaf0" strokeWidth="4" />
                <circle cx="300" cy="200" r="150" fill="none" stroke="#0dcaf0" strokeWidth="2" strokeDasharray="10,10" />
                <path d="M150 270 Q300 350 450 270" fill="none" stroke="#0dcaf0" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-dark">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Features</h2>
            <p className="text-muted">
              Comprehensive tools for monitoring and improving cardiovascular health
            </p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <h4>AI Prediction</h4>
                <p className="text-muted">
                  Advanced machine learning algorithms to predict cardiovascular disease risk based on your health data.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h4>Easy Appointments</h4>
                <p className="text-muted">
                  Seamlessly book appointments with specialized cardiologists and receive email confirmations.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h4>Health Tracking</h4>
                <p className="text-muted">
                  Monitor your cardiovascular health metrics over time with detailed visualization tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cardio Disease Info Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">Understanding Cardiovascular Disease</h2>
              <p>
                Cardiovascular disease (CVD) refers to a class of diseases that involve the heart or blood vessels. It is the leading cause of death globally, taking an estimated 17.9 million lives each year.
              </p>
              <p>
                Common risk factors include high blood pressure, high cholesterol, smoking, diabetes, obesity, physical inactivity, and excessive alcohol consumption.
              </p>
              <div className="mt-4">
                <h5 className="fw-bold text-info">Warning Signs</h5>
                <ul>
                  <li>Chest pain or discomfort</li>
                  <li>Shortness of breath</li>
                  <li>Pain or discomfort in the arms, left shoulder, jaw, or back</li>
                  <li>Nausea, vomiting, lightheadedness, or cold sweats</li>
                  <li>Fatigue and difficulty breathing during physical activities</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="card shadow-lg">
                <div className="card-header bg-info text-white py-3">
                  <h4 className="mb-0">Key Statistics</h4>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <h5>Risk Reduction</h5>
                    <p>
                      Up to 80% of premature heart attacks and strokes can be prevented through healthy lifestyle choices.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h5>Global Impact</h5>
                    <p>
                      Cardiovascular diseases are the number 1 cause of death globally, taking an estimated 17.9 million lives each year.
                    </p>
                  </div>
                  <div>
                    <h5>Early Detection</h5>
                    <p className="mb-0">
                      Early detection and management can significantly improve outcomes and quality of life for people with cardiovascular disease.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-info text-dark">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Ready to take control of your heart health?</h2>
              <p className="lead mb-4">
                Register now to access our AI prediction tool and connect with specialized doctors.
              </p>
              <button 
                className="btn btn-dark btn-lg px-5" 
                onClick={() => navigateTo('register')}
              >
                Sign Up Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
