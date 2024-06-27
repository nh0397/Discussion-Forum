import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import CryptoJS from "crypto-js";
import apiServices from '../../services/apiServices';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [requireOtp, setRequireOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setRequireOtp(false);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoggingIn(true);

  const hashedPassword = CryptoJS.SHA256(password).toString();

  try {
    const { data, error } = await apiServices.checkUserExists(email);
    
    if (error) {
      alert('Login failed: ' + error.message);
      setIsLoggingIn(false);
      return;
    }

    if (!data) {
      alert('No account found with that email. Please sign up.');
      navigate('/signup');
      setIsLoggingIn(false);
      return;
    }

    const isValidPassword = apiServices.validatePassword(hashedPassword, data.password);
    if (!isValidPassword) {
      alert('Incorrect password. Please try again.');
      setIsLoggingIn(false);
      return;
    }

    console.log('Login successful:', data);
    // Store necessary user details in session storage
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userId', data.id); // Storing user_id in session storage
    sessionStorage.setItem('firstName', data.first_name); // Storing first name
    sessionStorage.setItem('lastName', data.last_name); // Storing last name

    alert('Login successful!');
    navigate('/home');  // Directing all users to a common 'home' route
    setIsLoggingIn(false);
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + (error.message || 'An unexpected error occurred'));
    setIsLoggingIn(false);
  }
};

  return (
    <div className='full-container-login'>
      <div className='welcomeback-container'></div>
      <div className="login-container">
        <h2>Login</h2>
        <div className="underline"></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {requireOtp && (
            <div className="form-group">
              <label htmlFor="otp">OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
              />
            </div>
          )}
          <div className="forgot-password-link">
            <p className='register-link'>Forgot your password? <a href="/forgot-password">Reset it</a></p>
          </div>
          <button type="submit" disabled={isLoggingIn}>Login</button>
          <div className="register-link">
            <p>Don't have an account? <a href="/signup">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
