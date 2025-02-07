import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import LoanDetails from './components/LoanDetails';
import LoanManagement from './pages/LoanManagement';
import PaymentPage from './pages/PaymentPage';
import PaymentDetails from './pages/PaymentDetails';
import PaymentTracking from './pages/PaymentTracking';
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
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payments/:fileNumber" element={<PaymentDetails />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
