import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Recents = () => {
  const [recents, setRecents] = useState([]); // Lưu danh sách bài hát nghe gần nhất của user
  const [loading, setLoading] = useState(true);
  const userID = localStorage.getItem('userID'); // Lấy userID từ localStorage

  // Fetch user's recent albums
  useEffect(() => {
    const fetchRecents = async () => {
      try {
        // Get recent AlbumIDs from the API
        const response = await axios.get(`http://localhost:5000/api/recents?userId=${userID}`);
        const recentAlbumIDs = response.data
          .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt)) // Sắp xếp theo thời gian nghe gần nhất
          .slice(0, 10) // Lấy tối đa 10 bài hát gần nhất
          .map((recent) => recent.AlbumID);

        // Fetch album details for each AlbumID
        const albumRequests = recentAlbumIDs.map((albumID) =>
          axios.get(`http://localhost:5000/api/albums/search?AlbumID=${albumID}`)
        );

        const albumsResponses = await Promise.all(albumRequests);
        const albumsData = albumsResponses.map((res) => res.data[0]); // Extract first result from each response

        setRecents(albumsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent albums:', error);
        setLoading(false);
      }
    };

    if (userID) {
      fetchRecents();
    }
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recents.length) {
    return <div>No recent songs found.</div>;
  }

  return (
    <main className="recents-page">
      <h2> Recently Played (10 Songs) </h2>
      <div className="recents-list">
        {recents.map((recent) => (
          <div key={recent.AlbumID} className="recent-item">
            <div className="info">
            <Link to={`/song-details/${recent.AlbumID}`}>
                <img src={recent.coverPath} alt={recent.title}/>
             </Link>
              <div className="details">
                
                  <h3>{recent.title}</h3>
               
                <p>{recent.Artist?.name || 'Unknown Artist'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Recents;
