// server.js
const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(json());
// In server.js (backend)
app.use(cors({
  origin: ["http://localhost:3000", "http://tiger-task-tracker.s3-website-us-east-1.amazonaws.com"],
  credentials: true
}));

const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const projectRoutes = require('./routes/projectRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection failed:', err.message);
});