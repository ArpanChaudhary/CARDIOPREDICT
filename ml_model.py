import numpy as np
from sklearn.ensemble import RandomForestClassifier
import logging

# Initialize the model with more complex features
model = RandomForestClassifier(
    n_estimators=150,
    max_depth=12,
    random_state=42,
    class_weight='balanced'
)

# Set up logging
logging.basicConfig(level=logging.INFO)

def initialize_model():
    """Initialize and train the model with sample data."""
    try:
        # Define feature columns for our enhanced dataset
        # The sequence is based on 5 categories of features
        
        # Format of training data:
        # Basic: [age, gender, height, weight]
        # Cat1: [chest_pain, shortness_of_breath, fatigue, palpitations, dizziness]
        # Cat2: [systolic_bp, diastolic_bp, cholesterol, glucose, heart_rate]
        # Cat3: [smoking, alcohol, physical_activity, high_salt_diet, high_fat_diet]
        # Cat4: [family_history, genetic_disorders, previous_heart_problems]
        # Cat5: [diabetes, hypertension, kidney_disease]
        # Label: [cardio disease present]
        
        # Generate synthetic training data that captures medical relationships
        X = np.array([
            # Healthy young individual with good lifestyle
            [28, 1, 175, 70, 0, 0, 0, 0, 0, 110, 70, 1, 1, 72, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            # Middle-aged with mild risk factors
            [45, 1, 180, 82, 0, 0, 0, 0, 0, 120, 80, 1, 1, 75, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            # Middle-aged with some risk factors
            [52, 0, 165, 75, 0, 0, 1, 0, 0, 135, 85, 2, 1, 76, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            # Older with multiple risk factors
            [63, 1, 172, 88, 1, 1, 1, 0, 0, 142, 92, 2, 1, 82, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1],
            # Older with significant clinical symptoms
            [68, 0, 160, 65, 1, 1, 1, 1, 1, 155, 95, 3, 2, 88, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
            # Middle-aged with diabetes
            [50, 1, 175, 95, 0, 0, 1, 0, 0, 130, 85, 2, 2, 78, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0],
            # Middle-aged with hypertension
            [55, 0, 162, 70, 0, 1, 1, 0, 1, 160, 100, 2, 1, 80, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            # Young with family history
            [35, 1, 178, 72, 0, 0, 0, 1, 0, 118, 78, 1, 1, 70, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            # Older with severe cardio symptoms
            [72, 0, 155, 60, 1, 1, 1, 1, 1, 170, 105, 3, 2, 90, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            # Middle-aged with kidney disease
            [58, 1, 170, 85, 0, 0, 1, 0, 1, 145, 95, 2, 2, 82, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            # Older with multiple conditions
            [65, 0, 160, 68, 1, 1, 1, 1, 0, 155, 98, 3, 2, 85, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            # Young with lifestyle issues
            [32, 1, 182, 90, 0, 0, 0, 0, 0, 125, 80, 1, 1, 72, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            # Middle-aged with multiple symptoms
            [48, 0, 165, 75, 1, 1, 0, 1, 0, 140, 90, 2, 1, 80, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            # Healthy older individual
            [70, 1, 168, 72, 0, 0, 1, 0, 0, 130, 85, 1, 1, 75, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            # Middle-aged with genetic predisposition
            [45, 0, 163, 68, 0, 0, 0, 0, 0, 125, 82, 1, 1, 74, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            # Young adult with metabolic issues
            [38, 1, 175, 105, 0, 0, 1, 0, 0, 135, 88, 2, 2, 78, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            # Older with pain symptoms
            [68, 0, 160, 65, 1, 0, 0, 0, 0, 150, 90, 2, 1, 82, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            # Middle-aged with cardio symptoms and poor lifestyle
            [52, 1, 175, 88, 1, 1, 1, 1, 1, 145, 95, 2, 2, 84, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1],
            # Young adult with anemia
            [30, 0, 165, 55, 0, 0, 1, 0, 1, 110, 70, 1, 1, 85, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            # Middle-aged with thyroid issues
            [55, 0, 158, 80, 0, 0, 1, 0, 0, 130, 85, 2, 1, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            # Elderly with autoimmune issues
            [75, 1, 170, 68, 0, 1, 1, 0, 1, 148, 88, 2, 1, 78, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
            # Young with normal health
            [25, 0, 160, 55, 0, 0, 0, 0, 0, 110, 70, 1, 1, 68, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            # Middle-aged with kidney issues
            [50, 1, 175, 82, 0, 0, 0, 0, 0, 140, 90, 2, 1, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            # Older with diabetes and heart problems
            [65, 0, 160, 70, 1, 1, 1, 1, 0, 150, 95, 2, 3, 82, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
            # Middle-aged with metabolic syndrome
            [48, 1, 175, 95, 0, 0, 1, 0, 0, 140, 90, 2, 2, 78, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            # Elderly with multiple conditions
            [78, 0, 158, 60, 1, 1, 1, 1, 1, 165, 100, 3, 2, 90, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            # Young with family history but good lifestyle
            [32, 1, 180, 75, 0, 0, 0, 0, 0, 118, 76, 1, 1, 68, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            # Middle-aged with high stress
            [45, 0, 165, 72, 0, 0, 1, 1, 0, 132, 88, 1, 1, 82, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            # Healthy elderly
            [72, 1, 168, 70, 0, 0, 0, 0, 0, 128, 82, 1, 1, 72, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            # Young with poor lifestyle
            [28, 1, 182, 98, 0, 0, 0, 0, 0, 125, 80, 1, 1, 75, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]
        ])
        
        # Split into features and target
        features = X[:, :-1]  # All columns except the last
        target = X[:, -1]     # Last column is the target
        
        # Train the model
        model.fit(features, target)
        logging.info("Enhanced cardiovascular prediction model initialized successfully")
        return True
    
    except Exception as e:
        logging.error(f"Error initializing enhanced model: {str(e)}")
        return False

def preprocess_features(features_dict):
    """Convert the features dictionary to a numpy array for prediction."""
    try:
        # Convert gender to binary (1 for male, 0 for female)
        gender_binary = 1 if features_dict.get('gender', '').lower() == 'male' else 0
        
        # Process optional fields with defaults
        # Define default values for features that might not be present
        defaults = {
            # Basic info
            'age': 50, 'height': 170, 'weight': 70,
            
            # Category 1: Clinical Symptoms (convert to 0/1)
            'chest_pain': 0, 'shortness_of_breath': 0, 'fatigue': 0, 
            'palpitations': 0, 'dizziness': 0,
            
            # Category 2: Physiological indicators
            'systolic_bp': 120, 'diastolic_bp': 80, 
            'cholesterol': 1, 'glucose': 1, 'heart_rate': 75,
            
            # Category 3: Lifestyle factors (convert to 0/1)
            'smoking': 0, 'alcohol': 0, 'physical_activity': 1,
            'high_salt_diet': 0, 'high_fat_diet': 0,
            
            # Category 4: Genetic and family history (convert to 0/1)
            'family_history': 0, 'genetic_disorders': 0, 'previous_heart_problems': 0,
            
            # Category 5: Additional conditions (convert to 0/1)
            'diabetes': 0, 'hypertension': 0, 'kidney_disease': 0
        }
        
        # Create feature array in the correct order
        features_array = np.array([
            # Basic information
            features_dict.get('age', defaults['age']),
            gender_binary,
            features_dict.get('height', defaults['height']),
            features_dict.get('weight', defaults['weight']),
            
            # Category 1: Clinical Symptoms
            1 if features_dict.get('chest_pain', defaults['chest_pain']) else 0,
            1 if features_dict.get('shortness_of_breath', defaults['shortness_of_breath']) else 0,
            1 if features_dict.get('fatigue', defaults['fatigue']) else 0,
            1 if features_dict.get('palpitations', defaults['palpitations']) else 0,
            1 if features_dict.get('dizziness', defaults['dizziness']) else 0,
            
            # Category 2: Physiological indicators
            features_dict.get('systolic_bp', defaults['systolic_bp']),
            features_dict.get('diastolic_bp', defaults['diastolic_bp']),
            features_dict.get('cholesterol', defaults['cholesterol']),
            features_dict.get('glucose', defaults['glucose']),
            features_dict.get('heart_rate', defaults['heart_rate']),
            
            # Category 3: Lifestyle factors
            1 if features_dict.get('smoking', defaults['smoking']) else 0,
            1 if features_dict.get('alcohol', defaults['alcohol']) else 0,
            1 if features_dict.get('physical_activity', defaults['physical_activity']) else 0,
            1 if features_dict.get('high_salt_diet', defaults['high_salt_diet']) else 0,
            1 if features_dict.get('high_fat_diet', defaults['high_fat_diet']) else 0,
            
            # Category 4: Genetic and family history
            1 if features_dict.get('family_history', defaults['family_history']) else 0,
            1 if features_dict.get('genetic_disorders', defaults['genetic_disorders']) else 0,
            1 if features_dict.get('previous_heart_problems', defaults['previous_heart_problems']) else 0,
            
            # Category 5: Additional conditions
            1 if features_dict.get('diabetes', defaults['diabetes']) else 0,
            1 if features_dict.get('hypertension', defaults['hypertension']) else 0,
            1 if features_dict.get('kidney_disease', defaults['kidney_disease']) else 0
        ]).reshape(1, -1)
        
        return features_array
    
    except Exception as e:
        logging.error(f"Error preprocessing features: {str(e)}")
        raise

def predict_cardio_disease(features_dict):
    """Predict the probability of cardiovascular disease based on comprehensive symptoms."""
    try:
        # Make sure model is initialized
        if not hasattr(model, 'classes_'):
            initialize_model()
        
        # Preprocess features with enhanced categories
        features_array = preprocess_features(features_dict)
        
        # Get prediction probabilities
        probabilities = model.predict_proba(features_array)[0]
        
        # Get the probability for positive class (has cardio disease)
        positive_probability = probabilities[1] if len(probabilities) > 1 else probabilities[0]
        
        # Get prediction label (0: no disease, 1: disease)
        prediction_label = 1 if positive_probability >= 0.5 else 0
        
        # Get feature importances to provide insights
        if hasattr(model, 'feature_importances_'):
            # Log the top 5 influential factors for this prediction
            feature_names = [
                'age', 'gender', 'height', 'weight',
                'chest_pain', 'shortness_of_breath', 'fatigue', 'palpitations', 'dizziness',
                'systolic_bp', 'diastolic_bp', 'cholesterol', 'glucose', 'heart_rate',
                'smoking', 'alcohol', 'physical_activity', 'high_salt_diet', 'high_fat_diet',
                'family_history', 'genetic_disorders', 'previous_heart_problems',
                'diabetes', 'hypertension', 'kidney_disease'
            ]
            
            # Get feature importances from the model
            importances = model.feature_importances_
            
            # Create tuples of (feature_name, importance) and sort by importance
            feature_importance = [(feature_names[i], importances[i]) for i in range(len(feature_names))]
            feature_importance.sort(key=lambda x: x[1], reverse=True)
            
            # Log top influential factors
            logging.info(f"Top factors for this prediction:")
            for feature, importance in feature_importance[:5]:
                logging.info(f"- {feature}: {importance:.4f}")
        
        return float(positive_probability), bool(prediction_label)
    
    except Exception as e:
        logging.error(f"Error predicting cardio disease: {str(e)}")
        # Return default values in case of error
        return 0.0, False

# Initialize the enhanced model when this module is imported
initialize_model()
