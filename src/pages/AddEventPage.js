// src/pages/AddEventPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddEventPage.css';  // Import the CSS file

const AddEventPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    ticketsAvailable: 0,
  });

  const navigate = useNavigate();

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
      // Sending a POST request to the /api/events endpoint
      await axios.post('http://localhost:5000/api/users/events', formData);
      setFormData({
        name: '',
        date: '',
        description: '',
        ticketsAvailable: 0,
      });
      navigate('/'); // Redirect to events page after adding the event
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // setError(error.response.data.msg); // Set error message from backend
        console.error('Error in creating an account:', error.response ? error.response.data : error.message);
        alert(error.response.data.msg); // Display alert
        navigate('/');
      } else {
        console.error('Registration error:', error.message);
      }
    }
  };

  return (
    <div className="add-event-container">
      <h2>Add Event</h2>
      <form className="add-event-form" onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          Tickets Available:
          <input type="number" name="ticketsAvailable" value={formData.ticketsAvailable} onChange={handleChange} required />
        </label>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEventPage;
