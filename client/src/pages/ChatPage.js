import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(0);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch chat list from backend with JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:4000/api/chats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setChats(data);
      });
  }, []);

  // Fetch messages for selected chat with JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (chats.length > 0 && token) {
      fetch(`http://localhost:4000/api/chats/${selectedChat}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setMessages(data);
        });
    }
  }, [selectedChat, chats]);

  // Send user message to model server and add response to chat
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    // Add user message to chat
    const newMessages = [...messages, { user: 'You', message: input }];
    setMessages(newMessages);
    setInput("");
    try {
  const res = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages([...newMessages, { user: 'Bot', message: data.response }]);
    } catch (err) {
      setMessages([...newMessages, { user: 'Bot', message: 'Error: Could not get response.' }]);
    }
    setLoading(false);
  };

  return (
  <div style={{ display: 'flex', height: '100vh', width: '100vw', margin: 0, border: 'none', borderRadius: 0, overflow: 'hidden' }}>
      {/* Sidebar for previous chats */}
      <aside style={{ width: '220px', background: '#f4f4f4', padding: '1rem', borderRight: '1px solid #ddd' }}>
        <h3 style={{ marginBottom: '1rem' }}>Previous Chats</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chats.map(chat => (
            <li key={chat.id}>
              <button
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  background: selectedChat === chat.id ? '#e0e0e0' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedChat(chat.id)}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main chat area */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <h2>Chatbot</h2>
        <div style={{ minHeight: '200px', background: '#f9f9f9', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', height: '50vh', overflowY: 'auto' }}>
          {/* Display selected chat messages */}
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '0.5rem' }}>
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ width: '80%', padding: '0.5rem' }}
            disabled={loading}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default ChatPage;
