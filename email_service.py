import os
import sys
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

# Get SendGrid API key from environment variables
sendgrid_key = os.environ.get('SENDGRID_API_KEY')
if not sendgrid_key:
    logging.error("SENDGRID_API_KEY environment variable not set!")

def send_email(to_email, subject, text_content):
    """
    Generic function to send an email using SendGrid
    
    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        text_content (str): Email body content
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    if not sendgrid_key:
        logging.error("Cannot send email: SendGrid API key is missing")
        return False
        
    try:
        # Create SendGrid client
        sg = SendGridAPIClient(sendgrid_key)
        
        # Set up the email
        from_email = Email("healthsystem@example.com")  # Change this to your verified sender
        to_email = To(to_email)
        content = Content("text/plain", text_content)
        
        mail = Mail(from_email, to_email, subject, content)
        
        # Send the email
        response = sg.client.mail.send.post(request_body=mail.get())
        
        # Log the response
        logging.info(f"Email sent to {to_email.email}. Status code: {response.status_code}")
        
        # Check if successful
        if response.status_code >= 200 and response.status_code < 300:
            return True
        else:
            logging.error(f"Failed to send email. Status code: {response.status_code}")
            return False
            
    except Exception as e:
        logging.error(f"SendGrid error: {str(e)}")
        return False

def send_appointment_confirmation_email(recipient, appointment_details):
    """
    Send appointment confirmation email to the user.
    
    Args:
        recipient (str): Email address of the recipient
        appointment_details (dict): Dictionary containing appointment details
    """
    try:
        logging.info(f"Preparing to send confirmation email to {recipient}")
        logging.debug(f"Appointment details: {appointment_details}")
        
        # Get priority-specific information
        priority_text = ""
        if 'priority' in appointment_details:
            if appointment_details['priority'].lower() == 'urgent':
                priority_text = "\nThis appointment has been marked as URGENT. Special priority will be given."
            elif appointment_details['priority'].lower() == 'emergency':
                priority_text = "\nThis appointment has been marked as EMERGENCY. Please contact us immediately if your condition worsens before the appointment date."
        
        # Get additional notes
        notes_text = ""
        if 'notes' in appointment_details and appointment_details['notes']:
            notes_text = f"\nAdditional Notes: {appointment_details['notes']}"
        
        # Get follow-up information
        follow_up_text = ""
        if 'follow_up' in appointment_details and appointment_details['follow_up'] == 'Yes':
            follow_up_text = "\nThis is scheduled as a follow-up appointment."
        
        # Get medical records information
        records_text = ""
        if 'medical_records' in appointment_details and appointment_details['medical_records'] == 'Yes':
            records_text = "\nYou have indicated that you will bring your medical records to this appointment."

        subject = "Appointment Confirmation - Smart Healthcare Ecosystem"
        body = f"""
Dear {appointment_details['patient_name']},

Your appointment with Dr. {appointment_details['doctor_name']} ({appointment_details['specialization']}) has been confirmed.

Appointment Details:
Date: {appointment_details['date']}
Time: {appointment_details['time']}
Reason: {appointment_details['reason']}{priority_text}{follow_up_text}{notes_text}{records_text}

Location: Smart Healthcare Center

Preparation Instructions:
- Arrive 15 minutes early to complete any necessary paperwork
- Bring a list of current medications and dosages
- Bring your insurance card and ID
- Fast for 8 hours prior to appointment if lab work might be needed
- Wear comfortable clothing that allows easy examination

If you need to reschedule or cancel, please log in to your account or contact us.

We've added this appointment to your personal health calendar in your user dashboard.

Thank you for choosing Smart Healthcare Ecosystem!

Best regards,
The Smart Healthcare Team
        """
        
        # Use the generic send_email function
        email_sent = send_email(recipient, subject, body)
        
        if email_sent:
            logging.info(f"Appointment confirmation email sent to {recipient}")
            return True
        else:
            logging.error(f"Failed to send appointment confirmation email to {recipient}")
            return False
    
    except Exception as e:
        logging.error(f"Exception in send_appointment_confirmation_email: {str(e)}")
        return False

def send_appointment_reminder_email(recipient, appointment_details):
    """
    Send appointment reminder email to the user.
    
    Args:
        recipient (str): Email address of the recipient
        appointment_details (dict): Dictionary containing appointment details
    """
    try:
        logging.info(f"Preparing to send reminder email to {recipient}")
        
        subject = "Appointment Reminder - Smart Healthcare Ecosystem"
        body = f"""
Dear {appointment_details['patient_name']},

This is a friendly reminder for your upcoming appointment with Dr. {appointment_details['doctor_name']} ({appointment_details['specialization']}).

Appointment Details:
Date: {appointment_details['date']}
Time: {appointment_details['time']}
Reason: {appointment_details.get('reason', 'Not specified')}

Location: Smart Healthcare Center

Pre-appointment checklist:
- Please bring any previous medical records related to your condition
- Bring a list of current medications
- Have your ID and insurance card ready (if applicable)
- Complete any pre-appointment forms in your patient portal
- Fast for 8 hours if your appointment includes lab work

Please arrive 15 minutes before your scheduled appointment time.
If you need to reschedule or cancel, please log in to your account or contact us at least 24 hours in advance.

You can use our mobile app to get directions to our center and check in digitally when you arrive.

Thank you for choosing Smart Healthcare Ecosystem!

Best regards,
The Smart Healthcare Team
        """
        
        # Use the generic send_email function
        email_sent = send_email(recipient, subject, body)
        
        if email_sent:
            logging.info(f"Appointment reminder email sent to {recipient}")
            return True
        else:
            logging.error(f"Failed to send appointment reminder email to {recipient}")
            return False
    
    except Exception as e:
        logging.error(f"Exception in send_appointment_reminder_email: {str(e)}")
        return False

def send_prediction_result_email(recipient, prediction_details):
    """
    Send prediction result email to the user.
    
    Args:
        recipient (str): Email address of the recipient
        prediction_details (dict): Dictionary containing prediction details
    """
    try:
        subject = "Your Smart Healthcare Cardiovascular Risk Assessment Results"
        
        risk_level = "High" if prediction_details['prediction_label'] else "Low"
        risk_percentage = f"{prediction_details['prediction_result'] * 100:.1f}%"
        
        body = f"""
        Dear {prediction_details['patient_name']},
        
        Thank you for using our Smart Healthcare Ecosystem Prediction Service. Below are your cardiovascular risk assessment results:
        
        ✱ Risk Assessment: {risk_level} Risk
        ✱ Risk Percentage: {risk_percentage}
        
        {get_recommendation_text(prediction_details)}
        
        Next Steps:
        1. Schedule a consultation with one of our cardiologists to discuss your results
        2. Download our mobile app to track your health metrics daily
        3. Join our online support community for heart health tips and discussions
        4. Consider enrolling in our heart health wellness program
        
        Important Health Metrics to Monitor:
        - Blood Pressure: Target below 120/80 mmHg
        - Total Cholesterol: Target below 200 mg/dL
        - Resting Heart Rate: Target 60-100 BPM
        - BMI: Target 18.5-24.9
        
        Please note that this is an AI-based prediction and not a medical diagnosis. 
        We recommend consulting with a healthcare professional for a comprehensive evaluation.
        
        You can view your complete results and history by logging into your account dashboard.
        
        Stay healthy!
        
        Best regards,
        The Smart Healthcare Team
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
    recommendations = ["Based on your results, here are personalized recommendations for improving your heart health:"]
    
    # Blood pressure recommendations
    if prediction_details.get('systolic_bp', 0) > 140 or prediction_details.get('diastolic_bp', 0) > 90:
        recommendations.append("- Monitor your blood pressure daily and log readings in our mobile app")
        recommendations.append("- Reduce sodium intake to less than 1,500mg per day")
        recommendations.append("- Consider the DASH diet (Dietary Approaches to Stop Hypertension)")
        recommendations.append("- Practice stress reduction techniques like meditation or deep breathing exercises")
    
    # Cholesterol recommendations
    if prediction_details.get('cholesterol', 0) > 1:
        recommendations.append("- Increase consumption of foods rich in omega-3 fatty acids (salmon, walnuts, flaxseeds)")
        recommendations.append("- Add more soluble fiber to your diet (oats, beans, fruits)")
        recommendations.append("- Limit saturated fats and eliminate trans fats from your diet")
        recommendations.append("- Consider plant sterols/stanols supplements after consulting with your doctor")
    
    # Lifestyle recommendations
    if prediction_details.get('smoking', False):
        recommendations.append("- Join our smoking cessation program with personalized support")
        recommendations.append("- Download our app's quit-smoking tracker to monitor your progress")
        recommendations.append("- Consider nicotine replacement therapy or prescription medications (consult your doctor)")
    
    if prediction_details.get('alcohol', False):
        recommendations.append("- Limit alcohol to no more than 1 drink per day for women or 2 for men")
        recommendations.append("- Try alcohol-free days at least 3-4 days per week")
        recommendations.append("- Replace alcoholic beverages with heart-healthy alternatives like unsweetened tea")
    
    if not prediction_details.get('physical_activity', True):
        recommendations.append("- Start with 10-minute walks and gradually increase to 30 minutes daily")
        recommendations.append("- Aim for 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly")
        recommendations.append("- Add strength training exercises at least twice per week")
        recommendations.append("- Join our virtual fitness classes designed for heart health")
    
    # Weight recommendations
    if prediction_details.get('weight', 0) > 0 and prediction_details.get('height', 0) > 0:
        height_m = prediction_details['height'] / 100  # convert cm to m
        bmi = prediction_details['weight'] / (height_m * height_m)
        if bmi > 30:
            recommendations.append("- Consider our medically supervised weight management program")
            recommendations.append("- Schedule a consultation with our nutritionist for a personalized meal plan")
        elif bmi > 25:
            recommendations.append("- Aim for a 5-10% weight reduction over 6 months through diet and exercise")
            recommendations.append("- Use our meal planning tools in the mobile app to track calorie intake")
            recommendations.append("- Consider joining our weekly support group for weight management")
    
    # Sleep recommendations
    if prediction_details.get('sleep_hours', 0) < 7:
        recommendations.append("- Aim for 7-9 hours of quality sleep per night")
        recommendations.append("- Establish a regular sleep schedule and bedtime routine")
        recommendations.append("- Use our sleep tracker to monitor your sleep patterns")
    
    # Stress management
    if prediction_details.get('stress_level', 0) > 6:
        recommendations.append("- Practice mindfulness meditation for 10-15 minutes daily")
        recommendations.append("- Consider joining our stress management workshop")
        recommendations.append("- Try progressive muscle relaxation techniques before bedtime")
    
    # Nutrition recommendations
    if prediction_details.get('high_salt_diet', False) or prediction_details.get('high_fat_diet', False):
        recommendations.append("- Follow a Mediterranean or DASH diet rich in fruits, vegetables, whole grains, and lean proteins")
        recommendations.append("- Use our nutrition tracking feature to monitor your daily intake")
        recommendations.append("- Download our heart-healthy recipe collection with meal prep guides")
    
    # Follow-up care
    recommendations.append("- Schedule a follow-up with one of our cardiologists for a comprehensive evaluation")
    recommendations.append("- Consider our Remote Patient Monitoring program for continuous cardiac care")
    recommendations.append("- Join our monthly heart health webinars to stay informed about the latest advances")
    
    return "\n".join(recommendations)
