import axios from 'axios';

const API_URL = 'http://localhost:8081/api/payment/payments';  // Modify as needed

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
    const response = await axios.get(API_URL,{ params });
    return response.data; // Returns loan payment details
  } catch (error) {
    throw new Error('Error fetching loan payments');
  }
};

// Make a payment for a specific loan
const makePayment = async (loanId, paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/${loanId}/pay`, paymentData);
    return response.data; // Returns updated loan data
  } catch (error) {
    throw new Error('Error making payment');
  }
};

// Get loan details by file number
const getLoanDetailsByFileNumber = async (fileNumber) => {
  try {
    const response = await axios.get(`${API_URL}/${fileNumber}`);
    return response.data; // Returns loan details for the given file number
  } catch (error) {
    throw new Error('Error fetching loan details by file number');
  }
};


// Pay EMI for a specific loan
const payEMI = async (fileNumber, emiNumber,paymentAmount,paymentDate) => {
  console.log(fileNumber, emiNumber, paymentAmount);
  try {
    console.log(fileNumber, emiNumber, paymentAmount,paymentDate);
    const response = await axios.post(`${API_URL}/pay/${fileNumber}`, {
      fileNumber,
      emiNumber,
      paymentAmount,
      paymentDate
    });
    return response.data; // Returns confirmation of payment
  } catch (error) {
    throw new Error('Error paying EMI');
  }
};

export default { getLoanPayments, makePayment, getLoanDetailsByFileNumber, payEMI  };
