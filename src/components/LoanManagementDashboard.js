import React, { useEffect, useState } from "react";
import LoanService from "../services/loanService";
import { Card, Typography, Box, CircularProgress } from "@mui/material";
import CountUp from "react-countup";

const LoanManagementDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoanService.getLoanStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loan stats:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box display="flex" gap={2} marginBottom={4}>
      {/* Total Loans */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: "#e3f2fd" }}>
        <Typography variant="h6">Total Loans</Typography>
        <Typography variant="h4" color="primary">
          <CountUp end={stats?.totalLoans || 300} duration={1.5} />
        </Typography>
      </Card>

      {/* Total Loan Amount Given */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: "#fce4ec" }}>
        <Typography variant="h6">Total Loan Amount Given</Typography>
        <Typography variant="h4" color="secondary">
          ₹<CountUp end={stats?.totalLoanAmountGiven|| "No Data"} duration={1.5} separator="," />
        </Typography>
      </Card>

      {/* Total Amount Received */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: "#e8f5e9" }}>
        <Typography variant="h6">Total Amount Received</Typography>
        <Typography variant="h4" color="success">
          ₹<CountUp end={stats?.totalAmountReceived|| "No Data"} duration={1.5} separator="," />
        </Typography>
      </Card>

      {/* Total Outstanding Amount */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: "#ffebee" }}>
        <Typography variant="h6">Total Outstanding Amount</Typography>
        <Typography variant="h4" color="error">
          ₹<CountUp end={stats?.totalOutstandingAmount || "No Data"} duration={1.5} separator="," />
        </Typography>
      </Card>

      {/* Active Loans */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: "#e1bee7" }}>
        <Typography variant="h6">Active Loans</Typography>
        <Typography variant="h4" color="primary">
          <CountUp end={stats?.activeLoans|| "No Data"} duration={1.5} />
        </Typography>
      </Card>

      {/* Closed Loans */}
      <Card sx={{ flex: 1, padding: 2, backgroundColor: "#ffecb3" }}>
        <Typography variant="h6">Closed Loans</Typography>
        <Typography variant="h4" color="secondary">
          <CountUp end={stats?.closedLoans || "No Data"} duration={1.5} />
        </Typography>
      </Card>
    </Box>
  );
};

export default LoanManagementDashboard;
