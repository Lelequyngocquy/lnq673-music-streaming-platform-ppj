import React from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import RightSection from './components/RightSection';
import Header from './components/Header';
import './App.css';
import 'boxicons/css/boxicons.min.css';

import ComingSoon from './components/pages/ComingSoon';
import FileList from './components/pages/FileList';
import Login from './components/Login';
import SignUp from './components/SignUp'; // Import trang SignUp
import SongDetails from './components/pages/SongDetails';
import ArtistProfiles from './components/pages/ArtistProfiles';
import GenreSongs from './components/pages/GenreSongs';
import GenresList from './components/pages/GenresList';
import Albums from './components/pages/Albums';
import Artists from './components/pages/Artists';
import Explore from './components/pages/Explore';
import UserProfile from './components/pages/UserProfile';
import Favourites from './components/pages/Favorites';
import Recents from './components/pages/Recents';

const AppContent = () => {
  const location = useLocation(); // Kiểm tra đường dẫn hiện tại
  const isLoginPage = location.pathname === '/login';
  const isSignUpPage = location.pathname === '/signup'; // Kiểm tra nếu là trang SignUp

  return (
    <>
      {isLoginPage ? (
        <Login />
      ) : isSignUpPage ? (
        <SignUp />
      ) : (
        <div className="container">
          <Sidebar />
          <Header />
          <div className="routes">
            <Routes>
              <Route path="*" element={<ComingSoon />} />
              <Route path="/" element={<Main />} />
              <Route path="/music" element={<Main />} />
              <Route path="/backend/list-files" element={<FileList />} />
              <Route path="/song-details/:AlbumID" element={<SongDetails />} />
              <Route path="/artists/:artistID" element={<ArtistProfiles />} />
              <Route path="/genres" element={<GenresList />} />
              <Route path="/genres/:genre" element={<GenreSongs />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/recents" element={<Recents />} />
            </Routes>
          </div>
          <RightSection />
        </div>
      )}
    </>
  );
};

const App = () => {
  useEffect(() => {
    document.title = "Music Streaming Website"; 
  }, []); 
  return (
    <Router>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </Router>
  );
};

export default App;
