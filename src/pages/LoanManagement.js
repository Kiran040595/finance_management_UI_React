import React, { useState, useCallback } from "react";
import {
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddLoan from "../components/AddLoan"; // Loan Form Component
import LoansList from "../components/LoansList"; // Loan List Component
import LoanManagementDashboard from "../components/LoanManagementDashboard"; // Dashboard Component

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);

  // Initial Loan Details State
  const initialLoanDetails = {
    loanAmount: "",
    customerName: "",
    tenure: "",
    interestRate: "",
    customerPhonePrimary: "",
    address: "",
    adharNumber: "",
    vehicleNumber: "",
    modelYear: "",
    insuranceExpiryDate: "",
    guarantorName: "",
    guarantorPhoneNumber: "",
    guarantorAdharNumber: "",
  };

  const [loanDetails, setLoanDetails] = useState(initialLoanDetails);

  // Show Add Loan Form
  const showLoanForm = () => {
    setLoanDetails(initialLoanDetails); // Reset form
    setIsLoanFormVisible(true);
  };

  // Close Add Loan Form
  const onClose = () => setIsLoanFormVisible(false);

  // Add New Loan to the State
  const addNewLoan = (newLoan) => {
    setLoans([...loans, newLoan]);
    onClose();
  };

  // Handle Input Changes in Loan Form
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoanDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <div className="loan-management">
      {/* 🔹 Loan Management Dashboard */}
      <LoanManagementDashboard />

      {/* 🔹 Add Loan Button */}
      {!isLoanFormVisible && (
        <Grid container justifyContent="center" sx={{ marginBottom: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                textAlign: "center",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardActionArea onClick={showLoanForm}>
                <CardContent>
                  <Typography variant="h6">Add New Loan</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 🔹 Add Loan Dialog */}
      <Dialog open={isLoanFormVisible} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Loan</DialogTitle>
        <DialogContent>
          <AddLoan
            loanDetails={loanDetails}
            setLoanDetails={setLoanDetails}
            onSave={addNewLoan}
            handleInputChange={handleInputChange}
            onClose={onClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Loan List Section */}
      <LoansList />
    </div>
  );
};

export default LoanManagement;
