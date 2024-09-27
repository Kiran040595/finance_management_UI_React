// src/components/Dashboard.js
import React from 'react';

function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loan Management Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Loan Management</h2>
          <p>Manage your loans efficiently and track all your finances in one place.</p>
          <a href="/loan-management" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Go to Loan Management
          </a>
        </div>

        {/* Payment Tracking Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Payment Tracking</h2>
          <p>Track payments and view the history of all transactions for better planning.</p>
          <a href="/payment-tracking" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Go to Payment Tracking
          </a>
        </div>

        {/* Reports Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Reports</h2>
          <p>Generate detailed reports to analyze your finances and loan performance.</p>
          <a href="/reports" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Go to Reports
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
