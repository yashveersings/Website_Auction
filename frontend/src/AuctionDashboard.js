import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
  const [user, setUser] = useState({ name: '' }); // Mock user data
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchAuctions();
  }, []);

  const fetchUser = () => {
    // Fetch user data (this should be replaced with an actual API call)
    setUser({ name: 'John Doe' });
  };

  const fetchAuctions = () => {
    axios.get('http://localhost:8081/auctions')
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
    if (isEditing) {
      axios.put(`http://localhost:8081/auctions/${currentAuction.id}`, currentAuction)
        .then(res => {
          alert('Auction item updated successfully!');
          fetchAuctions();
          setIsEditing(false);
          setCurrentAuction({ id: '', title: '', description: '', startingBid: '', endDate: '' });
        })
        .catch(err => {
          console.error(err);
          alert('An error occurred while updating the auction item.');
        });
    } else {
      axios.post('http://localhost:8081/auctions', currentAuction)
        .then(res => {
          alert('Auction item created successfully!');
          fetchAuctions();
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
        fetchAuctions();
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while deleting the auction item.');
      });
  };

  const handleUpdateProfile = () => {
    navigate('/UpdateProfile');
  };

  return (
    
    <div className="auction-dashboard-container">
      <header className="dashboard-header">
        <h1>Hi {user.name}</h1>
        <button onClick={handleUpdateProfile} className="btn btn-secondary">Update Profile</button>
      </header>

      <h2>Auction Dashboard</h2>

      <div className="auction-list">
        <h3>Active Auctions</h3>
        {auctions.map(auction => (
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
        ))}
      </div>

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
            />
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
    </div>
  );
}

export default AuctionDashboard;
