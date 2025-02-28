import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Select,
  MenuItem,
  Button,
  Pagination,
} from '@mui/material';
import { Link } from 'react-router-dom';

function LoanList() {
  const [loans, setLoans] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'fileNumber', direction: 'asc' });
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
    { key: 'phoneNumberPrimary', label: 'Phone Number' },
    { key: 'vehicleNumber', label: 'Vehicle Number' },
    { key: 'insuranceExpiryDate', label: 'Insurance Validity' },
    { key: 'emi', label: 'EMI' },
  ];

  const sortedLoans = [...loans].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
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

  return (
    <Card sx={{ maxWidth: 1200, margin: 'auto', mt: 4, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Loan List
        </Typography>

        <TextField
          label="Search by File Number, Customer Name, or Vehicle Number"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          displayEmpty
          sx={{ mb: 2, minWidth: 120 }}
        >
          {[5, 10, 15, 20, 50, 75, 100].map((num) => (
            <MenuItem key={num} value={num}>
              {num} per page
            </MenuItem>
          ))}
        </Select>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header.key}>
                    <TableSortLabel
                      active={sortConfig.key === header.key}
                      direction={sortConfig.direction}
                      onClick={() => handleSort(header.key)}
                    >
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headers.length + 1} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={headers.length + 1} align="center" style={{ color: 'red' }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : currentLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headers.length + 1} align="center">
                    No loans found.
                  </TableCell>
                </TableRow>
              ) : (
                currentLoans.map((loan) => (
                  <TableRow key={loan.fileNumber}>
                    {headers.map((header) => (
                      <TableCell key={header.key}>{loan[header.key]}</TableCell>
                    ))}
                    <TableCell align="center">
                      <Button
                        component={Link}
                        to={`/loan/${loan.fileNumber}`}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => setCurrentPage(page)}
          color="primary"
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
      </CardContent>
    </Card>
  );
}

export default LoanList;
