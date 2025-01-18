import React, { useState, useEffect } from 'react';
import LoanPaymentTable from '../components/LoanPaymentTable'; // Reusable Table Component
import PaymentService from '../services/paymentService'; // API Service for Payment Data
import { LinearProgress } from '@mui/material'; // Loading Progress Bar

const PaymentPage = () => {
  const [loanPayments, setLoanPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'fileNumber', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0); // Total number of payments

  useEffect(() => {
    PaymentService.getLoanPayments(currentPage, pageSize, searchQuery, sortConfig.key, sortConfig.direction)
      .then((data) => {
        setLoanPayments(data.content); // Assuming 'data' contains the paginated results
        setFilteredPayments(data.content); // Initial set of filtered payments
        setTotalItems(data.totalElements); // Assuming 'totalElements' is returned for total item count
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching loan payments');
        setLoading(false);
      });
  }, [currentPage, pageSize, searchQuery, sortConfig]);

  useEffect(() => {
    // Apply search filter here (by customer name, vehicle number, or file number)
    const filtered = loanPayments.filter(
      (payment) =>
        payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.fileNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [searchQuery, loanPayments]);

  const headers = [
    { label: 'File Number', key: 'fileNumber' },
    { label: 'Customer Name', key: 'customerName' },
    { label: 'Phone Numbers', key: 'phoneNumbers' },
    { label: 'Vehicle Number', key: 'vehicleNumber' },
    { label: 'Pening Days', key: 'pendingDays' },
    { label: 'Pending Amount', key: 'totalPendingEmiAmount' },
    { label: 'Paid EMI/Total EMI', key: 'paidEmiCount' },
    { label: 'Pay', key: 'pay' },
  ];

  const handleFilterChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page, rowsPerPage) => {
    setCurrentPage(page);
    setPageSize(rowsPerPage);
  };

  if (loading) return (
    <div className="w-full">
      <LinearProgress />
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Payment Page</h2>

      {/* Search Input */}
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
      <LoanPaymentTable
        headers={headers}
        data={filteredPayments}
        onSort={handleSort}
        sortConfig={sortConfig}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PaymentPage;
