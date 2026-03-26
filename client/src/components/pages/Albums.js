import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        setAlbums(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching albums:', error);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="albums-page">
      <h2>All Albums</h2>
      <div className="albums-grid">
        {albums.map((album) => (
          <div key={album.id} className="album-card box-shadow">
            <Link to={`/song-details/${album.AlbumID}`}>
              <img className="shake-hover" src={album.coverPath} alt={album.title} />
            </Link>
            <div className="album-info">
              <h3>{album.title}</h3>
              <p><Link to={`/artists/${album.Artist.id}`} className="blue-hover">{album.Artist.name}</Link></p>
              
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Albums;
