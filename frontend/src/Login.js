import './Login.css'; // Import the CSS file
import Validation from './LoginValidation';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
 
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();
  const [errors, setErrors] = useState({})

  const handleInput = (event) => {
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  const handleSubmit =(event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    if(errors.email === "" && errors.password === ""){
      axios.post('http://localhost:8081/login', values)
      .then(res => {
        if (res.data == "Success") {
          navigate('/home');
        }
        else
        {
          alert("No Record Found !!");
        }
      })
      .catch(err => console.log(err));
    }
  }


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
          <h2>Login</h2>
          <p>Don't have an account yet? <Link to="/Signup">Sign Up</Link></p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">Email Address</label>
              <input
                onChange={handleInput}
                type="email"
                name="email"
                placeholder="you@example.com"
                className="form-control"
                value={values.email}
              />
              {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                onChange={handleInput}
                type="password"
                name="password"
                placeholder="Enter 6 characters or more"
                className="form-control"
                value={values.password}
              />
              {errors.password && <span className="text-danger">{errors.password}</span>}
              <Link to="/ForgotPassword" className="ForgotPassword">Forgot Password?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-100">LOGIN</button>
          </form>
        </div>
        <div className="login-illustration"></div>
      </div>
    </div>
  );
}

export default Login;
