// ProfilePage.js

import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userName = localStorage.getItem('userName'); // Get userName from localStorage

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${userName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userName]);

  const handleCancelBooking = async (bookingId) => {
    console.log('Attempting to cancel booking with ID:', bookingId);
    // if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        console.log(bookingId);
        await axios.delete(`http://localhost:5000/api/users/bookings/${bookingId}`);
        alert('Booking canceled successfully');
        // Optionally refresh the profile data
        const updatedData = profileData.bookings.filter((booking) => booking._id !== bookingId);
        setProfileData({ ...profileData, bookings: updatedData });
      } catch (error) {
        console.error('Error canceling booking:', error.response ? error.response.data : error.message);
        alert('Failed to cancel the booking.');
      }
    // }
  };
  const handleDownloadTicket = (booking) => {
    const doc = new jsPDF();
    
    // Add the title
    doc.setFontSize(20);
    doc.text("Ticket Information", 20, 20);
  
    // Adjust starting position for the ticket details
    let yPosition = 40;
  
    // Add ticket details below the title
    doc.setFontSize(12);
    doc.text(`User Name: ${booking.userName}`, 20, yPosition);
    yPosition += 10; // Move down by 10 units

    doc.text(`Event Name: ${booking.eventName}`, 20, yPosition);
    yPosition += 10; // Move down by 10 units
    
    doc.text(`Event ID: ${booking.eventId}`, 20, yPosition);
    yPosition += 10;
    
    doc.text(`Event Date: ${new Date(booking.eventDate).toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;
    
    doc.text(`Quantity: ${booking.quantity}`, 20, yPosition);
    yPosition += 10;
    
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 20, yPosition);
  
    // Save the PDF with a filename based on the event name and booking ID
    doc.save(`Ticket_${booking.eventName}_${booking._id}.pdf`);
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Information</h2>
        <p><strong>Username:</strong> {profileData.userName}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Role:</strong> {profileData.role}</p>
      </div>
      <div className="bookings-card">
        <h2>Booked Tickets</h2>
        {profileData.bookings.length > 0 ? (
          profileData.bookings.map((booking, index) => (
            <div key={index} className="booking-card">
            <p><strong>User Name:</strong> {booking.userName}</p>
            <p><strong>Event Name:</strong> {booking.eventName}</p>
              <p><strong>Event ID:</strong> {booking.eventId}</p>
              <p><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleString()}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              {console.log(booking._id)}
              <button className="button" onClick={() => handleCancelBooking(booking._id)}>Cancel Booking</button>
              <button className="btn-download" onClick={() => handleDownloadTicket(booking)}>Download Ticket</button>
            </div>
          ))
        ) : (
          <p>No tickets booked yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
