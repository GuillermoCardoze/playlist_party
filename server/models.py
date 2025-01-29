from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy.orm import validates
from datetime import time

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy.orm import validates
from datetime import time

class Song(db.Model, SerializerMixin):
    __tablename__ = 'songs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    artist = db.Column(db.String, nullable=False)
    genre = db.Column(db.String)
    duration = db.Column(db.String, nullable=False)  # Store duration as a string in MM:SS format
    
    # Relationship to Playlist_song (many-to-many with Playlist)
    playlist_songs = db.relationship('Playlist_song', back_populates='song', cascade='all, delete-orphan')

    # Association proxy for accessing playlists directly with a creator function
    playlists = association_proxy(
        'playlist_songs',
        'playlist',
        creator=lambda playlist_obj: Playlist_song(playlist=playlist_obj)
    )

    serialize_rules = ('-playlist_songs',)

    @validates('title', 'artist')
    def validate_not_empty(self, key, value):
        if not value or value.strip() == "":
            raise ValueError(f"{key.capitalize()} cannot be empty.")
        return value.strip()
    
    @validates('duration')
    def validate_duration(self, key, value):
        if value is None:
            raise ValueError("Duration cannot be null.")

        # Ensure the duration is in MM:SS format
        if isinstance(value, str):  # Check if it's in MM:SS format
            try:
                minutes, seconds = map(int, value.split(":"))
                if not (0 <= minutes <= 59):
                    raise ValueError("Minutes must be between 0 and 59.")
                if not (0 <= seconds <= 59):
                    raise ValueError("Seconds must be between 0 and 59.")
            except ValueError:
                raise ValueError("Duration must be in the format MM:SS.")
        return value

    @validates('genre')
    def validate_genre(self, key, value):
        allowed_genres = ['Rock', 'Pop', 'Jazz', 'Hip Hop', 'Classical', 'Country', 'Electronic']
        if value and value not in allowed_genres:
            raise ValueError(f"Genre must be one of {allowed_genres}.")
        return value

    def __repr__(self):
        return f'<Song Title:{self.title}, Artist:{self.artist}, Genre:{self.genre}, Duration:{self.duration}>'

class Playlist_song(db.Model, SerializerMixin):
    __tablename__ = 'playlist_songs'

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), nullable=False)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), nullable=False)
    explicit = db.Column(db.Boolean, default=False)

    # Relationships to Song and Playlist
    song = db.relationship('Song', back_populates='playlist_songs')
    playlist = db.relationship('Playlist', back_populates='playlist_songs')

    serialize_rules = ('-song.playlist_songs', '-playlist.playlist_songs')  

    @validates('explicit')
    def validate_explicit(self, key, value):
        if not isinstance(value, bool):
            raise ValueError("Explicit must be a boolean value.")
        return value

    def __repr__(self):
        return f'<Playlist_song SongID:{self.song_id}, PlaylistID:{self.playlist_id}, Explicit:{self.explicit}>'

class Playlist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    # Relationship to Playlist_song (many-to-many with Song)
    playlist_songs = db.relationship('Playlist_song', back_populates='playlist', cascade='all, delete-orphan')

    # Association proxy for accessing songs directly with a creator function
    songs = association_proxy(
        'playlist_songs',
        'song',
        creator=lambda song_obj: Playlist_song(song=song_obj)
    )

    serialize_rules = ('-playlist_songs',)

    @validates('name')
    def validate_name(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Playlist name cannot be empty.")
        return value.strip()

    @validates('description')
    def validate_description(self, key, value):
        if value and len(value) > 255:
            raise ValueError("Description cannot exceed 255 characters.")
        return value

    def __repr__(self):
        return f'<Playlist Name:{self.name}, Description:{self.description}>'
