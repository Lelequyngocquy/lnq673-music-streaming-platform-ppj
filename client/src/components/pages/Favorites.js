import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Favourites = () => {
  const [favorites, setFavorites] = useState([]); // Lưu danh sách album yêu thích của user
  const [loading, setLoading] = useState(true);
  const userID = localStorage.getItem('userID'); // Lấy userID từ localStorage

  // Fetch user's favorite albums
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Get favorite AlbumIDs from localStorage
        const response = await axios.get(`http://localhost:5000/api/favorites?userId=${userID}`);
        const favoriteAlbumIDs = response.data.map((fav) => fav.AlbumID);

        // Fetch album details for each AlbumID
        const albumRequests = favoriteAlbumIDs.map((albumID) =>
          axios.get(`http://localhost:5000/api/albums/search?AlbumID=${albumID}`)
        );

        const albumsResponses = await Promise.all(albumRequests);
        const albumsData = albumsResponses.map((res) => res.data[0]); // Extract first result from each response

        setFavorites(albumsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorite albums:', error);
        setLoading(false);
      }
    };

    if (userID) {
      fetchFavorites();
    }
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!favorites.length) {
    return <div>No favorite songs found.</div>;
  }

  return (
    <main className="favourites-page">
      <h2>Favourite Songs</h2>
      <div className="favourites-list">
        {favorites.map((fav) => (
          <div key={fav.AlbumID} className="favourite-item">
            <div className="info">
              <Link to={`/song-details/${fav.AlbumID}`}>
                <img src={fav.coverPath} alt={fav.title} />
              </Link>
              <div className="details">
                
                  <h3>{fav.title}</h3>
                
                <p>{fav.Artist?.name || 'Unknown Artist'}</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </main>
  );
};

export default Favourites;
