// App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import ForgotPassword from './ForgotPassword';
import AuctionDashboard from './AuctionDashboard';
import UpdateProfile from './UpdateProfile';
import Bid from './Bid';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/ForgotPassword' element={<ForgotPassword />} />
          <Route path='/home' element={<Home />} />
          <Route path='/AuctionDashboard' element={<AuctionDashboard />} />
          <Route path='/UpdateProfile' element={<UpdateProfile />} />
          <Route path='/Bid' element={<Bid />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
