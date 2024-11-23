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
    duration = db.Column(db.Time)  # Stores time in minutes and seconds

    playlist_songs = db.relationship('Playlist_song', back_populates='song', cascade='all, delete-orphan')

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

        if isinstance(value, str):  
            try:
                minutes, seconds = map(int, value.split(":"))
                value = time(minute=minutes, second=seconds)
            except ValueError:
                raise ValueError("Duration must be in the format MM:SS.")

        if value.minute < 0 or value.minute > 59:
            raise ValueError("Minutes must be between 0 and 59.")
        if value.second < 0 or value.second > 59:
            raise ValueError("Seconds must be between 0 and 59.")
        
        return value

    @validates('genre')
    def validate_genre(self, key, value):
        allowed_genres = ['Rock', 'Pop', 'Jazz', 'Hip Hop', 'Classical', 'Country', 'Electronic']
        if value and value not in allowed_genres:
            raise ValueError(f"Genre must be one of {allowed_genres}.")
        return value

    def __repr__(self):
        return f'<Song Title:{self.title}, Artist:{self.artist}>'




class Playlist_song(db.Model, SerializerMixin):
    __tablename__ = 'playlist_songs'

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), nullable=False)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), nullable=False)
    explicit = db.Column(db.Boolean, default=False)

    song = db.relationship('Song', back_populates='playlist_songs')
    playlist = db.relationship('Playlist', back_populates='playlist_songs')

    serialize_rules = ('-song.playlist_songs', '-playlist.playlist_songs')  

    @validates('explicit')
    def validate_explicit(self, key, value):
        if not isinstance(value, bool):
            raise ValueError("Explicit must be a boolean value.")
        return value

    # @validates('song_id', 'playlist_id')
    # def validate_foreign_keys(self, key, value):
    #     if not value:
    #         raise ValueError(f"{key} is required.")
    #     return value


    def __repr__(self):
        return f'<Playlist_song SongID:{self.song_id}, PlaylistID:{self.playlist_id}, Explicit:{self.explicit}>'
    





class Playlist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    playlist_songs = db.relationship('Playlist_song', back_populates='playlist', cascade='all, delete-orphan')

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
