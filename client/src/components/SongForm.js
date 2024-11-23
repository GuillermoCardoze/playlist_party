import React from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";

function SongForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const songData = location.state || {}; // Retrieve passed song data or use an empty object

  // Validation Schema with Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    artist: Yup.string().required("Artist is required"),
    genre: Yup.string()
      .required("Genre is required"),
    duration: Yup.string()
      .matches(
        /^([0-5]?\d):([0-5]\d)$/,
        "Duration must be in the format MM:SS and within valid time limits"
      )
      .required("Duration is required"),
  });

  // Initial form values
  const initialValues = {
    title: songData.title || "",
    artist: songData.artist || "",
    genre: songData.genre || "",
    duration: songData.duration || "",
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const method = songData.id ? "PATCH" : "POST";
      const url = songData.id ? `/songs/${songData.id}` : "/songs";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        resetForm();
        navigate("/songs"); // Redirect back to the song list
      } else {
        throw new Error(`Failed to ${songData.id ? "update" : "add"} the song.`);
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
          <h1>{songData.id ? "Update Song" : "Add a New Song"}</h1>

          {/* Title Field */}
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Song Title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="title" component="div" style={{ color: "red" }} />
          </div>

          {/* Artist Field */}
          <div>
            <label htmlFor="artist">Artist:</label>
            <input
              type="text"
              id="artist"
              name="artist"
              placeholder="Artist"
              value={values.artist}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="artist" component="div" style={{ color: "red" }} />
          </div>

          {/* Genre Field */}
          <div>
            <label htmlFor="genre">Genre:</label>
            <input
              type="text"
              id="genre"
              name="genre"
              placeholder="Genre: Rock, Pop, Jazz, etc."
              value={values.genre}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="genre" component="div" style={{ color: "red" }} />
          </div>

          {/* Duration Field */}
          <div>
            <label htmlFor="duration">Duration:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="Ex: MM:SS"
              value={values.duration}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage name="duration" component="div" style={{ color: "red" }} />
          </div>

          {/* Submit Button */}
          <button type="submit">{songData.id ? "Update Song" : "Add Song"}</button>
        </form>
      )}
    </Formik>
  );
}

export default SongForm;
