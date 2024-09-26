// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 flex item-center space-x-10">
      <h1 className='text-lg font-bold text-neutral-50'>FMS</h1>
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-blue-200 transition duration-300">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/loan-management" className="text-white hover:text-blue-200 transition duration-300">
            Loan Management
          </Link>
        </li>
        <li>
          <Link to="/payment-tracking" className="text-white hover:text-blue-200 transition duration-300">
            Payment Tracking
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
