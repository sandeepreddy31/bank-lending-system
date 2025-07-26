import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { makePayment } from '../services/api';

const MakePayment = () => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await makePayment(formData.loan_id, {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type
      });
      
      setSuccess({
        message: 'Payment recorded successfully!',
        paymentId: response.payment_id,
        remainingBalance: response.remaining_balance,
        emisLeft: response.emis_left
      });
      
      // Reset form
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: 'EMI'
      });
    } catch (err) {
      setError(err.error || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2><CreditCard size={24} style={{ marginRight: '8px' }} />Make Payment</h2>
        <p>Record a payment for an existing loan. You can make either EMI payments or lump sum payments.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <strong>Success!</strong> {success.message}
          <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            <strong>Payment ID:</strong> {success.paymentId}<br />
            <strong>Remaining Balance:</strong> ${success.remainingBalance}<br />
            <strong>EMIs Left:</strong> {success.emisLeft}
          </div>
        </div>
      )}

      <div className="card">
        <h3>💳 Payment Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loan_id">Loan ID *</label>
            <input
              type="text"
              id="loan_id"
              name="loan_id"
              value={formData.loan_id}
              onChange={handleInputChange}
              placeholder="Enter the loan ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Payment Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter payment amount"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment_type">Payment Type *</label>
            <select
              id="payment_type"
              name="payment_type"
              value={formData.payment_type}
              onChange={handleInputChange}
              required
            >
              <option value="EMI">EMI Payment</option>
              <option value="LUMP_SUM">Lump Sum Payment</option>
            </select>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Processing Payment...' : 'Record Payment'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>📋 Payment Information</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <h4>EMI Payment</h4>
            <p>Regular monthly installment payment. The amount should typically match the monthly EMI amount calculated for the loan.</p>
          </div>
          <div>
            <h4>Lump Sum Payment</h4>
            <p>One-time payment that reduces the outstanding balance. This can reduce the number of remaining EMIs.</p>
          </div>
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f7fafc', 
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#4a5568'
          }}>
            <strong>Note:</strong> After making a payment, the system will automatically calculate the remaining balance and number of EMIs left.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment; 