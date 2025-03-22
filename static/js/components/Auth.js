// Authentication Component (Login and Register)
const Auth = ({ isLogin, onLogin, navigateTo }) => {
  // State for login form
  const [loginData, setLoginData] = React.useState({
    email: '',
    password: ''
  });
  
  // State for register form
  const [registerData, setRegisterData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    age: '',
    gender: '',
    role: 'user',
    doctor: {
      specialization: '',
      experienceYears: '',
      bio: '',
      availableDays: [],
      availableHours: []
    }
  });
  
  // State for form errors and loading
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [showDoctorFields, setShowDoctorFields] = React.useState(false);
  
  // Days of the week for doctor availability
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Time slots for doctor availability
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];
  
  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };
  
  // Handle register form input changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      setShowDoctorFields(value === 'doctor');
    }
    
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };
  
  // Handle doctor-specific field changes
  const handleDoctorFieldChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      doctor: {
        ...registerData.doctor,
        [name]: value
      }
    });
  };
  
  // Handle checkbox changes for doctor availability
  const handleCheckboxChange = (type, value) => {
    let updatedArray;
    
    if (type === 'availableDays') {
      updatedArray = [...registerData.doctor.availableDays];
      
      if (updatedArray.includes(value)) {
        updatedArray = updatedArray.filter(day => day !== value);
      } else {
        updatedArray.push(value);
      }
    } else {
      updatedArray = [...registerData.doctor.availableHours];
      
      if (updatedArray.includes(value)) {
        updatedArray = updatedArray.filter(hour => hour !== value);
      } else {
        updatedArray.push(value);
      }
    }
    
    setRegisterData({
      ...registerData,
      doctor: {
        ...registerData.doctor,
        [type]: updatedArray
      }
    });
  };
  
  // Validate login form
  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate register form
  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (registerData.role === 'doctor') {
      if (!registerData.doctor.specialization) {
        newErrors.specialization = 'Specialization is required';
      }
      
      if (!registerData.doctor.experienceYears) {
        newErrors.experienceYears = 'Years of experience is required';
      }
      
      if (registerData.doctor.availableDays.length === 0) {
        newErrors.availableDays = 'Please select at least one available day';
      }
      
      if (registerData.doctor.availableHours.length === 0) {
        newErrors.availableHours = 'Please select at least one available time slot';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/login', loginData);
      
      if (response.data.user) {
        onLogin(response.data.user);
      }
    } catch (error) {
      setErrors({
        form: error.response?.data?.error || 'An error occurred during login'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle register form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/register', registerData);
      
      if (response.data.user) {
        onLogin(response.data.user);
      }
    } catch (error) {
      setErrors({
        form: error.response?.data?.error || 'An error occurred during registration'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Render login form
  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit}>
      {errors.form && (
        <div className="alert alert-danger" role="alert">
          {errors.form}
        </div>
      )}
    
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          value={loginData.email}
          onChange={handleLoginChange}
          placeholder="Enter your email"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          id="password"
          name="password"
          value={loginData.password}
          onChange={handleLoginChange}
          placeholder="Enter your password"
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      
      <div className="d-grid">
        <button 
          type="submit" 
          className="btn btn-info"
          disabled={loading}
        >
          {loading ? (
            <span>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging in...
            </span>
          ) : 'Login'}
        </button>
      </div>
      
      <div className="text-center mt-3">
        <p>
          Don't have an account?{' '}
          <a href="#" onClick={() => navigateTo('register')} className="text-info">
            Register here
          </a>
        </p>
      </div>
    </form>
  );
  
  // Render register form
  const renderRegisterForm = () => (
    <form onSubmit={handleRegisterSubmit}>
      {errors.form && (
        <div className="alert alert-danger" role="alert">
          {errors.form}
        </div>
      )}
      
      {/* Basic Information */}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          id="username"
          name="username"
          value={registerData.username}
          onChange={handleRegisterChange}
          placeholder="Choose a username"
        />
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          value={registerData.email}
          onChange={handleRegisterChange}
          placeholder="Enter your email"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="fullName" className="form-label">Full Name</label>
        <input
          type="text"
          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
          id="fullName"
          name="fullName"
          value={registerData.fullName}
          onChange={handleRegisterChange}
          placeholder="Enter your full name"
        />
        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
      </div>
      
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="age" className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={registerData.age}
            onChange={handleRegisterChange}
            placeholder="Your age"
          />
        </div>
        
        <div className="col">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
            className="form-select"
            id="gender"
            name="gender"
            value={registerData.gender}
            onChange={handleRegisterChange}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          id="password"
          name="password"
          value={registerData.password}
          onChange={handleRegisterChange}
          placeholder="Choose a password"
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          type="password"
          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          id="confirmPassword"
          name="confirmPassword"
          value={registerData.confirmPassword}
          onChange={handleRegisterChange}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="role" className="form-label">Register as</label>
        <div className="d-flex">
          <div className="form-check me-4">
            <input
              className="form-check-input"
              type="radio"
              name="role"
              id="roleUser"
              value="user"
              checked={registerData.role === 'user'}
              onChange={handleRegisterChange}
            />
            <label className="form-check-label" htmlFor="roleUser">
              Patient
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="role"
              id="roleDoctor"
              value="doctor"
              checked={registerData.role === 'doctor'}
              onChange={handleRegisterChange}
            />
            <label className="form-check-label" htmlFor="roleDoctor">
              Doctor
            </label>
          </div>
        </div>
      </div>
      
      {/* Doctor-specific fields */}
      {showDoctorFields && (
        <div className="doctor-fields mb-4 p-3 border border-info rounded">
          <h5 className="mb-3">Doctor Information</h5>
          
          <div className="mb-3">
            <label htmlFor="specialization" className="form-label">Specialization</label>
            <input
              type="text"
              className={`form-control ${errors.specialization ? 'is-invalid' : ''}`}
              id="specialization"
              name="specialization"
              value={registerData.doctor.specialization}
              onChange={handleDoctorFieldChange}
              placeholder="e.g., Cardiology, Internal Medicine"
            />
            {errors.specialization && <div className="invalid-feedback">{errors.specialization}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="experienceYears" className="form-label">Years of Experience</label>
            <input
              type="number"
              className={`form-control ${errors.experienceYears ? 'is-invalid' : ''}`}
              id="experienceYears"
              name="experienceYears"
              value={registerData.doctor.experienceYears}
              onChange={handleDoctorFieldChange}
              placeholder="Years of professional experience"
            />
            {errors.experienceYears && <div className="invalid-feedback">{errors.experienceYears}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="bio" className="form-label">Professional Bio</label>
            <textarea
              className="form-control"
              id="bio"
              name="bio"
              rows="3"
              value={registerData.doctor.bio}
              onChange={handleDoctorFieldChange}
              placeholder="Brief professional background and specialties"
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Available Days</label>
            {errors.availableDays && <div className="text-danger small mb-2">{errors.availableDays}</div>}
            <div className="row">
              {daysOfWeek.map(day => (
                <div className="col-md-4 mb-2" key={day}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`day-${day}`}
                      checked={registerData.doctor.availableDays.includes(day)}
                      onChange={() => handleCheckboxChange('availableDays', day)}
                    />
                    <label className="form-check-label" htmlFor={`day-${day}`}>
                      {day}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Available Hours</label>
            {errors.availableHours && <div className="text-danger small mb-2">{errors.availableHours}</div>}
            <div className="row">
              {timeSlots.map(time => (
                <div className="col-md-4 mb-2" key={time}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`time-${time}`}
                      checked={registerData.doctor.availableHours.includes(time)}
                      onChange={() => handleCheckboxChange('availableHours', time)}
                    />
                    <label className="form-check-label" htmlFor={`time-${time}`}>
                      {time}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="d-grid">
        <button 
          type="submit" 
          className="btn btn-info"
          disabled={loading}
        >
          {loading ? (
            <span>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Registering...
            </span>
          ) : 'Register'}
        </button>
      </div>
      
      <div className="text-center mt-3">
        <p>
          Already have an account?{' '}
          <a href="#" onClick={() => navigateTo('login')} className="text-info">
            Login here
          </a>
        </p>
      </div>
    </form>
  );
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">
                {isLogin ? 'Login to Your Account' : 'Create New Account'}
              </h2>
              
              {isLogin ? renderLoginForm() : renderRegisterForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
