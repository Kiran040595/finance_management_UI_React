import React, { useState, useEffect } from "react";
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert, 
  Grid, 
  Box 
} from "@mui/material";
import PaymentTrackingService from "../services/PaymentTrackingService";
import { Line, Bar, } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const PaymentTracking = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    PaymentTrackingService.getPayments()
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load data.");
        setLoading(false);
      });
  }, []);

// Function to generate daily payments based on transaction type (EMI Paid & Loan Given)
const generateDailyPayments = () => {
  // Find the earliest transaction date in the data
  const earliestDate = new Date(Math.min(...transactions.map(t => new Date(t.transactionDate))));
  const startDay = earliestDate.getDate(); // Get the starting day of the month

  // Initialize arrays for EMI collections and Loans Given
  const emiCollections = Array(30).fill(0);
  const loanGiven = Array(30).fill(0);

  // Loop through each transaction and categorize based on transactionType
  transactions.forEach((transaction) => {
    const date = new Date(transaction.transactionDate); // Get the transaction date
    const diffDays = Math.floor((date - earliestDate) / (1000 * 60 * 60 * 24)); // Days from the earliest transaction

    // Only process transactions within 30 days from the first recorded transaction
    if (diffDays >= 0 && diffDays < 30) {
      if (transaction.transactionType === "EMI Paid") {
        emiCollections[diffDays] += transaction.amount; // Sum EMI collections
      } else if (transaction.transactionType === "Loan Given") {
        loanGiven[diffDays] += transaction.amount; // Sum Loans Given
      }
    }
  });

  return { emiCollections, loanGiven };
};

// Generate daily payments categorized by EMI and Loan
const { emiCollections, loanGiven } = generateDailyPayments();

// Get the earliest transaction date
const earliestDate = new Date(Math.min(...transactions.map(t => new Date(t.transactionDate))));
const startDay = earliestDate.getDate(); // Starting day of the month
const startMonth = earliestDate.getMonth(); // Starting month (0-11)
const startYear = earliestDate.getFullYear(); // Starting year

// Generate labels starting from the earliest transaction date for 30 days
const labels = Array.from({ length: 30 }, (_, i) => {
  let date = new Date(startYear, startMonth, startDay + i); // Generate dates correctly
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // Format: "Feb 8"
});

// Common chart options
const chartOptions = {
  responsive: true,
  plugins: {
    title: { display: true, text: 'Payment Activity Overview' },
    tooltip: { mode: 'index', intersect: false },
  },
  maintainAspectRatio: false
};

// Bar Chart Data (Showing EMI Collection & Loan Given)
const barChartData = {
  labels: labels,
  datasets: [
    {
      label: "EMI Collected",
      data: emiCollections, // EMI collected per day
      backgroundColor: '#00c853', // Green for EMI Collected
      borderColor: '#009624',
      borderWidth: 1,
    },
    {
      label: "Loan Given",
      data: loanGiven, // Loan given per day
      backgroundColor: '#e53935', // Red for Loan Given
      borderColor: '#b71c1c',
      borderWidth: 1,
    }
  ]
}; 

const lineChartData = {
  labels: labels,
  datasets: [
    {
      label: "EMI Collected",
      data: emiCollections,
      borderColor: '#00c853',
      backgroundColor: 'rgba(0, 200, 83, 0.2)',
      fill: true,
      tension: 0.4,
    },
    {
      label: "Loan Given",
      data: loanGiven,
      borderColor: '#e53935',
      backgroundColor: 'rgba(229, 57, 53, 0.2)',
      fill: true,
      tension: 0.4,
    }
  ]
};






  if (loading) return <CircularProgress style={{ marginTop: "50px" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 4, 
          mb: 4, 
          borderRadius: 2, 
          boxShadow: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" gutterBottom>
          Payment Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Comprehensive overview of payment activities and transactions
        </Typography>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            height: '400px'
          }}>
            <Line data={lineChartData} options={chartOptions} />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            height: '400px'
          }}>
            <Bar data={barChartData} options={chartOptions} />
          </Box>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <Box sx={{
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="transaction table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white' }}>Type</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white' }}>File #</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white' }}>Bill #</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white' }}>Date</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white' }}>Given (₹)</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white' }}>Received (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                >
                  <TableCell sx={{ 
                    color: transaction.transactionType === "Loan Given" ? 'error.main' : 'success.main',
                    fontWeight: 'bold'
                  }}>
                    {transaction.transactionType}
                  </TableCell>
                  <TableCell>{transaction.fileNumber}</TableCell>
                  <TableCell>{transaction.billNumber}</TableCell>
                  <TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {transaction.transactionType === "Loan Given" ? `₹${transaction.amount}` : '-'}
                  </TableCell>
                  <TableCell sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {transaction.transactionType === "EMI Paid" ? `₹${transaction.amount}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default PaymentTracking;