// Bid.js
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function Bid() {
  const { user } = useContext(UserContext);

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
                <a className="nav-link" href="#">Sell</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Update Profile</a>
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
    </div>
  );
}

export default Bid;
