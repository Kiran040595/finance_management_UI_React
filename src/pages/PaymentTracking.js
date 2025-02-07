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
import { Line, Bar } from 'react-chartjs-2';
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

  const generateDailyPayments = () => {
    const payments = Array(30).fill(0);
    transactions.forEach((transaction) => {
      const date = new Date(transaction.transactionDate);
      const today = new Date();
      const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 30) {
        payments[diffDays] += transaction.amount;
      }
    });
    return payments;
  };

  const dailyPayments = generateDailyPayments();

  // Common chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Payment Activity Overview' },
      tooltip: { mode: 'index', intersect: false },
    },
    maintainAspectRatio: false
  };

  // Line Chart Data
  const lineChartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [{
      label: "Daily Payments",
      data: dailyPayments,
      borderColor: '#4a90e2',
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
      fill: true,
      tension: 0.4,
    }]
  };

  // Bar Chart Data
  const barChartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [{
      label: "Daily Payments",
      data: dailyPayments,
      backgroundColor: '#00c853',
      borderColor: '#009624',
      borderWidth: 1,
    }]
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