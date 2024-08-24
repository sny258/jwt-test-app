import React, { useEffect } from "react";
import logo from '../logo512.png';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './styles.css';


function BasicNavbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');

  useEffect(() => {
    const token = localStorage.getItem('token'); // Declare the token here
    if (token) {
      const checkAuth = async () => {
        try {
          const response = await axios.get('http://localhost:5000/authenticated', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }, {
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
          });
          console.log('Response:', response);
          if (response.status === 200) {
            // Decode the token to get the username
            const decodedToken = jwtDecode(token);
            const username = decodedToken.username;
            setUsername(username);
            setLoggedIn(true);
          } else {
            localStorage.removeItem('token');
            alert('Session expired, please login again !!!');
            setLoggedIn(false);
          }
        } catch (error) {
          console.error('Authentication error:', error.response?.data?.message || error.message);
          // server side is sending 401 error for expired token
          localStorage.removeItem('token');
          alert('Session expired, please login again !!!');
          setLoggedIn(false);
        }
      };      
      checkAuth();
    } else {
      setLoggedIn(false);
    }
  }, [navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/logout', {}, {
        validateStatus: function (status) {
          return status < 500;
        }
      });
      console.log('Response:', response);
      if (response.status === 200) {
        localStorage.removeItem('token');
        setLoggedIn(false);
        navigate('/welcome');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Logout error:', error.response?.data?.message || error.message);
      alert('Logout failed');
    }
  };

  return (
    <div className="basic-navbar" 
      style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0px 20px 20px 20px',
        padding: '1px 10px',
        borderRadius: '10px',
        backgroundColor: '#282c34',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 999
      }}
    >
      <div className="left-nav" style={{ display: 'flex', alignItems: 'center' }}>
        <img id="logo" src={logo} alt="Logo" style={{width: '35px', height: '35px', marginRight: '10px'}} />
        {/* <span style={{marginLeft: '15px', cursor: 'pointer'}} onClick={() => navigate('/welcome')}>Home</  span>
        <span style={{marginLeft: '15px', cursor: 'pointer'}} onClick={() => navigate('/about')}>About</  span>
        <span style={{marginLeft: '15px'}}>Contact</span> */}
        <Nav className="navbar-links"> 
          <Nav.Link as={Link} to="/welcome">Home</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
          {/* <Nav.Link disabled>Contacts</Nav.Link> */}
          <Nav.Link as={Link} to="/contacts">Contacts</Nav.Link>
        </Nav>
      </div> 
        
      <div className="right-nav" style={{ display: 'flex', alignItems: 'center' }}>
        {/* {loggedIn ? (
          <div>
            <span style={{marginLeft: '15px'}}>{username}</span>
            <span style={{marginLeft: '15px', cursor: 'pointer'}} onClick={handleLogout}>Logout</span>
          </div>
        ) : (
          <div>
            <span style={{marginLeft: '15px', cursor: 'pointer'}} onClick={() => navigate('/login')}>Login</span>
            <span style={{marginLeft: '15px', cursor: 'pointer'}} onClick={() => navigate('/signup')}>Signup</span>
          </div>
        )} */}
        <Nav className="navbar-links">  
          {loggedIn ? (
            <NavDropdown title={username} id="basic-nav-dropdown" menuVariant="dark">
              <NavDropdown.Item>{username}</NavDropdown.Item>
              <NavDropdown.Item>Item</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
          )}
        </Nav>
      </div>
    </div>
  );
}

export default BasicNavbar;
