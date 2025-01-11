import React from 'react';
import { Link } from 'react-router-dom';

function Table({ headers, data, onSort, sortConfig, clickableFields = [] }) {
  return (
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-blue-100">
          {headers.map((header, index) => (
            <th
              key={index}
              className="py-3 px-4 border text-left font-semibold text-gray-700 cursor-pointer"
              onClick={() => onSort(header.key)}
            >
              {header.label}
              {sortConfig.key === header.key && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-blue-50 transition-all`}>
            {headers.map((header, index) => {
              const fieldValue = row[header.key];

              return (
                <td key={index} className="py-3 px-4 text-gray-700">
                  {clickableFields.includes(header.key) ? (
                    <Link to={`/loan/${row.id}`} className="text-indigo-600 hover:text-indigo-800">
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
