import { createContext, useEffect, useState } from 'react'

export const AppContext = createContext();


export const AppProvider = ({ children }) =>{
      const [songs, setSongs] = useState([]);
      const [playlists, setPlaylists] = useState([]);
      const [partyData, setPartyData] = useState([]); 
    
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
        <AppContext.Provider
        value={{
            songs,
            setSongs,
            playlists,
            setPlaylists,
            partyData,
            setPartyData,
            deleteSong
        }}
        >
            {children}
        </AppContext.Provider>
      );
    }

export default AppProvider