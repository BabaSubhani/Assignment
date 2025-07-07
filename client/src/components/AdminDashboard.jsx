import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import Products from './Products';

function AdminDashboard({ token, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <Products token={token} role="admin" />
    </div>
  );
}

export default AdminDashboard;