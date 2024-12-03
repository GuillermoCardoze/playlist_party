import React from 'react';

function Home() {
    return (
    <div style={{ textAlign: 'center' }}>
        <h1>Home Page</h1>
        <p>
        This app is a music management platform that allows users to create, view, edit, and delete songs and playlists while associating songs with playlists. The app features components for displaying a list of songs, managing playlists, and a form for adding or editing songs. Through the integration of party data, the app tracks additional song metadata, such as whether a song is explicit and its associated playlist, ensuring songs are dynamically tied to their respective playlists. Users can seamlessly update or delete songs and playlists via user-friendly interfaces, with validations ensuring data integrity during submissions.
        </p>
        <p>
        Songs can be viewed in a list, where users see key details like title, artist, genre, duration, explicit status, and playlist association. For enhanced user interaction, each song can be edited or deleted, with changes instantly reflected in the app. Similarly, playlists are manageable through a dedicated interface where users can search for playlists by name or description, add new playlists, edit existing ones, or delete them. Real-time updates ensure that any modifications to playlists are accurately reflected, maintaining synchronization with the song data.
        </p>
        <p>
        Behind the scenes, the app leverages React for dynamic rendering and state management, Formik and Yup for form handling and validation, and RESTful API endpoints for server communication. Fetch requests handle CRUD operations, ensuring persistent updates to the backend. By merging and synchronizing song and playlist data through the party dataset, the app achieves a robust connection between songs and their corresponding playlists, creating a cohesive and interactive user experience.
        </p>
    </div>
    );
}

export default Home;
