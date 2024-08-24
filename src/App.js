//import logo from './logo.svg';
import './App.css';
import React from 'react';
//import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login';
import Signup from './components/signup';
import Welcome from './components/welcome';
import PrivateRoute from './components/privateRoute';
import About from './components/about';
import BasicNavbar from './components/navbar';
import Contacts from './components/contacts';


function App() {

  return (
    <div className="App">
      <Router>
        
        {/* <div className='Header' style={{border: '1px solid black', margin: '20px', textAlign: 'center', padding: '15px'}}>
          <h2>React Application</h2>  
          <Link to="/login" style={{marginLeft: '15px'}}>Login</Link>
          <Link to="/signup" style={{marginLeft: '15px'}}>Signup</Link>
          <Link to="/welcome" style={{marginLeft: '15px'}}>Welcome</Link>
          <Link to="/about" style={{marginLeft: '15px'}}>About</Link>
        </div> */}

        <BasicNavbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/about" element={<PrivateRoute element={About} />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
