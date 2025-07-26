import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator } from 'lucide-react';
import { createLoan, getCustomers } from '../services/api';

const CreateLoan = () => {
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getCustomers();
        setCustomers(customersData);
      } catch (err) {
        setError('Failed to fetch customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateLoan = () => {
    const { loan_amount, loan_period_years, interest_rate_yearly } = formData;
    
    if (loan_amount && loan_period_years && interest_rate_yearly) {
      const principal = parseFloat(loan_amount);
      const years = parseFloat(loan_period_years);
      const rate = parseFloat(interest_rate_yearly);
      
      const totalInterest = principal * years * (rate / 100);
      const totalAmount = principal + totalInterest;
      const monthlyEmi = totalAmount / (years * 12);
      
      setCalculation({
        principal,
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        monthlyEmi: parseFloat(monthlyEmi.toFixed(2))
      });
    } else {
      setCalculation(null);
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [formData.loan_amount, formData.loan_period_years, formData.interest_rate_yearly]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createLoan(formData);
      setSuccess({
        message: 'Loan created successfully!',
        loanId: response.loan_id,
        totalAmount: response.total_amount_payable,
        monthlyEmi: response.monthly_emi
      });
      
      // Reset form
      setFormData({
        customer_id: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
      setCalculation(null);
    } catch (err) {
      setError(err.error || 'Failed to create loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2><DollarSign size={24} style={{ marginRight: '8px' }} />Create New Loan</h2>
        <p>Create a new loan for a customer with custom amount, period, and interest rate.</p>
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
            <strong>Loan ID:</strong> {success.loanId}<br />
            <strong>Total Amount:</strong> ${success.totalAmount}<br />
            <strong>Monthly EMI:</strong> ${success.monthlyEmi}
          </div>
        </div>
      )}

      <div className="grid">
        <div className="card">
          <h3>📝 Loan Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customer_id">Customer ID *</label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.customer_id} - {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="loan_amount">Loan Amount (Principal) *</label>
              <input
                type="number"
                id="loan_amount"
                name="loan_amount"
                value={formData.loan_amount}
                onChange={handleInputChange}
                placeholder="Enter loan amount"
                min="1"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loan_period_years">Loan Period (Years) *</label>
              <input
                type="number"
                id="loan_period_years"
                name="loan_period_years"
                value={formData.loan_period_years}
                onChange={handleInputChange}
                placeholder="Enter loan period in years"
                min="1"
                max="30"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="interest_rate_yearly">Interest Rate (% per year) *</label>
              <input
                type="number"
                id="interest_rate_yearly"
                name="interest_rate_yearly"
                value={formData.interest_rate_yearly}
                onChange={handleInputChange}
                placeholder="Enter annual interest rate"
                min="0.1"
                max="50"
                step="0.1"
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating Loan...' : 'Create Loan'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3><Calculator size={20} style={{ marginRight: '8px' }} />Loan Calculation Preview</h3>
          {calculation ? (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Principal Amount:</strong> ${calculation.principal.toLocaleString()}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Total Interest:</strong> ${calculation.totalInterest.toLocaleString()}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Total Amount:</strong> ${calculation.totalAmount.toLocaleString()}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Monthly EMI:</strong> ${calculation.monthlyEmi.toLocaleString()}
              </div>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f7fafc', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#4a5568'
              }}>
                <strong>Formula:</strong><br />
                Interest = Principal × Years × (Rate ÷ 100)<br />
                Total Amount = Principal + Interest<br />
                Monthly EMI = Total Amount ÷ (Years × 12)
              </div>
            </div>
          ) : (
            <p style={{ color: '#718096', fontStyle: 'italic' }}>
              Fill in the loan details to see the calculation preview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLoan; 