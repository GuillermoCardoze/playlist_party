import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';


function Playlists() {


  const [searchQuery, setSearchQuery] = useState(''); // Track search input
  const [playlists, setPlaylists] = useState([])

  useEffect(()=>{
      fetch('/playlists')
      .then(res => res.json())
      .then(res => setPlaylists(res))
  },[])

  // Filter playlists based on search query (search by name and description)
  const filteredPlaylists = playlists.filter((playlist) => {
    return (
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Playlist List</h2>

      {/* Search Input */}
      <input
        className='search-playlist'
        type="text"
        placeholder="Search by playlist name or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <option></option>

      

      {filteredPlaylists.length === 0 ? (
        <p>No playlists found</p> // Handle case when no playlists match the search
      ) : (
        <ol className="playlist-list"> {/* Ordered list */}
          {filteredPlaylists.map((playlist) => (
            <li key={playlist.id} className="playlist-item">
              <div className="playlist-container">
                <div className="Name">
                  <strong>Playlist Name:</strong> {playlist.name}
                </div>
                <div className="Description">
                  <strong>Description:</strong> {playlist.description}
                </div>
                <br></br>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Playlists;
