import React, { useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [isRegister, setIsRegister] = useState(true); // Start with signup page

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>E-Commerce Platform</h1>
      </header>
      <main className="app-main">
        {!token ? (
          <Auth setToken={setToken} setRole={setRole} isRegister={isRegister} setIsRegister={setIsRegister} />
        ) : role === 'admin' ? (
          <AdminDashboard token={token} setToken={setToken} />
        ) : (
          <CustomerDashboard token={token} setToken={setToken} />
        )}
      </main>
    </div>
  );
}

export default App;