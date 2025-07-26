import React, { useState, useEffect } from 'react';
import { Users, DollarSign, CreditCard } from 'lucide-react';
import { getAccountOverview, getCustomers } from '../services/api';

const AccountOverview = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleCustomerChange = async (customerId) => {
    setSelectedCustomer(customerId);
    if (!customerId) {
      setOverview(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getAccountOverview(customerId);
      setOverview(data);
    } catch (err) {
      setError(err.error || 'Failed to fetch account overview');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (emisLeft) => {
    if (emisLeft === 0) {
      return <span className="badge badge-success">Paid Off</span>;
    } else if (emisLeft <= 3) {
      return <span className="badge badge-warning">Almost Paid</span>;
    } else {
      return <span className="badge badge-danger">Active</span>;
    }
  };

  return (
    <div>
      <div className="card">
        <h2><Users size={24} style={{ marginRight: '8px' }} />Account Overview</h2>
        <p>View a comprehensive overview of all loans for a specific customer.</p>
      </div>

      <div className="card">
        <h3>👤 Select Customer</h3>
        <div className="form-group">
          <label htmlFor="customer_select">Customer *</label>
          <select
            id="customer_select"
            value={selectedCustomer}
            onChange={(e) => handleCustomerChange(e.target.value)}
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.customer_id} - {customer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <h3>Loading account overview...</h3>
        </div>
      )}

      {overview && (
        <div>
          <div className="card">
            <h3>📊 Customer Summary</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{overview.customer_id}</h3>
                <p>Customer ID</p>
              </div>
              <div className="stat-card">
                <h3>{overview.total_loans}</h3>
                <p>Total Loans</p>
              </div>
              <div className="stat-card">
                <h3>${overview.loans.reduce((sum, loan) => sum + loan.principal, 0).toLocaleString()}</h3>
                <p>Total Principal</p>
              </div>
              <div className="stat-card">
                <h3>${overview.loans.reduce((sum, loan) => sum + loan.amount_paid, 0).toLocaleString()}</h3>
                <p>Total Paid</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>📋 Loan Details</h3>
            {overview.loans && overview.loans.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Principal</th>
                    <th>Total Amount</th>
                    <th>Total Interest</th>
                    <th>EMI Amount</th>
                    <th>Amount Paid</th>
                    <th>EMIs Left</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.loans.map((loan) => (
                    <tr key={loan.loan_id}>
                      <td>{loan.loan_id}</td>
                      <td>${loan.principal.toLocaleString()}</td>
                      <td>${loan.total_amount.toLocaleString()}</td>
                      <td>${loan.total_interest.toLocaleString()}</td>
                      <td>${loan.emi_amount.toLocaleString()}</td>
                      <td>${loan.amount_paid.toLocaleString()}</td>
                      <td>{loan.emis_left}</td>
                      <td>{getStatusBadge(loan.emis_left)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No loans found</h3>
                <p>This customer has no loans yet.</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3>💰 Payment Summary</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>${overview.loans.reduce((sum, loan) => sum + loan.total_amount, 0).toLocaleString()}</h3>
                <p>Total Amount Owed</p>
              </div>
              <div className="stat-card">
                <h3>${overview.loans.reduce((sum, loan) => sum + loan.amount_paid, 0).toLocaleString()}</h3>
                <p>Total Amount Paid</p>
              </div>
              <div className="stat-card">
                <h3>${overview.loans.reduce((sum, loan) => sum + (loan.total_amount - loan.amount_paid), 0).toLocaleString()}</h3>
                <p>Outstanding Balance</p>
              </div>
              <div className="stat-card">
                <h3>{overview.loans.reduce((sum, loan) => sum + loan.emis_left, 0)}</h3>
                <p>Total EMIs Left</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>📈 Loan Analysis</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {overview.loans.map((loan) => (
                <div key={loan.loan_id} style={{ 
                  padding: '16px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  backgroundColor: '#f7fafc'
                }}>
                  <h4>Loan ID: {loan.loan_id}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <strong>Principal:</strong> ${loan.principal.toLocaleString()}
                    </div>
                    <div>
                      <strong>Total Interest:</strong> ${loan.total_interest.toLocaleString()}
                    </div>
                    <div>
                      <strong>Total Amount:</strong> ${loan.total_amount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Monthly EMI:</strong> ${loan.emi_amount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Amount Paid:</strong> ${loan.amount_paid.toLocaleString()}
                    </div>
                    <div>
                      <strong>EMIs Left:</strong> {loan.emis_left}
                    </div>
                    <div>
                      <strong>Payment Progress:</strong> {((loan.amount_paid / loan.total_amount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountOverview; 