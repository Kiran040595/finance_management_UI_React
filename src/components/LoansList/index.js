import React, { useState, useEffect } from 'react';
import axios from 'axios';


function LoanList() {
  // Dummy loan data
  const [loans, setLoans] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState(null); 

  // Function to simulate fetching loan data from an API
  useEffect(() => {
    axios
    .get('http://localhost:8081/api/loans/loans')
    .then((response) => {
        setLoans(response.data); // Set the fetched data
        setLoading(false); // Data fetched, stop loading
      })

      .catch((error) => {
        setError('Error fetching loans'); // Handle error
        setLoading(false); // Stop loading
      });
    
  }, []);

  return (
    <div className="loan-list">
      <h2 className="text-xl font-semibold mb-4">Loan List</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Customer Name</th>
            <th className="py-2 px-4 border">Loan Amount</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-b">
              <td className="py-2 px-4">{loan.fileNumber}</td>
              <td className="py-2 px-4">{loan.customerName}</td>
              <td className="py-2 px-4">${loan.loanAmount}</td>
              <td className="py-2 px-4">{loan.tenure}</td>
              <td className="py-2 px-4">{loan.vehicleNumber}</td>
              <td className="py-2 px-4">{loan.insuranceValidity}</td>
              <td className="py-2 px-4">${loan.emi}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LoanList;
