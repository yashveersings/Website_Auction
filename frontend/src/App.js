import './App.css';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from './Signup';
import Home from './Home';
import ForgotPassword from './ForgotPassword'
import AuctionDashboard from './AuctionDashboard';
import UpdateProfile from './UpdateProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/AuctionDashboard' element={<AuctionDashboard/>}></Route>
        <Route path='/UpdateProfile' element={<UpdateProfile/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;