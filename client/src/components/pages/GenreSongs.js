import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GenreSongs = () => {
  const { genre } = useParams(); // Lấy thể loại từ URL params
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        const allSongs = response.data;

        // Lọc bài hát thuộc thể loại từ URL
        const filteredSongs = allSongs.filter((song) =>
          song.genre
            .toLowerCase()
            .split(',')
            .map((g) => g.trim().replace(/\s+/g, '-')) // Định dạng genre cho khớp URL
            .includes(genre)
        );

        setSongs(filteredSongs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setLoading(false);
      }
    };

    fetchSongs();
  }, [genre]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (songs.length === 0) {
    return <div>No songs found for the genre "{genre.replace(/-/g, ' ')}".</div>;
  }

  return (
    <main className="genre-songs">
      <h2>Songs in "{genre.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}"</h2>
      <div className="songs-list">
        {songs.map((song) => (
          <div key={song.id} className="song-card box-shadow">
            <Link to={`/song-details/${song.AlbumID}`}>
                <img className="shake-hover"src={song.coverPath} alt={song.title} />
            </Link>
                

            <div className="song-info">
                <Link to={`/song-details/${song.AlbumID}`}>
                    <h3 className=''>{song.title}</h3>
                </Link>
                <p><Link to={`/artists/${song.Artist.id}`} className='blue-hover'>{song.Artist.name}</Link></p>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default GenreSongs;
