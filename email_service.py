from flask_mail import Message
from app import mail
import logging

def send_appointment_confirmation_email(recipient, appointment_details):
    """
    Send appointment confirmation email to the user.
    
    Args:
        recipient (str): Email address of the recipient
        appointment_details (dict): Dictionary containing appointment details
    """
    try:
        subject = "Appointment Confirmation - CardioHealth"
        body = f"""
        Dear {appointment_details['patient_name']},
        
        Your appointment with Dr. {appointment_details['doctor_name']} has been confirmed.
        
        Appointment Details:
        Date: {appointment_details['date']}
        Time: {appointment_details['time']}
        Reason: {appointment_details['reason']}
        
        Location: CardioHealth Center
        
        Please arrive 15 minutes before your scheduled appointment time.
        If you need to reschedule or cancel, please log in to your account or contact us.
        
        Thank you for choosing CardioHealth!
        
        Best regards,
        The CardioHealth Team
        """
        
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body
        )
        
        mail.send(msg)
        logging.info(f"Appointment confirmation email sent to {recipient}")
        return True
    
    except Exception as e:
        logging.error(f"Failed to send appointment confirmation email: {str(e)}")
        return False

def send_appointment_reminder_email(recipient, appointment_details):
    """
    Send appointment reminder email to the user.
    
    Args:
        recipient (str): Email address of the recipient
        appointment_details (dict): Dictionary containing appointment details
    """
    try:
        subject = "Appointment Reminder - CardioHealth"
        body = f"""
        Dear {appointment_details['patient_name']},
        
        This is a reminder for your upcoming appointment with Dr. {appointment_details['doctor_name']}.
        
        Appointment Details:
        Date: {appointment_details['date']}
        Time: {appointment_details['time']}
        
        Location: CardioHealth Center
        
        Please arrive 15 minutes before your scheduled appointment time.
        If you need to reschedule or cancel, please log in to your account or contact us.
        
        Thank you for choosing CardioHealth!
        
        Best regards,
        The CardioHealth Team
        """
        
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body
        )
        
        mail.send(msg)
        logging.info(f"Appointment reminder email sent to {recipient}")
        return True
    
    except Exception as e:
        logging.error(f"Failed to send appointment reminder email: {str(e)}")
        return False

def send_prediction_result_email(recipient, prediction_details):
    """
    Send prediction result email to the user.
    
    Args:
        recipient (str): Email address of the recipient
        prediction_details (dict): Dictionary containing prediction details
    """
    try:
        subject = "Your CardioHealth Prediction Results"
        
        risk_level = "High" if prediction_details['prediction_label'] else "Low"
        risk_percentage = f"{prediction_details['prediction_result'] * 100:.1f}%"
        
        body = f"""
        Dear {prediction_details['patient_name']},
        
        Thank you for using our CardioHealth Prediction Service. Below are your results:
        
        Risk Assessment: {risk_level} Risk
        Risk Percentage: {risk_percentage}
        
        {get_recommendation_text(prediction_details)}
        
        Please note that this is an AI-based prediction and not a medical diagnosis. 
        We recommend consulting with a healthcare professional for a comprehensive evaluation.
        
        You can view your complete results and history by logging into your account.
        
        Best regards,
        The CardioHealth Team
        """
        
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body
        )
        
        mail.send(msg)
        logging.info(f"Prediction result email sent to {recipient}")
        return True
    
    except Exception as e:
        logging.error(f"Failed to send prediction result email: {str(e)}")
        return False

def get_recommendation_text(prediction_details):
    """Generate personalized recommendations based on prediction details."""
    recommendations = ["Based on your results, here are some recommendations:"]
    
    # Blood pressure recommendations
    if prediction_details.get('systolic_bp', 0) > 140 or prediction_details.get('diastolic_bp', 0) > 90:
        recommendations.append("- Monitor your blood pressure regularly and consult with a doctor")
    
    # Cholesterol recommendations
    if prediction_details.get('cholesterol', 0) > 1:
        recommendations.append("- Consider a heart-healthy diet low in saturated fats and cholesterol")
    
    # Lifestyle recommendations
    if prediction_details.get('smoking', False):
        recommendations.append("- Quitting smoking would significantly reduce your cardiovascular risk")
    
    if prediction_details.get('alcohol', False):
        recommendations.append("- Limit alcohol consumption to improve heart health")
    
    if not prediction_details.get('physical_activity', True):
        recommendations.append("- Regular physical activity (at least 150 minutes per week) is recommended")
    
    # Weight recommendations
    if prediction_details.get('weight', 0) > 0 and prediction_details.get('height', 0) > 0:
        height_m = prediction_details['height'] / 100  # convert cm to m
        bmi = prediction_details['weight'] / (height_m * height_m)
        if bmi > 25:
            recommendations.append("- Consider weight management strategies to achieve a healthy BMI")
    
    # General recommendations
    recommendations.append("- Schedule a follow-up with a cardiologist for a comprehensive evaluation")
    
    return "\n".join(recommendations)
