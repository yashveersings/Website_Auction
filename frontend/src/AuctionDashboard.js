import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';
import './AuctionDashboard.css'; // Import the CSS file

function AuctionDashboard() {
  const [auctions, setAuctions] = useState([]);
  const [currentAuction, setCurrentAuction] = useState({
    id: '',
    title: '',
    description: '',
    startingBid: '',
    endDate: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8081/getUserByEmail`, { params: { email } })
        .then(res => {
          if (res.data) {
            setUser(res.data);
            fetchAuctions(res.data.id);
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      navigate('/'); // Redirect to login if no email is found
    }
  }, [email, setUser, navigate]);

  const fetchAuctions = (userId) => {
    axios.get(`http://localhost:8081/auctions/user/${userId}`)
      .then(res => {
        setAuctions(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentAuction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const auctionData = {
      ...currentAuction,
      userId: user.id
    };
    if (isEditing) {
      axios.put(`http://localhost:8081/auctions/${currentAuction.id}`, auctionData)
        .then(res => {
          alert('Auction item updated successfully!');
          fetchAuctions(user.id);
          setIsEditing(false);
          setCurrentAuction({ id: '', title: '', description: '', startingBid: '', endDate: '' });
        })
        .catch(err => {
          console.error(err);
          alert('An error occurred while updating the auction item.');
        });
    } else {
      axios.post('http://localhost:8081/auctions', auctionData)
        .then(res => {
          alert('Auction item created successfully!');
          fetchAuctions(user.id);
          setCurrentAuction({ id: '', title: '', description: '', startingBid: '', endDate: '' });
        })
        .catch(err => {
          console.error(err);
          alert('An error occurred while creating the auction item.');
        });
    }
  };

  const handleEdit = (auction) => {
    setIsEditing(true);
    setCurrentAuction(auction);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/auctions/${id}`)
      .then(res => {
        alert('Auction item deleted successfully!');
        fetchAuctions(user.id);
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while deleting the auction item.');
      });
  };

  const handleUpdateProfile = () => {
    navigate('/UpdateProfile', { state: { email: user.email } });
  };

  const handleSellClick = () => {
    navigate('/AuctionDashboard', { state: { email: user.email } });
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
                <a className="nav-link active" aria-current="page" href="#">Bid</a>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleSellClick}>Sell</button>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleUpdateProfile}>Update Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Log Out</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">{user ? user.email : 'Disabled'}</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="auction-dashboard-container">
        <h2>Auction Dashboard</h2>

        <div className="auction-form">
          <h3>{isEditing ? 'Edit Auction' : 'Create Auction'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter Title"
                className="form-control"
                value={currentAuction.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter Description"
                className="form-control"
                value={currentAuction.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="startingBid">Starting Bid</label>
              <input
                type="number"
                id="startingBid"
                name="startingBid"
                placeholder="Enter Starting Bid"
                className="form-control"
                value={currentAuction.startingBid}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endDate">End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                className="form-control"
                value={currentAuction.endDate}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Auction' : 'Create Auction'}
            </button>
          </form>
        </div>

        <div className="auction-list">
          <h3>Active Auctions</h3>
          {Array.isArray(auctions) && auctions.length > 0 ? (
            auctions.map(auction => (
              <div key={auction.id} className="auction-item">
                <h4>{auction.title}</h4>
                <p>{auction.description}</p>
                <p>Starting Bid: ${auction.startingBid}</p>
                <p>Current Bid: ${auction.currentBid}</p>
                <p>End Date: {new Date(auction.endDate).toLocaleString()}</p>
                <div className="auction-actions">
                  <button onClick={() => handleEdit(auction)} className="btn btn-primary">Edit</button>
                  <button onClick={() => handleDelete(auction.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No active auctions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuctionDashboard;
