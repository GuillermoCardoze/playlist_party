import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SongForm({ songs, playlists, setSongs, deleteSong }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the song if not adding a new one (id !== 'new')
  const song = id !== 'new' ? songs.find((s) => s.id === parseInt(id)) : null;

  // Redirect if trying to edit a song that doesn't exist
  useEffect(() => {
    if (id !== 'new' && !song) {
      navigate('/songs'); // If no song is found, redirect to the songs list
    }
  }, [song, id, navigate]);

  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      title: song?.title || '',
      artist: song?.artist || '',
      genre: song?.genre || '',
      duration: song?.duration || '',  // Duration in MM:SS format
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      artist: Yup.string().required('Artist is required'),
      genre: Yup.string().required('Genre is required'),
      duration: Yup.string()
        .matches(/^\d{1,2}:\d{2}$/, 'Duration must be in MM:SS format')
        .required('Duration is required'),
    }),
    onSubmit: (values) => {
      const [minutes, seconds] = values.duration.split(':').map(Number);
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      if (id === 'new') {
        // Create new song
        fetch('/songs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            duration: formattedDuration,  // Ensure duration is in MM:SS format
          }),
        })
          .then((response) => response.json())
          .then((newSong) => {
            setSongs((prevSongs) => [...prevSongs, newSong]);
            navigate('/songs');  // Navigate back to the songs list
          })
          .catch((error) => {
            console.error('Error adding song:', error);
          });
      } else if (song) {
        fetch(`/songs/${song.id}`, {
            method: 'PATCH',  // Use PATCH to partially update the song
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...values,
              duration: formattedDuration,
            }),
          })
          .then((response) => response.json())
          .then((updatedSong) => {
            setSongs((prevSongs) =>
              prevSongs.map((s) => (s.id === updatedSong.id ? updatedSong : s))
            );
            navigate('/songs');  // Navigate back to the songs list
          })
          .catch((error) => {
            console.error('Error updating song:', error);
          });
      }
    },
  });

  // If there's no song and we're not adding a new one, don't render the form
  if (!song && id !== 'new') return null;

  return (
    <div>
      <h2>{id === 'new' ? 'Add New Song' : 'Edit Song'}</h2>
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
          {formik.touched.title && formik.errors.title && <div>{formik.errors.title}</div>}
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
          {formik.touched.artist && formik.errors.artist && <div>{formik.errors.artist}</div>}
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
          {formik.touched.genre && formik.errors.genre && <div>{formik.errors.genre}</div>}
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
          {formik.touched.duration && formik.errors.duration && <div>{formik.errors.duration}</div>}
        </div>
        <button type="submit">{id === 'new' ? 'Add Song' : 'Save Changes'}</button>
      </form>

      {/* Delete Button (only visible when editing an existing song) */}
      {id !== 'new' && (
        <button onClick={() => deleteSong(song.id)}>Delete Song</button>
      )}
    </div>
  );
}

export default SongForm;
