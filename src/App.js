import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import LoanManagement from './components/LoanManagement';
import PaymentTracking from './components/PaymentTracking'; // Later we'll build this
import Navbar from './components/Navbar'; 

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/loan-management" element={<LoanManagement />} />
          <Route path="/payment-tracking" element={<PaymentTracking />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;
