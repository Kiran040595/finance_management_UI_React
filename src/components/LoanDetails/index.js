import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function LoanDetails() {
  const { id } = useParams(); // Loan ID from URL
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const navigate = useNavigate(); // Navigation

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/loan/${id}`) // Fetch loan details
      .then((response) => {
        setLoan(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching loan details');
        setLoading(false);
      });
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoan((prevLoan) => ({
      ...prevLoan,
      [name]: value,
    }));
  };

  

  const handleSaveChanges = () => {
    axios
      .put(`http://localhost:8081/api/loan/${id}`, loan) // PUT request to save the updated loan details
      .then(() => {
        setIsEditing(false); // Disable edit mode after saving
      })
      .catch((error) => {
        setError('Error saving loan details');
      });
  };

  const handleDeleteLoan = () => {
     // Redirect to the Loans page
    if (window.confirm('Are you sure you want to delete this loan?')) {
      axios
        .delete(`http://localhost:8081/api/loan/${id}`) // DELETE request to remove the loan
        .then(() => {
          alert('Loan deleted successfully');
          // Redirect to another page or update the state to reflect the deletion
          navigate('/loan-management'); // Redirect to the Loans page
        })
        .catch((error) => {
          setError('Error deleting loan');
        });
    }
  };
  

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">Loan Details</h2>
      
      <button
        className="mb-6 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        onClick={() => navigate(-1)}
      >
        Back to Loan List
      </button>

      {/* Edit Toggle Button */}
      <button
        className="mb-6 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        onClick={isEditing ? handleSaveChanges : toggleEdit}
      >
        {isEditing ? 'Save Changes' : 'Edit'}
      </button> 

      <button onClick={handleDeleteLoan} style={{ marginLeft: '10px', color: 'red' }}>
      Delete Loan
    </button>
    {error && <p style={{ color: 'red' }}>{error}</p>}
 

      {/* Loan Information */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-purple-700">Loan Information</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <label>File Number:</label>
            {isEditing ? (
              <input
                type="text"
                name="fileNumber"
                value={loan.fileNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.fileNumber}</p>
            )}
          </div>
          <div>
            <label>Loan Amount:</label>
            {isEditing ? (
              <input
                type="text"
                name="loanAmount"
                value={loan.loanAmount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>Rs {loan.loanAmount}</p>
            )}
          </div>
          <div>
            <label>Date of Loan Creation:</label>
            {isEditing ? (
              <input
                type="date"
                name="loanCreationDate"
                value={loan.loanCreationDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.loanCreationDate}</p>
            )}
          </div>
          <div>
            <label>Tenure:</label>
            {isEditing ? (
              <input
                type="text"
                name="tenure"
                value={loan.tenure}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.tenure} months</p>
            )}
          </div>
          <div>
            <label>EMI:</label>
            {isEditing ? (
              <input
                type="text"
                name="emi"
                value={loan.emi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>Rs {loan.emi}</p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Customer Details</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="customerName"
                value={loan.customerName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.customerName}</p>
            )}
          </div>
          <div>
            <label>Phone 1:</label>
            {isEditing ? (
              <input
                type="text"
                name="customerPhonePrimary"
                value={loan.customerPhonePrimary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.customerPhonePrimary}</p>
            )}
          </div>
          <div>
            <label>Phone 2:</label>
            {isEditing ? (
              <input
                type="text"
                name="customerPhoneSecondary"
                value={loan.customerPhoneSecondary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.customerPhoneSecondary || 'N/A'}</p>
            )}
          </div>
          <div>
            <label>Father's Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="customerFatherName"
                value={loan.customerFatherName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.customerFatherName}</p>
            )}
          </div>
          <div>
            <label>Aadhaar:</label>
            {isEditing ? (
              <input
                type="text"
                name="customerAadhaarNumber"
                value={loan.customerAadhaarNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.customerAadhaarNumber}</p>
            )}
          </div>
          <div>
            <label>Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="customerFullAddress"
                value={loan.customerFullAddress}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.customerFullAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* Guarantor Details */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-green-700">Guarantor Details</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <label>Guarantor Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="guarantorName"
                value={loan.guarantorName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.guarantorName}</p>
            )}
          </div>
          <div>
            <label>Guarantor Phone:</label>
            {isEditing ? (
              <input
                type="text"
                name="guarantorPhonePrimary"
                value={loan.guarantorPhonePrimary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.guarantorPhonePrimary}</p>
            )}
          </div>
          <div>
            <label>Guarantor Aadhaar:</label>
            {isEditing ? (
              <input
                type="text"
                name="guarantorAadhaarNumber"
                value={loan.guarantorAadhaarNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.guarantorAadhaarNumber}</p>
            )}
          </div>
          <div>
            <label>Guarantor Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="guarantorFullAddress"
                value={loan.guarantorFullAddress}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.guarantorFullAddress}</p>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-red-700">Vehicle Details</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <label>Vehicle Number:</label>
            {isEditing ? (
              <input
                type="text"
                name="vehicleNumber"
                value={loan.vehicleNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.vehicleNumber}</p>
            )}
          </div>
          <div>
            <label>Model Year:</label>
            {isEditing ? (
              <input
                type="text"
                name="vehicleModelYear"
                value={loan.vehicleModelYear}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.vehicleModelYear}</p>
            )}
          </div>
          <div>
            <label>Insurance Expiry Date:</label>
            {isEditing ? (
              <input
                type="date"
                name="vehicleInsuranceExpiryDate"
                value={loan.vehicleInsuranceExpiryDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.vehicleInsuranceExpiryDate}</p>
            )}
          </div>
          <div>
            <label>Insurance Validity:</label>
            {isEditing ? (
              <input
                type="text"
                name="insuranceValidity"
                value={loan.insuranceValidity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p>{loan.insuranceValidity}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanDetails;
