import React, { useEffect } from "react";
import { TextField, Grid, Paper, Typography } from "@mui/material";




const calculateEMI = (loanAmount, interestRate, tenure) => {
    const principal = parseFloat(loanAmount);
    const interestRatePerMonth = parseFloat(interestRate);
    const months = parseInt(tenure);

    if (isNaN(principal) || isNaN(interestRatePerMonth) || isNaN(months) || principal <= 0 || interestRatePerMonth < 0 || months <= 0) {
        return "0";
    }

    const totalInterest = principal * (interestRatePerMonth / 100) * months;
    const totalAmount = principal + totalInterest;
    const emi = totalAmount / months;

    return emi.toFixed(2);
};

const LoanDetailsForm = ({ loanDetails, handleInputChange }) => {
    // Auto-calculate EMI when loanAmount, interestRate, or tenure changes
    useEffect(() => {
        const calculatedEmi = calculateEMI(loanDetails.loanAmount, loanDetails.interestRate, loanDetails.tenure);
        handleInputChange({ target: { name: "emi", value: calculatedEmi } });
    }, [loanDetails.loanAmount, loanDetails.interestRate, loanDetails.tenure]);

    const handleLoanDataChange = (event) => {
        const { name, value } = event.target;
        handleInputChange(event); // Update the parent state directly
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>Loan Details</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="File Number"
                        name="fileNumber"
                        value={loanDetails.fileNumber || ""}
                        onChange={handleLoanDataChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Loan Amount"
                        name="loanAmount"
                        type="number"
                        value={loanDetails.loanAmount || ""}
                        onChange={handleLoanDataChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Loan Creation Date"
                        name="loanCreationDate"
                        type="date"
                        value={loanDetails.loanCreationDate || new Date().toISOString().split("T")[0]}
                        onChange={handleLoanDataChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Rate of Interest (%)"
                        name="interestRate"
                        type="number"
                        value={loanDetails.interestRate || ""}
                        onChange={handleLoanDataChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Tenure (in months)"
                        name="tenure"
                        type="number"
                        value={loanDetails.tenure || ""}
                        onChange={handleLoanDataChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="EMI (Auto-calculated)"
                        name="emi"
                        value={loanDetails.emi || "0"}
                        fullWidth
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default LoanDetailsForm;
