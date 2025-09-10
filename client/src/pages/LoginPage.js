import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful! Redirecting to chat...");
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} required />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
      </form>
      {message && <div style={{ marginTop: '1rem', color: message.includes('successful') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
}

export default LoginPage;
