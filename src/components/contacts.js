import React from 'react';

function Contacts() {
  return (
    <div className="about" style={{border: '1px solid #ccc', margin: '20px auto', textAlign: 'center', padding: '0px 20px 20px 20px', borderRadius: '5px', width: '500px'}}>
      <h1>Contacts</h1>
      <hr/>
      <p>This is a simple React application with authentication.</p>
      <p>Users can signup, login, and logout.</p>
      <p>Protected routes are available for authenticated users.</p>
    </div>
  );
}

export default Contacts;