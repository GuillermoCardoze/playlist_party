#!/usr/bin/env python3
from datetime import datetime
# Standard library imports
import random

# Local imports
from app import app
from models import db, Song, Playlist, Playlist_song  

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        db.drop_all()  
        db.create_all()  
        

        songs_data = [
            {"title": "Shape of You", "artist": "Ed Sheeran", "genre": "Pop", "duration": "04:30"},
            {"title": "Bohemian Rhapsody", "artist": "Queen", "genre": "Rock", "duration": "06:00"},
            {"title": "Blinding Lights", "artist": "The Weeknd", "genre": "Pop", "duration": "04:30"},
            {"title": "Smells Like Teen Spirit", "artist": "Nirvana", "genre": "Rock", "duration": "05:10"},
            {"title": "Imagine", "artist": "John Lennon", "genre": "Rock", "duration": "03:15"},
            {"title": "Billie Jean", "artist": "Michael Jackson", "genre": "Pop", "duration": "04:30"},
            {"title": "Like a Rolling Stone", "artist": "Bob Dylan", "genre": "Rock", "duration": "06:00"},
            {"title": "Stayin' Alive", "artist": "Bee Gees", "genre": "Pop", "duration": "04:30"},
            {"title": "What's Going On", "artist": "Marvin Gaye", "genre": "Pop", "duration": "04:00"},
            {"title": "Rolling in the Deep", "artist": "Adele", "genre": "Pop", "duration": "05:00"},
        ]

        songs = []
        for song_data in songs_data:
            song = Song(
                title=song_data["title"],
                artist=song_data["artist"],
                genre=song_data["genre"],
                duration=song_data["duration"],  # MM:SS format
            )
            songs.append(song)

        db.session.add_all(songs)
        db.session.commit()






        playlist_data = [
            ("Chill Vibes", "A mix of relaxing and mellow tracks perfect for unwinding."),
            ("Workout Hits", "High-energy music to power you through your workout session."),
            ("Summer Beats", "Upbeat tracks to get you in the summer mood."),
            ("Rock Classics", "Timeless rock anthems that everyone loves."),
            ("Indie Favorites", "Indie tracks that you won't hear on the radio, but should.")
        ]

        playlists = []
        for name, description in playlist_data:
            playlist = Playlist(
                name=name,
                description=description,
            )
            playlists.append(playlist)

        db.session.add_all(playlists)
        db.session.commit()




        playlist_songs = []
        for playlist in playlists:
            for song in songs:
                playlist_song = Playlist_song(
                    song_id=song.id,
                    playlist_id=playlist.id,
                    explicit=random.choice([True, False])
                )
                playlist_songs.append(playlist_song)

        db.session.add_all(playlist_songs)
        db.session.commit()

        print("Seeding completed.")