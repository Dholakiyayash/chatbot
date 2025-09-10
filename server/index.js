import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'your_jwt_secret';

app.use(cors());
app.use(express.json());

// Connect to MongoDB (local)
mongoose.connect('mongodb://localhost:27017/chatbot');

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

// Chat schema
const chatSchema = new mongoose.Schema({
  email: String,
  messages: [{ user: String, message: String }]
});
const Chat = mongoose.model('Chat', chatSchema);

// JWT auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.email = decoded.email;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Health check
app.get('/', (req, res) => {
  res.send('Chatbot backend is running');
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashedPassword });
  await Chat.create({ email, messages: [] });
  res.json({ message: 'Signup successful' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// Get previous chats for logged-in user
app.get('/api/chats', auth, async (req, res) => {
  const userChat = await Chat.findOne({ email: req.email });
  if (!userChat) return res.json([]);
  // Return a single chat for now
  res.json([{ id: 0, title: 'Chat with Bot' }]);
});

// Get messages for logged-in user
app.get('/api/chats/:id/messages', auth, async (req, res) => {
  const userChat = await Chat.findOne({ email: req.email });
  if (!userChat) return res.json([]);
  res.json(userChat.messages);
});

// Add message to chat (user or bot)
app.post('/api/chats/:id/messages', auth, async (req, res) => {
  const { user, message } = req.body;
  const userChat = await Chat.findOne({ email: req.email });
  if (!userChat) return res.status(400).json({ error: 'Chat not found' });
  userChat.messages.push({ user, message });
  await userChat.save();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
