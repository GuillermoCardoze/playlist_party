import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function SongForm({ songs, playlists, setSongs, deleteSong, setPartyData, partyData }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the song and associated partyData if not adding a new one (id !== 'new')
  const song = id !== 'new' ? songs.find((s) => s.id === parseInt(id)) : null;
  const partyInfo = song ? partyData.find((p) => p.song_id === song.id) : null; // Find the associated partyData

  // Redirect if trying to edit a song that doesn't exist
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
      explicit: partyInfo?.explicit || false, 
      playlist_id: partyInfo?.playlist_id || '', 
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
            duration: formattedDuration,
          }),
        })
          .then((response) => response.json())
          .then((newSong) => {
            setSongs((prevSongs) => [...prevSongs, newSong]);
  
            // Now post to /party with the new song_id
            fetch('/party', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                explicit: values.explicit,
                song_id: newSong.id,  
                playlist_id: values.playlist_id,  
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log('Playlist song created:', data);
                
                setPartyData((prevPartyData) => [...prevPartyData, data]);
                navigate('/songs');
              })
              .catch((error) => {
                console.error('Error adding song to party:', error);
              });
          })
          .catch((error) => {
            console.error('Error adding song:', error);
          });
      } else if (song) {
        // Edit existing song
        fetch(`/songs/${song.id}`, {
          method: 'PATCH',
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
  
            // Post to /party with the updated song_id
            fetch(`/party/${partyInfo.id}`, {  
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                explicit: values.explicit,
                song_id: updatedSong.id,  
                playlist_id: values.playlist_id,  
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log('Playlist song updated:', data);
                setPartyData((prevPartyData) => 
                  prevPartyData.map((item) => (item.song_id === data.song_id ? data : item))
                );
                navigate('/songs');
              })
              .catch((error) => {
                console.error('Error updating song in party:', error);
              });
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
