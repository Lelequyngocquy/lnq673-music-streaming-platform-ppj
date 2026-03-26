import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirection after signup

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Used to navigate to login page after signup

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        username,
        email,
        password,
        role: 'user',
        AvatarPath: '' // Optional field, can be updated later
      });

      if (response.status === 201) {
        setSuccess('Account created successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup request:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Sign Up for Streaming Music</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSignUp}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        
        <a href="/login"><p>  Already have an account? Login here! </p></a>
        
      </div>
    </div>
  );
};

export default SignUp;
