// LoanList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Table from '../Table';
import Button from '../Button';

function LoanList() {
  const [loans, setLoans] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'fileNumber',
    direction: 'asc',
  });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/loan/loans')
      .then((response) => {
        setLoans(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching loans');
        setLoading(false);
      });
  }, []);

  const headers = [
    { key: 'fileNumber', label: 'File Number' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'loanAmount', label: 'Loan Amount' },
    { key: 'tenure', label: 'Tenure' },
    { key: 'vehicleNumber', label: 'Vehicle Number' },
    { key: 'insuranceValidity', label: 'Insurance Validity' },
    { key: 'emi', label: 'EMI' },
  ];

  const sortedLoans = [...loans].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredLoans = sortedLoans.filter((loan) => {
    const lowercasedFilter = filter.toLowerCase();
    return (
      (loan.customerName && loan.customerName.toLowerCase().includes(lowercasedFilter)) ||
      (loan.fileNumber && loan.fileNumber.toString().includes(filter)) ||
      (loan.vehicleNumber && loan.vehicleNumber.toString().includes(filter))
    );
  });

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLoans = filteredLoans.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="loan-list p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Loan List</h2>

      <input
        type="text"
        placeholder="Search by File Number, Customer Name, or Vehicle Number"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

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

      <Table headers={headers} data={currentLoans} onSort={handleSort} sortConfig={sortConfig} clickableFields={['fileNumber', 'loanName']} />

      <div className="pagination mt-4 flex justify-center">
        <Button
          label="Previous"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-4"
        />
        <span className="mx-4 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          label="Next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
}

export default LoanList;
