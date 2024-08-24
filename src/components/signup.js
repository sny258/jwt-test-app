import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  
  axios.defaults.withCredentials = true;
  
  const handleSignup = async (e) => {
      e.preventDefault();
      try {
      const response = await axios.post(
          "http://localhost:5000/signup",
          { firstname, lastname, username, email, password },
          {
          validateStatus: function (status) {
              return status < 500;
          },
          }
      );
      console.log("Response:", response);
      if (response.status === 200) {
          navigate("/login");
      } else {
          setError(response.data.message);
      }
      } catch (error) {
      console.error("Signup error:", error.response?.data?.message || error.message);
      setError("Signup failed");
      }
  };
  
  return (
      <div className="Signup" style={{border: '1px solid #ccc', margin: '20px auto', textAlign: 'center', padding: '20px', borderRadius: '5px', width: '300px'}}>
        <h2 style={{marginBottom: '20px'}}>Signup ...</h2>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
          <br/>
          <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
          <br/>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <br/>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <br/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <br/>
          <button type="submit" style={{margin: '20px'}}>Signup</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
  );

}

export default Signup;