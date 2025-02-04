import React from "react";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";
import { Box, Typography, Grid, Card, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a custom theme (optional)
const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    // Override some default styles if needed
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const Dashboard = () => {
  // Dummy data for charts
  const loanGrowthData = [
    { x: "Jan", y: 400 },
    { x: "Feb", y: 300 },
    { x: "Mar", y: 500 },
    { x: "Apr", y: 600 },
    { x: "May", y: 700 },
  ];

  const emiCollectionData = [
    { x: "Jan", y: 50000 },
    { x: "Feb", y: 60000 },
    { x: "Mar", y: 70000 },
    { x: "Apr", y: 80000 },
    { x: "May", y: 90000 },
  ];

  const loanStatusData = [
    { id: 0, value: 400, label: "Active Loans" },
    { id: 1, value: 300, label: "Closed Loans" },
    { id: 2, value: 200, label: "Pending Loans" },
  ];

  const predictedGrowthData = [
    { x: "Q1", y: 450000 },
    { x: "Q2", y: 550000 },
    { x: "Q3", y: 600000 },
    { x: "Q4", y: 700000 },
  ];

  // Dummy summary data for each card
  const loanGrowthSummary = {
    totalLoans: 120,
    totalAmountGiven: 5000000,
    totalAmountRecovered: 3500000,
    totalOutstanding: 1500000,
  };

  const totalEMI = emiCollectionData.reduce((acc, curr) => acc + curr.y, 0);
  const avgEMI = totalEMI / emiCollectionData.length;
  const maxEMI = Math.max(...emiCollectionData.map((d) => d.y));

  const loanStatusSummary = {
    active: loanStatusData.find((d) => d.label.includes("Active"))?.value || 0,
    closed: loanStatusData.find((d) => d.label.includes("Closed"))?.value || 0,
    pending: loanStatusData.find((d) => d.label.includes("Pending"))?.value || 0,
  };

  const totalPredicted = predictedGrowthData.reduce((acc, curr) => acc + curr.y, 0);
  const avgPredicted = totalPredicted / predictedGrowthData.length;
  const growthDiff =
    predictedGrowthData[predictedGrowthData.length - 1].y -
    predictedGrowthData[0].y;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Page Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Finance Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Overview of loan performance and key metrics
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Loan Growth Card with Embedded Summary */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 1, minHeight: 240 }}>
              <Typography variant="subtitle1" sx={{ fontSize: "14px", mb: 1 }}>
                Loan Growth Over Time
              </Typography>
              <Box display="flex" justifyContent="center">
                <LineChart
                  xAxis={[{ scaleType: "point", dataKey: "x" }]}
                  series={[
                    {
                      dataKey: "y",
                      label: "Loan Growth",
                      color: "#42a5f5",
                    },
                  ]}
                  dataset={loanGrowthData}
                  width={250}
                  height={150}
                />
              </Box>
              {/* Embedded Summary Cards */}
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Total Loans</Typography>
                    <Typography variant="body2">
                      {loanGrowthSummary.totalLoans}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Amount Given</Typography>
                    <Typography variant="body2">
                      ₹{loanGrowthSummary.totalAmountGiven.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Recovered</Typography>
                    <Typography variant="body2">
                      ₹{loanGrowthSummary.totalAmountRecovered.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Outstanding</Typography>
                    <Typography variant="body2">
                      ₹{loanGrowthSummary.totalOutstanding.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* EMI Collection Card with Embedded Summary */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 1, minHeight: 240 }}>
              <Typography variant="subtitle1" sx={{ fontSize: "14px", mb: 1 }}>
                EMI Collection (Monthly)
              </Typography>
              <Box display="flex" justifyContent="center">
                <BarChart
                  xAxis={[{ scaleType: "band", dataKey: "x" }]}
                  series={[
                    {
                      dataKey: "y",
                      label: "EMI Collection",
                      color: "#ff7043",
                    },
                  ]}
                  dataset={emiCollectionData}
                  width={250}
                  height={150}
                />
              </Box>
              {/* Embedded Summary Cards for EMI */}
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Total EMI</Typography>
                    <Typography variant="body2">
                      ₹{totalEMI.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Avg EMI</Typography>
                    <Typography variant="body2">
                      ₹{Math.round(avgEMI).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Max EMI</Typography>
                    <Typography variant="body2">
                      ₹{maxEMI.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Loan Status Distribution Card with Embedded Summary */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 1, minHeight: 240 }}>
              <Typography variant="subtitle1" sx={{ fontSize: "14px", mb: 1 }}>
                Loan Status Distribution
              </Typography>
              <Box display="flex" justifyContent="center">
                <PieChart
                  series={[
                    {
                      data: loanStatusData,
                      innerRadius: 30,
                      outerRadius: 60,
                      paddingAngle: 5,
                      cornerRadius: 3,
                    },
                  ]}
                  width={250}
                  height={150}
                />
              </Box>
              {/* Embedded Summary Cards for Loan Status */}
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Active</Typography>
                    <Typography variant="body2">
                      {loanStatusSummary.active}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Closed</Typography>
                    <Typography variant="body2">
                      {loanStatusSummary.closed}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Pending</Typography>
                    <Typography variant="body2">
                      {loanStatusSummary.pending}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Predicted Loan Growth Card with Embedded Summary */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ p: 1, minHeight: 240 }}>
              <Typography variant="subtitle1" sx={{ fontSize: "14px", mb: 1 }}>
                Predicted Loan Growth
              </Typography>
              <Box display="flex" justifyContent="center">
                <LineChart
                  xAxis={[{ scaleType: "point", dataKey: "x" }]}
                  series={[
                    {
                      dataKey: "y",
                      label: "Projected Growth",
                      color: "#66bb6a",
                      area: true,
                    },
                  ]}
                  dataset={predictedGrowthData}
                  width={250}
                  height={150}
                />
              </Box>
              {/* Embedded Summary Cards for Predicted Growth */}
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Total Predicted</Typography>
                    <Typography variant="body2">
                      ₹{totalPredicted.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Avg Predicted</Typography>
                    <Typography variant="body2">
                      ₹{Math.round(avgPredicted).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card sx={{ p: 0.5, textAlign: "center", boxShadow: 0 }}>
                    <Typography variant="caption">Q4-Q1 Diff</Typography>
                    <Typography variant="body2">
                      ₹{growthDiff.toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
