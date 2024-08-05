import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css'; // Import the CSS file
import Validation from './SignupValidation';
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios.post('http://localhost:8081/signup', values)
        .then(res => {
          alert('Signup successful!');
        })
        .catch(err => {
          console.error(err);
          alert('An error occurred during signup.');
        });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <p>Already have an account? <Link to="/">Login</Link></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Name"
              className="form-control"
              onChange={handleInput}
              value={values.name}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              className="form-control"
              onChange={handleInput}
              value={values.email}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              className="form-control"
              onChange={handleInput}
              value={values.password}
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="security-question">Security Question</label>
            <select
              id="security-question"
              name="securityQuestion"
              className="form-control"
              onChange={handleInput}
              value={values.securityQuestion}
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
              name="securityAnswer"
              placeholder="Enter Answer"
              className="form-control"
              onChange={handleInput}
              value={values.securityAnswer}
            />
            {errors.securityAnswer && <span className="text-danger">{errors.securityAnswer}</span>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          <p className="terms">You agree to our terms and policies</p>
          <div className="login-link">
            <Link to="/" className="btn btn-default border w-100 bg-light">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
