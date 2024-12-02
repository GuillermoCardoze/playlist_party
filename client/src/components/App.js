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
  const [partyData, setPartyData] = useState([]); // Hold state for /party

  useEffect(() => {
    Promise.all([
      fetch('/songs').then((res) => res.json()),
      fetch('/playlists').then((res) => res.json()),
      fetch('/party').then((res) => res.json()),
    ])
      .then(([songsData, playlistsData, fetchedPartyData]) => {
        setPlaylists(playlistsData);
        setPartyData(fetchedPartyData); // Store /party data separately

        const mergedSongs = songsData.map((song) => {
          const partyInfo = fetchedPartyData.find((party) => party.song_id === song.id);
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
            element={<Songs
              songs={songs}
              playlists={playlists}
              partyData={partyData} // Pass partyData if needed
              setSongs={setSongs}
              deleteSong={deleteSong}
            />}
          />
          <Route
            path="playlists"
            element={<Playlists
              songs={songs}
              playlists={playlists}
              setPlaylists={setPlaylists}
              setSongs={setSongs}
            />}
          />
          <Route
            path="edit-song/:id"
            element={<SongForm
              songs={songs}
              playlists={playlists}
              setPlaylists={setPlaylists}
              setSongs={setSongs}
              deleteSong={deleteSong}
              setPartyData={setPartyData}
            />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
