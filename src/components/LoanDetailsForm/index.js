import React, { useState, useEffect } from "react";

// Function to calculate EMI based on the loan amount, interest rate, and tenure
const calculateEMI = (loanAmount, interestRate, tenure) => {
    const principal = parseFloat(loanAmount);
    const interestPer100 = parseFloat(interestRate); // Interest rate per ₹100
    const months = parseInt(tenure);

    if (isNaN(principal) || isNaN(interestPer100) || isNaN(months) || principal <= 0 || interestPer100 <= 0 || months <= 0) {
        return 0;
    }

    // Calculate monthly interest based on the loan amount
    const interestPerMonth = (principal * interestPer100) / 100;

    // Calculate total interest for the entire loan tenure
    const totalInterest = interestPerMonth * months;

    // Total repayment = principal + total interest
    const totalRepayment = principal + totalInterest;

    // EMI = total repayment / number of months
    const emi = totalRepayment / months;

    return emi.toFixed(2); // Round to 2 decimal places
};

const LoanDetailsForm = ({ loanDetails, handleInputChange }) => {
    // State for EMI details (loan amount, interest rate, and tenure)
    const [loanData, setLoanData] = useState({
        loanAmount: loanDetails.loanAmount || "",
        interestRate: loanDetails.interestRate || "",
        tenure: loanDetails.tenure || "",
        fileNumber: loanDetails.fileNumber || "",
        loanCreationDate: loanDetails.loanCreationDate ||new Date().toISOString().split("T")[0],
    });

    // Function to handle changes to individual fields in loanData
    const handleLoanDataChange = (event) => {
        const { name, value } = event.target;
        setLoanData((prev) => {
            const updatedLoanData = { ...prev, [name]: value };
            const calculatedEmi = calculateEMI(
                updatedLoanData.loanAmount,
                updatedLoanData.interestRate,
                updatedLoanData.tenure
            );
            // Update the parent component's EMI field and all loan details (including fileNumber, loanCreationDate)
            handleInputChange({
                target: {
                    name: "loanDetails",
                    value: {
                        ...updatedLoanData,
                        emi: calculatedEmi, // Include calculated EMI
                    },
                },
            });
            return updatedLoanData;
        });
    };

    return (
        <div className="p-4 mb-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Loan Details</h3>

            {/* Use grid for 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* File Number Input */}
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">File Number</label>
                    <input
                        type="text"
                        name="fileNumber"
                        value={loanData.fileNumber || ""}
                        onChange={handleLoanDataChange} // Ensure it's using handleLoanDataChange
                        className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                        placeholder="Enter File Number"
                    />
                </div>

                {/* Loan Amount Input */}
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">Loan Amount</label>
                    <input
                        type="number"
                        name="loanAmount"
                        value={loanData.loanAmount || ""}
                        onChange={handleLoanDataChange}
                        className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                        placeholder="Enter Loan Amount"
                    />
                </div>

                {/* Date of Loan Creation Input */}
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">Date of Loan Creation</label>
                    <input
                        type="date"
                        name="loanCreationDate"
                        value={loanData.loanCreationDate || ""}
                        onChange={handleLoanDataChange} // Ensure it's using handleLoanDataChange
                        className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                    />  
                </div>

                {/* Rate of Interest Input (per ₹100) */}
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">Rate of Interest (in Rs per 100)</label>
                    <input
                        type="number"
                        name="interestRate"
                        value={loanData.interestRate || ""}
                        onChange={handleLoanDataChange}
                        className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                        placeholder="Enter Interest Rate"
                    />
                </div>

                {/* Tenure Input */}
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">Tenure (in months)</label>
                    <input
                        type="number"
                        name="tenure"
                        value={loanData.tenure || ""}
                        onChange={handleLoanDataChange}
                        className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                        placeholder="Enter Tenure (in months)"
                    />
                </div>

                {/* EMI Display */}
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">EMI (Auto-calculated)</label>
                    <input
                        type="text"
                        name="emi"
                        value={loanDetails.emi || "0"}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-100 text-sm text-gray-700"
                        placeholder="EMI will be calculated automatically"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoanDetailsForm;
