import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Box,
  Alert,
  Divider
} from '@mui/material';

function LoanDetails() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/loan/${id}`)
      .then((response) => {
        setLoan(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error fetching loan details');
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoan((prevLoan) => ({
      ...prevLoan,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    axios
      .put(`http://localhost:8081/api/loan/${id}`, loan)
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        setError('Error saving loan details');
      });
  };

  const handleDeleteLoan = () => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      axios
        .delete(`http://localhost:8081/api/loan/${id}`)
        .then(() => {
          alert('Loan deleted successfully');
          navigate('/loan-management');
        })
        .catch((error) => {
          setError('Error deleting loan');
        });
    }
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const renderField = (label, name, value, isDate = false) => (
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      {isEditing ? (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          name={name}
          value={value}
          onChange={handleInputChange}
          type={isDate ? 'date' : 'text'}
          sx={{ mt: 1 }}
        />
      ) : (
        <Typography variant="body1" sx={{ mt: 1 }}>
          {isDate ? value : name.includes('Amount') || name.includes('emi') ? `Rs ${value}` : value}
        </Typography>
      )}
    </Grid>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none' }}
        >
          Back to Loan List
        </Button>
        <Box>
          <Button
            variant="contained"
            color={isEditing ? 'success' : 'primary'}
            onClick={isEditing ? handleSaveChanges : toggleEdit}
            sx={{ mr: 2, textTransform: 'none' }}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteLoan}
            sx={{ textTransform: 'none' }}
          >
            Delete Loan
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Loan Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {renderField('File Number', 'fileNumber', loan.fileNumber)}
          {renderField('Loan Amount', 'loanAmount', loan.loanAmount)}
          {renderField('Date of Loan Creation', 'loanCreationDate', loan.loanCreationDate, true)}
          {renderField('Tenure (months)', 'tenure', loan.tenure)}
          {renderField('EMI', 'emi', loan.emi)}
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Customer Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {renderField('Name', 'customerName', loan.customerName)}
          {renderField('Phone 1', 'customerPhonePrimary', loan.customerPhonePrimary)}
          {renderField('Phone 2', 'customerPhoneSecondary', loan.customerPhoneSecondary || 'N/A')}
          {renderField("Father's Name", 'customerFatherName', loan.customerFatherName)}
          {renderField('Aadhaar', 'customerAadhaarNumber', loan.customerAadhaarNumber)}
          {renderField('Address', 'customerFullAddress', loan.customerFullAddress)}
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Guarantor Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {renderField('Guarantor Name', 'guarantorName', loan.guarantorName)}
          {renderField('Guarantor Phone', 'guarantorPhonePrimary', loan.guarantorPhonePrimary)}
          {renderField('Guarantor Aadhaar', 'guarantorAadhaarNumber', loan.guarantorAadhaarNumber)}
          {renderField('Guarantor Address', 'guarantorFullAddress', loan.guarantorFullAddress)}
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Vehicle Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {renderField('Vehicle Number', 'vehicleNumber', loan.vehicleNumber)}
          {renderField('Model Year', 'vehicleModelYear', loan.vehicleModelYear)}
          {renderField('Insurance Expiry Date', 'vehicleInsuranceExpiryDate', loan.vehicleInsuranceExpiryDate, true)}
          {renderField('Insurance Validity', 'insuranceValidity', loan.insuranceValidity)}
        </Grid>
      </Paper>
    </Container>
  );
}

export default LoanDetails;