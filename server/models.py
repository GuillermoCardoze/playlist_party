from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db
from sqlalchemy.orm import validates

# Models go here!
class Song(db.Model, SerializerMixin):
    __tablename__ = 'songs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    artist = db.Column(db.String)
    genre = db.Column(db.String)
    duration = db.Column(db.Time)

    def __repr__(self):
        return f'<Song Title:{self.title}, Artist:{self.artist}, Genre:{self.genre}, Duration:{self.duration}>'


class Playlist_song(db.Model, SerializerMixin):
    __tablename__ = 'playlist_songs'

    id = db.Column(db.Integer, primary_key=True)

    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'))
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'))


    explicit = db.Column(db.Boolean, nullable=False, default=False)
   
    def __repr__(self):
        return f'<Playlist_song Explicit:{self.explicit}>'
    

class Playlist(db.Model, SerializerMixin):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)


    def __repr__(self):
        return f'<Playlist Name:{self.name}, Description:{self.description}>'