import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, CreditCard } from 'lucide-react';
import { healthCheck, getCustomers } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLoans: 0,
    totalAmount: 0,
    activeLoans: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const customers = await getCustomers();
        setStats({
          totalCustomers: customers.length,
          totalLoans: 0, // This would need a separate API call
          totalAmount: 0, // This would need a separate API call
          activeLoans: 0 // This would need a separate API call
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>🏦 Bank Lending System Dashboard</h2>
        <p>Welcome to the comprehensive bank lending management system. Manage loans, track payments, and monitor customer accounts with ease.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Users size={32} />
          <h3>{stats.totalCustomers}</h3>
          <p>Total Customers</p>
        </div>
        <div className="stat-card">
          <CreditCard size={32} />
          <h3>{stats.totalLoans}</h3>
          <p>Total Loans</p>
        </div>
        <div className="stat-card">
          <DollarSign size={32} />
          <h3>${stats.totalAmount.toLocaleString()}</h3>
          <p>Total Amount Lent</p>
        </div>
        <div className="stat-card">
          <TrendingUp size={32} />
          <h3>{stats.activeLoans}</h3>
          <p>Active Loans</p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>📋 Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="/create-loan" className="btn">Create New Loan</a>
            <a href="/make-payment" className="btn btn-secondary">Make Payment</a>
            <a href="/view-ledger" className="btn btn-secondary">View Ledger</a>
            <a href="/account-overview" className="btn btn-secondary">Account Overview</a>
          </div>
        </div>

        <div className="card">
          <h3>📊 System Features</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
              ✅ <strong>LEND:</strong> Create loans with custom amounts and interest rates
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
              ✅ <strong>PAYMENT:</strong> Record EMI and lump sum payments
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
              ✅ <strong>LEDGER:</strong> View complete transaction history
            </li>
            <li style={{ padding: '8px 0' }}>
              ✅ <strong>ACCOUNT OVERVIEW:</strong> Monitor all customer loans
            </li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>📈 Sample Data Available</h3>
        <p>The system comes with sample customers pre-loaded:</p>
        <ul style={{ marginTop: '12px', marginLeft: '20px' }}>
          <li><strong>CUST001:</strong> John Doe</li>
          <li><strong>CUST002:</strong> Jane Smith</li>
          <li><strong>CUST003:</strong> Bob Johnson</li>
        </ul>
        <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#718096' }}>
          You can use these customer IDs to test the loan creation and payment features.
        </p>
      </div>
    </div>
  );
};

export default Dashboard; 