// Payment Module Component
const PaymentModule = ({ amount, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setShowForm(method === 'credit_card');
    setError('');
  };
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (paymentMethod === 'credit_card') {
      // Basic validation
      if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 16) {
        setError('Please enter a valid card number');
        return;
      }
      
      if (!cardName) {
        setError('Please enter the cardholder name');
        return;
      }
      
      if (!expiryDate || expiryDate.length < 5) {
        setError('Please enter a valid expiry date (MM/YY)');
        return;
      }
      
      if (!cvv || cvv.length < 3) {
        setError('Please enter a valid CVV');
        return;
      }
    }
    
    // Process payment
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      
      // Simulate successful payment
      const paymentInfo = {
        method: paymentMethod,
        amount: amount,
        date: new Date().toISOString(),
        status: 'paid'
      };
      
      onSuccess(paymentInfo);
    }, 1500);
  };
  
  return (
    <div className="payment-module">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Payment Method</h5>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <p className="mb-3">Select your preferred payment method:</p>
            <div className="row row-cols-lg-4 row-cols-md-3 row-cols-2 g-3">
              <div className="col">
                <div 
                  className={`payment-method-option text-center p-3 h-100 ${paymentMethod === 'credit_card' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('credit_card')}
                >
                  <div className="payment-icon">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <p className="mb-0">Credit Card</p>
                </div>
              </div>
              <div className="col">
                <div 
                  className={`payment-method-option text-center p-3 h-100 ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('paypal')}
                >
                  <div className="payment-icon">
                    <i className="fab fa-paypal"></i>
                  </div>
                  <p className="mb-0">PayPal</p>
                </div>
              </div>
              <div className="col">
                <div 
                  className={`payment-method-option text-center p-3 h-100 ${paymentMethod === 'insurance' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('insurance')}
                >
                  <div className="payment-icon">
                    <i className="fas fa-file-medical"></i>
                  </div>
                  <p className="mb-0">Insurance</p>
                </div>
              </div>
              <div className="col">
                <div 
                  className={`payment-method-option text-center p-3 h-100 ${paymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('cash')}
                >
                  <div className="payment-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <p className="mb-0">Cash (Pay at Visit)</p>
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-danger mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="cardNumber" className="form-label">Card Number</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-credit-card"></i></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength="19"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-12">
                  <label htmlFor="cardName" className="form-label">Cardholder Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="cardName" 
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="expiryDate" 
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength="5"
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="cvv" className="form-label">CVV</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="cvv" 
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength="4"
                    required
                  />
                </div>
              </div>
            </form>
          )}
          
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <span className="h5 mb-0">Total: ${amount.toFixed(2)}</span>
              <div>
                <button 
                  type="button" 
                  className="btn btn-secondary me-2"
                  onClick={onCancel}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!paymentMethod || processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>Pay Now</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};