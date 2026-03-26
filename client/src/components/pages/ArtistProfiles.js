import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';

const ArtistProfiles = () => {
  const { artistID } = useParams(); // Lấy artistID từ URL params
  const [artistDetails, setArtistDetails] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loadingArtist, setLoadingArtist] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  // Fetch dữ liệu artist từ API
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/artists/${artistID}`);
        setArtistDetails(response.data); // Lưu dữ liệu từ API
        setLoadingArtist(false);
      } catch (error) {
        console.error('Error fetching artist details:', error);
        setLoadingArtist(false);
      }
    };

    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        const filteredAlbums = response.data.filter((album) => album.artistID === Number(artistID));
        setAlbums(filteredAlbums); // Lọc các album thuộc về nghệ sĩ này
        setLoadingAlbums(false);
      } catch (error) {
        console.error('Error fetching albums:', error);
        setLoadingAlbums(false);
      }
    };

    fetchArtistDetails();
    fetchAlbums();
  }, [artistID]);

  if (loadingArtist || loadingAlbums) {
    return <div>Loading...</div>;
  }

  if (!artistDetails) {
    return <div>Artist not found.</div>;
  }

  return (
    <main className="artist-profile">
      <h2>Artist Profile</h2>
      <div className="artist-info">
        <div className="left">
          <img
            src={artistDetails.profileCoverPath || 'https://via.placeholder.com/300'}
            alt={artistDetails.name}
            className="artist-profile-cover"
          />
        </div>
        <div className="right">
          <h1>{artistDetails.name}</h1>
          <h3>{artistDetails.country}</h3>
          <p>{artistDetails.bio}</p>
          {artistDetails.createdAt && (
            <h4>
              Profile created on: {new Date(artistDetails.createdAt).toLocaleDateString()}
            </h4>
          )}
        </div>
      </div>
      <div className="artist-albums">
        <h2>Albums by {artistDetails.name}</h2>
        {albums.length > 0 ? (
          <div className="albums-grid">
            {albums.map((album) => (
              <Link to={`/song-details/${album.AlbumID}`}>
                <div key={album.AlbumID} className="album-card">
                  <img
                    src={album.coverPath || 'https://via.placeholder.com/150'}
                    alt={album.title}
                    className="album-cover"
                  />
                  <div className="album-info">
                      <h3>{album.title}</h3>
                    
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No albums found for this artist.</p>
        )}
      </div>
    </main>
  );
};

export default ArtistProfiles;
