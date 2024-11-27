import React from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";

function PlaylistForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const playlistData = location.state || {}; // Retrieve passed playlist data or use an empty object

  // Validation Schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Playlist name is required"),
    description: Yup.string()
      .max(500, "Description must be 500 characters or less")
      .required("Description is required"),
  });

  // Initial form values
  const initialValues = {
    name: playlistData.name || "",
    description: playlistData.description || "",
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const method = playlistData.id ? "PATCH" : "POST";
      const url = playlistData.id ? `/playlists/${playlistData.id}` : "/playlists";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        resetForm();
        navigate("/playlists"); // Redirect back to the playlist list
      } else {
        throw new Error(
          `Failed to ${playlistData.id ? "update" : "add"} the playlist.`
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleSubmit, handleBlur }) => (
        <form onSubmit={handleSubmit}>
          <h1>{playlistData.id ? "Update Playlist" : "Create a New Playlist"}</h1>

          {/* Name Field */}
          <div>
            <label htmlFor="name">Playlist Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Playlist Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="name" component="div" style={{ color: "red" }} />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              placeholder="Playlist Description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="description" component="div" style={{ color: "red" }} />
          </div>

          {/* Submit Button */}
          <button type="submit">{playlistData.id ? "Update Playlist" : "Create Playlist"}</button>
        </form>
      )}
    </Formik>
  );
}

export default PlaylistForm;
