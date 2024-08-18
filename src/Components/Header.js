import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import axios from 'axios';

// import EventsPage from '.././pages/EventsPage';

const Header = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setIsLoggedIn(true);
      setUserRole(storedUserRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
  };

  const handleDeleteEvent = async () => {
    // Prompt the user to enter the event name for confirmation
    const enteredName = prompt('Please enter the name of the event to confirm deletion:');
    
      try {
        // Send DELETE request to the server
        await axios.delete(`http://localhost:5000/api/users/events/${enteredName}`);
        alert('Event deleted successfully!');
        // Optionally refresh the page or update the UI
        window.location.reload();
      } catch (error) {
        console.error('Error deleting event:', error.response ? error.response.data : error.message);
        alert('Failed to delete the event.');
      }
    
  };

  return (
    <header className="header">
      <h1 className="heading">Event Management System</h1>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
        </ul>
        <ul className="nav-list nav-right">
        {(() => {if (isLoggedIn) {
      if (userRole === 'Admin') {
        return (
          <>
            <li className="nav-item">
              <Link to="/add-event" className="nav-link">Add Events</Link>
            </li>
            <li className="nav-item">
            <a href=''  onClick={handleDeleteEvent} className="nav-link">Delete Event</a>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">Profile</Link>
            </li>
            <li className="nav-item">
              <button  onClick={handleLogout} className="nav-link button">Logout</button>
            </li>
          </>
        );
      } else {
        return (
          <>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">Profile</Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link">Logout</button>
            </li>
          </>
        );
      }
    } else {
      return (
        <>
          <li className="nav-item">
            <Link to="/signin" className="nav-link">Sign In</Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </li>
        </>
      );
    }
  })()}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
