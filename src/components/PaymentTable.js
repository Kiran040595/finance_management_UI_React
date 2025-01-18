import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const PaymentTable = ({ headers, data, extraClass }) => {

 

  return (
    <TableContainer component={Paper} className={extraClass}>
      <Table>
        <TableHead >
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align="left" style={{ fontWeight: 'bold' }}>
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover>
              {headers.map((header, colIndex) => (
                <TableCell key={colIndex}>
                  {header.renderCell
                    ? header.renderCell(row)
                    : row[header.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PaymentTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // Header label
      key: PropTypes.string.isRequired, // Key to map data
      renderCell: PropTypes.func, // Optional: Custom rendering for the cell
    })
  ).isRequired,
  data: PropTypes.array.isRequired, // Data array for table rows
  extraClass: PropTypes.string, // Optional additional class for the container
};

PaymentTable.defaultProps = {
  extraClass: '',
};

export default PaymentTable;
