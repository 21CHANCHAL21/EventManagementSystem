// src/pages/SignInPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignInPage.css';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Corrected useNavigate hook

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
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log('Server response:', response.data);
  
      if (response.status === 200) {
        const user = response.data.user;
        const userRole = user.role;
        const userName = user.userName;
        console.log(userName);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userName', userName);
        navigate('/');
      } else {
        console.error('Login failed with status:', response.status);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Invalid credentials. Please try again.');
    }
  };
  

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Sign In</button>
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignInPage;
