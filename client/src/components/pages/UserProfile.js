import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Update the import
import { usePlayer } from '../../context/PlayerContext';


const UserProfile = () => {
  const { logout } = usePlayer();
  const [user, setUser] = useState({
    username: '',
    email: '',
    AvatarPath: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Get the current user's ID from localStorage
  const userId = localStorage.getItem('userID');

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data.');
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, AvatarPath: reader.result });
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...user };

      // Send the updated data to the backend
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, updatedUser);
      
      // If successful, update localStorage with new user info
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('avatar', response.data.user.AvatarPath || ''); // Handle null avatar
      localStorage.setItem('email', response.data.user.email);

      // Redirect to a different page (optional)
      window.location.reload(); 
      navigate('/userprofile'); // Use navigate() to redirect
    } catch (err) {
      setError('Failed to update user data.');
    }
  };

  // Handle log out
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('userID');
    localStorage.removeItem('role');
    logout(); // Clear playback memory and LocalStorage
    

    // Redirect to the login page
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>Edit Profile</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Avatar</label>
          <input
            type="file"
            name="AvatarPath"
            onChange={handleAvatarChange}
          />
          {user.AvatarPath && <img src={user.AvatarPath} alt="Avatar" className="avatar-preview" />}
        </div>

        <div className="form-group">
          <button type="submit">Save Changes</button>
        </div>
      </form>

      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default UserProfile;
