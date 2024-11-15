import React, { useState } from 'react';
import AddLoan from './AddLoan';
import LoansList from './LoansList';
import './Modal.css';

function LoanManagement() {
    const [loans, setLoans] = useState([]);
    const [isLoanFormVisible, setIsLoanFormVisible] = useState(false);
    const [loanDetails, setLoanDetails] = useState({
        loanAmount: '',
        customerName: '',
        tenure: '',
        interestRate: ''
    });

    // Function to show and hide the loan form
    const showLoanForm = () => setIsLoanFormVisible(true);
    const onClose = () => setIsLoanFormVisible(false);

    // Function to handle adding a new loan
    const addNewLoan = (newLoan) => {
        setLoans([...loans, newLoan]);
        onClose(); // Close form after adding loan
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoanDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="loan-management">
            

            <div className="grid grid-cols-3 gap-4 sticky top-1 z-10">
    <div onClick={showLoanForm} className="card bg-blue-200 p-4 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition-transform transform hover:scale-105">
      <h2 className="text-center font-semibold">Add New Loan</h2>
    </div>

    <div onClick={showLoanForm} className="card bg-green-200 p-4 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition-transform transform hover:scale-105">
      <h2 className="text-center font-semibold">Loan List</h2>
    </div>

    <div onClick={showLoanForm} className="card bg-yellow-200 p-4 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition-transform transform hover:scale-105">
      <h2 className="text-center font-semibold">Loan Search</h2>
    </div>
  </div>
 



                       

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

