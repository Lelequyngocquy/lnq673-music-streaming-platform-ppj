import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GenresList = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        const allSongs = response.data;

        // Tách các thể loại và loại trừ trùng lặp
        const uniqueGenres = [
          ...new Set(
            allSongs.flatMap((song) =>
              song.genre.toLowerCase().split(',').map((g) => g.trim().replace(/\s+/g, '-'))
            )
          ),
        ];

        setGenres(uniqueGenres);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <div>Loading genres...</div>;
  }

  return (
    <main className="genres-list">
      <h2>All Genres</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>
            <Link to={`/genres/${genre}`} className=' '>
              <i class='bx bx-music'></i>
              {genre.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
            
            </Link>
        </li>
        ))}
      </ul>
    </main>
  );
};

export default GenresList;
