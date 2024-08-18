// src/components/BookingModal.js
import React, { useState } from 'react';
import axios from 'axios';
import './BookingModal.css';

const BookingModal = ({ event, onClose }) => {

  const name = localStorage.getItem('userName');
  const [formData, setFormData] = useState({
    userId: '',
    userName: name,
    quantity: '',
    eventId: event._id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your booking API
      const res = await axios.post('http://localhost:5000/api/users/bookings', formData);
      console.log('Booking submitted:', formData);
      console.log(res.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error('Error submitting booking:', error.response ? error.response.data : error.message);
      
      // Show error message to the user
      if (error.response && error.response.data) {
        alert(`Failed to book: ${error.response.data}`);
        onClose();
      } else {
        alert('An unexpected error occurred. Please try again later.');
        onClose();
        
      }
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Book Event: {event.name}</h2>
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>
            User ID:
            <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />
          </label>
          <label>
            User Name:
            <input type="text" name="userName" value={formData.userName} onChange={handleChange}  required />
          </label>
          <label>
            Quantity:
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </label>
          <label>
            Event ID:
            <input type="text" name="eventId" value={formData.eventId} readOnly />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
