import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateProfile.css'; // Import the CSS file
import { useLocation, useNavigate } from 'react-router-dom';

function UpdateProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || { email: 'No email provided' };

  const [user, setUser] = useState({
    name: '',
    email: email,
    password: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  useEffect(() => {
    if (email !== 'No email provided') {
      console.log('Fetching user data for:', email); // Debugging line
      axios.get(`http://localhost:8081/getUserByEmail`, { params: { email } })
        .then(res => {
          if (res.data) {
            console.log('User data fetched:', res.data); // Debugging line
            setUser(res.data);
          }
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          alert('Error fetching user data. Check console for details.');
        });
    }
  }, [email]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate user data
    if (!user.name || !user.email || !user.password || !user.securityQuestion || !user.securityAnswer) {
      alert("Please fill in all fields.");
      return;
    }

    axios.post('http://localhost:8081/updateProfile', user)
      .then(res => {
        if (res.data.status === "Success") {
          alert("Profile updated successfully!");
          navigate('/Bid'); // Navigate back to the Bid page or another page
        } else {
          alert(res.data.message || "Error updating profile.");
        }
      })
      .catch(err => {
        console.error('Error updating profile:', err);
        alert('Error updating profile. Check console for details.');
      });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">Bid</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Sell</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Update Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Log Out</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">{email}</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
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
              readOnly
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
            <select
              id="securityQuestion"
              name="securityQuestion"
              className="form-control"
              value={user.securityQuestion}
              onChange={handleInputChange}
            >
              <option value="">Select a security question</option>
              <option value="pet-name">What is the name of your first pet?</option>
              <option value="birth-city">In which city were you born?</option>
              <option value="mother-maiden">What is your mother's maiden name?</option>
            </select>
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
    </div>
  );
}

export default UpdateProfile;
