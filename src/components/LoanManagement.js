import React, { useState } from 'react';

function LoanManagement() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');

  const handleAddLoan = (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(loanAmount); // Convert input to a number

    // Check if the input is a valid number and greater than 0
    if (parsedAmount <= 0) {
      setError('Please enter a valid loan amount');
    } else {
      setLoans([...loans, parsedAmount.toFixed(2)]); // Store loan with 2 decimal places
      setLoanAmount(''); // Clear input
      setError(''); // Clear error message
    }
  };

  // Only allow numbers and periods (decimal)
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Regular expression to allow only numbers and a single decimal point
    const regex = /^[0-9]*\.?[0-9]*$/;

    // If input is valid, update the loanAmount state
    if (regex.test(value)) {
      setLoanAmount(value);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add a New Loan</h2>
      <form onSubmit={handleAddLoan}>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Loan Amount:
          <input 
            type="number" 
            value={loanAmount} 
            onChange={handleInputChange} // Use custom validation for input
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </label>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600"
        >
          Add Loan
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <h3 className="text-lg font-medium mt-6">Loans List</h3>
      <ul className="mt-2">
        {loans.map((loan, index) => (
          <li key={index} className="bg-gray-200 p-2 rounded-md mt-2">
            ${loan}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LoanManagement;
