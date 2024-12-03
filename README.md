
# Playlist Party

This app is a music management platform that allows users to create, view, edit, and delete songs and playlists while associating songs with playlists. The app features components for displaying a list of songs, managing playlists, and a form for adding or editing songs. Through the integration of party data, the app tracks additional song metadata, such as whether a song is explicit and its associated playlist, ensuring songs are dynamically tied to their respective playlists. Users can seamlessly update or delete songs and playlists via user-friendly interfaces, with validations ensuring data integrity during submissions.


## Tech Used

- **Python 3.8+**
- **Flask**: A lightweight WSGI web application framework
- **Flask-SQLAlchemy**: A SQL toolkit for Python
- **Flask-RESTful**: An extension for Flask that adds support for quickly building REST APIs
- **Flask-Migrate**: A SQLAlchemy database migration framework
- **Flask-CORS**: A Flask extension for handling Cross-Origin Resource Sharing (CORS)
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **Faker**: A library for generating fake data
- **Alembic**: A lightweight database migration tool for SQLAlchemy
- **IPDB**: Python debugger
- **React**: A JavaScript library for building user interfaces


## Installation

Clone this repository:
```bash
git clone https://github.com/GuillermoCardoze/playlist_party.git
cd playlist_party

```
## Create a virtual environment and activate it:
```
python3 -m venv venv
source venv/bin/activate
```
## Install the required dependencies:
```
pip install -r requirements.txt
```
## Initialize the database and run migrations:
```
flask db upgrade
```
## To seed the database with sample data, run:
```
python seed.py
```
# Running the Server
## To start the server, run the following command:
```
python app.py
```
By default, the server will be hosted on http://localhost:5555

# Running the Client
## Navigate to the client directory and install the dependencies:
```
cd client
npm install
```
## Start the client application:
```
npm start
```
By default, the client will be hosted on http://localhost:3000

# API Endpoints
## Songs
- GET /songs: Retrieve a list of all songs.
- POST /songs: Add a new song by providing its title, artist, genre, duration, and explicit status.
- GET /songs/int:id: Retrieve details of a specific song by its id.
- PATCH /songs/int:id: Update details of a song, such as title, artist, or explicit status.
- DELETE /songs/int:id: Delete a song by its id.

## Playlists
- GET /playlists: Retrieve a list of all playlists.
- POST /playlists: Create a new playlist by providing its name and description.
- GET /playlists/int:id: Retrieve details of a specific playlist by its id.
- PATCH /playlists/int:id: Update details of a playlist, such as its name or description.
- DELETE /playlists/int:id: Delete a playlist by its id.

## Party Data
- GET /party-data: Retrieve party data, including explicit status and playlist associations for each song.
- POST /party-data: Add metadata about a song, including playlist id and explicit status.

# Database Structure
## Models
### Song
- id: Primary key
- title: Title of the song
- artist: Artist of the song
- genre: Genre of the song
- duration: Duration of the song
- explicit: Boolean flag indicating if the song is explicit
- Relationships: A song can belong to many playlists through party data

### Playlist
- id: Primary key
- name: Name of the playlist
- description: Description of the playlist
- Relationships: A playlist can have many songs associated through party data

### PartyData
- id: Primary key
- song_id: Foreign key to the Song
- playlist_id: Foreign key to the Playlist
- explicit: Boolean flag indicating if the song is explicit

# DataBase Seeding
To populate the database with sample songs, playlists, and party data, run the seeding script:
```
python seed.py
```
This will create:

- 10 songs with various artists, genres, and explicit statuses
- 5 playlists with different descriptions
- Party data linking songs to playlists with explicit status tracking

#Migrations
This project uses Alembic for database migrations. To make and apply migrations:

To generate a new migration:
```
flask db migrate -m "Migration message"
```
To apply the migration:
```
flask db upgrade
```
## Contributing
If you'd like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request. Please make sure to follow the code style and add tests for any new features.











