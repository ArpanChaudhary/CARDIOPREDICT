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
  
  // State for prediction types
  const [predictionType, setPredictionType] = React.useState('ai');
  
  // Get Clinical Symptoms Risk
  const getClinicalSymptomsRisk = () => {
    // Count the number of symptoms present
    const symptomCount = [
      formData.chestPain,
      formData.shortnessOfBreath,
      formData.fatigue,
      formData.palpitations,
      formData.dizziness,
      formData.swelling,
      formData.nausea,
      formData.coldSweats,
      formData.painJawNeckBack,
      formData.leftArmPain
    ].filter(Boolean).length;
    
    // Calculate risk based on symptom count
    if (symptomCount >= 5) return { risk: 'High', probability: 0.85, label: true };
    if (symptomCount >= 3) return { risk: 'Moderate', probability: 0.60, label: false };
    if (symptomCount >= 1) return { risk: 'Low', probability: 0.30, label: false };
    return { risk: 'Very Low', probability: 0.10, label: false };
  };
  
  // Get Physiological Indicators Risk
  const getPhysiologicalRisk = () => {
    let riskFactors = 0;
    
    // Check blood pressure (hypertension)
    if (formData.systolicBp > 140 || formData.diastolicBp > 90) riskFactors++;
    
    // Check cholesterol
    if (formData.cholesterol > 1) riskFactors++;
    
    // Check glucose
    if (formData.glucose > 1) riskFactors++;
    
    // Check heart rate (if provided)
    if (formData.heartRate && (formData.heartRate < 60 || formData.heartRate > 100)) riskFactors++;
    
    // Check BMI
    const bmi = calculateBMI();
    if (bmi !== '–' && parseFloat(bmi) > 25) riskFactors++;
    
    // Calculate risk based on physiological factors
    if (riskFactors >= 4) return { risk: 'High', probability: 0.85, label: true };
    if (riskFactors >= 2) return { risk: 'Moderate', probability: 0.55, label: false };
    if (riskFactors >= 1) return { risk: 'Low', probability: 0.25, label: false };
    return { risk: 'Very Low', probability: 0.05, label: false };
  };
  
  // Get Lifestyle Risk
  const getLifestyleRisk = () => {
    let riskFactors = 0;
    
    // Check smoking
    if (formData.smoking) riskFactors += 2; // Higher weight for smoking
    
    // Check alcohol
    if (formData.alcohol) riskFactors++;
    
    // Check physical activity (inactivity is a risk)
    if (!formData.physicalActivity) riskFactors++;
    
    // Check diet
    if (formData.highSaltDiet) riskFactors++;
    if (formData.highFatDiet) riskFactors++;
    
    // Check stress level
    if (formData.stressLevel && parseInt(formData.stressLevel) > 7) riskFactors++;
    
    // Calculate risk based on lifestyle factors
    if (riskFactors >= 4) return { risk: 'High', probability: 0.80, label: true };
    if (riskFactors >= 2) return { risk: 'Moderate', probability: 0.50, label: false };
    if (riskFactors >= 1) return { risk: 'Low', probability: 0.20, label: false };
    return { risk: 'Very Low', probability: 0.10, label: false };
  };
  
  // Get Genetic and Family History Risk
  const getGeneticRisk = () => {
    let riskFactors = 0;
    
    // Check family history
    if (formData.familyHistory) riskFactors += 2; // Higher weight for family history
    
    // Check genetic disorders
    if (formData.geneticDisorders) riskFactors += 2;
    
    // Check previous heart problems
    if (formData.previousHeartProblems) riskFactors += 3; // Highest weight for previous problems
    
    // Calculate risk based on genetic factors
    if (riskFactors >= 3) return { risk: 'High', probability: 0.90, label: true };
    if (riskFactors >= 2) return { risk: 'Moderate', probability: 0.60, label: false };
    if (riskFactors >= 1) return { risk: 'Low', probability: 0.30, label: false };
    return { risk: 'Very Low', probability: 0.05, label: false };
  };
  
  // Get Additional Risk Conditions
  const getAdditionalRiskConditions = () => {
    let riskFactors = 0;
    
    // Check each condition
    if (formData.diabetes) riskFactors += 2;
    if (formData.hypertension) riskFactors += 2;
    if (formData.kidneyDisease) riskFactors++;
    if (formData.thyroidDisorders) riskFactors++;
    if (formData.anemia) riskFactors++;
    if (formData.autoimmune) riskFactors++;
    if (formData.metabolicSyndrome) riskFactors += 2;
    
    // Calculate risk based on additional conditions
    if (riskFactors >= 4) return { risk: 'High', probability: 0.85, label: true };
    if (riskFactors >= 2) return { risk: 'Moderate', probability: 0.55, label: false };
    if (riskFactors >= 1) return { risk: 'Low', probability: 0.25, label: false };
    return { risk: 'Very Low', probability: 0.05, label: false };
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
      // If using AI prediction, call the API
      if (predictionType === 'ai') {
        const response = await axios.post('/api/predict', formData);
        setPredictionResult(response.data.prediction);
        
        // Show book appointment button if high risk
        if (response.data.prediction.prediction_label) {
          setShowBookAppointment(true);
        }
      } 
      // Otherwise use the appropriate local prediction function
      else {
        let result = {};
        
        switch(predictionType) {
          case 'clinical':
            result = getClinicalSymptomsRisk();
            break;
          case 'physiological':
            result = getPhysiologicalRisk();
            break;
          case 'lifestyle':
            result = getLifestyleRisk();
            break;
          case 'genetic':
            result = getGeneticRisk();
            break;
          case 'additional':
            result = getAdditionalRiskConditions();
            break;
          default:
            // Should never reach here
            setError('Invalid prediction type selected');
            setLoading(false);
            return;
        }
        
        // Set prediction result in appropriate format
        setPredictionResult({
          prediction_result: result.probability,
          prediction_label: result.label,
          risk_level: result.risk,
          // Add other required fields
          id: null,
          user_id: user.id,
          age: formData.age,
          gender: formData.gender,
          created_at: new Date().toISOString(),
          prediction_type: predictionType
        });
        
        // Show book appointment button if high risk
        if (result.label) {
          setShowBookAppointment(true);
        }
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
                  {/* Prediction Type Selector */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h5 className="mb-3">Select Assessment Type</h5>
                      <div className="d-flex flex-wrap gap-2">
                        <button 
                          type="button" 
                          className={`btn ${predictionType === 'ai' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setPredictionType('ai')}
                        >
                          <i className="fas fa-robot me-2"></i>
                          AI Comprehensive Assessment
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${predictionType === 'clinical' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setPredictionType('clinical')}
                        >
                          <i className="fas fa-heartbeat me-2"></i>
                          Clinical Symptoms
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${predictionType === 'physiological' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setPredictionType('physiological')}
                        >
                          <i className="fas fa-stethoscope me-2"></i>
                          Physiological Indicators
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${predictionType === 'lifestyle' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setPredictionType('lifestyle')}
                        >
                          <i className="fas fa-running me-2"></i>
                          Lifestyle Factors
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${predictionType === 'genetic' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setPredictionType('genetic')}
                        >
                          <i className="fas fa-dna me-2"></i>
                          Genetic History
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${predictionType === 'additional' ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setPredictionType('additional')}
                        >
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Additional Risk Conditions
                        </button>
                      </div>
                      <div className="mt-3 alert alert-info">
                        <small>
                          <i className="fas fa-info-circle me-2"></i>
                          {predictionType === 'ai' ? 
                            'AI Comprehensive Assessment evaluates all factors for the most accurate prediction.' : 
                            `${predictionType === 'clinical' ? 'Clinical Symptoms' : 
                              predictionType === 'physiological' ? 'Physiological Indicators' : 
                              predictionType === 'lifestyle' ? 'Lifestyle Factors' : 
                              predictionType === 'genetic' ? 'Genetic History' : 
                              'Additional Risk Conditions'} assessment focuses only on specific risk factors.`
                          }
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Always show Basic Information for any assessment type */}
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
                  
                  {/* Clinical Symptoms Section - Show only for AI or Clinical assessment */}
                  {(predictionType === 'ai' || predictionType === 'clinical') && (
                    <div className="row mb-4">
                      <div className="col-12">
                        <h5 className="mb-3">Clinical Symptoms</h5>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="chestPain"
                            name="chestPain"
                            checked={formData.chestPain}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="chestPain">
                            Chest Pain
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="shortnessOfBreath"
                            name="shortnessOfBreath"
                            checked={formData.shortnessOfBreath}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="shortnessOfBreath">
                            Shortness of Breath
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="fatigue"
                            name="fatigue"
                            checked={formData.fatigue}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="fatigue">
                            Fatigue
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="palpitations"
                            name="palpitations"
                            checked={formData.palpitations}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="palpitations">
                            Palpitations
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="dizziness"
                            name="dizziness"
                            checked={formData.dizziness}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="dizziness">
                            Dizziness
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="swelling"
                            name="swelling"
                            checked={formData.swelling}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="swelling">
                            Swelling in Legs/Ankles
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="nausea"
                            name="nausea"
                            checked={formData.nausea}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="nausea">
                            Nausea
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="coldSweats"
                            name="coldSweats"
                            checked={formData.coldSweats}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="coldSweats">
                            Cold Sweats
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="painJawNeckBack"
                            name="painJawNeckBack"
                            checked={formData.painJawNeckBack}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="painJawNeckBack">
                            Pain in Jaw/Neck/Back
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="leftArmPain"
                            name="leftArmPain"
                            checked={formData.leftArmPain}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="leftArmPain">
                            Left Arm Pain
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Physiological Indicators Section - Show only for AI or Physiological assessment */}
                  {(predictionType === 'ai' || predictionType === 'physiological') && (
                    <>
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
                          <h5 className="mb-3">Additional Physiological Measurements</h5>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="heartRate" className="form-label">Resting Heart Rate (BPM)</label>
                          <input
                            type="number"
                            className="form-control"
                            id="heartRate"
                            name="heartRate"
                            value={formData.heartRate}
                            onChange={handleInputChange}
                            min="40"
                            max="200"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="waistHipRatio" className="form-label">Waist-Hip Ratio</label>
                          <input
                            type="number"
                            className="form-control"
                            id="waistHipRatio"
                            name="waistHipRatio"
                            value={formData.waistHipRatio}
                            onChange={handleInputChange}
                            min="0.5"
                            max="2"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Lifestyle Factors Section - Show only for AI or Lifestyle assessment */}
                  {(predictionType === 'ai' || predictionType === 'lifestyle') && (
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
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="highSaltDiet"
                            name="highSaltDiet"
                            checked={formData.highSaltDiet}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="highSaltDiet">
                            High Salt Diet
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="highFatDiet"
                            name="highFatDiet"
                            checked={formData.highFatDiet}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="highFatDiet">
                            High Fat Diet
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="sleepHours" className="form-label">Sleep Hours (per day)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="sleepHours"
                          name="sleepHours"
                          value={formData.sleepHours}
                          onChange={handleInputChange}
                          min="1"
                          max="16"
                          step="0.5"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="stressLevel" className="form-label">Stress Level (1-10)</label>
                        <select
                          className="form-select"
                          id="stressLevel"
                          name="stressLevel"
                          value={formData.stressLevel}
                          onChange={handleInputChange}
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="workHours" className="form-label">Work Hours (per week)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="workHours"
                          name="workHours"
                          value={formData.workHours}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Genetic History Section - Show only for AI or Genetic assessment */}
                  {(predictionType === 'ai' || predictionType === 'genetic') && (
                    <div className="row mb-4">
                      <div className="col-12">
                        <h5 className="mb-3">Genetic and Family History</h5>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="familyHistory"
                            name="familyHistory"
                            checked={formData.familyHistory}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="familyHistory">
                            Family History of Heart Disease
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="geneticDisorders"
                            name="geneticDisorders"
                            checked={formData.geneticDisorders}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="geneticDisorders">
                            Genetic Disorders
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="previousHeartProblems"
                            name="previousHeartProblems"
                            checked={formData.previousHeartProblems}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="previousHeartProblems">
                            Previous Heart Problems
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Risk Conditions - Show only for AI or Additional assessment */}
                  {(predictionType === 'ai' || predictionType === 'additional') && (
                    <div className="row mb-4">
                      <div className="col-12">
                        <h5 className="mb-3">Additional Risk Conditions</h5>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="diabetes"
                            name="diabetes"
                            checked={formData.diabetes}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="diabetes">
                            Diabetes
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="hypertension"
                            name="hypertension"
                            checked={formData.hypertension}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="hypertension">
                            Hypertension
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="kidneyDisease"
                            name="kidneyDisease"
                            checked={formData.kidneyDisease}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="kidneyDisease">
                            Kidney Disease
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="thyroidDisorders"
                            name="thyroidDisorders"
                            checked={formData.thyroidDisorders}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="thyroidDisorders">
                            Thyroid Disorders
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="anemia"
                            name="anemia"
                            checked={formData.anemia}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="anemia">
                            Anemia
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="autoimmune"
                            name="autoimmune"
                            checked={formData.autoimmune}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="autoimmune">
                            Autoimmune Disorders
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="metabolicSyndrome"
                            name="metabolicSyndrome"
                            checked={formData.metabolicSyndrome}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="metabolicSyndrome">
                            Metabolic Syndrome
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
