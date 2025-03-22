import numpy as np
from sklearn.ensemble import RandomForestClassifier
import logging

# Initialize the model
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)

# Sample data to initially train the model
# In a real application, you would load a pre-trained model
# or train with a large dataset
def initialize_model():
    try:
        # Sample data features 
        # age,gender,height,weight,systolic_bp,diastolic_bp,cholesterol,glucose,smoking,alcohol,physical_activity,cardio
        X = np.array([
            [50, 1, 165, 70, 120, 80, 1, 1, 0, 0, 1, 0],
            [55, 1, 170, 80, 140, 90, 2, 1, 1, 0, 0, 1],
            [60, 0, 160, 65, 150, 95, 3, 2, 1, 1, 0, 1],
            [45, 1, 175, 75, 130, 85, 1, 1, 0, 0, 1, 0],
            [52, 0, 162, 68, 125, 82, 1, 1, 0, 0, 1, 0],
            [58, 1, 178, 90, 135, 88, 2, 2, 1, 1, 0, 1],
            [63, 0, 155, 60, 155, 98, 3, 2, 1, 0, 0, 1],
            [48, 1, 172, 78, 118, 78, 1, 1, 0, 1, 1, 0],
            [57, 0, 159, 63, 145, 94, 2, 2, 1, 0, 0, 1],
            [65, 1, 168, 82, 160, 100, 3, 3, 1, 1, 0, 1],
            [43, 0, 163, 65, 120, 80, 1, 1, 0, 0, 1, 0],
            [53, 1, 175, 88, 130, 85, 2, 1, 1, 1, 0, 0],
            [61, 0, 158, 72, 150, 95, 2, 2, 1, 0, 0, 1],
            [47, 1, 180, 85, 125, 82, 1, 1, 0, 1, 1, 0],
            [59, 0, 165, 75, 140, 90, 2, 2, 1, 0, 0, 1],
            [51, 1, 172, 78, 130, 85, 1, 1, 0, 0, 1, 0],
            [56, 0, 160, 68, 145, 92, 2, 2, 1, 0, 0, 1],
            [62, 1, 170, 80, 150, 95, 3, 2, 1, 1, 0, 1],
            [46, 0, 158, 60, 120, 80, 1, 1, 0, 0, 1, 0],
            [54, 1, 175, 85, 135, 88, 2, 1, 1, 0, 0, 0]
        ])
        
        # Extract features and target
        features = X[:, 0:11]
        target = X[:, 11]
        
        # Train the model
        model.fit(features, target)
        logging.info("Model initialized successfully")
        return True
    
    except Exception as e:
        logging.error(f"Error initializing model: {str(e)}")
        return False

def preprocess_features(features_dict):
    """Convert the features dictionary to a numpy array for prediction."""
    try:
        # Convert gender to binary (1 for male, 0 for female)
        gender_binary = 1 if features_dict['gender'].lower() == 'male' else 0
        
        # Create feature array in the correct order
        features_array = np.array([
            features_dict['age'],
            gender_binary,
            features_dict['height'],
            features_dict['weight'],
            features_dict['systolic_bp'],
            features_dict['diastolic_bp'],
            features_dict['cholesterol'],
            features_dict['glucose'],
            1 if features_dict['smoking'] else 0,
            1 if features_dict['alcohol'] else 0,
            1 if features_dict['physical_activity'] else 0
        ]).reshape(1, -1)
        
        return features_array
    
    except Exception as e:
        logging.error(f"Error preprocessing features: {str(e)}")
        raise

def predict_cardio_disease(features_dict):
    """Predict the probability of cardiovascular disease."""
    try:
        # Make sure model is initialized
        if not hasattr(model, 'classes_'):
            initialize_model()
        
        # Preprocess features
        features_array = preprocess_features(features_dict)
        
        # Get prediction probabilities
        probabilities = model.predict_proba(features_array)[0]
        
        # Get the probability for positive class (has cardio disease)
        positive_probability = probabilities[1] if len(probabilities) > 1 else probabilities[0]
        
        # Get prediction label (0: no disease, 1: disease)
        prediction_label = 1 if positive_probability >= 0.5 else 0
        
        return float(positive_probability), bool(prediction_label)
    
    except Exception as e:
        logging.error(f"Error predicting cardio disease: {str(e)}")
        # Return default values in case of error
        return 0.0, False

# Initialize the model when this module is imported
initialize_model()
