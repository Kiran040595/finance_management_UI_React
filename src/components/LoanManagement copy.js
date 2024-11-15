import React, { useState } from 'react';
import './Modal.css';

function LoanManagement() {
    const [showModal, setShowModal] = useState(false);
    const [loanDetails, setLoanDetails] = useState({ loanAmount: '', customerName: '', tenure: '', interestRate: '' });
    const [loans, setLoans] = useState([]);
    const [modalMode, setModalMode] = useState(''); // Mode: 'add', 'edit', 'view'
    const [currentLoanIndex, setCurrentLoanIndex] = useState(null); // Track the loan being edited or viewed
    const [filter, setFilter] = useState('');

    const openModal = (mode, loanIndex = null) => {
        setModalMode(mode);
        if (loanIndex !== null) {
            setLoanDetails(loans[loanIndex]); // Load loan details if editing/viewing
            setCurrentLoanIndex(loanIndex);
        } else {
            setLoanDetails({ loanAmount: '', customerName: '', tenure: '', interestRate: '' }); // Clear details for new loan
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoanDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Flat interest calculation
    const calculateFlatInterest = (principal, tenure) => {
        const interestPer100 = 2; // 2 rupees per 100 Rs
        const totalInterest = (principal * interestPer100 / 100) * tenure; // Total interest for the tenure
        const totalAmount = principal + totalInterest; // Total amount payable
        const monthlyEMI = totalAmount / tenure; // Calculate monthly EMI
        return { monthlyEMI, totalInterest }; // Return monthly EMI and total interest
    };

    const handleAddLoan = (e) => {
        e.preventDefault();
        const { loanAmount, tenure, customerName } = loanDetails;
        
        // Check for empty fields
        if (!loanAmount || !tenure || !customerName) {
            alert("Please fill in all fields");
            return;
        }

        const { monthlyEMI } = calculateFlatInterest(parseFloat(loanAmount), parseInt(tenure));
        setLoans([...loans, { customerName, loanAmount, tenure, monthlyEMI }]);
        setLoanDetails({ loanAmount: '', customerName: '', tenure: '' });
        closeModal();
    };

    const handleUpdateLoan = (e) => {
        e.preventDefault();
        const updatedLoans = [...loans];
        const { loanAmount, tenure, customerName } = loanDetails;
        const { monthlyEMI } = calculateFlatInterest(parseFloat(loanAmount), parseInt(tenure));
        updatedLoans[currentLoanIndex] = { customerName, loanAmount, tenure, monthlyEMI }; // Update loan at specific index
        setLoans(updatedLoans);
        setLoanDetails({ loanAmount: '', customerName: '', tenure: '' });
        setCurrentLoanIndex(null);
        closeModal();
    };

    const handleDeleteLoan = (index) => {
        const updatedLoans = loans.filter((_, loanIndex) => loanIndex !== index); // Remove the loan at the specified index
        setLoans(updatedLoans);
    };

    return (
        <div className="loan-management">
            <h2 className="text-2xl font-semibold mb-4">Loan Management</h2>

            {/* Loan Function Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div onClick={() => openModal('add')} className="card bg-blue-200 p-4 rounded-lg shadow-md cursor-pointer">
                    Add New Loan
                </div>
                <div onClick={() => openModal('view')} className="card bg-green-200 p-4 rounded-lg shadow-md cursor-pointer">
                    Get All Loans
                </div>
                <div className="card bg-yellow-200 p-4 rounded-lg shadow-md cursor-pointer">
                    Update Loan
                </div>
            </div>

            {/* Filter Input */}
            <input
                type="text"
                placeholder="Filter by Customer Name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border p-2 mb-4 rounded w-full"
            />

            {/* Modal */}
            {showModal && (
                <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="modal-content bg-white p-8 rounded-lg shadow-lg relative">
                        <span className="close-button absolute top-2 right-2 cursor-pointer" onClick={closeModal}>×</span>
                        {modalMode === 'add' && (
                            <>
                                <h3 className="text-xl mb-4">Add New Loan</h3>
                                <form onSubmit={handleAddLoan}>
                                    <div className="mb-4">
                                        <label>Customer Name</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={loanDetails.customerName}
                                            onChange={handleInputChange}
                                            className="border p-2 w-full rounded"
                                            placeholder="Enter customer name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>Loan Amount (in ₹)</label>
                                        <input
                                            type="number"
                                            name="loanAmount"
                                            value={loanDetails.loanAmount}
                                            onChange={handleInputChange}
                                            className="border p-2 w-full rounded"
                                            placeholder="Enter loan amount"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>Tenure (in months)</label>
                                        <input
                                            type="number"
                                            name="tenure"
                                            value={loanDetails.tenure}
                                            onChange={handleInputChange}
                                            className="border p-2 w-full rounded"
                                            placeholder="Enter tenure"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Loan</button>
                                </form>
                            </>
                        )}

                        {modalMode === 'view' && (
                            <>
                                <h3 className="text-xl mb-4">Loans List</h3>
                                <ul className="loan-list">
                                    {loans.filter(loan => loan.customerName.toLowerCase().includes(filter.toLowerCase())).map((loan, index) => (
                                        <li key={index} className="flex justify-between p-2 bg-gray-100 mb-2">
                                            <span>{loan.customerName} - ₹{loan.loanAmount} - Monthly EMI: ₹{loan.monthlyEMI.toFixed(2)} - Tenure: {loan.tenure} months</span>
                                            <div>
                                                <button
                                                    className="text-blue-500 underline mr-2"
                                                    onClick={() => openModal('edit', index)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-500 underline"
                                                    onClick={() => handleDeleteLoan(index)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {loans.length === 0 && <p>No loans available.</p>} {/* Message for no loans */}
                            </>
                        )}

                        {modalMode === 'edit' && (
                            <>
                                <h3 className="text-xl mb-4">Edit Loan</h3>
                                <form onSubmit={handleUpdateLoan}>
                                    <div className="mb-4">
                                        <label>Customer Name</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={loanDetails.customerName}
                                            onChange={handleInputChange}
                                            className="border p-2 w-full rounded"
                                            placeholder="Enter customer name"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>Loan Amount (in ₹)</label>
                                        <input
                                            type="number"
                                            name="loanAmount"
                                            value={loanDetails.loanAmount}
                                            onChange={handleInputChange}
                                            className="border p-2 w-full rounded"
                                            placeholder="Enter loan amount"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>Tenure (in months)</label>
                                        <input
                                            type="number"
                                            name="tenure"
                                            value={loanDetails.tenure}
                                            onChange={handleInputChange}
                                            className="border p-2 w-full rounded"
                                            placeholder="Enter tenure"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Loan</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Display Loans */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">All Loans</h2>
            <ul>
                {loans.filter(loan => loan.customerName.toLowerCase().includes(filter.toLowerCase())).map((loan, index) => (
                    <li key={index} className="flex justify-between p-2 bg-gray-100 mb-2">
                        <span>{loan.customerName} - Loan Amount: ₹{loan.loanAmount} - Monthly EMI: ₹{loan.monthlyEMI.toFixed(2)} - Tenure: {loan.tenure} months</span>
                        <div>
                            <button
                                className="text-blue-500 underline mr-2"
                                onClick={() => openModal('edit', index)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-500 underline"
                                onClick={() => handleDeleteLoan(index)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LoanManagement;
