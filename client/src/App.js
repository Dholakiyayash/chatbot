import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Get user email from token (simple decode, not secure for production)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email);
      } catch {}
    } else {
      setUserEmail("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <Router>
      <div style={{ width: '100vw', background: '#eee', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Chatbot</Link>
        </div>
        <div style={{ marginRight: '5rem' }}>
          {token ? (
            <>
              <span style={{ fontWeight: 'bold', color: '#333', marginRight: '1rem' }}>Welcome, {username}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>Login</Link>
              <Link to="/signup" style={{ textDecoration: 'none', color: '#333' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
      <div style={{ paddingTop: '4.5rem' }}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
