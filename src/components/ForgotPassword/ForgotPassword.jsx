import React, { useState } from 'react';
import './ForgotPassword.css';
import apiServices from '../../services/apiServices' // Ensure you have the correct import path

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await apiServices.checkUserExists(email);
            if (data) {
                setIsEmailValid(true);
                setMessage('');
            } else {
                setMessage('Email not registered. Please sign up.');
                setIsEmailValid(false);
            }
        } catch (error) {
            setMessage('An error occurred while checking the email. Please try again.');
            setIsEmailValid(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await apiServices.resetPassword(email, newPassword);
            setMessage('Your password has been reset successfully. You can now login with your new password.');
            setIsEmailValid(false); // Reset the state to allow another operation
        } catch (error) {
            setMessage('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className='full-container'>
            <div className="forgot-password-container">
                <h2>Reset Password</h2>
                {!isEmailValid ? (
                    <form onSubmit={handleCheckEmail} className="password-reset-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <button type="submit" className="submit-btn">Check Email</button>
                        <div className="register-link">
                            <p>Go back to <a href="/login">Login</a></p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="password-reset-form">
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="input-field"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter your new password"
                            />
                        </div>
                        <button type="submit" className="submit-btn">Reset Password</button>
                        <div className="register-link">
                            <p>Go back to <a href="/login">Login</a></p>
                        </div>
                    </form>
                )}
                {message && <p className="reset-message">{message}</p>}
            </div>
        </div>
    );
}

export default ForgotPassword;
