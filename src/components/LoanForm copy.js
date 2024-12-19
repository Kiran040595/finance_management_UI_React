// src/components/LoanForm.js
import React, { useState, useEffect } from 'react';

function LoanForm({ onSubmit, loan }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (loan) {
      setCustomerName(loan.customerName);
      setCustomerEmail(loan.customerEmail);
      setCustomerPhone(loan.customerPhone);
      setLoanAmount(loan.loanAmount);
    }
  }, [loan]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !loanAmount) {
      setError('All fields are required.');
      return;
    }

    const parsedAmount = parseFloat(loanAmount);
    if (parsedAmount <= 0) {
      setError('Loan amount must be greater than zero.');
    } else {
      onSubmit({ customerName, customerEmail, customerPhone, loanAmount: parsedAmount.toFixed(2) });
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setLoanAmount('');
      setError('');
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{loan ? 'Edit Loan' : 'Add New Loan'}</h2>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block font-medium">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter customer name"
          />
        </div>

        {/* Customer Email */}
        <div>
          <label className="block font-medium">Customer Email</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter customer email"
          />
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block font-medium">Customer Phone</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter customer phone"
          />
        </div>

        {/* Loan Amount */}
        <div>
          <label className="block font-medium">Loan Amount</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter loan amount"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
        >
          {loan ? 'Update Loan' : 'Submit Loan'}
        </button>
      </form>
    </div>
  );
}

export default LoanForm;
