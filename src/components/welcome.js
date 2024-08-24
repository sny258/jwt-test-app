import React from 'react';
//import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="welcome" style={{border: '1px solid #ccc', margin: '20px auto', textAlign: 'center', borderRadius: '5px', padding: '20px', width: '500px'}}>
      <h2>Welcome to our app !!!</h2>
      <hr/>
      <p>This is welcome page.</p>
      <br/>
      <Link to="/about">Know About US...</Link>
    </div>
  );
}

export default Welcome;
