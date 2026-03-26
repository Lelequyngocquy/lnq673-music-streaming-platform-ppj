import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../../context/PlayerContext';

const SongDetails = () => {
  const { setCurrentSong } = usePlayer(); // Access the PlayerContext
  const { AlbumID } = useParams(); // Lấy AlbumID từ URL params
  const [songDetails, setSongDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // Lưu danh sách album yêu thích của user

  const userID = localStorage.getItem('userID'); // Lấy userID từ localStorage

  // Fetch dữ liệu bài hát từ API
  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/albums/search?AlbumID=${AlbumID}`);
        setSongDetails(response.data[0]); // Vì API trả về một mảng, ta lấy phần tử đầu tiên
        setLoading(false);
      } catch (error) {
        console.error('Error fetching song details:', error);
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/favorites?userId=${userID}`);
        setFavorites(response.data.map((fav) => fav.AlbumID));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchSongDetails();
    if (userID) {
      fetchFavorites();
    }
  }, [AlbumID, userID]);

  const toggleFavorite = async (albumID) => {
    if (favorites.includes(albumID)) {
      // Nếu đã yêu thích, xóa album khỏi danh sách yêu thích
      try {
        await axios.delete('http://localhost:5000/api/favorites', {
          data: { userId: userID, AlbumID: albumID },
        });
        setFavorites(favorites.filter((id) => id !== albumID));
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    } else {
      // Nếu chưa yêu thích, thêm album vào danh sách yêu thích
      try {
        await axios.post('http://localhost:5000/api/favorites', {
          userId: userID,
          AlbumID: albumID,
        });
        setFavorites([...favorites, albumID]);
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!songDetails) {
    return <div>Song not found.</div>;
  }

  return (
    <main className="song-details">
      <h2>Song Details</h2>
      <div className="song-info">
        <div className="left">
          <img src={songDetails.coverPath} alt={songDetails.title} />
        </div>
        <div className="right">
          <h1>{songDetails.title}</h1>
          <Link to={`/artists/${songDetails.Artist.id}`}>
            <h3 className='underline-hover shake-hover'>{songDetails.Artist.name}</h3>
          </Link>
          <h4>{songDetails.genre} - {songDetails.year}</h4>
          <h4>{Math.floor(songDetails.duration / 60)}:{String(songDetails.duration % 60).padStart(2, '0')}</h4>
          <h4>{new Date(songDetails.releaseDay).toLocaleDateString()}</h4>
          <h4>{songDetails.views.toLocaleString('de-DE')} listeners</h4>
          <div className="actions">
            <button className='shake-hover' onClick={() => setCurrentSong(songDetails)}>
              Play
            </button>
           
            <i
              className="bx bxs-heart favourites-adding"
              style={{ color: favorites.includes(songDetails.AlbumID) ? '#CA4A4A' : '#fff' }}
              onClick={() => toggleFavorite(songDetails.AlbumID)}
            ></i>
         
          </div>
        </div>
      </div>
    </main>
  );
};

export default SongDetails;