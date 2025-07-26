import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api/v1' 
  : 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions

// Get all customers
export const getCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new loan
export const createLoan = async (loanData) => {
  try {
    const response = await api.post('/loans', loanData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Make a payment
export const makePayment = async (loanId, paymentData) => {
  try {
    const response = await api.post(`/loans/${loanId}/payments`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get loan ledger
export const getLoanLedger = async (loanId) => {
  try {
    const response = await api.get(`/loans/${loanId}/ledger`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get customer account overview
export const getAccountOverview = async (customerId) => {
  try {
    const response = await api.get(`/customers/${customerId}/overview`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api; 