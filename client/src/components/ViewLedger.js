import React, { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { getLoanLedger } from '../services/api';

const ViewLedger = () => {
  const [loanId, setLoanId] = useState('');
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loanId.trim()) return;

    setLoading(true);
    setError(null);
    setLedger(null);

    try {
      const data = await getLoanLedger(loanId);
      setLedger(data);
    } catch (err) {
      setError(err.error || 'Failed to fetch ledger');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="card">
        <h2><FileText size={24} style={{ marginRight: '8px' }} />View Loan Ledger</h2>
        <p>View the complete transaction history and current status of a loan.</p>
      </div>

      <div className="card">
        <h3><Search size={20} style={{ marginRight: '8px' }} />Search Loan</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loan_id">Loan ID *</label>
            <input
              type="text"
              id="loan_id"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              placeholder="Enter the loan ID"
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading || !loanId.trim()}>
            {loading ? 'Loading...' : 'View Ledger'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <h3>Loading ledger...</h3>
        </div>
      )}

      {ledger && (
        <div>
          <div className="card">
            <h3>📊 Loan Summary</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>${ledger.principal.toLocaleString()}</h3>
                <p>Principal Amount</p>
              </div>
              <div className="stat-card">
                <h3>${ledger.total_amount.toLocaleString()}</h3>
                <p>Total Amount</p>
              </div>
              <div className="stat-card">
                <h3>${ledger.monthly_emi.toLocaleString()}</h3>
                <p>Monthly EMI</p>
              </div>
              <div className="stat-card">
                <h3>{ledger.emis_left}</h3>
                <p>EMIs Left</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>💰 Payment Status</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>${ledger.amount_paid.toLocaleString()}</h3>
                <p>Amount Paid</p>
              </div>
              <div className="stat-card">
                <h3>${ledger.balance_amount.toLocaleString()}</h3>
                <p>Balance Amount</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>📋 Transaction History</h3>
            {ledger.transactions && ledger.transactions.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.transactions.map((transaction) => (
                    <tr key={transaction.transaction_id}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.transaction_id}</td>
                      <td>${transaction.amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${
                          transaction.type === 'EMI' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No transactions found</h3>
                <p>This loan has no payment transactions yet.</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3>📝 Loan Details</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <strong>Loan ID:</strong> {ledger.loan_id}
              </div>
              <div>
                <strong>Customer ID:</strong> {ledger.customer_id}
              </div>
              <div>
                <strong>Principal Amount:</strong> ${ledger.principal.toLocaleString()}
              </div>
              <div>
                <strong>Total Amount:</strong> ${ledger.total_amount.toLocaleString()}
              </div>
              <div>
                <strong>Monthly EMI:</strong> ${ledger.monthly_emi.toLocaleString()}
              </div>
              <div>
                <strong>Amount Paid:</strong> ${ledger.amount_paid.toLocaleString()}
              </div>
              <div>
                <strong>Balance Amount:</strong> ${ledger.balance_amount.toLocaleString()}
              </div>
              <div>
                <strong>EMIs Left:</strong> {ledger.emis_left}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLedger; 