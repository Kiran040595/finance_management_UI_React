import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate

function LoanDetails() {
  const { id } = useParams(); // Get the loan ID from the URL
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/loan/${id}`) // Make API call to fetch details for specific loan
      .then((response) => {
        setLoan(response.data); // Set the loan data
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError('Error fetching loan details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="loan-details p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Loan Details</h2>
      <button
        className="mb-4 text-blue-500"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        Back to Loan List
      </button>

      <div className="loan-info">
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Loan Information */}
        <h3 className="text-xl font-bold mb-4">Loan Information</h3>
        <p><strong>File Number:</strong> {loan.fileNumber}</p>
        <p><strong>Loan Amount:</strong> Rs {loan.loanAmount}</p>
        <p><strong>Date of Loan Creation:</strong> {loan.loanCreationDate}</p>
        <p><strong>Tenure:</strong> {loan.tenure} months</p>
        <p><strong>EMI:</strong> Rs {loan.emi}</p>

        {/* Customer Details */}
        <h3 className="text-lg font-semibold mb-4 mt-6">Customer Details</h3>
        <p><strong>Customer Name:</strong> {loan.customerName}</p>
        <p><strong>Phone Number:</strong> {loan.phoneNumber}</p>
        <p><strong>Phone Number 2:</strong> {loan.phoneNumber2 || "N/A"}</p>
        <p><strong>Father's Name:</strong> {loan.fatherName}</p>
        <p><strong>Aadhaar Number:</strong> {loan.adharNumber}</p>
        <p><strong>Address:</strong> House No. {loan.houseNo}, Village {loan.villageName}</p>

        {/* Guarantor Details */}
        <h3 className="text-lg font-semibold mb-4 mt-6">Guarantor Details</h3>
        <p><strong>Guarantor Name:</strong> {loan.guarantorName}</p>
        <p><strong>Phone Number:</strong> {loan.guarantorPhoneNumber}</p>
        <p><strong>Aadhaar Number:</strong> {loan.guarantorAdharNumber}</p>
        <p><strong>Address:</strong> House No. {loan.guarantorHouseNo}, Village {loan.guarantorVillageName}</p>

        {/* Vehicle Details */}
        <h3 className="text-lg font-semibold mb-4 mt-6">Vehicle Details</h3>
        <p><strong>Vehicle Number:</strong> {loan.vehicleNumber}</p>
        <p><strong>Model Year:</strong> {loan.modelYear}</p>
        <p><strong>Insurance Expiry Date:</strong> {loan.insuranceExpiryDate}</p>
        <p><strong>Insurance Validity:</strong> {loan.insuranceValidity}</p>
    </div>

      </div>
    </div>
  );
}

export default LoanDetails;
