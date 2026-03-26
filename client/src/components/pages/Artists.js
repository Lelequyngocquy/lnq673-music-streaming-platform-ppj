import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/artists');
        setArtists(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="artists-page">
      <h2>All Artists</h2>
      <div className="artists-grid">
        {artists.map((artist) => (
          <div key={artist.id} className="artist-card ">
            <Link to={`/artists/${artist.id}`}>
              <img
                src={artist.profileCoverPath || 'https://via.placeholder.com/150'}
                alt={artist.name}
                className="artist-cover"
              />
            </Link>
            <div className="artist-info">
            <Link to={`/artists/${artist.id}`} className="blue-hover">
                <h3>{artist.name}</h3>
                <p>{artist.bio}</p> 
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Artists;
