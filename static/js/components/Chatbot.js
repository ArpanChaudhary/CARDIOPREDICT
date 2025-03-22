// Chatbot Component for Heart Disease Q&A
const Chatbot = () => {
  const [messages, setMessages] = React.useState([
    {
      sender: 'bot',
      text: 'Hello! I\'m your CardioHealth assistant. How can I help you with your heart health questions today?'
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const chatContainerRef = React.useRef(null);
  
  const heartDiseaseInfo = {
    "what is heart disease": "Heart disease is a term covering any disorder of the heart. The most common type is coronary artery disease, which affects the blood flow to the heart. Decreased blood flow can cause a heart attack.",
    
    "what are symptoms of heart disease": "Common symptoms of heart disease include chest pain or discomfort, shortness of breath, fatigue, rapid or irregular heartbeat, dizziness, swelling in legs, ankles, or feet. Some people may experience no symptoms before having a heart attack.",
    
    "what causes heart disease": "Heart disease can be caused by various factors including high blood pressure, high cholesterol, smoking, diabetes, obesity, physical inactivity, unhealthy diet, and family history.",
    
    "how can i prevent heart disease": "You can reduce your risk by maintaining a healthy weight, exercising regularly (at least 150 minutes per week), eating a heart-healthy diet, not smoking, limiting alcohol, managing stress, and getting regular health screenings.",
    
    "what is hypertension": "Hypertension, or high blood pressure, is when your blood pressure is consistently too high. It's often called the 'silent killer' because it has no obvious symptoms but can lead to serious heart problems if untreated.",
    
    "what is a heart attack": "A heart attack, or myocardial infarction, occurs when blood flow to part of the heart is blocked, causing damage to heart muscle. It requires immediate medical attention.",
    
    "what is a healthy blood pressure": "A normal blood pressure is less than 120/80 mmHg. 120-129/<80 is elevated, 130-139/80-89 is stage 1 hypertension, and 140+/90+ is stage 2 hypertension.",
    
    "what is cholesterol": "Cholesterol is a waxy substance in your blood. Your body needs it to build healthy cells, but high levels can increase your risk of heart disease. There are two types: LDL (bad) and HDL (good).",
    
    "how does the ai prediction work": "Our AI model analyzes your health data including age, gender, blood pressure, cholesterol levels, and lifestyle factors to estimate your risk of cardiovascular disease using advanced machine learning algorithms.",
    
    "what is arrhythmia": "Arrhythmia is an irregular heartbeat - either too fast (tachycardia), too slow (bradycardia), or with an irregular rhythm. Some arrhythmias are harmless, while others can be life-threatening.",
    
    "what is heart failure": "Heart failure doesn't mean your heart has stopped working, but that it's not pumping as well as it should. This can cause fatigue, shortness of breath, and fluid buildup in the body.",
    
    "what diet is good for heart health": "A heart-healthy diet includes plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats (like those in fish, nuts, and olive oil). Limit salt, sugar, and processed foods. The Mediterranean and DASH diets are often recommended.",
    
    "when should i see a doctor": "See a doctor if you experience chest pain, shortness of breath, fainting, irregular heartbeat, or if you have risk factors like high blood pressure, high cholesterol, or a family history of heart disease."
  };
  
  // Scroll to bottom of chat when messages update
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Function to get response from prebuilt answers
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    
    // Direct matches
    for (const question in heartDiseaseInfo) {
      if (input.includes(question)) {
        return heartDiseaseInfo[question];
      }
    }
    
    // Keyword matching
    if (input.includes("symptom") || input.includes("sign")) {
      return heartDiseaseInfo["what are symptoms of heart disease"];
    } else if (input.includes("cause") || input.includes("risk")) {
      return heartDiseaseInfo["what causes heart disease"];
    } else if (input.includes("prevent") || input.includes("avoid")) {
      return heartDiseaseInfo["how can i prevent heart disease"];
    } else if (input.includes("blood pressure") || input.includes("hypertension")) {
      return heartDiseaseInfo["what is hypertension"];
    } else if (input.includes("heart attack")) {
      return heartDiseaseInfo["what is a heart attack"];
    } else if (input.includes("cholesterol")) {
      return heartDiseaseInfo["what is cholesterol"];
    } else if (input.includes("diet") || input.includes("food") || input.includes("eat")) {
      return heartDiseaseInfo["what diet is good for heart health"];
    } else if (input.includes("doctor") || input.includes("hospital") || input.includes("emergency")) {
      return heartDiseaseInfo["when should i see a doctor"];
    } else if (input.includes("prediction") || input.includes("ai") || input.includes("model")) {
      return heartDiseaseInfo["how does the ai prediction work"];
    } else if (input.includes("arrhythmia") || input.includes("irregular")) {
      return heartDiseaseInfo["what is arrhythmia"];
    } else if (input.includes("heart failure")) {
      return heartDiseaseInfo["what is heart failure"];
    }
    
    // Default response
    return "I'm not sure I understand that question. Try asking about heart disease symptoms, causes, prevention, or specific conditions like hypertension or cholesterol.";
  };
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot "typing"
    setIsTyping(true);
    
    // Get bot response with a delay to look more natural
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: getBotResponse(input)
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <div className="card shadow-lg h-100">
      <div className="card-header bg-info text-white py-3">
        <h5 className="mb-0">
          <i className="fas fa-robot me-2"></i>
          CardioHealth Assistant
        </h5>
      </div>
      <div 
        className="card-body p-3 d-flex flex-column" 
        style={{ height: '400px', maxHeight: '400px' }}
      >
        <div 
          className="chat-messages flex-grow-1 overflow-auto mb-3" 
          ref={chatContainerRef}
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} mb-2`}
            >
              <div 
                className={`message-bubble p-2 rounded ${
                  message.sender === 'user' 
                    ? 'bg-info text-white ms-auto' 
                    : 'bg-light'
                }`}
                style={{ 
                  maxWidth: '80%', 
                  display: 'inline-block',
                  float: message.sender === 'user' ? 'right' : 'left',
                  clear: 'both'
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="bot-message mb-2">
              <div 
                className="message-bubble p-2 rounded bg-light"
                style={{ maxWidth: '80%', display: 'inline-block' }}
              >
                <div className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="chat-input mt-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Ask a question about heart health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="btn btn-info"
              disabled={isTyping || input.trim() === ''}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};