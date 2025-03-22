// AppointmentBooking Component
const AppointmentBooking = ({ user, navigateTo }) => {
  const [doctors, setDoctors] = React.useState([]);
  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [availableDays, setAvailableDays] = React.useState([]);
  const [availableHours, setAvailableHours] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [symptoms, setSymptoms] = React.useState([]);
  const [priority, setPriority] = React.useState('regular');
  const [followUp, setFollowUp] = React.useState(false);
  const [medicalRecords, setMedicalRecords] = React.useState(false);
  const [showChatbot, setShowChatbot] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  
  // Fetch doctors on component mount
  React.useEffect(() => {
    fetchDoctors();
  }, []);
  
  // Fetch doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format day name (for displaying full day name)
  const formatDayName = (day) => {
    return day;
  };
  
  // Get day of week from date
  const getDayOfWeek = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  
  // Check if date is available
  const isDateAvailable = (dateString) => {
    const dayOfWeek = getDayOfWeek(dateString);
    return availableDays.includes(dayOfWeek);
  };
  
  // Generate next 30 days
  const getNext30Days = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Skip weekends if needed
      // if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const formattedDate = date.toISOString().split('T')[0];
      const dayOfWeek = getDayOfWeek(formattedDate);
      
      if (availableDays.includes(dayOfWeek)) {
        dates.push(formattedDate);
      }
    }
    
    return dates;
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };
  
  // Handle doctor selection
  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    setSelectedDoctor(doctor);
    
    if (doctor) {
      setAvailableDays(doctor.available_days);
      setAvailableHours(doctor.available_hours);
      setSelectedDate('');
      setSelectedTime('');
    } else {
      setAvailableDays([]);
      setAvailableHours([]);
    }
  };

  // Handle symptom selection
  const handleSymptomSelect = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please select a doctor, date, and time for your appointment');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const appointmentData = {
        userId: user.id,
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: reason,
        status: 'confirmed',
        notes: symptoms.length > 0 ? `Reported symptoms: ${symptoms.join(', ')}` : '',
        priority: priority,
        followUp: followUp,
        medicalRecords: medicalRecords
      };
      
      const response = await axios.post('/api/appointments', appointmentData);
      
      setSuccess('Your appointment has been successfully booked! A confirmation email has been sent to your email address with preparation instructions.');
      
      // Reset form
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      setSymptoms([]);
      setPriority('regular');
      setFollowUp(false);
      setMedicalRecords(false);
      setAvailableDays([]);
      setAvailableHours([]);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
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
          <p className="mt-3">Loading available doctors...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-info text-white py-3">
              <h3 className="mb-0">Book Doctor Appointment</h3>
            </div>
            <div className="card-body p-4">
              {/* Success message */}
              {success && (
                <div className="alert alert-success mb-4">
                  <h5 className="alert-heading">
                    <i className="fas fa-check-circle me-2"></i>
                    Appointment Booked!
                  </h5>
                  <p className="mb-0">{success}</p>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <button 
                      className="btn btn-success me-2" 
                      onClick={() => navigateTo('userDashboard')}
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setSuccess(null)}
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              )}
              
              {/* Error message */}
              {error && !success && (
                <div className="alert alert-danger mb-4">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {/* Booking Form */}
              {!success && (
                <form onSubmit={handleSubmit}>
                  {/* Doctor Selection */}
                  <div className="mb-4">
                    <label htmlFor="doctor" className="form-label">Select Doctor</label>
                    <select
                      className="form-select"
                      id="doctor"
                      value={selectedDoctor ? selectedDoctor.id : ''}
                      onChange={(e) => handleDoctorSelect(e.target.value)}
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.full_name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Doctor Details */}
                  {selectedDoctor && (
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title">Dr. {selectedDoctor.full_name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{selectedDoctor.specialization}</h6>
                        <p className="card-text small">
                          {selectedDoctor.experience_years} years of experience
                        </p>
                        {selectedDoctor.bio && (
                          <p className="card-text small">{selectedDoctor.bio}</p>
                        )}
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <p className="mb-1 fw-bold small">Available Days:</p>
                            <p className="small">
                              {availableDays.map(formatDayName).join(', ')}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-1 fw-bold small">Available Hours:</p>
                            <p className="small">
                              {availableHours.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Date Selection */}
                  {selectedDoctor && (
                    <div className="mb-4">
                      <label className="form-label">Select Date</label>
                      <div className="row row-cols-lg-4 row-cols-md-3 row-cols-2 g-2">
                        {getNext30Days().map(date => (
                          <div className="col" key={date}>
                            <div 
                              className={`card date-card h-100 ${selectedDate === date ? 'border-info' : ''}`}
                              onClick={() => handleDateSelect(date)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body p-2 text-center">
                                <p className="mb-1 small">{getDayOfWeek(date)}</p>
                                <p className="mb-0 fw-bold">
                                  {new Date(date).getDate()}
                                </p>
                                <p className="mb-0 small">
                                  {new Date(date).toLocaleDateString(undefined, { month: 'short' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="mb-4">
                      <label className="form-label">Select Time</label>
                      <div className="row row-cols-lg-4 row-cols-md-3 row-cols-2 g-2">
                        {availableHours.map(time => (
                          <div className="col" key={time}>
                            <div 
                              className={`card time-card h-100 ${selectedTime === time ? 'border-info' : ''}`}
                              onClick={() => setSelectedTime(time)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body p-2 text-center">
                                <p className="mb-0 fw-bold">{time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Appointment Reason */}
                  {selectedTime && (
                    <div className="mb-4">
                      <label htmlFor="reason" className="form-label">Reason for Appointment</label>
                      <textarea
                        className="form-control"
                        id="reason"
                        rows="3"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please briefly describe the reason for your visit"
                      ></textarea>
                    </div>
                  )}
                  
                  {/* Appointment Summary */}
                  {selectedDoctor && selectedDate && selectedTime && (
                    <div className="alert alert-info mb-4">
                      <h5 className="alert-heading">Appointment Summary</h5>
                      <p className="mb-1">
                        <strong>Doctor:</strong> Dr. {selectedDoctor.full_name} ({selectedDoctor.specialization})
                      </p>
                      <p className="mb-1">
                        <strong>Date:</strong> {formatDate(selectedDate)}
                      </p>
                      <p className="mb-1">
                        <strong>Time:</strong> {selectedTime}
                      </p>
                      <p className="mb-0">
                        <strong>Reason:</strong> {reason || 'Not specified'}
                      </p>
                    </div>
                  )}
                  
                  {/* Appointment Details and Enhanced Information */}
                  {selectedDoctor && selectedDate && selectedTime && (
                    <div className="mb-4">
                      <div className="card">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Additional Information</h5>
                        </div>
                        <div className="card-body">
                          {/* Symptoms Checklist */}
                          <div className="mb-4">
                            <label className="form-label fw-bold">Common Symptoms (Select all that apply)</label>
                            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-2">
                              {['Chest Pain', 'Shortness of Breath', 'Fatigue', 'Dizziness', 'Palpitations', 'Swelling', 
                                'High Blood Pressure', 'Nausea', 'Sweating', 'Jaw/Neck Pain'].map(symptom => (
                                <div className="col" key={symptom}>
                                  <div 
                                    className={`card h-100 ${symptoms.includes(symptom) ? 'border-info bg-light' : ''}`}
                                    onClick={() => handleSymptomSelect(symptom)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <div className="card-body p-2">
                                      <div className="form-check">
                                        <input 
                                          className="form-check-input" 
                                          type="checkbox" 
                                          checked={symptoms.includes(symptom)}
                                          onChange={() => {}} 
                                          id={`symptom-${symptom}`}
                                        />
                                        <label className="form-check-label" htmlFor={`symptom-${symptom}`}>
                                          {symptom}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Priority Selection */}
                          <div className="mb-4">
                            <label className="form-label fw-bold">Appointment Priority</label>
                            <div className="btn-group w-100" role="group">
                              <input 
                                type="radio" 
                                className="btn-check" 
                                name="priority" 
                                id="priority-regular" 
                                checked={priority === 'regular'} 
                                onChange={() => setPriority('regular')}
                              />
                              <label className="btn btn-outline-secondary" htmlFor="priority-regular">Regular</label>
                              
                              <input 
                                type="radio" 
                                className="btn-check" 
                                name="priority" 
                                id="priority-urgent" 
                                checked={priority === 'urgent'} 
                                onChange={() => setPriority('urgent')}
                              />
                              <label className="btn btn-outline-warning" htmlFor="priority-urgent">Urgent</label>
                              
                              <input 
                                type="radio" 
                                className="btn-check" 
                                name="priority" 
                                id="priority-emergency" 
                                checked={priority === 'emergency'} 
                                onChange={() => setPriority('emergency')}
                              />
                              <label className="btn btn-outline-danger" htmlFor="priority-emergency">Emergency</label>
                            </div>
                            <div className="form-text">
                              {priority === 'emergency' && 
                                <small className="text-danger">For medical emergencies, please call 911 immediately.</small>}
                            </div>
                          </div>

                          {/* Additional Options */}
                          <div className="mb-3">
                            <div className="form-check form-switch mb-2">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="followUp" 
                                checked={followUp}
                                onChange={() => setFollowUp(!followUp)}
                              />
                              <label className="form-check-label" htmlFor="followUp">
                                This is a follow-up appointment
                              </label>
                            </div>
                            
                            <div className="form-check form-switch">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="medicalRecords" 
                                checked={medicalRecords}
                                onChange={() => setMedicalRecords(!medicalRecords)}
                              />
                              <label className="form-check-label" htmlFor="medicalRecords">
                                I will bring my medical records
                              </label>
                            </div>
                          </div>

                          {/* Preparation Instructions */}
                          <div className="alert alert-light border mt-3 mb-0">
                            <h6 className="alert-heading fw-bold">Appointment Preparation</h6>
                            <p className="small mb-1">To make the most of your appointment, please:</p>
                            <ul className="small mb-0">
                              <li>Arrive 15 minutes early to complete any necessary paperwork</li>
                              <li>Bring a list of current medications and dosages</li>
                              <li>Bring your insurance card and ID</li>
                              <li>Fast for 8 hours if lab work is needed</li>
                              <li>Wear comfortable clothing that allows easy examination</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Health Assistant Chatbot */}
                  <div className="mb-4">
                    <button 
                      type="button" 
                      className="btn btn-outline-info w-100" 
                      onClick={toggleChatbot}
                    >
                      <i className={`fas fa-${showChatbot ? 'minus' : 'plus'}-circle me-2`}></i>
                      {showChatbot ? 'Hide' : 'Show'} Health Assistant
                    </button>
                    
                    {showChatbot && (
                      <div className="mt-3">
                        <Chatbot />
                      </div>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => navigateTo('userDashboard')}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-info"
                      disabled={!selectedDoctor || !selectedDate || !selectedTime || submitting}
                    >
                      {submitting ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Booking...
                        </span>
                      ) : 'Book Appointment'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
