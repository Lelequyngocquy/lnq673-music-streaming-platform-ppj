import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const albumScrollRef = useRef(null); // Ref for the albums container
  const artistScrollRef = useRef(null); // Ref for the artists container

  // Fetch data from API
  useEffect(() => {
    // Fetch albums data
    axios.get('http://localhost:5000/api/albums')
      .then(response => {
        const sortedAlbums = response.data.sort((a, b) => b.views - a.views);
        setAlbums(sortedAlbums);
      })
      .catch(error => {
        console.error('Error fetching albums:', error);
      });

    // Fetch artists data
    axios.get('http://localhost:5000/api/artists')
      .then(response => {
        setArtists(response.data);
      })
      .catch(error => {
        console.error('Error fetching artists:', error);
      });
  }, []);

  // Handle horizontal scrolling for both album and artist sections
  const handleWheel = (event, scrollContainerRef) => {
    if (scrollContainerRef.current) {
      event.preventDefault(); // Prevent default scrolling
      const sensitivity = 2; // Adjust the sensitivity value for faster scrolling
      scrollContainerRef.current.scrollLeft += event.deltaY * sensitivity *4; // Apply sensitivity
    }
  };

  return (
    <div className="explore-page">
      <div className="explore-section">
        <h2>Explore Albums</h2>
        <div
          ref={albumScrollRef} // Ref for album scroll container
          className="scroll-container"
          onWheel={(event) => handleWheel(event, albumScrollRef)} // Listen for wheel event on albums section
        >
          {albums.map(album => (
            <Link to={`/song-details/${album.AlbumID}`} key={album.id}>
              <div className="item">
                <img src={album.coverPath} alt={album.title} className="cover" />
                <h3>{album.title}</h3>
                <p>{album.Artist.name}</p>
                <p>Views: {album.views}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="explore-section">
        <h2>Explore Artists</h2>
        <div
          ref={artistScrollRef} // Ref for artist scroll container
          className="scroll-container"
          onWheel={(event) => handleWheel(event, artistScrollRef)} // Listen for wheel event on artists section
        >
          {artists.map(artist => (
            <Link to={`/artists/${artist.id}`} key={artist.id}>
              <div className="item">
                <img src={artist.profileCoverPath} alt={artist.name} className="profile-cover" />
                <h3>{artist.name}</h3>
                <p>{artist.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
