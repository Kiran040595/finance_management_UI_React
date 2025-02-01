import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import LoanDetailsForm from "../LoanDetailsForm";
import CustomerDetailsForm from "../CustomerDetailsForm";
import VehicleDetailsForm from "../VehicleDetailsForm";
import GuarantorDetailsForm from "../GuarantorDetailsForm";
import { 
    Box, 
    Button, 
    CircularProgress, 
    Paper, 
    Step, 
    StepLabel, 
    Stepper, 
    Typography, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle 
} from "@mui/material";

const steps = ["Loan Details", "Customer Details", "Vehicle Details", "Guarantor Details"];

const AddLoan = ({ onSave, onClose }) => {
    const [loanDetails, setLoanDetails] = useState({
        fileNumber: "",
        loanAmount: "",
        interestRate: "",
        tenure: "",
        emi: "0",
        loanCreationDate: new Date().toISOString().split("T")[0],
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseDialog = (event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setOpenDialog(false);
            onClose();
        }
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoanDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSaveLoan = async () => {
        if (!loanDetails.fileNumber || !loanDetails.loanAmount) {
            alert("Loan details cannot be empty!");
            return;
        }

        console.log("Payload being sent:", loanDetails);

        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:8081/api/loan", loanDetails);
            
            if (response.status === 201) {
                setOpenDialog(true); // Open confirmation popup
                onSave && onSave(response.data);
            } else {
                alert("Unexpected response. Please try again.");
            }
        } catch (error) {
            console.error("Error saving loan:", error);
            alert(error.response?.data?.message || "Failed to save the loan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper 
            sx={{ 
                p: 4, 
                width: "90%", 
                maxWidth: "1200px", 
                minHeight: "80vh", 
                margin: "auto", 
                position: "relative" 
            }}
        >
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
                Add New Loan
            </Typography>

            <Stepper activeStep={currentStep} alternativeLabel sx={{ width: "100%", mb: 4 }}>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ width: "100%", minHeight: "50vh" }}>
                {currentStep === 0 && <LoanDetailsForm loanDetails={loanDetails} handleInputChange={handleInputChange} />}
                {currentStep === 1 && <CustomerDetailsForm loanDetails={loanDetails} handleInputChange={handleInputChange} />}
                {currentStep === 2 && <VehicleDetailsForm loanDetails={loanDetails} handleInputChange={handleInputChange} />}
                {currentStep === 3 && <GuarantorDetailsForm loanDetails={loanDetails} handleInputChange={handleInputChange} />}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button variant="contained" color="error" onClick={onClose} disabled={isLoading}>
                    Close
                </Button>

                <Box>
                    {currentStep > 0 && (
                        <Button variant="contained" color="secondary" onClick={prevStep} sx={{ mr: 2 }} disabled={isLoading}>
                            Back
                        </Button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <Button variant="contained" color="primary" onClick={nextStep} disabled={isLoading}>
                            Next
                        </Button>
                    ) : (
                        <Button variant="contained" color="success" onClick={handleSaveLoan} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : "Save"}
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Material UI Dialog for Loan Confirmation */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Loan Saved Successfully</DialogTitle>
                <DialogContent>
                    <Typography variant="body1"><strong>Loan Number:</strong> {loanDetails.fileNumber}</Typography>
                    <Typography variant="body1"><strong>Loan Amount:</strong> ${loanDetails.loanAmount}</Typography>
                    <Typography variant="body1"><strong>EMI Amount:</strong> ${loanDetails.emi}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

AddLoan.propTypes = {
    onSave: PropTypes.func,
    onClose: PropTypes.func.isRequired,
};

export default AddLoan;
