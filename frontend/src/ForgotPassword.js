import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css'; // Import the CSS file
import validateForgotPassword from './ForgotPasswordValidation'; // Import the validation function
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForgotPassword({
      email,
      securityQuestion,
      securityAnswer,
      newPassword,
      confirmPassword,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      axios.post('http://localhost:8081/reset-password', {
        email,
        securityQuestion,
        securityAnswer,
        newPassword
      })
      .then(res => {
        alert('Password has been reset successfully.');
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred during password reset.');
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <p>Please enter your email address and answer the security question to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="security-question">Security Question</label>
            <select 
              id="security-question" 
              className="form-control" 
              value={securityQuestion} 
              onChange={(e) => setSecurityQuestion(e.target.value)}
            >
              <option value="">Select a security question</option>
              <option value="pet-name">What is the name of your first pet?</option>
              <option value="birth-city">In which city were you born?</option>
              <option value="mother-maiden">What is your mother's maiden name?</option>
            </select>
            {errors.securityQuestion && <span className="text-danger">{errors.securityQuestion}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="security-answer">Answer</label>
            <input 
              type="text" 
              id="security-answer" 
              placeholder="Enter Answer" 
              className="form-control" 
              value={securityAnswer} 
              onChange={(e) => setSecurityAnswer(e.target.value)} 
            />
            {errors.securityAnswer && <span className="text-danger">{errors.securityAnswer}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="new-password">New Password</label>
            <input 
              type="password" 
              id="new-password" 
              placeholder="Enter New Password" 
              className="form-control" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
            {errors.newPassword && <span className="text-danger">{errors.newPassword}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              placeholder="Confirm New Password" 
              className="form-control" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Reset Password</button>
          <div className="login-link">
            <Link to="/" className="btn btn-default border w-100 bg-light">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
