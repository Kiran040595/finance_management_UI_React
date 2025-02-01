import React, { useState, useEffect } from 'react';
import LoanPaymentTable from '../components/LoanPaymentTable'; // Reusable Table Component
import PaymentService from '../services/paymentService'; // API Service for Payment Data
import { Card, Typography, Box, LinearProgress } from '@mui/material'; // Material-UI Components
import CountUp from 'react-countup'; // Animation Library

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
  const [totalLoans, setTotalLoans] = useState(0);
  const [pendingEmiCount, setPendingEmiCount] = useState(0);
  const [pendingEmiAmount, setPendingEmiAmount] = useState(0);
  const [pendingCustomerCount, setpendingCustomerCount] = useState(0);


  useEffect(() => {
    PaymentService.getLoanPayments(currentPage, pageSize, searchQuery, sortConfig.key, sortConfig.direction)
      .then((data) => {
        setLoanPayments(data.payments.content); // Assuming 'data' contains the paginated results
        setFilteredPayments(data.payments.content); // Initial set of filtered payments
        setTotalItems(data.payments.totalElements); // Assuming 'totalElements' is returned for total item count
        setLoading(false);
        setTotalLoans(data.totalLoans); // Extract the total loans count
        setPendingEmiCount(data.pendingEmiCount); // Extract the pending EMI count
        setPendingEmiAmount(data.pendingEmiAmount); // Extract the total pending EMI amount
        setpendingCustomerCount(data.pendingCustomerCount); // Extract the pending customer count
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
        payment.fileNumber.toString().toLowerCase().includes(searchQuery.toLowerCase())
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

  const renderMetrics = () => (
    <Box display="flex" gap={2} marginBottom={4}>
      {/* Total Customers */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: '#e3f2fd' }}>
        <Typography variant="h6">Total Customers</Typography>
        <Typography variant="h4" color="primary">
          <CountUp end={totalLoans} duration={1.5} />
        </Typography>
      </Card>

      {/* Pending EMI Count */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: '#fce4ec' }}>
        <Typography variant="h6">Pending EMI Count</Typography>
        <Typography variant="h4" color="secondary">
          <CountUp end={pendingEmiCount} duration={1.5} />
        </Typography>
      </Card>

      {/* Pending EMI Amount */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: '#e8f5e9' }}>
        <Typography variant="h6">Pending EMI Amount</Typography>
        <Typography variant="h4" color="success">
          ₹<CountUp end={pendingEmiAmount} duration={1.5} separator="," />
        </Typography>
      </Card>

      {/* Overdue EMI Count */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: '#ffebee' }}>
        <Typography variant="h6">Overdue EMI Count</Typography>
        <Typography variant="h4" color="error">
          <CountUp end={pendingCustomerCount} duration={1.5} />
        </Typography>
      </Card>
    </Box>
  );

  if (loading) return (
    <div className="w-full">
      <LinearProgress />
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Payment Page</h2>

      {/* Metrics Section */}
      {renderMetrics()}

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
