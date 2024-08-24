import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Set the default config for axios
  axios.defaults.withCredentials = true;

  // Function to handle the form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password }, {
        validateStatus: function (status) {
          // Consider any status code less than 500 as a success status.
          return status < 500;
        }
      });
      console.log('Response:', response);
      if (response.status === 200) {
        // store the toke coming with reposnse in localStorage
        localStorage.setItem('token', response.data.token)
        // navigate to the welcome page
        navigate('/welcome');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      setError('Login failed');
    }
  };

  return (
    <div className='Login' style={{border: '1px solid #ccc', margin: '20px auto', textAlign: 'center', padding: '20px', borderRadius: '5px', width: '300px'}}>
      <h2 style={{marginBottom: '20px'}}>Login ...</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <br/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br/>
        <button type="submit" style={{margin: '20px'}}>Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );

}

export default Login;