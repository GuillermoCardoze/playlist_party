// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <ul><Link to="/">Home</Link></ul>
                <ul><Link to="/songs">Songs</Link></ul>
                <ul><Link to="/playlists">Playlists</Link></ul>
                {/* <ul><Link to="/form">Add New Song Form</Link></ul> */}

            </ul>
        </nav>
    );
}

export default Navbar;