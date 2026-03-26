import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import userProfile from '../assets/defaultuser.jpg'; // Default avatar
import playingSong from '../assets/playingsong.jpg'; // Example image
import { usePlayer } from '../context/PlayerContext';

const RightSection = () => {
  const [username, setUsername] = useState('Username');
  const [avatar, setAvatar] = useState(null);
  const { currentSong, queue, currentIndex, setCurrentIndex } = usePlayer();

  // Ref for audio instance
  const audioRef = useRef(null);

  // State for playback control
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load user information
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedAvatar = localStorage.getItem('avatar');

    if (storedUsername) setUsername(storedUsername);
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  // Handle the "Next" button functionality
  const handleNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, queue.length, setCurrentIndex]);

  // Handle the "Previous" button functionality
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, setCurrentIndex]);

  // Manage audio playback and cleanup
  useEffect(() => {
    if (currentSong) {
      const audio = new Audio(currentSong.audioPath);
      audioRef.current = audio;

      // Load song metadata and update duration
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      // Update currentTime during playback
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      // Handle when the song ends
      audio.addEventListener('ended', handleNext);

      // Auto-play the current song
      audio.play();
      setIsPlaying(true);

      // Cleanup audio instance on unmount or song change
      return () => {
        audio.pause();
        audio.currentTime = 0;
        audio.removeEventListener('ended', handleNext);
        audioRef.current = null;
      };
    }
  }, [currentSong, handleNext]);

  // Play/Pause button handler
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Format time (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
  
    const rect = e.target.getBoundingClientRect(); // Lấy vị trí của progress bar
    const seekTime = ((e.clientX - rect.left) / rect.width) * duration; // Tính thời gian cần tua đến
    audioRef.current.currentTime = seekTime; // Cập nhật thời gian cho audio
    setCurrentTime(seekTime); // Cập nhật thời gian hiện tại
  };
  
  return (
    <div className="right-section">
      {/* User Profile Section */}
      <div className="profile">
        <Link to={`/notifications`}>
          <i className="bx bxs-bell"></i>
        </Link>
        <Link to={`/setting`}>
          <i className="bx bxs-cog"></i>
        </Link>

        <Link to={username !== 'Username' ? '/userprofile' : '/login'}>
          <div className="user">
            <div className="left">
              <img src={avatar || userProfile} alt="User Avatar" />
            </div>
            <div className="right">
              <h5>{username !== 'Username' ? username : 'Login'}</h5>
            </div>
          </div>
        </Link>
      </div>

      {/* Music Player Section */}
      <div className="music-player">
        <div className="top-section">
          <div className="header">
            <h5>Player</h5>
            <i className="bx bxs-playlist"></i>
          </div>
          <div className="song-info">
            <img src={currentSong?.coverPath || playingSong} alt="Playing Song" />
            <div className="description">
              <h3>{currentSong?.title || 'No Song Is Playing'}</h3>
              <h5>{currentSong?.Artist?.name || ''}</h5>
              <p>{currentSong?.genre || ''}</p>
            </div>

            <div className="progress">
  <p>{formatTime(currentTime)}</p>
  <div
    className="progress-bar"
    onClick={(e) => handleSeek(e)} // Xử lý khi click
  >
    <div
      className="active-line"
      style={{
        width: `${(currentTime / duration) * 100}%`,
      }}
    ></div>
  </div>
  <p>{formatTime(duration)}</p>
</div>



          </div>
        </div>

        <div className="player-actions">
          <div className="buttons">
            {/* <i className="bx bx-repeat">10s</i>  */}
            <i className="bx bx-first-page" onClick={handlePrevious}></i>
            <i
              className={`bx ${isPlaying ? 'bx-stop' : 'bx-right-arrow'} play-button`}
              onClick={handlePlayPause}
            ></i>
            <i className="bx bx-last-page" onClick={handleNext}></i>
            {/* <i className="bx bx-transfer-alt">10s</i> */}
          </div>
          <div className="lyrics">
            <i className="bx bx-chevron-up"></i>
            <h5>LYRICS</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSection;
