import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  

  // Fetch playlists from the backend on mount
  useEffect(() => {
    fetch('/playlists')
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch((err) => console.error('Error fetching playlists:', err));
  }, []);

  // Formik for handling form submission
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingPlaylist) {
          // Update playlist (PATCH)
          const response = await fetch(`/playlists/${editingPlaylist.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            const updatedPlaylist = await response.json();
            setPlaylists((prev) =>
              prev.map((playlist) =>
                playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
              )
            );
            setEditingPlaylist(null);
            resetForm();
          } else {
            throw new Error('Failed to update playlist');
          }
        } else {
          // Add new playlist (POST)
          const response = await fetch('/playlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            const newPlaylist = await response.json();
            setPlaylists((prev) => [...prev, newPlaylist]);
            resetForm();
          } else {
            throw new Error('Failed to add playlist');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  // Handle deleting a playlist
  const handleDelete = async (playlistId) => {
    try {
      const response = await fetch(`/playlists/${playlistId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist.id !== playlistId));
        console.log("Playlist deleted successfully");
      } else {
        throw new Error("Failed to delete the playlist.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  // Handle edit button
  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    formik.setValues({
      name: playlist.name,
      description: playlist.description,
    });
  };

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter((playlist) =>
    [playlist.name, playlist.description]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Playlists</h2>

      <input
        type="text"
        placeholder="Search playlists..."
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
        <h3>{editingPlaylist ? 'Edit Playlist' : 'Add Playlist'}</h3>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Playlist Name"
            value={formik.values.name}
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
          {formik.touched.name && formik.errors.name && (
            <p style={{ color: 'red' }}>{formik.errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="description"
            placeholder="Playlist Description"
            value={formik.values.description}
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
          {formik.touched.description && formik.errors.description && (
            <p style={{ color: 'red' }}>{formik.errors.description}</p>
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
          {editingPlaylist ? 'Update Playlist' : 'Add Playlist'}
        </button>

        {editingPlaylist && (
          <button
            type="button"
            onClick={() => {
              setEditingPlaylist(null);
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

      {filteredPlaylists.length === 0 ? (
        <p>No playlists found</p>
      ) : (
        <ol>
          {filteredPlaylists.map((playlist) => (
            <li key={playlist.id}>
              <div>
                <strong>Name:</strong> {playlist.name}
                <br />
                <strong>Description:</strong> {playlist.description}
              </div>
              <button
                onClick={() => handleEdit(playlist)}
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
                Update Playlist
              </button>
              <button
                onClick={() => handleDelete(playlist.id)}
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
                Delete Playlist
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Playlists;
