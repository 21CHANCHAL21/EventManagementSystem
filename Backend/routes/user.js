const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Events = require('../models/Events');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/register', async (req, res) => {
  // console.log(req.body);  // Add this line to debug
  const { userName, email, password, role } = req.body;

  if (!userName || !email || !password || !role) {
    return res.status(400).send('Please enter all fields');
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

const newUser = new User({
  userName,
  email,
  password,
  role
});

   await newUser.save();
    res.status(201).json({ msg: 'User registered successfully', newUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', req.body);

  try {
    const user = await User.findOne({ email });
    // console.log('User found:', user);

    if (!user) {
      console.log('No user found with this email');
      return res.status(400).send('Invalid credentials');
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log('Password match status:', isMatch);
    // console.log(password);
    // console.log(user.password);
    const isMatch = password === user.password? true: false;
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).send('Invalid credentials');
    }

    console.log('Login successful');
    res.status(200).send({ message: 'Login successful', user });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
});


router.post('/events', async (req, res) => {
  
  try {
    const { name, date, description, ticketsAvailable } = req.body;
  // console.log(req.body);
  existingEvent = await Events.findOne({name});
  if (existingEvent) {
    return res.status(400).json({ msg: 'Event already exists' });
  }

    // console.log('Request received:', req.body); // Add this line to log the incoming request
    const newEvent = new Events({
      name,
      date,
      description,
      ticketsAvailable,
    });

    await newEvent.save();
    // console.log('Event saved:', newEvent); // Add this line to confirm saving
    res.status(201).send('Event added successfully');
  } catch (error) {
    console.error('Error saving event:', error); // Add this line to log any errors
    res.status(500).send('Server error');
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = await Events.find({});
    res.json(events); // Send the events as a JSON response
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Server error');
  }
});

// Route to handle booking submission
// Book ticket
router.post('/bookings', async (req, res) => {
  try {
    const { userId, userName, quantity, eventId } = req.body;
    console.log('Booking data received:', req.body); // Check if data is received correctly


    const event = await Events.findById(eventId);
    if (event.ticketsAvailable < quantity) {
      return res.status(400).send(`only ${event.ticketsAvailable} tickets are available`);
    }
  if (event.ticketsAvailable == 0) {
      return res.status(400).send("Event is fully booked No tickets are available");
  }
  if (quantity > 15) {
    return res.status(400).send("You can only book a maximum of 15 tickets in a single request.");
  }

  const newBooking = new Booking({
    userId,
    userName,
    quantity,
    eventId,
  });

    const savedBooking = await newBooking.save();
    console.log('Booking saved:', savedBooking); // Check if saving is successful
    event.ticketsAvailable -= quantity;
    await event.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error saving booking:', error.message);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Delete Events
router.delete('/events/:name', async (req, res) => {
  const { name } = req.params;

  try {
    // Find and delete the event by name
    const result = await Events.findOneAndDelete({ name });

    if (!result) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete the event' });
  }
});


// Route to get user profile data by userName
router.get('/profile/:userName', async (req, res) => {
  try {
    const { userName } = req.params;

    // Fetch user information by userName
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch booking data for the user based on userName
    const bookings = await Booking.find({ userName });
    // const eventId = bookings.eventId;
    // const event = await Events.find({ eventId });

    // console.log(bookings);
     // Fetch event details for each booking
     const bookingsWithEventDetails = await Promise.all(
      bookings.map(async (booking) => {
        const event = await Events.findById(booking.eventId);
        return {
          _id: booking._id,
          eventId: booking.eventId,
          userName: booking.userName,
          eventName: event.name,
          eventDate: event.date,
          quantity: booking.quantity,
          bookingDate: booking.bookingDate,
        };
      })
    );

    // Respond with user info and booking data
    res.json({
     userName: user.userName,
      email: user.email,
      role: user.role,
      bookings: bookingsWithEventDetails,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel bookingsrouter.delete('/bookings/:id', async (req, res) => {
  router.delete('/bookings/:id', async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Find the associated event by eventId
    const event = await Events.findById(booking.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Increase the ticketsAvailable count
    event.ticketsAvailable += booking.quantity;
    await event.save();

      const deletedBooking = await Booking.findByIdAndDelete(bookingId);
      if (!deletedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  


module.exports = router;

