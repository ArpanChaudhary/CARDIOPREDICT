// UserDashboard Component
const UserDashboard = ({ user, navigateTo }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [predictions, setPredictions] = React.useState([]);
  const [appointments, setAppointments] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalPredictions: 0,
    highRiskCount: 0,
    averagePredictionScore: 0,
    upcomingAppointments: 0
  });
  
  // Charts
  const predictionChartRef = React.useRef(null);
  const bpChartRef = React.useRef(null);
  const bmiChartRef = React.useRef(null);
  const lifestyleChartRef = React.useRef(null);
  let predictionChart = null;
  let bpChart = null;
  let bmiChart = null;
  let lifestyleChart = null;

  // Fetch user data on component mount
  React.useEffect(() => {
    fetchUserData();
  }, []);

  // Cleanup charts on unmount
  React.useEffect(() => {
    return () => {
      if (predictionChart) {
        predictionChart.destroy();
      }
      if (bpChart) {
        bpChart.destroy();
      }
      if (bmiChart) {
        bmiChart.destroy();
      }
      if (lifestyleChart) {
        lifestyleChart.destroy();
      }
    };
  }, []);

  // Fetch user data (predictions and appointments)
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch predictions
      const predictionsResponse = await axios.get(`/api/users/${user.id}/predictions`);
      setPredictions(predictionsResponse.data);
      
      // Fetch appointments
      const appointmentsResponse = await axios.get(`/api/users/${user.id}/appointments`);
      setAppointments(appointmentsResponse.data);
      
      // Calculate stats
      calculateStats(predictionsResponse.data, appointmentsResponse.data);
      
      // Initialize charts
      setTimeout(() => {
        initializeCharts(predictionsResponse.data);
      }, 100);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load your data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate user stats
  const calculateStats = (predictions, appointments) => {
    const totalPredictions = predictions.length;
    const highRiskCount = predictions.filter(p => p.prediction_label).length;
    
    let totalScore = 0;
    predictions.forEach(p => {
      totalScore += p.prediction_result;
    });
    
    const averagePredictionScore = totalPredictions > 0 
      ? (totalScore / totalPredictions) 
      : 0;
    
    const upcomingAppointments = appointments.filter(
      a => a.status !== 'completed' && a.status !== 'cancelled'
    ).length;
    
    setStats({
      totalPredictions,
      highRiskCount,
      averagePredictionScore,
      upcomingAppointments
    });
  };

  // Initialize charts
  const initializeCharts = (predictions) => {
    // Sort predictions by date
    const sortedPredictions = [...predictions].sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );
    
    // Prepare data for prediction history chart
    const predictionLabels = sortedPredictions.map(p => {
      const date = new Date(p.created_at);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });
    
    const predictionScores = sortedPredictions.map(p => 
      (p.prediction_result * 100).toFixed(1)
    );
    
    // Create prediction history chart
    if (predictionChartRef.current) {
      if (predictionChart) {
        predictionChart.destroy();
      }
      
      const ctx = predictionChartRef.current.getContext('2d');
      predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: predictionLabels,
          datasets: [{
            label: 'Risk Score (%)',
            data: predictionScores,
            backgroundColor: 'rgba(13, 202, 240, 0.2)',
            borderColor: 'rgba(13, 202, 240, 1)',
            borderWidth: 2,
            tension: 0.3,
            pointBackgroundColor: 'rgba(13, 202, 240, 1)',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Risk Score (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            }
          },
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Risk Score: ${context.parsed.y}%`;
                }
              }
            }
          }
        }
      });
    }
    
    // Prepare data for blood pressure chart
    if (sortedPredictions.length > 0 && bpChartRef.current) {
      const bpLabels = sortedPredictions.map(p => {
        const date = new Date(p.created_at);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });
      
      const systolicData = sortedPredictions.map(p => p.systolic_bp);
      const diastolicData = sortedPredictions.map(p => p.diastolic_bp);
      
      if (bpChart) {
        bpChart.destroy();
      }
      
      const ctx = bpChartRef.current.getContext('2d');
      bpChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: bpLabels,
          datasets: [
            {
              label: 'Systolic BP',
              data: systolicData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointRadius: 4
            },
            {
              label: 'Diastolic BP',
              data: diastolicData,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: 'Blood Pressure (mmHg)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            }
          },
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-0">Welcome, {user.full_name}!</h2>
          <p className="text-muted">Here's an overview of your heart health</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value">{stats.totalPredictions}</div>
              <div className="stat-label">Total Assessments</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value text-warning">{stats.highRiskCount}</div>
              <div className="stat-label">High Risk Results</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value text-info">{(stats.averagePredictionScore * 100).toFixed(1)}%</div>
              <div className="stat-label">Avg. Risk Score</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value text-success">{stats.upcomingAppointments}</div>
              <div className="stat-label">Upcoming Appointments</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Get Heart Health Assessment</h5>
              <p className="card-text">Complete a quick assessment to check your cardiovascular risk.</p>
              <button 
                className="btn btn-info" 
                onClick={() => navigateTo('predictionForm')}
              >
                Take Assessment
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Schedule Doctor Appointment</h5>
              <p className="card-text">Book an appointment with a cardiologist for consultation.</p>
              <button 
                className="btn btn-info" 
                onClick={() => navigateTo('appointmentBooking')}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="card dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Risk Assessment History</h5>
            </div>
            <div className="card-body">
              {predictions.length > 0 ? (
                <div className="chart-container">
                  <canvas ref={predictionChartRef}></canvas>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No assessment data available yet.</p>
                  <button 
                    className="btn btn-outline-info btn-sm" 
                    onClick={() => navigateTo('predictionForm')}
                  >
                    Take your first assessment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Blood Pressure Trends</h5>
            </div>
            <div className="card-body">
              {predictions.length > 0 ? (
                <div className="chart-container">
                  <canvas ref={bpChartRef}></canvas>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No blood pressure data available yet.</p>
                  <button 
                    className="btn btn-outline-info btn-sm" 
                    onClick={() => navigateTo('predictionForm')}
                  >
                    Record your blood pressure
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* New Charts Row */}
      {predictions.length > 0 && (
        <div className="row mb-4">
          {/* BMI Tracker Chart */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card dashboard-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">BMI Tracker</h5>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="bmiChartOptions" data-bs-toggle="dropdown" aria-expanded="false">
                    Options
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="bmiChartOptions">
                    <li><button className="dropdown-item" onClick={() => {}}>Last 5 entries</button></li>
                    <li><button className="dropdown-item" onClick={() => {}}>Last 10 entries</button></li>
                    <li><button className="dropdown-item" onClick={() => {}}>All entries</button></li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="chart-container" style={{ position: 'relative', height: '250px' }}>
                  <canvas id="bmiChart"></canvas>
                </div>
                <div className="mt-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <span className="d-block text-muted small">Underweight</span>
                      <span className="badge bg-info">Below 18.5</span>
                    </div>
                    <div>
                      <span className="d-block text-muted small">Normal</span>
                      <span className="badge bg-success">18.5 - 24.9</span>
                    </div>
                    <div>
                      <span className="d-block text-muted small">Overweight</span>
                      <span className="badge bg-warning">25 - 29.9</span>
                    </div>
                    <div>
                      <span className="d-block text-muted small">Obese</span>
                      <span className="badge bg-danger">30+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lifestyle Factor Impact */}
          <div className="col-lg-6">
            <div className="card dashboard-card">
              <div className="card-header">
                <h5 className="mb-0">Lifestyle Factors Impact</h5>
              </div>
              <div className="card-body">
                <div className="chart-container" style={{ position: 'relative', height: '250px' }}>
                  <canvas id="lifestyleChart"></canvas>
                </div>
                <div className="mt-3 small text-muted text-center">
                  This chart shows how different lifestyle factors are contributing to your cardiovascular risk based on your assessments
                </div>
              </div>
              <div className="card-footer bg-transparent">
                <div className="row text-center">
                  <div className="col">
                    <div className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: '#36a2eb', borderRadius: '50%' }}></div>
                    <span className="small">Diet</span>
                  </div>
                  <div className="col">
                    <div className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: '#ff6384', borderRadius: '50%' }}></div>
                    <span className="small">Exercise</span>
                  </div>
                  <div className="col">
                    <div className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: '#4bc0c0', borderRadius: '50%' }}></div>
                    <span className="small">Smoking</span>
                  </div>
                  <div className="col">
                    <div className="d-inline-block me-1" style={{ width: '12px', height: '12px', backgroundColor: '#ff9f40', borderRadius: '50%' }}></div>
                    <span className="small">Sleep</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Appointments */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Appointments</h5>
              <button 
                className="btn btn-sm btn-outline-info" 
                onClick={() => navigateTo('appointmentBooking')}
              >
                Book New
              </button>
            </div>
            <div className="card-body">
              {appointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map(appointment => (
                        <tr key={appointment.id}>
                          <td>{formatDate(appointment.appointment_date)}</td>
                          <td>{appointment.appointment_time}</td>
                          <td>Dr. {appointment.doctor_name}</td>
                          <td>{appointment.reason}</td>
                          <td>
                            <span className={`status-badge ${appointment.status}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                  // Navigate to appointment booking with pre-filled data
                                  navigateTo('appointmentBooking', { 
                                    editMode: true, 
                                    appointmentId: appointment.id,
                                    doctorId: appointment.doctor_id,
                                    appointmentDate: appointment.appointment_date,
                                    appointmentTime: appointment.appointment_time,
                                    reason: appointment.reason
                                  });
                                }}
                                disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to cancel this appointment?')) {
                                    try {
                                      await axios.delete(`/api/appointments/${appointment.id}`);
                                      // Refresh appointments
                                      fetchUserData();
                                    } catch (err) {
                                      console.error('Error cancelling appointment:', err);
                                      alert('Failed to cancel appointment. Please try again.');
                                    }
                                  }
                                }}
                                disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No appointments scheduled yet.</p>
                  <button 
                    className="btn btn-outline-info btn-sm" 
                    onClick={() => navigateTo('appointmentBooking')}
                  >
                    Schedule your first appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Assessments */}
      <div className="row">
        <div className="col-12">
          <div className="card dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Health Assessments</h5>
              <button 
                className="btn btn-sm btn-outline-info" 
                onClick={() => navigateTo('predictionForm')}
              >
                Take New
              </button>
            </div>
            <div className="card-body">
              {predictions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Blood Pressure</th>
                        <th>Cholesterol</th>
                        <th>Glucose</th>
                        <th>Risk Score</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.slice(0, 5).map(prediction => (
                        <tr key={prediction.id}>
                          <td>{formatDate(prediction.created_at)}</td>
                          <td>{prediction.systolic_bp}/{prediction.diastolic_bp}</td>
                          <td>
                            {prediction.cholesterol === 1 ? 'Normal' : 
                             prediction.cholesterol === 2 ? 'Above Normal' : 'Well Above Normal'}
                          </td>
                          <td>
                            {prediction.glucose === 1 ? 'Normal' : 
                             prediction.glucose === 2 ? 'Above Normal' : 'Well Above Normal'}
                          </td>
                          <td>{(prediction.prediction_result * 100).toFixed(1)}%</td>
                          <td>
                            <span className={`status-badge ${prediction.prediction_label ? 'cancelled' : 'completed'}`}>
                              {prediction.prediction_label ? 'High Risk' : 'Low Risk'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No health assessments taken yet.</p>
                  <button 
                    className="btn btn-outline-info btn-sm" 
                    onClick={() => navigateTo('predictionForm')}
                  >
                    Take your first assessment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
