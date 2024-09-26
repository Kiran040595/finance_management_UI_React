// src/components/PaymentTracking.js
import React, { useState } from 'react';

function PaymentTracking() {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payments, setPayments] = useState([]);

  const handleAddPayment = (e) => {
    e.preventDefault();
    setPayments([...payments, paymentAmount]);
    setPaymentAmount('');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Track Payments</h2>
      <form onSubmit={handleAddPayment}>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Payment Amount:
          <input 
            type="number" 
            value={paymentAmount} 
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </label>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-3"
        >
          Add Payment
        </button>
      </form>

      <h3 className="text-lg font-medium mt-6">Payments List</h3>
      <ul className="mt-2">
        {payments.map((payment, index) => (
          <li key={index} className="bg-gray-200 p-2 rounded-md mt-2">
            {payment}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentTracking;
