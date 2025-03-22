// PredictionForm Component
const PredictionForm = ({ user, navigateTo }) => {
  const [formData, setFormData] = React.useState({
    // Basic Info
    userId: user.id,
    age: user.age || '',
    gender: user.gender || '',
    height: '',
    weight: '',
    
    // Category 1: Clinical Symptoms
    chestPain: false,
    shortnessOfBreath: false,
    fatigue: false, 
    palpitations: false,
    dizziness: false,
    swelling: false,
    nausea: false,
    coldSweats: false,
    painJawNeckBack: false,
    leftArmPain: false,
    
    // Category 2: Physiological and Medical Indicators
    systolicBp: '',
    diastolicBp: '',
    cholesterol: '1',
    hdlCholesterol: '',
    ldlCholesterol: '',
    glucose: '1',
    heartRate: '',
    waistHipRatio: '',
    triglycerides: '',
    cReactiveProtein: '',
    
    // Category 3: Lifestyle and Behavioral Risk Factors
    smoking: false,
    alcohol: false,
    physicalActivity: true,
    highSaltDiet: false,
    highFatDiet: false,
    sleepHours: '',
    stressLevel: '1',
    workHours: '',
    
    // Category 4: Genetic and Family History
    familyHistory: false,
    geneticDisorders: false,
    previousHeartProblems: false,
    
    // Category 5: Additional Risk Conditions
    diabetes: false,
    hypertension: false,
    kidneyDisease: false,
    thyroidDisorders: false,
    anemia: false,
    autoimmune: false,
    metabolicSyndrome: false
  });
  
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [predictionResult, setPredictionResult] = React.useState(null);
  const [showBookAppointment, setShowBookAppointment] = React.useState(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Calculate BMI
  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return '–';
    
    const heightInMeters = formData.height / 100;
    const bmi = formData.weight / (heightInMeters * heightInMeters);
    
    return bmi.toFixed(1);
  };
  
  // Get BMI category
  const getBMICategory = (bmi) => {
    if (bmi === '–') return '';
    
    const bmiValue = parseFloat(bmi);
    
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };
  
  // Get BMI category color
  const getBMICategoryColor = (bmi) => {
    if (bmi === '–') return '';
    
    const bmiValue = parseFloat(bmi);
    
    if (bmiValue < 18.5) return 'text-warning';
    if (bmiValue < 25) return 'text-success';
    if (bmiValue < 30) return 'text-warning';
    return 'text-danger';
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.age || !formData.gender || !formData.height || !formData.weight || 
        !formData.systolicBp || !formData.diastolicBp) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/predict', formData);
      
      setPredictionResult(response.data.prediction);
      
      // Show book appointment button if high risk
      if (response.data.prediction.prediction_label) {
        setShowBookAppointment(true);
      }
    } catch (err) {
      console.error('Error submitting prediction form:', err);
      setError('Failed to process your health assessment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form and results
  const handleReset = () => {
    setFormData({
      // Basic Info
      userId: user.id,
      age: user.age || '',
      gender: user.gender || '',
      height: '',
      weight: '',
      
      // Category 1: Clinical Symptoms
      chestPain: false,
      shortnessOfBreath: false,
      fatigue: false, 
      palpitations: false,
      dizziness: false,
      swelling: false,
      nausea: false,
      coldSweats: false,
      painJawNeckBack: false,
      leftArmPain: false,
      
      // Category 2: Physiological and Medical Indicators
      systolicBp: '',
      diastolicBp: '',
      cholesterol: '1',
      hdlCholesterol: '',
      ldlCholesterol: '',
      glucose: '1',
      heartRate: '',
      waistHipRatio: '',
      triglycerides: '',
      cReactiveProtein: '',
      
      // Category 3: Lifestyle and Behavioral Risk Factors
      smoking: false,
      alcohol: false,
      physicalActivity: true,
      highSaltDiet: false,
      highFatDiet: false,
      sleepHours: '',
      stressLevel: '1',
      workHours: '',
      
      // Category 4: Genetic and Family History
      familyHistory: false,
      geneticDisorders: false,
      previousHeartProblems: false,
      
      // Category 5: Additional Risk Conditions
      diabetes: false,
      hypertension: false,
      kidneyDisease: false,
      thyroidDisorders: false,
      anemia: false,
      autoimmune: false,
      metabolicSyndrome: false
    });
    
    setPredictionResult(null);
    setError(null);
    setShowBookAppointment(false);
  };
  
  // Current BMI value
  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const bmiCategoryColor = getBMICategoryColor(bmi);
  
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header bg-info text-white py-3">
              <h3 className="mb-0">Cardiovascular Disease Risk Assessment</h3>
            </div>
            <div className="card-body p-4">
              {/* Instructions */}
              {!predictionResult && (
                <div className="alert alert-info mb-4">
                  <h5 className="alert-heading">
                    <i className="fas fa-info-circle me-2"></i>
                    Instructions
                  </h5>
                  <p className="mb-0">
                    Please fill in all the required information accurately for the most reliable assessment. 
                    This assessment uses AI to estimate your risk of cardiovascular disease based on various health parameters.
                  </p>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="alert alert-danger mb-4">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {/* Prediction Results */}
              {predictionResult && (
                <div className={`alert ${predictionResult.prediction_label ? 'alert-danger' : 'alert-success'} mb-4`}>
                  <h4 className="alert-heading">
                    <i className={`fas ${predictionResult.prediction_label ? 'fa-heart-broken' : 'fa-heart'} me-2`}></i>
                    Your Assessment Results
                  </h4>
                  <p className="fs-5 mb-2">
                    Based on your inputs, your cardiovascular disease risk is:
                  </p>
                  <div className="d-flex align-items-center mb-2">
                    <div 
                      className="progress flex-grow-1 me-3" 
                      style={{ height: '25px' }}
                      role="progressbar" 
                      aria-valuenow={(predictionResult.prediction_result * 100).toFixed(1)} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      <div 
                        className={`progress-bar ${predictionResult.prediction_label ? 'bg-danger' : 'bg-success'}`}
                        style={{ width: `${(predictionResult.prediction_result * 100).toFixed(1)}%` }}
                      >
                        {(predictionResult.prediction_result * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="fs-4 fw-bold">
                      {predictionResult.prediction_label ? 'HIGH RISK' : 'LOW RISK'}
                    </div>
                  </div>
                  <hr />
                  <p>
                    {predictionResult.prediction_label 
                      ? 'Your results indicate a higher risk of cardiovascular disease. We recommend consulting with a healthcare professional.'
                      : 'Your results indicate a lower risk of cardiovascular disease. Continue maintaining healthy habits.'}
                  </p>
                  <div className="d-flex gap-2 mt-3">
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={handleReset}
                    >
                      New Assessment
                    </button>
                    {showBookAppointment && (
                      <button 
                        className="btn btn-info" 
                        onClick={() => navigateTo('appointmentBooking')}
                      >
                        Book Doctor Appointment
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Assessment Form */}
              {!predictionResult && (
                <form onSubmit={handleSubmit}>
                  <div className="row mb-4">
                    <div className="col-12">
                      <h5 className="mb-3">Basic Information</h5>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="age" className="form-label">Age (years) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="18"
                        max="120"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="gender" className="form-label">Gender *</label>
                      <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-12">
                      <h5 className="mb-3">Body Measurements</h5>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="height" className="form-label">Height (cm) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        min="100"
                        max="250"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="weight" className="form-label">Weight (kg) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        min="30"
                        max="300"
                        step="0.1"
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">BMI (calculated)</label>
                      <div className="form-control bg-light">
                        {bmi}{' '}
                        <span className={bmiCategoryColor}>
                          {bmiCategory && `(${bmiCategory})`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-12">
                      <h5 className="mb-3">Blood Pressure</h5>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="systolicBp" className="form-label">Systolic Blood Pressure (mmHg) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="systolicBp"
                        name="systolicBp"
                        value={formData.systolicBp}
                        onChange={handleInputChange}
                        min="80"
                        max="250"
                        required
                      />
                      <small className="form-text text-muted">The upper number in a blood pressure reading</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="diastolicBp" className="form-label">Diastolic Blood Pressure (mmHg) *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="diastolicBp"
                        name="diastolicBp"
                        value={formData.diastolicBp}
                        onChange={handleInputChange}
                        min="40"
                        max="150"
                        required
                      />
                      <small className="form-text text-muted">The lower number in a blood pressure reading</small>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-12">
                      <h5 className="mb-3">Biochemical Measurements</h5>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cholesterol" className="form-label">Cholesterol Level *</label>
                      <select
                        className="form-select"
                        id="cholesterol"
                        name="cholesterol"
                        value={formData.cholesterol}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1">Normal</option>
                        <option value="2">Above Normal</option>
                        <option value="3">Well Above Normal</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="glucose" className="form-label">Glucose Level *</label>
                      <select
                        className="form-select"
                        id="glucose"
                        name="glucose"
                        value={formData.glucose}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1">Normal</option>
                        <option value="2">Above Normal</option>
                        <option value="3">Well Above Normal</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-12">
                      <h5 className="mb-3">Lifestyle Factors</h5>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="smoking"
                          name="smoking"
                          checked={formData.smoking}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="smoking">
                          Smoking
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="alcohol"
                          name="alcohol"
                          checked={formData.alcohol}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="alcohol">
                          Alcohol Consumption
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="physicalActivity"
                          name="physicalActivity"
                          checked={formData.physicalActivity}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="physicalActivity">
                          Regular Physical Activity
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-info"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </span>
                      ) : 'Get Assessment'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Health Tips */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Heart Health Tips</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-heartbeat text-info fs-4 me-2"></i>
                    </div>
                    <div>
                      <h6>Regular Exercise</h6>
                      <p className="small text-muted mb-0">
                        Aim for at least 150 minutes of moderate exercise weekly to keep your heart strong.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-utensils text-info fs-4 me-2"></i>
                    </div>
                    <div>
                      <h6>Healthy Diet</h6>
                      <p className="small text-muted mb-0">
                        Focus on whole foods, fruits, vegetables, and limit processed foods high in salt and sugar.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-smoking-ban text-info fs-4 me-2"></i>
                    </div>
                    <div>
                      <h6>Avoid Smoking</h6>
                      <p className="small text-muted mb-0">
                        Smoking significantly increases your risk of heart disease. Quitting helps your heart immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
