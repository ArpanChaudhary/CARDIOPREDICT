// DoctorDashboard Component
const DoctorDashboard = ({ user, navigateTo }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [doctor, setDoctor] = React.useState(null);
  const [appointments, setAppointments] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalPatients: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    todayAppointments: 0
  });
  
  // Charts
  const appointmentsChartRef = React.useRef(null);
  let appointmentsChart = null;

  // Find doctor ID based on user ID
  const fetchDoctorInfo = async () => {
    try {
      const response = await axios.get('/api/doctors');
      const doctorInfo = response.data.find(d => d.user_id === user.id);
      
      if (doctorInfo) {
        setDoctor(doctorInfo);
        return doctorInfo.id;
      } else {
        setError('Doctor profile not found. Please contact administrator.');
        return null;
      }
    } catch (err) {
      console.error('Error fetching doctor info:', err);
      setError('Failed to load doctor profile. Please try again later.');
      return null;
    }
  };

  // Fetch doctor data
  const fetchDoctorData = async (doctorId) => {
    try {
      const appointmentsResponse = await axios.get(`/api/doctors/${doctorId}/appointments`);
      setAppointments(appointmentsResponse.data);
      
      // Calculate stats
      calculateStats(appointmentsResponse.data);
      
      // Initialize charts
      setTimeout(() => {
        initializeCharts(appointmentsResponse.data);
      }, 100);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointment data. Please try again later.');
    }
  };

  // Fetch all data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const doctorId = await fetchDoctorInfo();
      
      if (doctorId) {
        await fetchDoctorData(doctorId);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Cleanup charts on unmount
  React.useEffect(() => {
    return () => {
      if (appointmentsChart) {
        appointmentsChart.destroy();
      }
    };
  }, []);

  // Calculate doctor stats
  const calculateStats = (appointments) => {
    // Get unique patient IDs
    const uniquePatients = [...new Set(appointments.map(a => a.user_id))];
    
    // Count appointments by status
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    
    // Check for today's appointments
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => 
      a.appointment_date === today && (a.status === 'pending' || a.status === 'confirmed')
    ).length;
    
    setStats({
      totalPatients: uniquePatients.length,
      pendingAppointments: pendingAppointments + confirmedAppointments,
      completedAppointments,
      todayAppointments
    });
  };

  // Initialize charts
  const initializeCharts = (appointments) => {
    if (!appointmentsChartRef.current || appointments.length === 0) {
      return;
    }
    
    // Get appointment counts by status
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    
    // Create appointments chart
    if (appointmentsChart) {
      appointmentsChart.destroy();
    }
    
    const ctx = appointmentsChartRef.current.getContext('2d');
    appointmentsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        datasets: [{
          data: [pending, confirmed, completed, cancelled],
          backgroundColor: [
            'rgba(255, 193, 7, 0.8)',  // warning
            'rgba(13, 202, 240, 0.8)',  // info
            'rgba(25, 135, 84, 0.8)',   // success
            'rgba(220, 53, 69, 0.8)'    // danger
          ],
          borderColor: [
            'rgba(255, 193, 7, 1)',
            'rgba(13, 202, 240, 1)',
            'rgba(25, 135, 84, 1)',
            'rgba(220, 53, 69, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                const percentage = ((value * 100) / total).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };

  // Handle appointment status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(`/api/appointments/${appointmentId}`, {
        status: newStatus
      });
      
      // Update the appointments list
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId ? response.data.appointment : appointment
        )
      );
      
      // Recalculate stats
      calculateStats(appointments.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      ));
      
      // Reinitialize charts
      setTimeout(() => {
        initializeCharts(appointments.map(appointment => 
          appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
        ));
      }, 100);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if a date is today
  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
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
      {/* Doctor Info Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-user-md fa-3x text-info"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h2 className="mb-0">Dr. {user.full_name}</h2>
                  <p className="text-muted mb-0">{doctor?.specialization} | {doctor?.experience_years} years of experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value">{stats.totalPatients}</div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value text-warning">{stats.pendingAppointments}</div>
              <div className="stat-label">Pending Appointments</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value text-success">{stats.completedAppointments}</div>
              <div className="stat-label">Completed Appointments</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card stat-card dashboard-card">
            <div className="card-body">
              <div className="stat-value text-info">{stats.todayAppointments}</div>
              <div className="stat-label">Today's Appointments</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointments Overview */}
      <div className="row mb-4">
        <div className="col-lg-4">
          <div className="card dashboard-card h-100">
            <div className="card-header">
              <h5 className="mb-0">Appointments Overview</h5>
            </div>
            <div className="card-body">
              {appointments.length > 0 ? (
                <div className="chart-container">
                  <canvas ref={appointmentsChartRef}></canvas>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No appointments data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="card dashboard-card h-100">
            <div className="card-header">
              <h5 className="mb-0">Today's Schedule</h5>
            </div>
            <div className="card-body">
              {appointments.filter(a => isToday(a.appointment_date) && 
                                        (a.status === 'pending' || a.status === 'confirmed')).length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(a => isToday(a.appointment_date) && 
                                   (a.status === 'pending' || a.status === 'confirmed'))
                        .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                        .map(appointment => (
                          <tr key={appointment.id}>
                            <td>{appointment.appointment_time}</td>
                            <td>{appointment.patient_name}</td>
                            <td>{appointment.reason}</td>
                            <td>
                              <span className={`status-badge ${appointment.status}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {appointment.status === 'pending' && (
                                  <button 
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                  >
                                    Confirm
                                  </button>
                                )}
                                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No appointments scheduled for today.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="row">
        <div className="col-12">
          <div className="card dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Appointments</h5>
              <button 
                className="btn btn-sm btn-outline-info" 
                onClick={() => navigateTo('patientHistory')}
              >
                View Patient History
              </button>
            </div>
            <div className="card-body">
              {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(a => a.status === 'pending' || a.status === 'confirmed')
                        .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
                        .map(appointment => (
                          <tr key={appointment.id} className={isToday(appointment.appointment_date) ? 'table-active' : ''}>
                            <td>{formatDate(appointment.appointment_date)}</td>
                            <td>{appointment.appointment_time}</td>
                            <td>{appointment.patient_name}</td>
                            <td>{appointment.reason}</td>
                            <td>
                              <span className={`status-badge ${appointment.status}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {appointment.status === 'pending' && (
                                  <button 
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                  >
                                    Confirm
                                  </button>
                                )}
                                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                  >
                                    Complete
                                  </button>
                                )}
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                >
                                  Cancel
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
                  <p className="text-muted">No upcoming appointments scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recently Completed */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card dashboard-card">
            <div className="card-header">
              <h5 className="mb-0">Recently Completed Appointments</h5>
            </div>
            <div className="card-body">
              {appointments.filter(a => a.status === 'completed').length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(a => a.status === 'completed')
                        .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
                        .slice(0, 5)
                        .map(appointment => (
                          <tr key={appointment.id}>
                            <td>{formatDate(appointment.appointment_date)}</td>
                            <td>{appointment.patient_name}</td>
                            <td>{appointment.reason}</td>
                            <td>{appointment.notes || 'No notes'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No completed appointments yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
