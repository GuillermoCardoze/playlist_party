// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <ul><Link to="/">PlaylistParty</Link></ul>
                <ul><Link to="/songs">Songs</Link></ul>
                <ul><Link to="/playlists">Playlists</Link></ul>
            </ul>
        </nav>
    );
}

export default Navbar;