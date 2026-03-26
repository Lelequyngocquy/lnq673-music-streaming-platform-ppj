import React from 'react';
import { Link } from 'react-router-dom';
import playingArt from '../assets/art1.jpg';


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <button className="menu-btn" id="menu-close">
          <i className="bx bx-log-out-circle"></i>
        </button>
        <i className="bx bx-pulse"></i>
        <Link className="a" to="/">Music Streaming Website</Link>
      </div>
      <div className="menu">
        <h5>Menu</h5>
        <ul>
          <li>
            <i className="bx bxs-bolt-circle"></i>
            <Link className="a" to="/explore">Explore</Link>
          </li>
          <li>
            <i className="bx bxs-volume-full"></i>
            <Link className="a" to="/genres">Genres</Link>
          </li>
          <li>
            <i className="bx bxs-album"></i>
            <Link className="a" to="/albums">Albums</Link>
          </li>
          <li>
            <i className="bx bxs-microphone"></i>
            <Link className="a" to="/artists">Artists</Link>
          </li>
          {/* <li>
            <i className="bx bxs-radio"></i>
            <Link className="a" to="/podcasts">Podcasts</Link>
          </li> */}
        </ul>
      </div>
      <div className="menu">
        <h5>Library</h5>
        <ul>
          <li>
            <i className="bx bx-undo"></i>
            <Link className="a" to="/recents">Recent</Link>
          </li>
          <li>
            <i className="bx bxs-heart"></i>
            <Link className="a" to="/favourites">Favourites</Link>
          </li>
        </ul>
      </div>
      {/* <div className="menu">
        <h5>Playlist</h5>
        <ul>
          <li>
            <i className="bx bxs-plus-square"></i>
            <Link className="a" to="/create-new-playlist">Create New</Link>
          </li>
          <li>
            <i className="bx bxs-caret-right-circle"></i>
            <Link className="a" to="/playlist/1">.</Link>
          </li>
          <li>
            <i className="bx bxs-caret-right-circle"></i>
            <Link className="a" to="/playlist/2">. </Link>
          </li>
          <li>
            <i className="bx bxs-caret-right-circle"></i>
            <Link className="a" to="/playlist/3">.</Link>
          </li>
        </ul>
      </div> */}
      <div class="playing">
        <div class="top">
            <img src={playingArt} alt='playingArt'/>
            <h4>Demo Version <br/> 12/2024</h4>
        </div>
        <div class="bottom">
          
           <i class='bx bxs-copyright bx-tada' ></i>
            <p>Copyright 2024 MSW</p>
        </div>
    </div>
    </aside>
  );
};

export default Sidebar;
