from app import db
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    role = db.Column(db.String(10), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Define relationships
    predictions = db.relationship('Prediction', backref='user', lazy=True)
    appointments = db.relationship('Appointment', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'full_name': self.full_name,
            'age': self.age,
            'gender': self.gender,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    experience_years = db.Column(db.Integer, nullable=False)
    bio = db.Column(db.Text, nullable=True)
    available_days = db.Column(db.String(100), nullable=True)  # Comma-separated days
    available_hours = db.Column(db.String(100), nullable=True)  # Comma-separated hours
    
    # Define relationships
    appointments = db.relationship('Appointment', backref='doctor', lazy=True)
    
    def to_dict(self):
        user = User.query.get(self.user_id)
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': user.full_name if user else None,
            'email': user.email if user else None,
            'specialization': self.specialization,
            'experience_years': self.experience_years,
            'bio': self.bio,
            'available_days': self.available_days.split(',') if self.available_days else [],
            'available_hours': self.available_hours.split(',') if self.available_hours else []
        }

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Basic Information
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    height = db.Column(db.Float, nullable=False)  # in cm
    weight = db.Column(db.Float, nullable=False)  # in kg
    
    # Category 1: Clinical Symptoms
    chest_pain = db.Column(db.Boolean, default=False)
    shortness_of_breath = db.Column(db.Boolean, default=False)
    fatigue = db.Column(db.Boolean, default=False)
    palpitations = db.Column(db.Boolean, default=False)
    dizziness = db.Column(db.Boolean, default=False)
    swelling = db.Column(db.Boolean, default=False)
    nausea = db.Column(db.Boolean, default=False)
    cold_sweats = db.Column(db.Boolean, default=False)
    pain_jaw_neck_back = db.Column(db.Boolean, default=False)
    left_arm_pain = db.Column(db.Boolean, default=False)
    
    # Category 2: Physiological and Medical Indicators
    systolic_bp = db.Column(db.Integer, nullable=False)  # upper blood pressure
    diastolic_bp = db.Column(db.Integer, nullable=False)  # lower blood pressure
    cholesterol = db.Column(db.Integer, nullable=False)  # 1: normal, 2: above normal, 3: well above normal
    hdl_cholesterol = db.Column(db.Float, nullable=True)  # mg/dL
    ldl_cholesterol = db.Column(db.Float, nullable=True)  # mg/dL
    glucose = db.Column(db.Integer, nullable=False)  # 1: normal, 2: above normal, 3: well above normal
    heart_rate = db.Column(db.Integer, nullable=True)  # beats per minute
    waist_hip_ratio = db.Column(db.Float, nullable=True)
    triglycerides = db.Column(db.Float, nullable=True)
    c_reactive_protein = db.Column(db.Float, nullable=True)
    
    # Category 3: Lifestyle and Behavioral Risk Factors
    smoking = db.Column(db.Boolean, nullable=False)
    alcohol = db.Column(db.Boolean, nullable=False)
    physical_activity = db.Column(db.Boolean, nullable=False)
    high_salt_diet = db.Column(db.Boolean, default=False)
    high_fat_diet = db.Column(db.Boolean, default=False)
    sleep_hours = db.Column(db.Float, nullable=True)  # hours per day
    stress_level = db.Column(db.Integer, nullable=True)  # 1-10 scale
    work_hours = db.Column(db.Integer, nullable=True)  # hours per week
    
    # Category 4: Genetic and Family History
    family_history = db.Column(db.Boolean, default=False)
    genetic_disorders = db.Column(db.Boolean, default=False)
    previous_heart_problems = db.Column(db.Boolean, default=False)
    
    # Category 5: Additional Risk Conditions
    diabetes = db.Column(db.Boolean, default=False)
    hypertension = db.Column(db.Boolean, default=False)
    kidney_disease = db.Column(db.Boolean, default=False)
    thyroid_disorders = db.Column(db.Boolean, default=False)
    anemia = db.Column(db.Boolean, default=False)
    autoimmune_disorders = db.Column(db.Boolean, default=False)
    metabolic_syndrome = db.Column(db.Boolean, default=False)
    
    # Prediction Results
    prediction_result = db.Column(db.Float, nullable=False)  # Probability of cardio disease
    prediction_label = db.Column(db.Boolean, nullable=False)  # 0: no disease, 1: disease
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            
            # Basic Information
            'age': self.age,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            
            # Category 1: Clinical Symptoms
            'chest_pain': self.chest_pain,
            'shortness_of_breath': self.shortness_of_breath,
            'fatigue': self.fatigue,
            'palpitations': self.palpitations,
            'dizziness': self.dizziness,
            'swelling': self.swelling,
            'nausea': self.nausea,
            'cold_sweats': self.cold_sweats,
            'pain_jaw_neck_back': self.pain_jaw_neck_back,
            'left_arm_pain': self.left_arm_pain,
            
            # Category 2: Physiological and Medical Indicators
            'systolic_bp': self.systolic_bp,
            'diastolic_bp': self.diastolic_bp,
            'cholesterol': self.cholesterol,
            'hdl_cholesterol': self.hdl_cholesterol,
            'ldl_cholesterol': self.ldl_cholesterol,
            'glucose': self.glucose,
            'heart_rate': self.heart_rate,
            'waist_hip_ratio': self.waist_hip_ratio,
            'triglycerides': self.triglycerides,
            'c_reactive_protein': self.c_reactive_protein,
            
            # Category 3: Lifestyle and Behavioral Risk Factors
            'smoking': self.smoking,
            'alcohol': self.alcohol,
            'physical_activity': self.physical_activity,
            'high_salt_diet': self.high_salt_diet,
            'high_fat_diet': self.high_fat_diet,
            'sleep_hours': self.sleep_hours,
            'stress_level': self.stress_level,
            'work_hours': self.work_hours,
            
            # Category 4: Genetic and Family History
            'family_history': self.family_history,
            'genetic_disorders': self.genetic_disorders,
            'previous_heart_problems': self.previous_heart_problems,
            
            # Category 5: Additional Risk Conditions
            'diabetes': self.diabetes,
            'hypertension': self.hypertension,
            'kidney_disease': self.kidney_disease,
            'thyroid_disorders': self.thyroid_disorders,
            'anemia': self.anemia,
            'autoimmune_disorders': self.autoimmune_disorders,
            'metabolic_syndrome': self.metabolic_syndrome,
            
            # Prediction Results
            'prediction_result': self.prediction_result,
            'prediction_label': self.prediction_label,
            'created_at': self.created_at.isoformat()
        }

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.String(10), nullable=False)
    reason = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, completed, cancelled
    notes = db.Column(db.Text, nullable=True)
    payment_status = db.Column(db.String(20), default='unpaid')  # unpaid, paid
    payment_method = db.Column(db.String(50), nullable=True)  # credit_card, paypal, insurance, etc.
    payment_amount = db.Column(db.Float, default=0.0)
    payment_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        user = User.query.get(self.user_id)
        doctor_model = Doctor.query.get(self.doctor_id)
        doctor_user = User.query.get(doctor_model.user_id) if doctor_model else None
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'doctor_id': self.doctor_id,
            'patient_name': user.full_name if user else None,
            'doctor_name': doctor_user.full_name if doctor_user else None,
            'specialization': doctor_model.specialization if doctor_model else None,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'appointment_time': self.appointment_time,
            'reason': self.reason,
            'status': self.status,
            'notes': self.notes,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'payment_amount': self.payment_amount,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'created_at': self.created_at.isoformat()
        }
