
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'; // For redirection after login


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Used to navigate to the music page after login

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
  
      // Check if login is successful
      if (response.data.user) {
        const { username, AvatarPath, id, role } = response.data.user;
  
        // Save user info to localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('avatar', AvatarPath || ''); // Use empty string if AvatarPath is null
        localStorage.setItem('userID', id);
        localStorage.setItem('role',role);
  
        // Redirect to music page
        navigate('/music');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Streaming Music Website</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
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

          <button type="submit" className="login-button">
            Login
          </button>
          <Link to={`/signup`}><p>If you dont have an account, Sign Up here!</p></Link>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
