// src/pages/EventsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookingModal from '../Components/BookingModal';
import "./EventsPage.css";


const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch the events when the component loads
  }, []);

  const handleBookTicket = (event) => {
    const isAuthenticated = localStorage.getItem('userRole'); // Assuming you store the auth token in localStorage

    if (!isAuthenticated) {
      navigate('/signin'); // Redirect to sign-in page if not logged in
    } else {
      setSelectedEvent(event);
      setIsBookingModalOpen(true); // Open booking modal if logged in
    }
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="events-container">
      <h2>Events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <h3>{event.name}</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.description}</p>
            <p>Tickets Available: {event.ticketsAvailable}</p>
            <button className='book-ticket-button' onClick={() => handleBookTicket(event)}>Book Ticket</button>
          </li>
        ))}
      </ul>

      {isBookingModalOpen && (
        <BookingModal event={selectedEvent} onClose={closeBookingModal} />
      )}
    </div>
  );
};

export default EventsPage;
