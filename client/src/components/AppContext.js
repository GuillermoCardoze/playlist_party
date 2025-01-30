import { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [partyData, setPartyData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    Promise.all([
      fetch('/songs').then((res) => res.json()),
      fetch('/playlists').then((res) => res.json()),
      fetch('/party').then((res) => res.json()),
    ])
      .then(([songsData, playlistsData, fetchedPartyData]) => {
        setPlaylists(playlistsData);
        setPartyData(fetchedPartyData);

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

  // CRUD methods
  const addSong = async (newSongData) => {
    try {
      const response = await fetch('/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSongData),
      });
      const newSong = await response.json();
      setSongs((prevSongs) => [...prevSongs, newSong]);

      if (newSongData.playlist_id) {
        const partyResponse = await fetch('/party', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            explicit: newSongData.explicit,
            song_id: newSong.id,
            playlist_id: newSongData.playlist_id,
          }),
        });

        const newPartyData = await partyResponse.json();
        setPartyData((prev) => [...prev, newPartyData]);
      }
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const updateSong = async (songId, updatedData) => {
    try {
      const response = await fetch(`/songs/${songId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const updatedSong = await response.json();
      setSongs((prevSongs) =>
        prevSongs.map((s) => (s.id === updatedSong.id ? updatedSong : s))
      );

      const partyEntry = partyData.find((p) => p.song_id === updatedSong.id);
      if (partyEntry) {
        const partyResponse = await fetch(`/party/${partyEntry.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            explicit: updatedData.explicit,
            playlist_id: updatedData.playlist_id,
          }),
        });

        const updatedPartyData = await partyResponse.json();
        setPartyData((prev) =>
          prev.map((item) => (item.song_id === updatedPartyData.song_id ? updatedPartyData : item))
        );
      }
    } catch (error) {
      console.error('Error updating song:', error);
    }
  };

  const deleteSong = async (songId) => {
    try {
      const response = await fetch(`/songs/${songId}`, { method: 'DELETE' });
      if (response.ok) {
        setSongs((prev) => prev.filter((song) => song.id !== songId));
        setPartyData((prev) => prev.filter((party) => party.song_id !== songId));
      }
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        songs,
        playlists,
        partyData,
        addSong,
        updateSong,
        deleteSong,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
