import axios from 'axios';

const API_URL = 'https://finance-management-b934.onrender.com/api/payment/payments'; // Modify as needed

// Get loan payment details
const getLoanPayments = async (currentPage, pageSize, searchQuery, sortKey, sortDirection) => {
  try {
    const params = {
      page: currentPage,
      size: pageSize,
      searchQuery: searchQuery,
      sortKey: sortKey,
      sortDirection: sortDirection,
    };
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching loan payments');
  }
};

// Make a payment for a specific loan
const makePayment = async (loanId, paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/${loanId}/pay`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error('Error making payment');
  }
};

// Get loan details by file number
const getLoanDetailsByFileNumber = async (fileNumber) => {
  try {
    const response = await axios.get(`${API_URL}/${fileNumber}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching loan details by file number');
  }
};

// Pay EMI for a specific loan
const payEMI = async (fileNumber, emiNumber, paymentAmount, paymentDate) => {
  console.log(fileNumber, emiNumber, paymentAmount, paymentDate);
  try {
    const response = await axios.post(`${API_URL}/pay/${fileNumber}`, {
      fileNumber,
      emiNumber,
      paymentAmount,
      paymentDate,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error paying EMI');
  }
};

// Update EMI details for a specific loan
const updateEMI = async (fileNumber, emiNumber, data) => {
  try {
    const response = await axios.put(`${API_URL}/${fileNumber}/${emiNumber}`, {
      fileNumber,
      emiNumber,
      emiDate: data.emiDate,
      paymentDate: data.paymentDate,
      paymentAmount: data.paidAmount,
      remainingAmount: data.remainingAmount,
    });
    return response.data; // Returns updated EMI details
  } catch (error) {
    throw new Error('Error updating EMI');
  }
};

export default { getLoanPayments, makePayment, getLoanDetailsByFileNumber, payEMI, updateEMI };