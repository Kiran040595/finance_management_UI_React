import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LoanList() {
  const [loans, setLoans] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'fileNumber',
    direction: 'asc',
  });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // **NEW CODE: Pagination States**
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page (5)
  
  // Fetching data from the API
  useEffect(() => {
    axios
      .get('http://localhost:8081/api/loan/loans')
      .then((response) => {
        setLoans(response.data); // Set the fetched data
        setLoading(false); // Data fetched, stop loading
      })
      .catch((error) => {
        setError('Error fetching loans');
        setLoading(false);
      });
  }, []);

  // Sorting logic
  const sortedLoans = [...loans].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // **NEW CODE: Filtered and Paginated Loans**
  const filteredLoans = sortedLoans.filter((loan) => {
    const lowercasedFilter = filter.toLowerCase();
    return (
      (loan.customerName && loan.customerName.toLowerCase().includes(lowercasedFilter)) ||
      (loan.fileNumber && loan.fileNumber.toString().includes(filter)) ||
      (loan.loanAmount && loan.loanAmount.toString().includes(filter))
    );
  });

  // **NEW CODE: Pagination Logic**
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage); // Total number of pages
  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start index
  const currentLoans = filteredLoans.slice(startIndex, startIndex + itemsPerPage); // Slice loans based on current page

  // Handle sorting on column header click
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle the input change for filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  // **NEW CODE: Handle Page Change**
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // **NEW CODE: Handle Items Per Page Change**
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Update the items per page
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  // JSX to render
  return (
    <div className="loan-list p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Loan List</h2>

      <input
        type="text"
        placeholder="Search by File Number, Customer, or Loan Amount"
        value={filter}
        onChange={handleFilterChange}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {/* **NEW CODE: Items Per Page Dropdown** */}
      <div className="mb-4">
        <label className="font-semibold text-gray-700 mr-2">Items Per Page:</label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={75}>75</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th
                className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('fileNumber')}
              >
                File Number
                {sortConfig.key === 'fileNumber' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('customerName')}
              >
                Customer Name
                {sortConfig.key === 'customerName' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('loanAmount')}
              >
                Loan Amount
                {sortConfig.key === 'loanAmount' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('tenure')}
              >
                Tenure
                {sortConfig.key === 'tenure' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('vehicleNumber')}
              >
                Vehicle Number
                {sortConfig.key === 'vehicleNumber' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('insuranceValidity')}
              >
                Insurance Validity
                {sortConfig.key === 'insuranceValidity' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('emi')}
              >
                EMI
                {sortConfig.key === 'emi' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLoans.map((loan, index) => (
              <tr
                key={loan.id}
                className={`border-b ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                } hover:bg-blue-50 transition-all`}
              >
                <td className="py-3 px-4 text-gray-700">
                <Link to={`/loan/${loan.id}`} className="text-blue-500 hover:underline">
                {loan.fileNumber}
                </Link>
                </td>
                <td className="py-3 px-4 text-gray-700">
                <Link to={`/loan/${loan.id}`} className="text-blue-500 hover:underline">
                {loan.customerName}
                </Link>
                </td>
                <td className="py-3 px-4 text-gray-700">${loan.loanAmount}</td>
                <td className="py-3 px-4 text-gray-700">{loan.tenure}</td>
                <td className="py-3 px-4 text-gray-700">{loan.vehicleNumber}</td>
                <td className="py-3 px-4 text-gray-700">{loan.insuranceValidity}</td>
                <td className="py-3 px-4 text-gray-700">${loan.emi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* **NEW CODE: Pagination Controls** */}
      <div className="pagination mt-4">
        <button
          className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="mx-4 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LoanList;
