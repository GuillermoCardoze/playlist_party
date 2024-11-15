from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db
from sqlalchemy.orm import validates



class Song(db.Model, SerializerMixin):
    __tablename__ = 'songs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    artist = db.Column(db.String, nullable=False)
    genre = db.Column(db.String)
    duration = db.Column(db.Time)

    # Direct access to Playlist_song association
    playlist_songs = db.relationship('Playlist_song', back_populates='song', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Song Title:{self.title}, Artist:{self.artist}>'

class Playlist_song(db.Model, SerializerMixin):
    __tablename__ = 'playlist_songs'

    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), nullable=False)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), nullable=False)
    explicit = db.Column(db.Boolean, default=False)

    # Relationships to Song and Playlist
    song = db.relationship('Song', back_populates='playlist_songs')
    playlist = db.relationship('Playlist', back_populates='playlist_songs')

    def __repr__(self):
        return f'<Playlist_song SongID:{self.song_id}, PlaylistID:{self.playlist_id}, Explicit:{self.explicit}>'

class Playlist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    # Direct access to Playlist_song association
    playlist_songs = db.relationship('Playlist_song', back_populates='playlist', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Playlist Name:{self.name}, Description:{self.description}>'
