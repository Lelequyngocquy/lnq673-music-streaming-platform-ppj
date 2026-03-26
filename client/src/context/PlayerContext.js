import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // List of songs in the queue
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the current song
  const userID = localStorage.getItem('userID'); // Get userId from localStorage

  // Increment views for an album when a song is played
  const incrementViews = async (AlbumID) => {
    try {
      await axios.put(`http://localhost:5000/api/albums/${AlbumID}/increment-views`);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  // Save a song to the recents list in the database
  const saveToRecents = async (AlbumID) => {
    if (!userID) {
      console.error('User not logged in');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/recents', {
        userId: userID,
        AlbumID,
      });
    } catch (error) {
      console.error('Error saving to recents:', error);
    }
  };

  // Set the current song
  const setCurrentSong = (song) => {
    const index = queue.findIndex((item) => item.id === song.id);

    if (index !== -1) {
      setCurrentIndex(index); // If the song is already in the queue, set its index
    } else {
      setQueue([...queue, song]); // Add song to the queue if not already present
      setCurrentIndex(queue.length); // Set as the last song
    }

    // Increment views and save to recents
    incrementViews(song.AlbumID);
    saveToRecents(song.AlbumID);
  };

  // Current song
  const currentSong = queue[currentIndex] || null;

  // Play the next song in the queue
  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('End of queue');
    }
  };

  // Play the previous song in the queue
  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      console.log('Start of queue');
    }
  };

  // Add a song to the queue
  const addToQueue = (song) => {
    if (!queue.find((item) => item.id === song.id)) {
      setQueue([...queue, song]);
    }
  };

  // Remove a song from the queue
  const removeFromQueue = (songID) => {
    setQueue(queue.filter((song) => song.id !== songID));
    if (currentIndex >= queue.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  // Logout function: clear playback memory and LocalStorage
  const logout = () => {
    setQueue([]); // Clear the playback queue
    setCurrentIndex(0); // Reset the current song index
    localStorage.clear(); // Clear LocalStorage
    console.log('User logged out, playback memory and LocalStorage cleared');
  };

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentSong,
        currentIndex,
        setCurrentSong,
        playNext,
        playPrevious,
        addToQueue,
        removeFromQueue,
        setQueue,
        setCurrentIndex,
        logout, // Provide the logout function
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
