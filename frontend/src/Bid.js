import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Bid.css';

function Bid() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/auctions')
      .then(res => {
        const updatedAuctions = res.data.map(auction => ({
          ...auction,
          timeRemaining: calculateTimeRemaining(auction.endDate)
        }));
        setAuctions(updatedAuctions);
      })
      .catch(err => console.log(err));
  }, []);

  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeRemaining = end - now;
    
    if (timeRemaining <= 0) {
      return "Bid ended";
    }

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(prevAuctions => 
        prevAuctions.map(auction => ({
          ...auction,
          timeRemaining: calculateTimeRemaining(auction.endDate)
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBid = (auctionId, startingBid, currentBid, bidAmount) => {
    if (isNaN(bidAmount) || bidAmount <= startingBid || (currentBid && bidAmount <= currentBid)) {
      alert("Bid must be a number and greater than the starting bid and current bid.");
      return;
    }
    
    axios.post('http://localhost:8081/placeBid', { auctionId, bidAmount })
      .then(res => {
        if (res.data.status === "Success") {
          setAuctions(prevAuctions => 
            prevAuctions.map(auction => 
              auction.id === auctionId ? { ...auction, currentBid: bidAmount } : auction
            )
          );
          alert("Bid placed successfully!");
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => console.log(err));
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
              <a className="nav-link" onClick={() => navigate('/AuctionDashboard', { state: { email: user.email } })}>Sell</a>
            </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/UpdateProfile', { state: { email: user.email } })}>Update Profile</a>
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
      <div className="auction-container">
        {auctions.map(auction => (
          <div key={auction.id} className="auction-card">
            <img src={auction.imageUrl} alt={auction.title} className="auction-image" />
            <h2>{auction.title}</h2>
            <p>{auction.description}</p>
            <p>Starting Bid: ${auction.startingBid}</p>
            <p>Current Bid: ${auction.currentBid || 'No bids yet'}</p>
            <p className={auction.timeRemaining === "Bid ended" ? "bid-ended" : ""}>
              {auction.timeRemaining || calculateTimeRemaining(auction.endDate)}
            </p>
            {auction.timeRemaining !== "Bid ended" && (
              <div className="bid-section">
                <input 
                  type="number" 
                  placeholder="Enter your bid" 
                  onChange={(e) => auction.newBid = parseFloat(e.target.value)} 
                />
                <button 
                  onClick={() => handleBid(auction.id, auction.startingBid, auction.currentBid, auction.newBid)}
                >
                  Place Bid
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bid;
