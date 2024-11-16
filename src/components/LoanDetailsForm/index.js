import React from "react";

const LoanDetailsForm = ({ loanDetails, handleInputChange }) => {
    // Auto-calculation of EMI based on fixed interest rate
    const calculateEMI = (loanAmount, interestRate, tenure) => {
        const principal = parseFloat(loanAmount);
        const interestPer100 = parseFloat(interestRate); // Interest rate per ₹100
        const months = parseInt(tenure);

        if (isNaN(principal) || isNaN(interestPer100) || isNaN(months)) return 0;

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

    // Calculate EMI value when loan details are entered
    const emi = calculateEMI(
        loanDetails.loanAmount,
        loanDetails.interestRate,
        loanDetails.tenure
    );

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
                        value={loanDetails.fileNumber || ""}
                        onChange={handleInputChange}
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
                        value={loanDetails.loanAmount || ""}
                        onChange={handleInputChange}
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
                        value={loanDetails.loanCreationDate || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg shadow-sm text-sm text-gray-700"
                    />
                </div>

                {/* Rate of Interest Input (per ₹100) */}
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-600">Rate of Interest (in Rs per 100)</label>
                    <input
                        type="number"
                        name="interestRate"
                        value={loanDetails.interestRate || ""}
                        onChange={handleInputChange}
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
                        value={loanDetails.tenure || ""}
                        onChange={handleInputChange}
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
                        value={emi || "0"}
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
