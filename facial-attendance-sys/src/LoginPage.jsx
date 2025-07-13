import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Admin login
    if (email === '123abc@admin.edu' && password === 'admin123') {
      navigate('/admin');
    }
    // Lecturer login
    else if (email === 'lecturer@lect.edu' && password === 'lect123') {
      navigate('/lecturer');
    }
    // Student Login
    else if (email === 'student123@student.edu' && password === 'stud123') {
      navigate('/student')
    }
    // Invalid login
    else {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <p className="system-name">
          Facial<br />
          Recognition<br />
          Attendance<br />
          System
        </p>
      </div>

      <div className="login-box">
        <h2>Welcome</h2>
        <p className="sub-text">Log in to continue</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a href="#" className="forgot-password">Forgot Password?</a>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-button">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;