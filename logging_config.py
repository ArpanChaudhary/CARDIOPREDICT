import logging
import os
from datetime import datetime

# Create logs directory if it doesn't exist
if not os.path.exists('logs'):
    os.makedirs('logs')

# Create a timestamp for the log file name
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
log_file = f'logs/app_{timestamp}.log'

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

# Create a logger for the application
logger = logging.getLogger('CardioPredict')
logger.setLevel(logging.DEBUG)

# Create a logger specifically for email-related issues
email_logger = logging.getLogger('CardioPredict.Email')
email_logger.setLevel(logging.DEBUG)

# Create a logger for API requests
api_logger = logging.getLogger('CardioPredict.API')
api_logger.setLevel(logging.DEBUG)

# Create a logger for database operations
db_logger = logging.getLogger('CardioPredict.Database')
db_logger.setLevel(logging.DEBUG)

# Create a logger for ML model operations
ml_logger = logging.getLogger('CardioPredict.ML')
ml_logger.setLevel(logging.DEBUG) 