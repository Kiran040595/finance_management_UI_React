import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import LoanDetails from './components/LoanDetails';
import LoanManagement from './pages/LoanManagement';
import PaymentTracking from './components/PaymentTracking';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loan/:id" element={<LoanDetails />} />
            <Route path="/loan-management" element={<LoanManagement />} />
            <Route path="/payment-tracking" element={<PaymentTracking />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
