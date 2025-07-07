import React from 'react';
import './CustomerDashboard.css';
import Products from './Products';
import Cart from './Cart';
import Orders from './Orders';

function CustomerDashboard({ token, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
  };

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h2>Customer Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <Products token={token} role="customer" />
      <Cart token={token} />
      <Orders token={token} />
    </div>
  );
}

export default CustomerDashboard;