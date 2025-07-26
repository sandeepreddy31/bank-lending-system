import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, DollarSign, CreditCard, Users, FileText } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CreateLoan from './components/CreateLoan';
import MakePayment from './components/MakePayment';
import ViewLedger from './components/ViewLedger';
import AccountOverview from './components/AccountOverview';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/create-loan', label: 'Create Loan', icon: DollarSign },
    { path: '/make-payment', label: 'Make Payment', icon: CreditCard },
    { path: '/view-ledger', label: 'View Ledger', icon: FileText },
    { path: '/account-overview', label: 'Account Overview', icon: Users },
  ];

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🏦 Bank Lending System
        </Link>
        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon size={16} style={{ marginRight: '8px' }} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-loan" element={<CreateLoan />} />
            <Route path="/make-payment" element={<MakePayment />} />
            <Route path="/view-ledger" element={<ViewLedger />} />
            <Route path="/account-overview" element={<AccountOverview />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 