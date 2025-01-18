import React, { useState, useEffect } from 'react';
import Table from '../components/Table'; // Reusable Table Component
import PaymentService from '../services/paymentService';
import { LinearProgress } from '@mui/material';

const PaymentPage = () => {
  const [loanPayments, setLoanPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const [searchQuery, setSearchQuery] = useState(''); // Single search input state

  useEffect(() => {
    // Fetch payment details when the page loads
    PaymentService.getLoanPayments()
      .then((data) => {
        setLoanPayments(data);
        setFilteredPayments(data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching loan payments');
        setLoading(false);
      });
  }, []);

  const headers = [
    { label: 'File Number', key: 'fileNumber' },
    { label: 'Customer Name', key: 'customerName' },
    { label: 'Loan Amount', key: 'loanAmount' },
    { label: 'Vehicle Number', key: 'vehicleNumber' },
    { label: 'EMI Date', key: 'emiDate' },
    { label: 'EMI Amount', key: 'emi' },
    { label: 'Paid EMI/Total EMI', key: 'paidEmiCount' },
    { label: 'Remaining EMI', key: 'remainingEmi' },
    { label: 'Pay', key: 'pay' },
  ];

  const handleFilterChange = (value) => {
    setSearchQuery(value);

    const filtered = loanPayments.filter((loan) => {
      return (
        loan.customerName.toLowerCase().includes(value.toLowerCase()) ||
        loan.vehicleNumber.toLowerCase().includes(value.toLowerCase()) ||
        String(loan.fileNumber).toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredPayments(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredPayments].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPayments(sortedData);
  };

  if (loading) return (<div className="w-full">
    <LinearProgress />
  </div>);
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Payment Page</h2>

      {/* Single Search Input */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-gray-700 font-medium mb-1">
          Search:
        </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Search by customer name, vehicle number, or file number"
        />
      </div>

      {/* Table */}
      <Table
        headers={headers}
        data={filteredPayments}
        onSort={handleSort}
        sortConfig={sortConfig}
      />
    </div>
  );
};

export default PaymentPage;
