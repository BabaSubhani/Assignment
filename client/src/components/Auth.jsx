import React, { useState } from 'react';
import './Auth.css';

function Auth({ setToken, setRole, isRegister, setIsRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setLocalRole] = useState('customer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(`https://adaptnxt-backend-79vr.onrender.com${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          ...(isRegister && { role })
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      if (isRegister) {
        alert('Registered successfully! Please log in.');
        setIsRegister(false); // Switch to login page after successful registration
        setUsername('');
        setPassword('');
      } else {
        setToken(data.token);
        setRole(data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        alert('Logged in successfully');
      }
    } catch (error) {
      alert(error.message || 'Error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          {isRegister && (
            <div className="auth-field">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setLocalRole(e.target.value)}
                className="auth-select"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button type="submit" className="auth-button">
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="auth-switch-button"
        >
          {isRegister ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
}

export default Auth;