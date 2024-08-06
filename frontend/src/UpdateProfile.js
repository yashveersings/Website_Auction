import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateProfile.css'; // Import the CSS file

function UpdateProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    // Fetch user data (this should be replaced with an actual API call)
    setUser({ name: 'John Doe', email: 'john@example.com', password: '', securityQuestion: '', securityAnswer: '' });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:8081/users/${user.id}`, user)
      .then(res => {
        alert('Profile updated successfully!');
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while updating the profile.');
      });
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Name"
            className="form-control"
            value={user.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            className="form-control"
            value={user.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password"
            className="form-control"
            value={user.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="securityQuestion">Security Question</label>
          <input
            type="text"
            id="securityQuestion"
            name="securityQuestion"
            placeholder="Enter Security Question"
            className="form-control"
            value={user.securityQuestion}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="securityAnswer">Answer</label>
          <input
            type="text"
            id="securityAnswer"
            name="securityAnswer"
            placeholder="Enter Answer"
            className="form-control"
            value={user.securityAnswer}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
