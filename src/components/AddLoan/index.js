import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddLoan = ({ onSave, onClose }) => {
    const [fileNumber, setFileNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [tenure, setTenure] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [insuranceValidity, setInsuranceValidity] = useState('');
    const [emi, setEmi] = useState(0);

    const calculateEmi = () => {
        if (loanAmount && tenure && interestRate) {
            const principal = parseFloat(loanAmount);
            const tenureMonths = parseInt(tenure);
            const rateOfInterest = parseFloat(interestRate) / 100 / 12;
            const emiValue = (principal * rateOfInterest * Math.pow(1 + rateOfInterest, tenureMonths)) / 
                             (Math.pow(1 + rateOfInterest, tenureMonths) - 1);
            setEmi(emiValue.toFixed(2));
        }
    };

    useEffect(() => {
        calculateEmi();
    }, [loanAmount, tenure, interestRate]);

    const handleSubmit = async (e) => {
        console.log("calling Sub")
        e.preventDefault();

        const loanDTO = {
            fileNumber,
            customerName,
            loanAmount,
            tenure,
            interestRate,
            vehicleNumber,
            insuranceValidity,
            emi,
          };
        try {
            const response = await axios.post('http://localhost:8081/api/loans', loanDTO );
            onSave(response.data); // Save loan data and close form
            // Close form after saving
            onClose();      
        } catch (error) {
          console.error('Error occurred during loan creation:', error);
        }
    };

    const handleClose = () => {
        setFileNumber('');
        setCustomerName('');
        setLoanAmount('');
        setTenure('');
        setInterestRate('');
        setVehicleNumber('');
        setInsuranceValidity('');
        setEmi(0);
        onClose(); // Trigger onClose to close the modal
    };

    return (
        <div className="modal-container w-3/4 mx-auto p-6 rounded-lg bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Loan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">File Number</label>
                        <input
                            type="text"
                            value={fileNumber}
                            onChange={(e) => setFileNumber(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Customer Name</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Loan Amount</label>
                        <input
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Tenure (in months)</label>
                        <input
                            type="number"
                            value={tenure}
                            onChange={(e) => setTenure(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Interest Rate (%)</label>
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Vehicle Number</label>
                        <input
                            type="text"
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                            className="p-2 border rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Insurance Validity</label>
                        <input
                            type="date"
                            value={insuranceValidity}
                            onChange={(e) => setInsuranceValidity(e.target.value)}
                            className="p-2 border rounded-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">EMI</label>
                        <input
                            type="text"
                            value={emi}
                            readOnly
                            className="p-2 border rounded-md bg-gray-200"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-gray-500 text-white p-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        Save Loan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddLoan;
