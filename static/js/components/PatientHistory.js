// PatientHistory Component
const PatientHistory = ({ user, navigateTo }) => {
  const [loading, setLoading] = React.useState(true);
  const [doctorId, setDoctorId] = React.useState(null);
  const [appointments, setAppointments] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [patientPredictions, setPatientPredictions] = React.useState([]);
  const [patientAppointments, setPatientAppointments] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  
  // Chart references
  const predictionChartRef = React.useRef(null);
  const bpChartRef = React.useRef(null);
  let predictionChart = null;
  let bpChart = null;
  
  // Find doctor ID on component mount
  React.useEffect(() => {
    const findDoctorId = async () => {
      try {
        const response = await axios.get('/api/doctors');
        const doctorInfo = response.data.find(d => d.user_id === user.id);
        
        if (doctorInfo) {
          setDoctorId(doctorInfo.id);
          return doctorInfo.id;
        } else {
          setError('Doctor profile not found');
          setLoading(false);
          return null;
        }
      } catch (err) {
        console.error('Error finding doctor ID:', err);
        setError('Failed to load doctor information');
        setLoading(false);
        return null;
      }
    };
    
    const loadData = async () => {
      const id = await findDoctorId();
      if (id) {
        await fetchAllPatients(id);
      }
    };
    
    loadData();
  }, []);
  
  // Clean up charts on unmount
  React.useEffect(() => {
    return () => {
      if (predictionChart) {
        predictionChart.destroy();
      }
      if (bpChart) {
        bpChart.destroy();
      }
    };
  }, []);
  
  // Update charts when selected patient changes
  React.useEffect(() => {
    if (selectedPatient && patientPredictions.length > 0) {
      setTimeout(() => {
        initializeCharts();
      }, 100);
    }
  }, [selectedPatient, patientPredictions]);
  
  // Fetch all patients who have appointments with this doctor
  const fetchAllPatients = async (doctorId) => {
    try {
      const appointmentsResponse = await axios.get(`/api/doctors/${doctorId}/appointments`);
      setAppointments(appointmentsResponse.data);
      
      // Extract unique patients
      const uniquePatients = [];
      const patientIds = new Set();
      
      appointmentsResponse.data.forEach(appointment => {
        if (!patientIds.has(appointment.user_id)) {
          patientIds.add(appointment.user_id);
          uniquePatients.push({
            id: appointment.user_id,
            name: appointment.patient_name
          });
        }
      });
      
      setPatients(uniquePatients);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patient data');
      setLoading(false);
    }
  };
  
  // Fetch patient details
  const fetchPatientDetails = async (patientId) => {
    setLoading(true);
    try {
      // Fetch patient predictions
      const predictionsResponse = await axios.get(`/api/users/${patientId}/predictions`);
      setPatientPredictions(predictionsResponse.data);
      
      // Fetch patient appointments
      const filteredAppointments = appointments.filter(a => a.user_id === patientId);
      setPatientAppointments(filteredAppointments);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patient details:', err);
      setError('Failed to load patient details');
      setLoading(false);
    }
  };
  
  // Handle patient selection
  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    fetchPatientDetails(patientId);
  };
  
  // Initialize charts
  const initializeCharts = () => {
    // Sort predictions by date
    const sortedPredictions = [...patientPredictions].sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );
    
    // Prepare data for prediction history chart
    if (predictionChartRef.current && sortedPredictions.length > 0) {
      const predictionLabels = sortedPredictions.map(p => {
        const date = new Date(p.created_at);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });
      
      const predictionScores = sortedPredictions.map(p => 
        (p.prediction_result * 100).toFixed(1)
      );
      
      // Create prediction history chart
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
    if (bpChartRef.current && sortedPredictions.length > 0) {
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
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter appointments based on status
  const filteredAppointments = patientAppointments.filter(appointment => 
    filterStatus === 'all' || appointment.status === filterStatus
  );
  
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
          <p className="mt-3">Loading patient data...</p>
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
      <div className="row">
        {/* Patient List Sidebar */}
        <div className="col-md-4 mb-4">
          <div className="card dashboard-card h-100">
            <div className="card-header">
              <h5 className="mb-0">Patient List</h5>
            </div>
            <div className="card-body p-0">
              <div className="p-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="list-group list-group-flush patient-list">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(patient => (
                    <button
                      key={patient.id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedPatient && selectedPatient.id === patient.id ? 'active' : ''}`}
                      onClick={() => handlePatientSelect(patient.id)}
                    >
                      <div>
                        <i className="fas fa-user-circle me-2"></i>
                        {patient.name}
                      </div>
                      <span className="badge bg-info rounded-pill">
                        {appointments.filter(a => a.user_id === patient.id).length}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No patients found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Patient Details */}
        <div className="col-md-8">
          {selectedPatient ? (
            <>
              {/* Patient Info Card */}
              <div className="card dashboard-card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Patient Information</h5>
                </div>
                <div className="card-body">
                  <h4 className="mb-3">{selectedPatient.name}</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Total Assessments:</strong> {patientPredictions.length}
                      </p>
                      <p className="mb-1">
                        <strong>High Risk Results:</strong> {patientPredictions.filter(p => p.prediction_label).length}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Total Appointments:</strong> {patientAppointments.length}
                      </p>
                      <p className="mb-1">
                        <strong>Latest Assessment:</strong> {
                          patientPredictions.length > 0 
                            ? formatDate(patientPredictions[0].created_at) 
                            : 'None'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Health Charts */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card dashboard-card h-100">
                    <div className="card-header">
                      <h5 className="mb-0">Risk Assessment History</h5>
                    </div>
                    <div className="card-body">
                      {patientPredictions.length > 0 ? (
                        <div className="chart-container">
                          <canvas ref={predictionChartRef}></canvas>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted">No assessment data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card dashboard-card h-100">
                    <div className="card-header">
                      <h5 className="mb-0">Blood Pressure Trends</h5>
                    </div>
                    <div className="card-body">
                      {patientPredictions.length > 0 ? (
                        <div className="chart-container">
                          <canvas ref={bpChartRef}></canvas>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted">No blood pressure data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Appointment History */}
              <div className="card dashboard-card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Appointment History</h5>
                  <div>
                    <select 
                      className="form-select form-select-sm"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Appointments</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="card-body">
                  {filteredAppointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments
                            .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
                            .map(appointment => (
                              <tr key={appointment.id}>
                                <td>{formatDate(appointment.appointment_date)}</td>
                                <td>{appointment.appointment_time}</td>
                                <td>{appointment.reason}</td>
                                <td>
                                  <span className={`status-badge ${appointment.status}`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                  </span>
                                </td>
                                <td>{appointment.notes || '—'}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No appointment history available</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Health Assessment Details */}
              <div className="card dashboard-card">
                <div className="card-header">
                  <h5 className="mb-0">Health Assessment Details</h5>
                </div>
                <div className="card-body">
                  {patientPredictions.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>BP</th>
                            <th>Cholesterol</th>
                            <th>Glucose</th>
                            <th>BMI</th>
                            <th>Lifestyle</th>
                            <th>Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patientPredictions
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map(prediction => (
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
                                <td>
                                  {(prediction.weight / Math.pow(prediction.height/100, 2)).toFixed(1)}
                                </td>
                                <td>
                                  {prediction.smoking && <i className="fas fa-smoking text-danger me-1" title="Smoker"></i>}
                                  {prediction.alcohol && <i className="fas fa-wine-glass-alt text-warning me-1" title="Alcohol"></i>}
                                  {prediction.physical_activity && <i className="fas fa-running text-success" title="Physical Activity"></i>}
                                </td>
                                <td>
                                  <span className={`status-badge ${prediction.prediction_label ? 'cancelled' : 'completed'}`}>
                                    {(prediction.prediction_result * 100).toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No health assessment data available</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card dashboard-card">
              <div className="card-body text-center py-5">
                <i className="fas fa-user-circle fa-4x text-muted mb-3"></i>
                <h4>Select a Patient</h4>
                <p className="text-muted">
                  Please select a patient from the list to view their health records and appointment history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
