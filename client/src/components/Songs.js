import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';


function Songs({ songs }) {
  const [searchSong, setSearchSong] = useState(''); 

  const filteredSongs = songs.filter((song) => {
    return (
      song.title.toLowerCase().includes(searchSong.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchSong.toLowerCase()) ||
      song.duration.toLowerCase().includes(searchSong.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Song List</h2>

      <input
        className='search-song'
        type="text"
        placeholder="Search by song title or artist..."
        value={searchSong}
        onChange={(e) => setSearchSong(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
        <button>Explicit Lyrics</button>
        

      

      {filteredSongs.length === 0 ? (
        <p>No songs found</p> 
      ) : (
        <ol className="song-list"> 
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
                <button>Add Song</button>
                <button>Update Song</button>
                <button>Delete Song</button>              
                <br></br>
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
