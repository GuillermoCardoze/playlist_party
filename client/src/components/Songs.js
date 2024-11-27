// import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// function Songs() {
//   const [songs, setSongs] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editingSong, setEditingSong] = useState(null);
//   const [partyData, setPartyData] = useState([]);



  
//   useEffect(() => {
//     // Fetch all songs
//     fetch('/songs')
//       .then((res) => res.json())
//       .then((data) => setSongs(data))
//       .catch((err) => console.error('Error fetching songs:', err));
  
//     // Fetch party data
//     fetch('/party')
//       .then((res) => res.json())
//       .then((data) => setPartyData(data))
//       .catch((err) => console.error('Error fetching party data:', err));
//   }, []);
  
//   // Formik for handling form submission
//   const formik = useFormik({
//     initialValues: {
//       title: '',
//       artist: '',
//       genre: '',
//       duration: '',
//       explicit: false,
//     },
//     validationSchema: Yup.object({
//       title: Yup.string().required('Title is required'),
//       artist: Yup.string().required('Artist is required'),
//       genre: Yup.string().required('Genre is required'),
//       duration: Yup.string().required('Duration is required'),
//       explicit: Yup.boolean(),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const songData = {
//           title: values.title,
//           artist: values.artist,
//           genre: values.genre,
//           duration: values.duration,
//           explicit: values.explicit, // Include explicit in the song data
//         };
  
//         if (editingSong) {
//           // Update song (PATCH)
//           const response = await fetch(`/songs/${editingSong.id}`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(songData),
//           });
  
//           if (response.ok) {
//             const updatedSong = await response.json();
//             setSongs((prev) =>
//               prev.map((song) =>
//                 song.id === updatedSong.id ? updatedSong : song
//               )
//             );
//             // Also update the /party route with explicit value
//             await fetch(`/party/${editingSong.id}`, {
//               method: 'PATCH',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ explicit: values.explicit }),
//             });
//             setEditingSong(null);
//             resetForm();
//           } else {
//             throw new Error('Failed to update song');
//           }
//         } else {
//           // Add new song (POST)
//           const response = await fetch('/songs', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(songData),
//           });
  
//           if (response.ok) {
//             const newSong = await response.json();
//             setSongs((prev) => [...prev, newSong]);
  
//             // Add to /party route with explicit value
//             await fetch('/party', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ song_id: newSong.id, explicit: values.explicit }),
//             });
  
//             resetForm();
//           } else {
//             throw new Error('Failed to add song');
//           }
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     },
//   });
  

//   // Handle deleting a song
//   const handleDelete = async (songId) => {
//     try {
//       const response = await fetch(`/songs/${songId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
//         console.log('Song deleted successfully');
//       } else {
//         throw new Error('Failed to delete the song.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // Handle edit button
//   const handleEdit = (song) => {
//     setEditingSong(song);
//     formik.setValues({
//       title: song.title,
//       artist: song.artist,
//       genre: song.genre,
//       duration: song.duration,
//       explicit: song.explicit, // Set the value for explicit
//     });
//   };

//   // Filter songs based on search query
//   const filteredSongs = songs.filter((song) =>
//     [song.title, song.artist, song.genre]
//       .join(' ')
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div>
//       <h2>Songs</h2>

//       <input
//         type="text"
//         placeholder="Search songs..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         style={{
//           padding: '10px',
//           marginBottom: '20px',
//           width: '100%',
//           maxWidth: '400px',
//           borderRadius: '5px',
//           border: '1px solid #ccc',
//         }}
//       />

//       <form onSubmit={formik.handleSubmit} style={{ marginBottom: '20px' }}>
//         <h3>{editingSong ? 'Edit Song' : 'Add Song'}</h3>

//         <div>
//           <input
//             type="text"
//             name="title"
//             placeholder="Song Title"
//             value={formik.values.title}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             style={{
//               padding: '10px',
//               marginBottom: '10px',
//               width: '100%',
//               maxWidth: '400px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//             }}
//           />
//           {formik.touched.title && formik.errors.title && (
//             <p style={{ color: 'red' }}>{formik.errors.title}</p>
//           )}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="artist"
//             placeholder="Artist"
//             value={formik.values.artist}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             style={{
//               padding: '10px',
//               marginBottom: '10px',
//               width: '100%',
//               maxWidth: '400px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//             }}
//           />
//           {formik.touched.artist && formik.errors.artist && (
//             <p style={{ color: 'red' }}>{formik.errors.artist}</p>
//           )}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="genre"
//             placeholder="Genre"
//             value={formik.values.genre}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             style={{
//               padding: '10px',
//               marginBottom: '10px',
//               width: '100%',
//               maxWidth: '400px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//             }}
//           />
//           {formik.touched.genre && formik.errors.genre && (
//             <p style={{ color: 'red' }}>{formik.errors.genre}</p>
//           )}
//         </div>

//         <div>
//           <input
//             type="text"
//             name="duration"
//             placeholder="Duration"
//             value={formik.values.duration}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             style={{
//               padding: '10px',
//               marginBottom: '10px',
//               width: '100%',
//               maxWidth: '400px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//             }}
//           />
//           {formik.touched.duration && formik.errors.duration && (
//             <p style={{ color: 'red' }}>{formik.errors.duration}</p>
//           )}
//         </div>

//         <div>
//           <label style={{ marginRight: '10px' }}>
//             <input
//               type="checkbox"
//               name="explicit"
//               checked={formik.values.explicit}
//               onChange={formik.handleChange}
//             />
//             Explicit
//           </label>
//         </div>

//         <button
//           type="submit"
//           style={{
//             padding: '10px',
//             marginBottom: '10px',
//             width: '100%',
//             maxWidth: '200px',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             cursor: 'pointer',
//           }}
//         >
//           {editingSong ? 'Update Song' : 'Add Song'}
//         </button>

//         {editingSong && (
//           <button
//             type="button"
//             onClick={() => {
//               setEditingSong(null);
//               formik.resetForm();
//             }}
//             style={{
//               padding: '10px',
//               marginBottom: '10px',
//               width: '100%',
//               maxWidth: '200px',
//               borderRadius: '5px',
//               border: '1px solid #ccc',
//               backgroundColor: '#f44336',
//               color: 'white',
//               cursor: 'pointer',
//             }}
//           >
//             Cancel Edit
//           </button>
//         )}
//       </form>

//       {filteredSongs.length === 0 ? (
//         <p>No songs found</p>
//       ) : (
//         <ol>
// {filteredSongs.map((song) => {
//     // Find the explicit value from partyData using the song ID
//     const partyEntry = partyData.find((entry) => entry.song_id === song.id);
//     const isExplicit = partyEntry ? partyEntry.explicit : false; // Default to false if no match

//     return (
//       <li key={song.id}>
//         <div>
//           <strong>Title:</strong> {song.title}
//           <br />
//           <strong>Artist:</strong> {song.artist}
//           <br />
//           <strong>Genre:</strong> {song.genre}
//           <br />
//           <strong>Duration:</strong> {song.duration} mins
//           <br />
//           <strong>Explicit:</strong> {isExplicit ? 'Yes' : 'No'}
//         </div>
//         <button
//           onClick={() => handleEdit(song)}
//           style={{
//             padding: '5px 10px',
//             margin: '5px',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//             backgroundColor: '#2196F3',
//             color: 'white',
//             cursor: 'pointer',
//           }}
//         >
//           Update Song
//         </button>
//         <button
//           onClick={() => handleDelete(song.id)}
//           style={{
//             padding: '5px 10px',
//             margin: '5px',
//             borderRadius: '5px',
//             border: '1px solid #ccc',
//             backgroundColor: '#f44336',
//             color: 'white',
//             cursor: 'pointer',
//           }}
//         >
//           Delete Song
//         </button>
//       </li>
//     );
//   })}        </ol>
//       )}
//     </div>
//   );
// }

// export default Songs;







import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Songs() {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [editingSong, setEditingSong] = useState(null);

  // Fetch songs, playlists, and party info on component mount
  useEffect(() => {
    // Fetch songs, playlists, and party data in parallel
    Promise.all([
      fetch('/songs').then((res) => res.json()),
      fetch('/playlists').then((res) => res.json()),
      fetch('/party').then((res) => res.json())  // Party data should contain song_id, playlist_id, explicit
    ])
      .then(([songsData, playlistsData, partyData]) => {
        // Set playlists first
        setPlaylists(playlistsData);

        // Merge party data with songs data
        const updatedSongs = songsData.map((song) => {
          const partyDataForSong = partyData.find((party) => party.song_id === song.id);
          return {
            ...song,
            playlist_id: partyDataForSong?.playlist_id || null,
            explicit: partyDataForSong?.explicit || false,
          };
        });

        // Set merged songs data
        setSongs(updatedSongs);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  // Formik setup for handling song form submission
  const formik = useFormik({
    initialValues: {
      title: '',
      artist: '',
      genre: '',
      duration: '',
      playlist_id: '',  // To store the selected playlist
      explicit: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      artist: Yup.string().required('Artist is required'),
      genre: Yup.string().required('Genre is required'),
      duration: Yup.string().required('Duration is required'),
      playlist_id: Yup.string().required('Playlist is required'),
      explicit: Yup.boolean(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const songData = {
          title: values.title,
          artist: values.artist,
          genre: values.genre,
          duration: values.duration,
          explicit: values.explicit,
        };

        let newSong;
        if (editingSong) {
          // Update song (PATCH)
          const response = await fetch(`/songs/${editingSong.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(songData),
          });

          if (response.ok) {
            newSong = await response.json();
            // Update the /party route to associate the song with a playlist and update explicit
            await fetch(`/party/${editingSong.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ playlist_id: values.playlist_id, explicit: values.explicit }),
            });

            // After successful update, refetch the songs and party data
            const updatedSongs = await fetch('/songs').then((res) => res.json());
            const updatedPartyData = await fetch('/party').then((res) => res.json());

            // Update the songs state with the updated data
            const updatedSongsWithPlaylist = updatedSongs.map((song) => {
              const partyDataForSong = updatedPartyData.find((party) => party.song_id === song.id);
              return {
                ...song,
                playlist_id: partyDataForSong?.playlist_id || null,
                explicit: partyDataForSong?.explicit || false,
              };
            });

            setSongs(updatedSongsWithPlaylist);
            setEditingSong(null);
            resetForm();
          }
        } else {
          // Add new song (POST)
          const response = await fetch('/songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(songData),
          });

          if (response.ok) {
            newSong = await response.json();
            // Add to /party route to associate the song with a playlist
            await fetch('/party', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ song_id: newSong.id, playlist_id: values.playlist_id, explicit: values.explicit }),
            });

            // After adding a new song, refetch the songs and party data
            const updatedSongs = await fetch('/songs').then((res) => res.json());
            const updatedPartyData = await fetch('/party').then((res) => res.json());

            // Update the songs state with the new song and playlist_id
            const updatedSongsWithPlaylist = updatedSongs.map((song) => {
              const partyDataForSong = updatedPartyData.find((party) => party.song_id === song.id);
              return {
                ...song,
                playlist_id: partyDataForSong?.playlist_id || null,
                explicit: partyDataForSong?.explicit || false,
              };
            });

            setSongs(updatedSongsWithPlaylist);
            resetForm();
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  // Handle delete action
  const handleDelete = async (songId) => {
    try {
      const response = await fetch(`/songs/${songId}`, { method: 'DELETE' });

      if (response.ok) {
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle edit action
  const handleEdit = (song) => {
    setEditingSong(song);
    formik.setValues({
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      duration: song.duration,
      explicit: song.explicit,
      playlist_id: song.playlist_id,  // Assuming the song has a playlist_id
    });
  };

  return (
    <div>
      <h2>Songs</h2>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Song Title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="artist"
            placeholder="Artist"
            value={formik.values.artist}
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formik.values.genre}
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formik.values.duration}
            onChange={formik.handleChange}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="explicit"
              checked={formik.values.explicit}
              onChange={formik.handleChange}
            />
            Explicit
          </label>
        </div>
        <div>
          <select
            name="playlist_id"
            value={formik.values.playlist_id}
            onChange={formik.handleChange}
          >
            <option value="">Select Playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">
          {editingSong ? 'Update Song' : 'Add Song'}
        </button>
      </form>

      <h3>Song List</h3>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <div>
              <strong>Title:</strong> {song.title}
              <br />
              <strong>Artist:</strong> {song.artist}
              <br />
              <strong>Genre:</strong> {song.genre}
              <br />
              <strong>Duration:</strong> {song.duration} mins
              <br />
              <strong>Explicit:</strong> {song.explicit ? 'Yes' : 'No'}
              <br />
              <strong>Playlist:</strong> {playlists.find(playlist => playlist.id === song.playlist_id)?.name || 'N/A'}
            </div>
            <button onClick={() => handleEdit(song)}>Edit</button>
            <button onClick={() => handleDelete(song.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Songs;
