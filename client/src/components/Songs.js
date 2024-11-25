import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Songs() {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSong, setEditingSong] = useState(null);

  // Fetch songs from the backend on mount
  useEffect(() => {
    fetch('/songs')
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error('Error fetching songs:', err));
  }, []);

  // Formik for handling form submission
  const formik = useFormik({
    initialValues: {
      title: '',
      artist: '',
      genre: '',
      duration: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      artist: Yup.string().required('Artist is required'),
      genre: Yup.string().required('Genre is required'),
      duration: Yup.string().required('Duration is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingSong) {
          // Update song (PATCH)
          const response = await fetch(`/songs/${editingSong.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            const updatedSong = await response.json();
            setSongs((prev) =>
              prev.map((song) =>
                song.id === updatedSong.id ? updatedSong : song
              )
            );
            setEditingSong(null);
            resetForm();
          } else {
            throw new Error('Failed to update song');
          }
        } else {
          // Add new song (POST)
          const response = await fetch('/songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            const newSong = await response.json();
            setSongs((prev) => [...prev, newSong]);
            resetForm();
          } else {
            throw new Error('Failed to add song');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  // Handle deleting a song
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
  
  // Handle edit button
  const handleEdit = (song) => {
    setEditingSong(song);
    formik.setValues({
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      duration: song.duration,
    });
  };

  // Filter songs based on search query
  const filteredSongs = songs.filter((song) =>
    [song.title, song.artist, song.genre]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Songs</h2>

      <input
        type="text"
        placeholder="Search songs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />

      <form onSubmit={formik.handleSubmit} style={{ marginBottom: '20px' }}>
        <h3>{editingSong ? 'Edit Song' : 'Add Song'}</h3>

        <div>
          <input
            type="text"
            name="title"
            placeholder="Song Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          {formik.touched.title && formik.errors.title && (
            <p style={{ color: 'red' }}>{formik.errors.title}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="artist"
            placeholder="Artist"
            value={formik.values.artist}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          {formik.touched.artist && formik.errors.artist && (
            <p style={{ color: 'red' }}>{formik.errors.artist}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formik.values.genre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          {formik.touched.genre && formik.errors.genre && (
            <p style={{ color: 'red' }}>{formik.errors.genre}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          {formik.touched.duration && formik.errors.duration && (
            <p style={{ color: 'red' }}>{formik.errors.duration}</p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: '10px',
            marginBottom: '10px',
            width: '100%',
            maxWidth: '200px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {editingSong ? 'Update Song' : 'Add Song'}
        </button>

        {editingSong && (
          <button
            type="button"
            onClick={() => {
              setEditingSong(null);
              formik.resetForm();
            }}
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              maxWidth: '200px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#f44336',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {filteredSongs.length === 0 ? (
        <p>No songs found</p>
      ) : (
        <ol>
          {filteredSongs.map((song) => (
            <li key={song.id}>
              <div>
                <strong>Title:</strong> {song.title}
                <br />
                <strong>Artist:</strong> {song.artist}
                <br />
                <strong>Genre:</strong> {song.genre}
                <br />
                <strong>Duration:</strong> {song.duration} mins
              </div>
              <button
                onClick={() => handleEdit(song)}
                style={{
                  padding: '5px 10px',
                  margin: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Update Song
              </button>
              <button
                onClick={() => handleDelete(song.id)}
                style={{
                  padding: '5px 10px',
                  margin: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#f44336',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Delete Song
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Songs;

