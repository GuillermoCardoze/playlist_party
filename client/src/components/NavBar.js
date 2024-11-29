// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/songs">Songs</Link></li>
                <li><Link to="/playlists">Playlists</Link></li>
                <li><Link to="/edit-song/new">New Song Form</Link></li>  {/* Adjusted for the edit route */}
            </ul>
        </nav>
    );
}

export default Navbar;
