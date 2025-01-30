import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppContext } from './AppContext';

function SongForm() {
  const { songs, playlists, addSong, updateSong, deleteSong } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // Find song by id if editing, or set to null for a new song
  const song = id !== 'new' ? songs.find((s) => s.id === parseInt(id)) : null;

  // Redirect if editing a non-existent song
  useEffect(() => {
    if (id !== 'new' && !song) {
      navigate('/songs');
    }
  }, [song, id, navigate]);

  const formik = useFormik({
    initialValues: {
      title: song?.title || '',
      artist: song?.artist || '',
      genre: song?.genre || '',
      duration: song?.duration || '',
      explicit: song?.explicit || false,
      playlist_id: song?.playlist_id || '',
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
      if (id === 'new') {
        // Add new song
        addSong(values).then(() => navigate('/songs'));
      } else {
        // Update existing song
        updateSong(song.id, values).then(() => navigate('/songs'));
      }
    },
  });

  // If there's no song found and this isn't a new entry, don't show the form
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
          {formik.touched.title && formik.errors.title && (
            <div style={{ color: 'red' }}>{formik.errors.title}</div>
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
          />
          {formik.touched.artist && formik.errors.artist && (
            <div style={{ color: 'red' }}>{formik.errors.artist}</div>
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
          />
          {formik.touched.genre && formik.errors.genre && (
            <div style={{ color: 'red' }}>{formik.errors.genre}</div>
          )}
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
          {formik.touched.duration && formik.errors.duration && (
            <div style={{ color: 'red' }}>{formik.errors.duration}</div>
          )}
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
          <label>
            Playlist:
            <select
              name="playlist_id"
              value={formik.values.playlist_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" label="Select a playlist" />
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </label>
          {formik.touched.playlist_id && formik.errors.playlist_id && (
            <div style={{ color: 'red' }}>{formik.errors.playlist_id}</div>
          )}
        </div>
        <button type="submit">{id === 'new' ? 'Add Song' : 'Save Changes'}</button>
      </form>

      {id !== 'new' && (
        <button onClick={() => deleteSong(song.id)}>Delete Song</button>
      )}
    </div>
  );
}

export default SongForm;
