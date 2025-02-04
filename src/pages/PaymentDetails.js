import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PaymentTable from '../components/PaymentTable';
import PaymentService from '../services/paymentService';
import { LinearProgress, Card, CardContent, Typography, Grid,Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button } from '@mui/material';

const PaymentDetails = () => {
  const { fileNumber } = useParams();
  const [loanDetails, setLoanDetails] = useState(null);
  const [emiRows, setEmiRows] = useState([]);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ 
    paidAmount: 0, 
    remainingAmount: 0 
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  // Fetch loan details
  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await PaymentService.getLoanDetailsByFileNumber(fileNumber);
        setLoanDetails({
          customerName: response.customerName,
          loanAmount: response.loanAmount,
          tenure: response.tenure,
          creationDate: response.loanCreationDate || 'Not Available',
          fileNumber: response.fileNumber,
          vehicleNumber: response.vehicleNumber,
          paidEmiCount: response.paidEmiCount,
          remainingEmi: response.remainingEmi,
          emi: response.emi,
          totalPendingEmiAmount: response.totalPendingEmiAmount,
        });

        const rows = response.emiDetails.map((emi) => ({
          emiNumber: emi.emiNumber,
          paidAmount: emi.paidAmount || 0,
          emiAmount: emi.emiAmount,
          initialRemainingAmount: emi.remainingAmount || emi.emiAmount, // Set initial remaining amount
          remainingAmount: emi.remainingAmount || emi.emiAmount, // Initialize remaining amount
          paymentDate: emi.paymentDate,
          status: emi.status,
          emiDate: emi.emiDate,
        }));

        setEmiRows(rows);
      } catch (err) {
        setError('Failed to fetch loan details');
      }
    };

    fetchLoanDetails();
  }, [fileNumber, refreshTrigger]);

  

  const handlePaidAmountChange = useCallback((emiNumber, value) => {
    setEmiRows((prevRows) =>
      prevRows.map((row) => {
        if (row.emiNumber === emiNumber) {
          const newPaidAmount = value;
          const baseEmiAmount = row.emiAmount; // using the explicit EMI amount
          let overdueAmount = 0;
  
          // If a payment date is set, recalculate the overdue amount.
          if (row.paymentDate) {
            const emiDate = new Date(row.emiDate);
            const paidDate = new Date(row.paymentDate);
            if (paidDate > emiDate) {
              const diffTime = paidDate - emiDate;
              const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              overdueAmount = baseEmiAmount * 0.002 * overdueDays;
            }
          }
  
          // Calculate the new remaining amount.
          const newRemainingAmount = baseEmiAmount + overdueAmount - newPaidAmount;
  
          return {
            ...row,
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
          };
        }
        return row;
      })
    );
  }, []);
  

  const handlePaymentDateChange = useCallback((emiNumber, date) => {
    setEmiRows((prevRows) =>
      prevRows.map((row) => {
        if (row.emiNumber === emiNumber) {
          // Parse dates from the row and the new value.
          const emiDate = new Date(row.emiDate);
          const paidDate = new Date(date);
  
          // Use initialRemainingAmount as the base EMI amount.
          const baseEmiAmount = row.emiAmount; 
          console.log(baseEmiAmount);
          const paidAmount = row.paidAmount || 0;
          let overdueAmount = 0;
  
          // Only adjust if the paid date is later than the EMI due date.
          if (date && paidDate > emiDate) {
            // Calculate the difference in days.
            const diffTime = paidDate - emiDate;
            const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            // Calculate overdue amount based on the provided logic (2% per day).
            overdueAmount = baseEmiAmount * 0.002 * overdueDays;
          }
  
          // Calculate the new remaining amount.
          const newRemainingAmount = baseEmiAmount + overdueAmount - paidAmount;
  
          return {
            ...row,
            paymentDate: date,
            remainingAmount: newRemainingAmount,
          };
        }
        return row;
      })
    );
  }, []);
  
  
  

  // Handle payment
  const handlePay = useCallback(
    async (emiNumber, paymentAmount,paymentDate) => {
      try {
        const response = await PaymentService.payEMI(fileNumber, emiNumber, paymentAmount,paymentDate);
        const { paidAmount, remainingAmount, status } = response;

        setEmiRows((prevRows) =>
          prevRows.map((row) =>
            row.emiNumber === emiNumber
              ? {
                  ...row,
                  paidAmount,
                  remainingAmount, // Update remaining amount from the API response
                  status: status ? 'Paid' : 'Pending',
                  paymentDate,
                }
              : row
          )
        );

        // Show success popup
        setPaymentDetails({
          paidAmount: paidAmount,
          remainingAmount: remainingAmount
        });
        setShowSuccessPopup(true);
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        setError('Payment failed. Please try again.');
        console.error('Payment failed:', error.message);
      }
    },
    [fileNumber]
  );

  // Add the popup component
  const SuccessPopup = () => (
    <Dialog
      open={showSuccessPopup}
      onClose={() => setShowSuccessPopup(false)}
      aria-labelledby="payment-success-dialog"
    >
      <DialogTitle id="payment-success-dialog" sx={{ bgcolor: '#4CAF50', color: 'white' }}>
        Payment Successful!
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText>
          <strong>Paid Amount:</strong> ₹{paymentDetails.paidAmount.toFixed(2)}
        </DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>
          <strong>Remaining Amount:</strong> ₹{paymentDetails.remainingAmount.toFixed(2)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setShowSuccessPopup(false)}
          variant="contained"
          color="success"
          sx={{ mb: 1, mr: 1 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Calculate total remaining amount
  const totalRemainingAmount = useMemo(() => {
    return emiRows.reduce((sum, row) => sum + row.remainingAmount, 0);
  }, [emiRows]);

  // Table headers
  const headers = useMemo(
    () => [
      { label: 'EMI Number', key: 'emiNumber' },
      { label: 'EMI Date', key: 'emiDate' },
      {
        label: 'Payment Date', // New column
        key: 'paymentDate',
        renderCell: (row) => (
          <input
            type="date"
            disabled={row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid'}
            value={row.paymentDate || ''}
            onChange={(e) => handlePaymentDateChange(row.emiNumber, e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        ),
      },
      {
        label: 'Paid Amount',
        key: 'paidAmount',
        renderCell: (row) => (
          <input
            type="number"
            disabled={row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid'}
            value={row.paidAmount || ''}
            onChange={(e) => handlePaidAmountChange(row.emiNumber, Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          />
        ),
      },
      
      {
        label: 'Remaining Amount',
        key: 'remainingAmount',
        renderCell: (row) => <span className="text-gray-700">{row.remainingAmount.toFixed(2)}</span>,
      },
      {
        label: 'Payment Status',
        key: 'status',
        renderCell: (row) => {
          const statusColor =
            row.status.toLowerCase() === 'paid'
              ? 'bg-green-500'
              : row.status.toLowerCase() === 'overpaid'
              ? 'bg-blue-500'
              : 'bg-yellow-500';
          return (
            <span className={`text-white px-2 py-1 rounded ${statusColor}`}>{row.status}</span>
          );
        },
      },
      {
        label: 'Actions',
        key: 'actions',
        renderCell: (row) => (
          <button
            disabled={row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid'}
            onClick={() => handlePay(row.emiNumber, row.paidAmount,row.paymentDate)}
            className={`px-4 py-2 rounded ${
              row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Pay
          </button>
        ),
      },
    ],
    [handlePaidAmountChange, handlePay]
  );

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!loanDetails) {
    return (
      <div className="w-full">
        <LinearProgress />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Loan Details Card */}
      <Card sx={{ width: '100%', mx: 'auto', my: 4, p: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#1976d2', fontSize: '1.2rem' }}>
            Loan Details
          </Typography>
          <Grid container spacing={1}>
            {[
              { label: 'Customer Name', value: loanDetails.customerName },
              { label: 'Loan Amount', value: `₹${loanDetails.loanAmount}` },
              { label: 'Total EMIs', value: loanDetails.tenure },
              { label: 'EMI Amount', value: `₹${loanDetails.emi || 'No Data'}` },
              { label: 'Loan Creation Date', value: loanDetails.creationDate },
              { label: 'Total Remaining Amount', value: `₹${totalRemainingAmount.toFixed(2)}` },
              { label: 'File Number', value: loanDetails.fileNumber },
              { label: 'Vehicle Number', value: loanDetails.vehicleNumber },
              { label: 'Paid EMIs', value: loanDetails.paidEmiCount || '0' },
              { label: 'Remaining EMIs', value: loanDetails.remainingEmi },
            ].map((item, index) => (
              <Grid item xs={6} sm={2} key={index}>
                <Card sx={{ boxShadow: 1, borderRadius: 1, p: 1, bgcolor: '#f0f4ff' }}>
                  <CardContent sx={{ p: 0.5 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1e88e5', fontSize: '0.9rem' }}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Table */}
      <PaymentTable headers={headers} data={emiRows} onInputChange={handlePaidAmountChange} extraClass="my-4" />
      <SuccessPopup />
    </div>
  );
};

export default PaymentDetails;