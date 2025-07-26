const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database(':memory:'); // Using in-memory database for Vercel deployment

// Initialize database tables
db.serialize(() => {
  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Loans table
  db.run(`CREATE TABLE IF NOT EXISTS loans (
    loan_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    principal_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    loan_period_years INTEGER NOT NULL,
    monthly_emi DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
  )`);

  // Payments table
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    payment_id TEXT PRIMARY KEY,
    loan_id TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type TEXT NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
  )`);

  // Insert some sample customers
  db.run(`INSERT OR IGNORE INTO customers (customer_id, name) VALUES 
    ('CUST001', 'John Doe'),
    ('CUST002', 'Jane Smith'),
    ('CUST003', 'Bob Johnson')`);
});

// Helper function to calculate loan details
function calculateLoanDetails(principal, years, rate) {
  const totalInterest = principal * years * (rate / 100);
  const totalAmount = principal + totalInterest;
  const monthlyEmi = totalAmount / (years * 12);
  
  return {
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    monthlyEmi: parseFloat(monthlyEmi.toFixed(2))
  };
}

// Helper function to get loan status
function getLoanStatus(loanId) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT 
        l.*,
        COALESCE(SUM(p.amount), 0) as amount_paid
      FROM loans l
      LEFT JOIN payments p ON l.loan_id = p.loan_id
      WHERE l.loan_id = ?
      GROUP BY l.loan_id
    `, [loanId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// API Routes

// 1. LEND: Create a new loan
app.post('/api/v1/loans', (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  // Validation
  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (loan_amount <= 0 || loan_period_years <= 0 || interest_rate_yearly <= 0) {
    return res.status(400).json({ error: 'Invalid input values' });
  }

  const loanId = uuidv4();
  const { totalInterest, totalAmount, monthlyEmi } = calculateLoanDetails(
    loan_amount, 
    loan_period_years, 
    interest_rate_yearly
  );

  db.run(`
    INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [loanId, customer_id, loan_amount, totalAmount, interest_rate_yearly, loan_period_years, monthlyEmi], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create loan' });
    }

    res.status(201).json({
      loan_id: loanId,
      customer_id,
      total_amount_payable: totalAmount,
      monthly_emi: monthlyEmi,
      total_interest: totalInterest
    });
  });
});

// 2. PAYMENT: Record a payment for a loan
app.post('/api/v1/loans/:loanId/payments', (req, res) => {
  const { loanId } = req.params;
  const { amount, payment_type } = req.body;

  if (!amount || !payment_type || !['EMI', 'LUMP_SUM'].includes(payment_type)) {
    return res.status(400).json({ error: 'Valid amount and payment_type (EMI or LUMP_SUM) required' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' });
  }

  const paymentId = uuidv4();

  db.run(`
    INSERT INTO payments (payment_id, loan_id, amount, payment_type)
    VALUES (?, ?, ?, ?)
  `, [paymentId, loanId, amount, payment_type], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to record payment' });
    }

    // Get updated loan status
    getLoanStatus(loanId).then(loan => {
      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      const balanceAmount = loan.total_amount - loan.amount_paid;
      const emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);

      res.json({
        payment_id: paymentId,
        loan_id: loanId,
        message: 'Payment recorded successfully',
        remaining_balance: parseFloat(balanceAmount.toFixed(2)),
        emis_left: Math.max(0, emisLeft)
      });
    }).catch(err => {
      res.status(500).json({ error: 'Failed to get loan status' });
    });
  });
});

// 3. LEDGER: View loan details and transaction history
app.get('/api/v1/loans/:loanId/ledger', (req, res) => {
  const { loanId } = req.params;

  db.get(`
    SELECT 
      l.*,
      COALESCE(SUM(p.amount), 0) as amount_paid
    FROM loans l
    LEFT JOIN payments p ON l.loan_id = p.loan_id
    WHERE l.loan_id = ?
    GROUP BY l.loan_id
  `, [loanId], (err, loan) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get all transactions for this loan
    db.all(`
      SELECT 
        payment_id as transaction_id,
        payment_date as date,
        amount,
        payment_type as type
      FROM payments
      WHERE loan_id = ?
      ORDER BY payment_date DESC
    `, [loanId], (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get transactions' });
      }

      const balanceAmount = loan.total_amount - loan.amount_paid;
      const emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);

      res.json({
        loan_id: loan.loan_id,
        customer_id: loan.customer_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        monthly_emi: loan.monthly_emi,
        amount_paid: parseFloat(loan.amount_paid.toFixed(2)),
        balance_amount: parseFloat(balanceAmount.toFixed(2)),
        emis_left: Math.max(0, emisLeft),
        transactions: transactions.map(t => ({
          ...t,
          date: t.date,
          amount: parseFloat(t.amount.toFixed(2))
        }))
      });
    });
  });
});

// 4. ACCOUNT OVERVIEW: View all loans for a customer
app.get('/api/v1/customers/:customerId/overview', (req, res) => {
  const { customerId } = req.params;

  db.all(`
    SELECT 
      l.*,
      COALESCE(SUM(p.amount), 0) as amount_paid
    FROM loans l
    LEFT JOIN payments p ON l.loan_id = p.loan_id
    WHERE l.customer_id = ?
    GROUP BY l.loan_id
    ORDER BY l.created_at DESC
  `, [customerId], (err, loans) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (loans.length === 0) {
      return res.status(404).json({ error: 'No loans found for this customer' });
    }

    const formattedLoans = loans.map(loan => {
      const balanceAmount = loan.total_amount - loan.amount_paid;
      const emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);
      const totalInterest = loan.total_amount - loan.principal_amount;

      return {
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: parseFloat(totalInterest.toFixed(2)),
        emi_amount: loan.monthly_emi,
        amount_paid: parseFloat(loan.amount_paid.toFixed(2)),
        emis_left: Math.max(0, emisLeft)
      };
    });

    res.json({
      customer_id: customerId,
      total_loans: loans.length,
      loans: formattedLoans
    });
  });
});

// Additional endpoint to get all customers
app.get('/api/v1/customers', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY created_at', (err, customers) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(customers);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bank Lending System API is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the client build directory
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 