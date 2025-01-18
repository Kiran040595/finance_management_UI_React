import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
  TablePagination,
  Tooltip,
  Box,
  LinearProgress,
  Typography,
  Chip, // Import Chip for phone numbers
} from '@mui/material';
import { Payment } from '@mui/icons-material'; // Icon for the "Pay" button

function LoanPaymentTable({
  headers,
  data,
  onSort,
  sortConfig,
  clickableFields = [],
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}) {
  const navigate = useNavigate();

  const handleSort = (key) => {
    if (key !== 'pay') {
      onSort(key);
    }
  };

  // Function to calculate the progress percentage for paid EMIs
  const getEmiProgress = (paidEmiCount, tenure) => {
    return tenure === 0 ? 0 : (paidEmiCount / tenure) * 100;
  };

  // Function to calculate the progress percentage for pending days (how overdue the loan is)
  const getPendingDaysProgress = (pendingDays) => {
    const maxPendingDays = 90; // Set a max threshold for pending days (e.g., 90 days)
    return Math.min((pendingDays / maxPendingDays) * 100, 100); // Ensure it doesn't exceed 100%
  };

  // Function to determine the progress color based on the progress percentage
  const getEmiProgressColor = (progress) => {
    if (progress < 30) return '#f44336'; // Red for less than 30%
    if (progress >= 30 && progress < 70) return '#ff9800'; // Yellow for 30%-70%
    return '#4caf50'; // Green for 70%-100%
  };

  // Function to determine the progress color for pending days (opposite of EMIs)
  const getPendingDaysColor = (progress) => {
    if (progress < 30) return '#4caf50'; // Green for less than 30% (low pending days)
    if (progress >= 30 && progress < 70) return '#ff9800'; // Yellow for 30%-70%
    return '#f44336'; // Red for 70%-100% (high pending days)
  };

  return (
    <div>
      {/* Table Container */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table aria-label="loan payment table">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    color: 'lightcyan',
                    backgroundColor: 'primary.main',
                  }}
                >
                  {header.key !== 'pay' ? (
                    <Tooltip title={`Sort by ${header.label}`} arrow>
                      <TableSortLabel
                        active={sortConfig.key === header.key}
                        direction={sortConfig.direction}
                        onClick={() => handleSort(header.key)}
                      >
                        {header.label}
                      </TableSortLabel>
                    </Tooltip>
                  ) : (
                    header.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    boxShadow: 1,
                  },
                }}
              >
                {headers.map((header, index) => {
                  const fieldValue = row[header.key];

                  return (
                    <TableCell key={index}>
                      {header.key === 'phoneNumbers' ? (
                        <Box>
                          {/* Display the Primary Phone Number as a Chip */}
                          <Chip label={row.phoneNumbers[0]} variant="outlined" sx={{ mr: 1 }} />

                          {/* Tooltip for remaining phone numbers */}
                          {row.phoneNumbers.length > 1 && (
                            <Tooltip title={row.phoneNumbers.slice(1).join(', ')} arrow>
                              <Chip label={`+${row.phoneNumbers.length - 1} more`} color="primary" variant="outlined" />
                            </Tooltip>
                          )}
                        </Box>
                      ) : header.key === 'pay' ? (
                        <Tooltip title="Make Payment" arrow>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<Payment />}
                            onClick={() => navigate(`/payments/${row.fileNumber}`)}
                          >
                            Pay
                          </Button>
                        </Tooltip>
                      ) : header.key === 'pendingDays' ? (
                        // Pending Days Progress Bar
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant="body2">{fieldValue} Days</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={getPendingDaysProgress(fieldValue)} // Calculate the progress based on pending days
                            sx={{
                              width: '100%',
                              mt: 1,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getPendingDaysColor(getPendingDaysProgress(fieldValue)), // Set the color based on progress
                              },
                            }}
                          />
                        </Box>
                      ) : header.key === 'paidEmiCount' || header.key === 'tenure' ? (
                        // Add progress bar for paidEmiCount and tenure
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant="body2">
                            {row.paidEmiCount} / {row.tenure}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={getEmiProgress(row.paidEmiCount, row.tenure)} // Calculate the progress
                            sx={{
                              width: '100%',
                              mt: 1,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getEmiProgressColor(getEmiProgress(row.paidEmiCount, row.tenure)), // Set the color based on progress
                              },
                            }}
                          />
                        </Box>
                      ) : clickableFields.includes(header.key) ? (
                        <Link to={`/loan/${row.id}`} style={{ color: '#1976d2' }}>
                          {fieldValue}
                        </Link>
                      ) : (
                        fieldValue
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <div className="mt-4">
        <TablePagination
          component="div"
          count={totalItems}
          page={currentPage - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => onPageChange(1, e.target.value)}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            mt: 1,
          }}
        />
      </div>
    </div>
  );
}

export default LoanPaymentTable;
