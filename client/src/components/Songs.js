import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';


function Songs({ songs }) {
  const [searchQuery, setSearchQuery] = useState(''); // Track search input

  // Filter songs based on search query (search by title and artist)
  const filteredSongs = songs.filter((song) => {
    return (
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.duration.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Song List</h2>

      {/* Search Input */}
      <input
        className='search-song'
        type="text"
        placeholder="Search by song title or artist..."
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

      

      {filteredSongs.length === 0 ? (
        <p>No songs found</p> // Handle case when no songs match the search
      ) : (
        <ol className="song-list"> {/* Ordered list */}
          {filteredSongs.map((song) => (
            <li key={song.id} className="song-item">
              <div className="song-container">
                <div className="Title">
                  <strong>Song Title:</strong> {song.title}
                </div>
                <div className="Artist">
                  <strong>Artist:</strong> {song.artist}
                </div>
                <div className="Duration">
                  <strong>Duration:</strong> {song.duration} mins.
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

export default Songs;
