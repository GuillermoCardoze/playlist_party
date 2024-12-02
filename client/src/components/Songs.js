import React from 'react';
import { Link } from 'react-router-dom';

function Songs({ songs, playlists, setSongs, deleteSong, partyData }) {

  return (
    <div>
      <h2>Song List</h2>

      <ol className="cards">
        {songs.map((song) => {
          // Find the partyData entry for this song to get playlist_id and explicit
          const partyInfo = partyData.find((party) => party.song_id === song.id);
          const playlistId = partyInfo ? partyInfo.playlist_id : null;
          const explicit = partyInfo ? partyInfo.explicit : false;

          // Find the playlist associated with this song using playlistId
          const playlist = playlists.find((playlist) => playlist.id === playlistId);

          return (
            <div className="card" key={song.id}>
              <li>
                <strong>Title:</strong> {song.title}
                <br />
                <strong>Artist:</strong> {song.artist}
                <br />
                <strong>Genre:</strong> {song.genre}
                <br />
                <strong>Duration:</strong> {song.duration}
                <br />
                <strong>Explicit:</strong> {explicit ? 'Yes' : 'No'}
                <br />
                {/* Display Playlist name and description */}
                <strong>Playlist Name:</strong> {playlist ? playlist.name : 'No Playlist'}
                <br />
                <strong>Playlist Description:</strong> {playlist ? playlist.description : 'No Description'}
                <br />
                <Link to={`/edit-song/${song.id}`}>
                  <button>Edit</button>
                </Link>
                {/* Delete button */}
                <button onClick={() => deleteSong(song.id)}>Delete</button>
              </li>
            </div>
          );
        })}
      </ol>
    </div>
  );
}

export default Songs;
