import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';

const Main = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [favorites, setFavorites] = useState([]); // Lưu danh sách album yêu thích của user
  const { setCurrentSong } = usePlayer();

  const userID = localStorage.getItem('userID'); // Lấy userID từ localStorage

  // Fetch top songs
  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        const sortedSongs = response.data.sort((a, b) => b.views - a.views).slice(0, 5);
        setTopSongs(sortedSongs);
      } catch (error) {
        console.error('Error fetching top songs:', error);
      }
    };

    fetchTopSongs();
  }, []);

  // Fetch user's favorite albums
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/favorites?userId=${userID}`);
        setFavorites(response.data.map((fav) => fav.AlbumID));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    if (userID) {
      fetchFavorites();
    }
  }, [userID]);

  // Handle adding/removing favorites
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

  return (
    <main>
      <div className="trending">
        <div className="left">
          <h5>New Trending</h5>
          {topSongs.length > 0 && (
            <div className="info">
              <h2 className="trending-songname">{topSongs[0].title}</h2>
              <Link to={`/artists/${topSongs[0].Artist.id}`}>
                <h4 className="trending-artistname blue-hover">{topSongs[0].Artist.name}</h4>
              </Link>
              <h5 className="trending-streams">{topSongs[0].views.toLocaleString('de-DE')} listeners</h5>
              <div className="buttons">
                <button className="play-btn" onClick={() => setCurrentSong(topSongs[0])}>
                  Listen Now
                </button>
                <i
                  className="bx bxs-heart favourites-adding"
                  style={{ color: favorites.includes(topSongs[0].AlbumID) ? '#CA4A4A' : '#fff' }}
                  onClick={() => toggleFavorite(topSongs[0].AlbumID)}
                ></i>
              </div>
            </div>
          )}
        </div>
        {topSongs.length > 0 && <img src={topSongs[0].coverPath} alt="Trending" />}
      </div>

      <div className="playlist">
        <div className="genres">
          <div className="header">
            <h5>Genres</h5>
            <Link className="a" to="/genres">See all</Link>
          </div>
          <div className="items">
            <Link className="item" to="/genres/electro">
              <p>Electro <br />Music</p>
            </Link>
            <Link className="item" to="/genres/dance">
              <p>Dance <br />Music</p>
            </Link>
            <Link className="item" to="/genres/pop">
              <p>Pop <br />Music</p>
            </Link>
            <Link className="item" to="/genres/hiphop">
              <p>Hip Hop <br />Music</p>
            </Link>
            <Link className="item" to="/genres/alternative">
              <p>Alternative <br />Music</p>
            </Link>
            <Link className="item" to="/genres/disco">
              <p>Disco <br />Music</p>
            </Link>
          </div>
        </div>

        <div className="music-list">
          <div className="header">
            <h5>Top Songs</h5>
            <Link className="a" to="/">.</Link>
          </div>
          <div className="items">
          {topSongs.map((song, index) => (
            <div className="item" key={song.AlbumID}>
              <div className="info">
                <p>{index + 1}</p>
                <img src={song.coverPath} alt={`Top Song ${index + 1}`} />
                <div className="details">
                  <Link to={`/song-details/${song.AlbumID}`}>
                    <h5>{song.title}</h5>
                  </Link>
                  <p>{song.Artist.name}</p>
                </div>
              </div>
              <div className="actions">
                <p>{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</p>
                <div className="icon">
                  <i onClick={() => setCurrentSong(song)} className="bx bxs-right-arrow"></i>
                </div>
                <i
                  className="bx bxs-heart favourites-adding"
                  style={{ color: favorites.includes(song.AlbumID) ? '#CA4A4A' : '#fff' }}
                  onClick={() => toggleFavorite(song.AlbumID)}
                ></i>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
