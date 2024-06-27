import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import CryptoJS from "crypto-js";
import apiService from "../../services/apiServices"

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirmedPassword) {
    alert('Passwords do not match! Please retry.');
    return;
  }

  try {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const response = await apiService.signup(firstName, lastName, email, hashedPassword);

    if (response.error) {
      console.error('Signup error:', response.error);
      alert('Signup failed: ' + response.error.message);
      if (response.error.message === "Email is already in use") {
        navigate('/login');
      }
    } else {
      console.log('Signup successful:', response.data);
      alert('Signup successful!');
      navigate('/login');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed: ' + (error.message || 'An unexpected error occurred'));
  }
};




  return (
    <div className='full-container-signup'>

      <div className='welcome-container'>

      </div>

    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="underline"></div>
      <form>
        <div className="form-group">
          <label htmlFor="email">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Enter your first name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Enter your last name"
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" onClick={handleSubmit}>Sign Up</button>

        <div className="register-link">
            <p>Already have an account? Sign in here <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Signup;
