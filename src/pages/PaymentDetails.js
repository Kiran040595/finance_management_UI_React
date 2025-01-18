import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaymentTable from '../components/PaymentTable';
import PaymentService from '../services/paymentService';
import { LinearProgress } from '@mui/material';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const PaymentDetails = () => {
  const { fileNumber } = useParams();
  const [loanDetails, setLoanDetails] = useState(null);
  const [emiRows, setEmiRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoanDetails(fileNumber);
  }, [fileNumber]);

  const fetchLoanDetails = async (fileNumber) => {
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

      });

      const rows = response.emiDetails.map((emi) => ({
        emiNumber: emi.emiNumber,
        emiAmount: emi.emiAmount,
        paidAmount: emi.paidAmount || 0,
        remainingAmount: emi.remainingAmount || emi.emiAmount,
        paymentDate: emi.paymentDate,
        status: emi.status,
        emiDate: emi.emiDate,
      }));

      setEmiRows(rows);
    } catch (err) {
      setError('Failed to fetch loan details');
    }
  };

  const handlePaidAmountChange = (emiNumber, value) => {
    const updatedRows = emiRows.map((row) =>
      row.emiNumber === emiNumber
        ? {
            ...row,
            paidAmount: value,
            remainingAmount: row.emiAmount - value,
          }
        : row
    );
    setEmiRows(updatedRows);
  };

  const handlePay = async (emiNumber, paymentAmount) => {
    try {
      const selectedRow = emiRows.find((row) => row.emiNumber === emiNumber);

      if (!selectedRow) {
        console.error('EMI not found');
        return;
      }

      const response = await PaymentService.payEMI(fileNumber, emiNumber, paymentAmount);

      const { paidAmount, remainingAmount, status } = response;

      const updatedRows = emiRows.map((row) =>
        row.emiNumber === emiNumber
          ? {
              ...row,
              paidAmount,
              remainingAmount,
              status: status ? 'Paid' : 'Pending',
            }
          : row
      );

      setEmiRows(updatedRows);
    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error('Payment failed:', error.message);
    }
  };

  const headers = [
    { label: 'EMI Number', key: 'emiNumber' },
    { label: 'EMI Amount', key: 'emiAmount' },
    { label: 'EMI Date', key: 'emiDate' },
    {
      label: 'Paid Amount',
      key: 'paidAmount',
      renderCell: (row) => (
        <input
          type="number"
          disabled={(row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid') && row.paidAmount >= row.emiAmount} // Disable if the EMI is marked as 'Paid' or if the paid amount is equal to the EMI amount
          value={row.paidAmount || ''}
          onChange={(e) => handlePaidAmountChange(row.emiNumber, Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        />
      ),
    },
    { label: 'Remaining Amount', key: 'remainingAmount' },
    {
      label: 'Payment Status',
      key: 'status',
      renderCell: (row) => {
        const statusColor = row.status.toLowerCase() === 'paid' ? 'bg-green-500' :
        row.status.toLowerCase() === 'overpaid' ? 'bg-blue-500' : 'bg-yellow-500'; // default to yellow for pending or not paid
        return (
          <span className={`text-white px-2 py-1 rounded ${statusColor}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      label: 'Actions',
      key: 'actions',
      renderCell: (row) => (
        <button
          disabled={(row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid') && row.paidAmount >= row.emiAmount} // Disable only if the EMI is marked as 'Paid'
          onClick={() => handlePay(row.emiNumber, row.paidAmount)}
          className={`px-4 py-2 rounded ${
            (row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid') && row.paidAmount >= row.emiAmount
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Pay
        </button>
      ),
    }
    
  ];

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}
      {!loanDetails ? (
         <div className="w-full">
         <LinearProgress />
       </div>
      ) : (
        <>
      <Card sx={{ width: '100%', mx: 'auto', my: 4 }}>
  <CardContent>
    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
      Loan Details
    </Typography>

    <Grid container spacing={4}>
      {/* Row 1 */}
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>Customer Name:</strong> {loanDetails.customerName}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>Loan Amount:</strong> ₹{loanDetails.loanAmount}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>Total EMIs:</strong> {loanDetails.tenure}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>Loan Creation Date:</strong> {loanDetails.creationDate}
        </Typography>
      </Grid>

      {/* Row 2 */}
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>File Number:</strong> {loanDetails.fileNumber}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>Vehicle Number:</strong> {loanDetails.vehicleNumber}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>Paid EMIs:</strong> {loanDetails.paidEmiCount}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          <strong>Remaining EMIs:</strong> {loanDetails.remainingEmi}
        </Typography>
      </Grid>
    </Grid>
  </CardContent>
</Card>


          <PaymentTable
            headers={headers}
            data={emiRows}
            onInputChange={handlePaidAmountChange} // Pass the handler here
            extraClass="my-4"
          />
        </>
      )}
    </div>
  );
};

export default PaymentDetails;
