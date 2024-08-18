import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
   
    userName: '',
    email: '',
    password: '',
    role: '', // Add role to form data
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
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      setFormData({
        userName: '',
        email: '',
        password: '',
        role: '', // Reset role field
      });
      
      navigate('/'); // Redirect to the home page
      
      const userRole = response.data.user.role;
      localStorage.setItem('userRole', userRole);
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
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          User Name:
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <label>
          Role:
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;