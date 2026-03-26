import React from 'react'
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className='main-header'>
      <header>
        <div className="nav-links">
          <button className="menu-btn" id="menu-open">
            <i className="bx bx-menu"></i>
          </button>
          <Link className="a" to="/music">Music</Link>
          <Link className="a" to="/live">Live</Link>
          <Link className="a" to="/podcast">Podcast</Link>
        </div>
        <div className="search">
          <i className="bx bx-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
      </header>
    </div>
  )
}

export default Header
