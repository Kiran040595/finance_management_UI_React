import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Table({ headers, data, onSort, sortConfig, clickableFields = [] }) {
  const navigate = useNavigate();

  return (
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-blue-100">
          {headers.map((header, index) => (
            <th
              key={index}
              className={`py-3 px-4 border text-left font-semibold text-gray-700 ${
                header.key !== 'pay' ? 'cursor-pointer' : ''
              }`}
              onClick={() => header.key !== 'pay' && onSort(header.key)} // Exclude 'pay' column from sorting
            >
              {header.label}
              {sortConfig.key === header.key && (
                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={row.id}
            className={`border-b ${
              index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
            } hover:bg-blue-50 transition-all`}
          >
            {headers.map((header, index) => {
              const fieldValue = row[header.key];

              return (
                <td key={index} className="py-3 px-4 text-gray-700">
                  {header.key === 'pay' ? (
                    // Pay button navigates to the PaymentDetails page
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => navigate(`/payments/${row.fileNumber}`)}
                    >
                      Pay
                    </button>
                  ) : clickableFields.includes(header.key) ? (
                    // If the field is clickable, create a link
                    <Link
                      to={`/loan/${row.id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {fieldValue}
                    </Link>
                  ) : (
                    fieldValue
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
