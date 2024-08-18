// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
// import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AddEventPage from './pages/AddEventPage';
// import DeleteEventPage from './pages/DeleteEventPage';
import EventsPage from './pages/EventsPage';
import "./App.css";


const App = () => {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
      
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<EventsPage />} />
        <Route path="/add-event" element={<AddEventPage />} />
        <Route path="/events" element={<EventsPage />} />
          {/* <Route path="/delete-event" element={<DeleteEventPage />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
