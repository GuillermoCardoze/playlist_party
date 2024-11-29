import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Songs from './Songs';
import SongForm from './SongForm';
import Home from './Home';
import Playlists from './Playlists';

function App() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/songs').then((res) => res.json()),
      fetch('/playlists').then((res) => res.json()),
      fetch('/party').then((res) => res.json()),
    ])
      .then(([songsData, playlistsData, partyData]) => {
        setPlaylists(playlistsData);

        const mergedSongs = songsData.map((song) => {
          const partyInfo = partyData.find((party) => party.song_id === song.id);
          return {
            ...song,
            playlist_id: partyInfo?.playlist_id || null,
            explicit: partyInfo?.explicit || false,
          };
        });

        setSongs(mergedSongs);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  // Delete function lifted to App
  const deleteSong = (songId) => {
    fetch(`/songs/${songId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
        } else {
          console.error('Error deleting song');
        }
      })
      .catch((error) => console.error('Error deleting song:', error));
  };

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="songs"
            element={<Songs songs={songs} playlists={playlists} setSongs={setSongs} deleteSong={deleteSong} />}
          />
          <Route
            path="playlists"
            element={<Playlists songs={songs} playlists={playlists} setSongs={setSongs} />}
          />
          <Route
            path="edit-song/:id"
            element={<SongForm songs={songs} playlists={playlists} setSongs={setSongs} deleteSong={deleteSong} />}
          />
          {/* <Route
            path="edit-song/new"
            element={<SongForm songs={songs} playlists={playlists} setSongs={setSongs} deleteSong={deleteSong} />}
          /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
