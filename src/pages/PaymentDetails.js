import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import PaymentTable from '../components/PaymentTable';
import PaymentService from '../services/paymentService';
import {
  LinearProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const PaymentDetails = () => {
  const { fileNumber } = useParams();
  const [loanDetails, setLoanDetails] = useState(null);
  const [emiRows, setEmiRows] = useState([]);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    paidAmount: 0,
    remainingAmount: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
          initialRemainingAmount: emi.remainingAmount || emi.emiAmount,
          remainingAmount: emi.remainingAmount || emi.emiAmount,
          paymentDate: emi.paymentDate || '',
          status: emi.status,
          emiDate: emi.emiDate,
          isEditing: false,
        }));

        setEmiRows(rows);
      } catch (err) {
        setError('Failed to fetch loan details');
      }
    };

    fetchLoanDetails();
  }, [fileNumber, refreshTrigger]);

  const toggleEdit = useCallback((emiNumber) => {
    setEmiRows((prevRows) =>
      prevRows.map((row) =>
        row.emiNumber === emiNumber ? { ...row, isEditing: !row.isEditing } : row
      )
    );
  }, []);

  const handleEmiDateChange = useCallback((emiNumber, date) => {
    setEmiRows((prevRows) =>
      prevRows.map((row) =>
        row.emiNumber === emiNumber ? { ...row, emiDate: date } : row
      )
    );
  }, []);

  const handlePaymentDateChange = useCallback(
    (emiNumber, date) => {
      setEmiRows((prevRows) =>
        prevRows.map((row) => {
          if (row.emiNumber === emiNumber) {
            const emiDate = new Date(row.emiDate);
            const paidDate = date ? new Date(date) : null;
            const baseEmiAmount = row.emiAmount;
            const paidAmount = row.paidAmount || 0;
            let overdueAmount = 0;

            if (date && paidDate > emiDate) {
              const diffTime = paidDate - emiDate;
              const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              overdueAmount = baseEmiAmount * 0.002 * overdueDays;
            }

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
    },
    []
  );

  const handlePaidAmountChange = useCallback(
    (emiNumber, value) => {
      setEmiRows((prevRows) =>
        prevRows.map((row) => {
          if (row.emiNumber === emiNumber) {
            const newPaidAmount = Number(value);
            const baseEmiAmount = row.emiAmount;
            let overdueAmount = 0;

            if (row.paymentDate && row.emiDate) {
              const emiDate = new Date(row.emiDate);
              const paidDate = new Date(row.paymentDate);
              if (paidDate > emiDate) {
                const diffTime = paidDate - emiDate;
                const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                overdueAmount = baseEmiAmount * 0.002 * overdueDays;
              }
            }

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
    },
    []
  );

  const handleRemainingAmountChange = useCallback((emiNumber, value) => {
    setEmiRows((prevRows) =>
      prevRows.map((row) =>
        row.emiNumber === emiNumber ? { ...row, remainingAmount: Number(value) } : row
      )
    );
  }, []);

  const handlePay = useCallback(
    async (emiNumber, paymentAmount, paymentDate) => {
      try {
        const response = await PaymentService.payEMI(fileNumber, emiNumber, paymentAmount, paymentDate);
        const { paidAmount, remainingAmount, status } = response;

        setEmiRows((prevRows) =>
          prevRows.map((row) =>
            row.emiNumber === emiNumber
              ? {
                  ...row,
                  paidAmount,
                  remainingAmount,
                  paymentDate,
                  status: status ? 'Paid' : 'Pending',
                }
              : row
          )
        );

        setPaymentDetails({
          paidAmount: paidAmount,
          remainingAmount: remainingAmount,
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

  const handleUpdateRow = useCallback(
    async (emiNumber) => {
      const row = emiRows.find((r) => r.emiNumber === emiNumber);
      if (!row.emiDate) {
        setError('EMI Date is required.');
        return;
      }

      try {
        const response = await PaymentService.updateEMI(fileNumber, emiNumber, {
          emiDate: row.emiDate,
          paymentDate: row.paymentDate,
          paidAmount: row.paidAmount,
          remainingAmount: row.remainingAmount,
        });

        const { paidAmount, remainingAmount, status, emiDate, paymentDate } = response;

        setEmiRows((prevRows) =>
          prevRows.map((r) =>
            r.emiNumber === emiNumber
              ? {
                  ...r,
                  emiDate: emiDate,
                  paymentDate: paymentDate,
                  paidAmount: paidAmount,
                  remainingAmount: remainingAmount,
                  status: status,
                  isEditing: false,
                }
              : r
          )
        );

        setPaymentDetails({
          paidAmount: paidAmount,
          remainingAmount: remainingAmount,
        });
        setShowSuccessPopup(true);
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        setError('Update failed. Please try again.');
        console.error('Update failed:', error.message);
      }
    },
    [fileNumber, emiRows]
  );

  const SuccessPopup = () => (
    <Dialog
      open={showSuccessPopup}
      onClose={() => setShowSuccessPopup(false)}
      aria-labelledby="payment-success-dialog"
    >
      <DialogTitle sx={{ bgcolor: '#4CAF50', color: 'white' }}>
        {emiRows.some((row) => row.isEditing) ? 'Update Successful!' : 'Payment Successful!'}
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

  const totalRemainingAmount = useMemo(() => {
    return emiRows.reduce((sum, row) => sum + row.remainingAmount, 0);
  }, [emiRows]);

  const headers = useMemo(
    () => [
      { label: 'EMI Number', key: 'emiNumber' },
      {
        label: 'EMI Date',
        key: 'emiDate',
        renderCell: (row) => (
          row.isEditing ? (
            <input
              type="date"
              value={row.emiDate}
              onChange={(e) => handleEmiDateChange(row.emiNumber, e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <span>{row.emiDate}</span>
          )
        ),
      },
      {
        label: 'Payment Date',
        key: 'paymentDate',
        renderCell: (row) => (
          <input
            type="date"
            disabled={row.status.toLowerCase() !== 'pending' && !row.isEditing}
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
            disabled={row.status.toLowerCase() !== 'pending' && !row.isEditing}
            value={row.paidAmount || ''}
            onChange={(e) => handlePaidAmountChange(row.emiNumber, Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          />
        ),
      },
      {
        label: 'Remaining Amount',
        key: 'remainingAmount',
        renderCell: (row) => (
          row.isEditing ? (
            <input
              type="number"
              value={row.remainingAmount}
              onChange={(e) => handleRemainingAmountChange(row.emiNumber, Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <span className="text-gray-700">{row.remainingAmount.toFixed(2)}</span>
          )
        ),
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
          <div className="flex gap-2">
            {row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid' ? (
              <button
                onClick={() => toggleEdit(row.emiNumber)}
                className={`px-4 py-2 rounded ${
                  row.isEditing
                    ? 'bg-gray-500 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {row.isEditing ? 'Cancel' : 'Edit'}
              </button>
            ) : null}
            <button
              onClick={() =>
                row.isEditing
                  ? handleUpdateRow(row.emiNumber)
                  : handlePay(row.emiNumber, row.paidAmount || row.emiAmount, row.paymentDate)
              }
              className={`px-4 py-2 rounded ${
                row.isEditing
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : row.status.toLowerCase() === 'paid' || row.status.toLowerCase() === 'overpaid'
                  ? 'bg-gray-300 cursor-not-allowed text-gray-700'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {row.isEditing ? 'Save' : 'Pay'}
            </button>
          </div>
        ),
      },
    ],
    [
      handlePaidAmountChange,
      handlePay,
      handlePaymentDateChange,
      handleEmiDateChange,
      handleRemainingAmountChange,
      handleUpdateRow,
      toggleEdit,
    ]
  );

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
        <Button onClick={() => setError(null)} color="primary" sx={{ ml: 2 }}>
          Retry
        </Button>
      </div>
    );
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
      <Card sx={{ width: '100%', mx: 'auto', my: 4, p: 1 }}>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', color: '#1976d2', fontSize: '1.2rem' }}
          >
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: '#1e88e5', fontSize: '0.9rem' }}
                    >
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <PaymentTable headers={headers} data={emiRows} extraClass="my-4" />
      <SuccessPopup />
    </div>
  );
};

export default PaymentDetails;