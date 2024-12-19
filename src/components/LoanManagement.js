import React, { useState, useCallback } from 'react';
import AddLoan from './AddLoan'; // This will include all the forms for loan, customer, vehicle, and guarantor
import LoansList from './LoansList';
import './Modal.css';

function LoanManagement() {
    const [loans, setLoans] = useState([]);
    const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
    const [loanDetails, setLoanDetails] = useState({
        loanAmount: '',
        customerName: '',
        tenure: '',
        interestRate: '',
        // Customer Details
        customerPhonePrimary: '',
        address: '',
        adharNumber: '',
        // Vehicle Details
        vehicleNumber: '',
        modelYear: '',
        insuranceExpiryDate: '',
        // Guarantor Details
        guarantorName: '',
        guarantorPhoneNumber: '',
        guarantorAdharNumber: '',
    });

    // Function to show and hide the loan form
    const showLoanForm = () => {
        setLoanDetails({
            loanAmount: '',
            customerName: '',
            tenure: '',
            interestRate: '',
            customerPhonePrimary: '',
            address: '',
            adharNumber: '',
            vehicleNumber: '',
            modelYear: '',
            insuranceExpiryDate: '',
            guarantorName: '',
            guarantorPhoneNumber: '',
            guarantorAdharNumber: '',
        });  // Reset the form fields
        setIsLoanFormVisible(true);
    };
    const onClose = () => setIsLoanFormVisible(false);
    
    // Function to handle adding a new loan
    const addNewLoan = (newLoan) => {
        setLoans([...loans, newLoan]);
        onClose(); // Close form after adding loan
    };

    // Memoize the handleInputChange function
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'loanDetails') {
            setLoanDetails(value); 
        }
        
        setLoanDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    
    }, []);

    return (
        <div className="loan-management">
            {/* Conditionally render the Add New Loan card */}
            {!isLoanFormVisible && (
                <div className="grid grid-cols-5 gap-4 sticky top-1 z-10">
                    <div
                        onClick={showLoanForm}
                        className="card bg-blue-200 p-4 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition-transform transform hover:scale-105"
                    >
                        <h2 className="text-center font-semibold">Add New Loan</h2>
                    </div>
                </div>
            )}

            {/* Show the AddLoan form if isLoanFormVisible is true */}
            {isLoanFormVisible && (
                <AddLoan
                    loanDetails={loanDetails}
                    setLoanDetails={setLoanDetails}
                    onSave={addNewLoan}
                    handleInputChange={handleInputChange}
                    onClose={onClose}
                />
            )}

            <LoansList />
        </div>
    );
}

export default LoanManagement;
