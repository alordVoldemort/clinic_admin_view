import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import debug utility for API testing
import './utils/debug';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetLinkSent from './pages/ResetLinkSent/ResetLinkSent';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess/PasswordResetSuccess';
import Dashboard from './pages/Dashboard/Dashboard'; 
import Appointments from './pages/Appointments/Appointments';
import ContactMessage from './pages/Contact-Message/ContactMessage';
import Testimonials from './pages/Testimonials/Testimonials';
import Layout from './components/common/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes without layout */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-link-sent" element={<ResetLinkSent />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        
        {/* Admin routes with layout */}
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/appointments" element={
          <Layout>
            <Appointments />
          </Layout>
        } />
        <Route path="/contact-message" element={
          <Layout>
            <ContactMessage />
          </Layout>
        } />
        <Route path="/testimonial" element={
          <Layout>
            <Testimonials />
          </Layout>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;