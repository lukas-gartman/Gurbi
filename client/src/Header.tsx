import React from 'react';
import './Header.css';

function Header() {
  return (
    <header>
        <div className="header-row">
            <h1>Gurbi</h1>
        </div>
        <nav className="header-row">
            <a className="nav-button active" href="#">Following</a>
            <a className="nav-button" href="#">Upcoming</a>
        </nav>
    </header>
  );
}

export default Header;