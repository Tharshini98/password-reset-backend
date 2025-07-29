const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const passwordRoutes = require('./routes/password.routes');



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: 'https://idyllic-florentine-9f1669.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Password Reset API is live ');
});


app.use('/api/auth', authRoutes);

app.use('/api/password', passwordRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
