import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewAuction.css'; // Import the CSS file

function ViewAuction() {
  const { id } = useParams();
  const [auction, setAuction] = useState({});
  const [bid, setBid] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8081/auctions/${id}`)
      .then(res => {
        setAuction(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]);

  const handleBid = () => {
    axios.post(`http://localhost:8081/auctions/${id}/bid`, {
      bid
    })
      .then(res => {
        alert('Bid placed successfully!');
      })
      .catch(err => {
        console.error(err);
        alert('An error occurred while placing the bid.');
      });
  };

  return (
    <div className="view-auction-container">
      <h2>{auction.title}</h2>
      <p>{auction.description}</p>
      <p>Current Bid: ${auction.currentBid}</p>
      <p>End Date: {new Date(auction.endDate).toLocaleString()}</p>
      <div className="place-bid">
        <input
          type="number"
          placeholder="Enter your bid"
          className="form-control"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
        />
        <button onClick={handleBid} className="btn btn-primary">Place Bid</button>
      </div>
    </div>
  );
}

export default ViewAuction;
