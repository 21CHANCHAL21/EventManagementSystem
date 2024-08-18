const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user');
// const eventRoutes = require('./routes/events');

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server running on port ${PORT}`));

