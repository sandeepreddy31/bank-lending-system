# 🏦 Bank Lending System

A comprehensive bank lending management system built with React frontend and Node.js backend, designed to handle loan creation, payment processing, and customer account management.

## 🚀 Features

### Core Functionality
- **LEND**: Create loans with custom amounts, periods, and interest rates
- **PAYMENT**: Record EMI and lump sum payments
- **LEDGER**: View complete transaction history for any loan
- **ACCOUNT OVERVIEW**: Monitor all loans for a specific customer

### Technical Features
- Modern React frontend with responsive design
- RESTful API backend with Express.js
- SQLite database for data persistence
- Real-time loan calculations
- Beautiful, intuitive user interface
- Mobile-responsive design

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd bank-lending-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Return to root directory
cd ..
```

### 3. Run the Application

#### Development Mode
```bash
# Run both frontend and backend concurrently
npm run dev
```

#### Separate Mode
```bash
# Terminal 1 - Start backend server
npm run server

# Terminal 2 - Start frontend development server
npm run client
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🌐 API Endpoints

### Base URL: `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/loans` | Create a new loan |
| `POST` | `/loans/:loanId/payments` | Record a payment |
| `GET` | `/loans/:loanId/ledger` | Get loan ledger |
| `GET` | `/customers/:customerId/overview` | Get customer account overview |
| `GET` | `/customers` | Get all customers |
| `GET` | `/health` | Health check |

### Sample API Usage

#### Create a Loan
```bash
curl -X POST http://localhost:5000/api/v1/loans \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "loan_amount": 10000,
    "loan_period_years": 5,
    "interest_rate_yearly": 8.5
  }'
```

#### Make a Payment
```bash
curl -X POST http://localhost:5000/api/v1/loans/{loan_id}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "payment_type": "EMI"
  }'
```

## 🚀 Deployment to Vercel

### 1. Prepare for Deployment
The application is already configured for Vercel deployment with the following files:
- `vercel.json` - Vercel configuration
- `package.json` - Root package configuration
- Proper build scripts in both frontend and backend

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link your project
```

#### Option B: Using Vercel Dashboard
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration and deploy

### 3. Environment Variables (if needed)
For production, you might want to set these environment variables in Vercel:
- `NODE_ENV=production`
- `PORT=3000` (Vercel will set this automatically)

## 📊 Sample Data

The system comes with pre-loaded sample customers:
- **CUST001**: John Doe
- **CUST002**: Jane Smith  
- **CUST003**: Bob Johnson

You can use these customer IDs to test the loan creation and payment features.

## 🧮 Loan Calculation Formula

The system uses simple interest calculation:
- **Interest (I)** = Principal (P) × Years (N) × Rate (R) / 100
- **Total Amount (A)** = Principal (P) + Interest (I)
- **Monthly EMI** = Total Amount (A) / (Years (N) × 12)

## 📱 Features Overview

### Dashboard
- Overview of system statistics
- Quick access to all features
- Sample data information

### Create Loan
- Customer selection dropdown
- Loan amount, period, and interest rate inputs
- Real-time calculation preview
- Form validation

### Make Payment
- Loan ID input
- Payment amount and type selection
- EMI or lump sum payment options
- Payment confirmation

### View Ledger
- Loan search by ID
- Complete transaction history
- Payment status and balance information
- Detailed loan information

### Account Overview
- Customer selection
- All loans summary
- Payment progress tracking
- Loan status indicators

## 🔧 Development

### Project Structure
```
bank-lending-system/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Main server file
│   └── package.json
├── package.json           # Root package.json
├── vercel.json           # Vercel configuration
└── README.md
```

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build frontend for production
npm run start        # Start production server
npm run install-all  # Install all dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the API health endpoint: `/api/health`
2. Review the browser console for frontend errors
3. Check the server logs for backend errors
4. Ensure all dependencies are properly installed

## 🎯 Future Enhancements

- User authentication and authorization
- Advanced loan types (compound interest, variable rates)
- Payment scheduling and reminders
- PDF report generation
- Email notifications
- Advanced analytics and reporting
- Mobile app development

---

**Built with ❤️ for the Bank Lending System Assignment** 