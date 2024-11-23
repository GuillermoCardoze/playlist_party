import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Songs() {
  const [searchSong, setSearchSong] = useState("");
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  // Fetch songs from the API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/songs");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  // Filtered songs based on search input
  const filteredSongs = songs.filter((song) => {
    return (
      song.title.toLowerCase().includes(searchSong.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchSong.toLowerCase()) ||
      song.duration.toLowerCase().includes(searchSong.toLowerCase())
    );
  });

  const handleGoToForm = () => {
    navigate("/form");
  };

  const handleUpdateSong = (song) => {
    navigate("/form", { state: song }); // Pass song data as state
  };

  const handleDelete = async (songId) => {
    try {
      const response = await fetch(`/songs/${songId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
        console.log("Song deleted successfully");
      } else {
        throw new Error("Failed to delete the song.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Song List</h2>

      <input
        className="search-song"
        type="text"
        placeholder="Search by song title or artist..."
        value={searchSong}
        onChange={(e) => setSearchSong(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <br />

      <button
        onClick={handleGoToForm}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "20%",
          maxWidth: "400px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        Add Song
      </button>

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
                <button onClick={() => handleUpdateSong(song)}>Update Song</button>
                <button onClick={() => handleDelete(song.id)}>Delete Song</button>
                <br />
                <br />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Songs;
