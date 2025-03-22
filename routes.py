from flask import jsonify, request, render_template
from app import app, db, mail
from models import User, Doctor, Prediction, Appointment
from flask_mail import Message
from ml_model import predict_cardio_disease
import logging
from datetime import datetime
from werkzeug.security import generate_password_hash
import json

# Serve main React app
@app.route('/')
@app.route('/<path:path>')
def index(path=None):
    return render_template('index.html')

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        full_name=data['fullName'],
        age=data.get('age'),
        gender=data.get('gender'),
        role=data['role']
    )
    user.set_password(data['password'])
    
    try:
        # First commit the user to get an ID
        db.session.add(user)
        db.session.commit()
        
        # If user is a doctor, create doctor profile after user has an ID
        if data['role'] == 'doctor' and 'doctor' in data:
            doctor_data = data['doctor']
            doctor = Doctor(
                user_id=user.id,
                specialization=doctor_data['specialization'],
                experience_years=doctor_data['experienceYears'],
                bio=doctor_data.get('bio', ''),
                available_days=','.join(doctor_data.get('availableDays', [])),
                available_hours=','.join(doctor_data.get('availableHours', []))
            )
            db.session.add(doctor)
            db.session.commit()
        
        return jsonify({'message': 'Registration successful', 'user': user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Find user by email
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    doctors_list = []
    
    for doctor in doctors:
        doctor_dict = doctor.to_dict()
        doctors_list.append(doctor_dict)
    
    return jsonify(doctors_list), 200

@app.route('/api/doctors/<int:doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404
    
    return jsonify(doctor.to_dict()), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    user_id = data['userId']
    
    # Extract prediction features
    features = {
        'age': data['age'],
        'gender': data['gender'],
        'height': data['height'],
        'weight': data['weight'],
        'systolic_bp': data['systolicBp'],
        'diastolic_bp': data['diastolicBp'],
        'cholesterol': data['cholesterol'],
        'glucose': data['glucose'],
        'smoking': data['smoking'],
        'alcohol': data['alcohol'],
        'physical_activity': data['physicalActivity']
    }
    
    # Get prediction from ML model
    prediction_result, prediction_label = predict_cardio_disease(features)
    
    # Create new prediction record
    prediction = Prediction(
        user_id=user_id,
        age=features['age'],
        gender=features['gender'],
        height=features['height'],
        weight=features['weight'],
        systolic_bp=features['systolic_bp'],
        diastolic_bp=features['diastolic_bp'],
        cholesterol=features['cholesterol'],
        glucose=features['glucose'],
        smoking=features['smoking'],
        alcohol=features['alcohol'],
        physical_activity=features['physical_activity'],
        prediction_result=prediction_result,
        prediction_label=prediction_label
    )
    
    db.session.add(prediction)
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Prediction successful',
            'prediction': prediction.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/api/users/<int:user_id>/predictions', methods=['GET'])
def get_user_predictions(user_id):
    predictions = Prediction.query.filter_by(user_id=user_id).order_by(Prediction.created_at.desc()).all()
    predictions_list = [prediction.to_dict() for prediction in predictions]
    
    return jsonify(predictions_list), 200

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    
    # Create new appointment
    appointment = Appointment(
        user_id=data['userId'],
        doctor_id=data['doctorId'],
        appointment_date=datetime.strptime(data['appointmentDate'], '%Y-%m-%d').date(),
        appointment_time=data['appointmentTime'],
        reason=data.get('reason', ''),
        status='pending'
    )
    
    db.session.add(appointment)
    
    try:
        db.session.commit()
        
        # Send confirmation email
        user = User.query.get(data['userId'])
        doctor_model = Doctor.query.get(data['doctorId'])
        doctor_user = User.query.get(doctor_model.user_id)
        
        send_appointment_confirmation(
            user.email,
            user.full_name,
            doctor_user.full_name,
            doctor_model.specialization,
            data['appointmentDate'],
            data['appointmentTime']
        )
        
        return jsonify({
            'message': 'Appointment created successfully',
            'appointment': appointment.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Appointment creation error: {str(e)}")
        return jsonify({'error': 'Failed to create appointment'}), 500

@app.route('/api/users/<int:user_id>/appointments', methods=['GET'])
def get_user_appointments(user_id):
    appointments = Appointment.query.filter_by(user_id=user_id).order_by(Appointment.appointment_date.desc()).all()
    appointments_list = [appointment.to_dict() for appointment in appointments]
    
    return jsonify(appointments_list), 200

@app.route('/api/doctors/<int:doctor_id>/appointments', methods=['GET'])
def get_doctor_appointments(doctor_id):
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).order_by(Appointment.appointment_date.desc()).all()
    appointments_list = [appointment.to_dict() for appointment in appointments]
    
    return jsonify(appointments_list), 200

@app.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    data = request.get_json()
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    # Update appointment fields
    if 'status' in data:
        appointment.status = data['status']
    if 'notes' in data:
        appointment.notes = data['notes']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Appointment updated successfully',
            'appointment': appointment.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Appointment update error: {str(e)}")
        return jsonify({'error': 'Failed to update appointment'}), 500

@app.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({'error': 'Appointment not found'}), 404
    
    db.session.delete(appointment)
    
    try:
        db.session.commit()
        return jsonify({'message': 'Appointment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Appointment deletion error: {str(e)}")
        return jsonify({'error': 'Failed to delete appointment'}), 500

# Helper function to send appointment confirmation email
def send_appointment_confirmation(recipient_email, patient_name, doctor_name, specialization, appointment_date, appointment_time):
    try:
        subject = "Appointment Confirmation"
        body = f"""
        Hello {patient_name},
        
        Your appointment with Dr. {doctor_name} ({specialization}) has been scheduled for {appointment_date} at {appointment_time}.
        
        Please arrive 15 minutes before your scheduled time.
        
        If you need to reschedule or cancel, please log in to your account or contact us.
        
        Thank you,
        CardioCare Team
        """
        
        msg = Message(
            subject=subject,
            recipients=[recipient_email],
            body=body
        )
        
        mail.send(msg)
    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")
