// import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// function Songs() {
//   const [songs, setSongs] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [editingSong, setEditingSong] = useState(null);

//   // Fetch songs, playlists, and party info on component mount
//   useEffect(() => {
//     // Fetch songs, playlists, and party data in parallel
//     Promise.all([
//       fetch('/songs').then((res) => res.json()),
//       fetch('/playlists').then((res) => res.json()),
//       fetch('/party').then((res) => res.json())  // Party data should contain song_id, playlist_id, explicit
//     ])
//       .then(([songsData, playlistsData, partyData]) => {
//         // Set playlists first
//         setPlaylists(playlistsData);

//         // Merge party data with songs data
//         const updatedSongs = songsData.map((song) => {
//           const partyDataForSong = partyData.find((party) => party.song_id === song.id);
//           return {
//             ...song,
//             playlist_id: partyDataForSong?.playlist_id || null,
//             explicit: partyDataForSong?.explicit || false,
//           };
//         });

//         // Set merged songs data
//         setSongs(updatedSongs);
//       })
//       .catch((err) => console.error('Error fetching data:', err));
//   }, []);

//   // Formik setup for handling song form submission
//   const formik = useFormik({
//     initialValues: {
//       title: '',
//       artist: '',
//       genre: '',
//       duration: '',
//       playlist_id: '',  // To store the selected playlist
//       explicit: false,
//     },
//     validationSchema: Yup.object({
//       title: Yup.string().required('Title is required'),
//       artist: Yup.string().required('Artist is required'),
//       genre: Yup.string().required('Genre is required'),
//       duration: Yup.string().required('Duration is required'),
//       playlist_id: Yup.string().required('Playlist is required'),
//       explicit: Yup.boolean(),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const songData = {
//           title: values.title,
//           artist: values.artist,
//           genre: values.genre,
//           duration: values.duration,
//           explicit: values.explicit,
//         };

//         let newSong;
//         if (editingSong) {
//           // Update song (PATCH)
//           const response = await fetch(`/songs/${editingSong.id}`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(songData),
//           });

//           if (response.ok) {
//             newSong = await response.json();
//             // Update the /party route to associate the song with a playlist and update explicit
//             await fetch(`/party/${editingSong.id}`, {
//               method: 'PATCH',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ playlist_id: values.playlist_id, explicit: values.explicit }),
//             });

//             // After successful update, refetch the songs and party data
//             const updatedSongs = await fetch('/songs').then((res) => res.json());
//             const updatedPartyData = await fetch('/party').then((res) => res.json());

//             // Update the songs state with the updated data
//             const updatedSongsWithPlaylist = updatedSongs.map((song) => {
//               const partyDataForSong = updatedPartyData.find((party) => party.song_id === song.id);
//               return {
//                 ...song,
//                 playlist_id: partyDataForSong?.playlist_id || null,
//                 explicit: partyDataForSong?.explicit || false,
//               };
//             });

//             setSongs(updatedSongsWithPlaylist);
//             setEditingSong(null);
//             resetForm();
//           }
//         } else {
//           // Add new song (POST)
//           const response = await fetch('/songs', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(songData),
//           });

//           if (response.ok) {
//             newSong = await response.json();
//             // Add to /party route to associate the song with a playlist
//             await fetch('/party', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ song_id: newSong.id, playlist_id: values.playlist_id, explicit: values.explicit }),
//             });

//             // After adding a new song, refetch the songs and party data
//             const updatedSongs = await fetch('/songs').then((res) => res.json());
//             const updatedPartyData = await fetch('/party').then((res) => res.json());

//             // Update the songs state with the new song and playlist_id
//             const updatedSongsWithPlaylist = updatedSongs.map((song) => {
//               const partyDataForSong = updatedPartyData.find((party) => party.song_id === song.id);
//               return {
//                 ...song,
//                 playlist_id: partyDataForSong?.playlist_id || null,
//                 explicit: partyDataForSong?.explicit || false,
//               };
//             });

//             setSongs(updatedSongsWithPlaylist);
//             resetForm();
//           }
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     },
//   });

//   // Handle delete action
//   const handleDelete = async (songId) => {
//     try {
//       const response = await fetch(`/songs/${songId}`, { method: 'DELETE' });

//       if (response.ok) {
//         setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Handle edit action
//   const handleEdit = (song) => {
//     setEditingSong(song);
//     formik.setValues({
//       title: song.title,
//       artist: song.artist,
//       genre: song.genre,
//       duration: song.duration,
//       explicit: song.explicit,
//       playlist_id: song.playlist_id,  // Assuming the song has a playlist_id
//     });
//   };

//   return (
//     <div>
//       <h2>Songs</h2>

//       <form onSubmit={formik.handleSubmit}>
//         <div>
//           <input
//             type="text"
//             name="title"
//             placeholder="Song Title"
//             value={formik.values.title}
//             onChange={formik.handleChange}
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             name="artist"
//             placeholder="Artist"
//             value={formik.values.artist}
//             onChange={formik.handleChange}
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             name="genre"
//             placeholder="Genre"
//             value={formik.values.genre}
//             onChange={formik.handleChange}
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             name="duration"
//             placeholder="Duration"
//             value={formik.values.duration}
//             onChange={formik.handleChange}
//           />
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               name="explicit"
//               checked={formik.values.explicit}
//               onChange={formik.handleChange}
//             />
//             Explicit
//           </label>
//         </div>
//         <div>
//           <select
//             name="playlist_id"
//             value={formik.values.playlist_id}
//             onChange={formik.handleChange}
//           >
//             <option value="">Select Playlist</option>
//             {playlists.map((playlist) => (
//               <option key={playlist.id} value={playlist.id}>
//                 {playlist.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button type="submit">
//           {editingSong ? 'Update Song' : 'Add Song'}
//         </button>
//       </form>

//       <h3>Song List</h3>
//       <ul>
//         {songs.map((song) => (
//           <li key={song.id}>
//             <div>
//               <strong>Title:</strong> {song.title}
//               <br />
//               <strong>Artist:</strong> {song.artist}
//               <br />
//               <strong>Genre:</strong> {song.genre}
//               <br />
//               <strong>Duration:</strong> {song.duration} mins
//               <br />
//               <strong>Explicit:</strong> {song.explicit ? 'Yes' : 'No'}
//               <br />
//               <strong>Playlist:</strong> {playlists.find(playlist => playlist.id === song.playlist_id)?.name || 'N/A'}
//             </div>
//             <button onClick={() => handleEdit(song)}>Edit</button>
//             <button onClick={() => handleDelete(song.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Songs;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Songs({ songs, setSongs }) {
  const formik = useFormik({
    initialValues: {
      title: '',
      artist: '',
      genre: '',
      duration: '',  // Duration in MM:SS format
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      artist: Yup.string().required('Artist is required'),
      genre: Yup.string().required('Genre is required'),
      duration: Yup.string()
        .matches(/^\d{1,2}:\d{2}$/, 'Duration must be in MM:SS format')
        .required('Duration is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // Convert duration to minutes and seconds
        const [minutes, seconds] = values.duration.split(':').map(Number);
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Submit new song to the API
        const response = await fetch('/songs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            duration: formattedDuration,  // Send formatted duration
          }),
        });

        if (response.ok) {
          const newSong = await response.json();
          setSongs((prevSongs) => [...prevSongs, newSong]);
          resetForm();  // Clear the form fields
        } else {
          console.error('Failed to add song');
        }
      } catch (error) {
        console.error('Error adding song:', error);
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Song Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="error">{formik.errors.title}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            name="artist"
            placeholder="Artist"
            value={formik.values.artist}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.artist && formik.errors.artist ? (
            <div className="error">{formik.errors.artist}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formik.values.genre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.genre && formik.errors.genre ? (
            <div className="error">{formik.errors.genre}</div>
          ) : null}
        </div>
        <div>
          <input
            type="text"
            name="duration"
            placeholder="Duration (MM:SS)"
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.duration && formik.errors.duration ? (
            <div className="error">{formik.errors.duration}</div>
          ) : null}
        </div>
        <button type="submit">Add Song</button>
      </form>
      <ul className="cards">
        {songs.map((song) => (
          <div className="card" key={song.id}>
            <strong>Title:</strong> {song.title}
            <br />
            <strong>Artist:</strong> {song.artist}
            <br />
            <strong>Genre:</strong> {song.genre}
            <br />
            <strong>Duration:</strong> {song.duration}
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Songs;
