#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import random

# Remote library imports
from faker import Faker
from datetime import datetime

# Local imports
from app import app
from models import db, Song, Playlist, Playlist_song  

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        db.drop_all()  
        db.create_all()  



        
        # Create songs
        songs = []
        for _ in range(10):  # 
            duration_str = fake.time()  # Faker generates a string in the format 'HH:MM:SS'
            
            # Convert the string to a datetime.time object
            duration = datetime.strptime(duration_str, "%H:%M:%S").time()
            
            # Create a new Song instance with valid data
            song = Song(
                title=fake.sentence(),  # Random song title
                artist=fake.name(),     # Random artist name
                genre=rc(['Rock', 'Pop', 'Jazz', 'Hip Hop', 'Classical', 'Country', 'Electronic']),  # Random genre
                duration=duration  # Random duration converted to time object
            )
            songs.append(song)  # Append the song to the list

        # Add songs to session
        db.session.add_all(songs)
        db.session.commit()






        # # Create playlists
        # playlists = []
        # for _ in range(5):  # Generate 5 playlists
        #     playlist = Playlist(
        #         name=fake.catch_phrase(),  # Random playlist name
        #         description=fake.text(max_nb_chars=200),  # Random playlist description
        #     )
        #     playlists.append(playlist)

        # # Add playlists to session
        # db.session.add_all(playlists)
        # db.session.commit()
        playlist_data = [
            ("Chill Vibes", "A mix of relaxing and mellow tracks perfect for unwinding."),
            ("Workout Hits", "High-energy music to power you through your workout session."),
            ("Summer Beats", "Upbeat tracks to get you in the summer mood."),
            ("Rock Classics", "Timeless rock anthems that everyone loves."),
            ("Indie Favorites", "Indie tracks that you won't hear on the radio, but should.")
        ]

        # Create playlists
        playlists = []
        for name, description in playlist_data:  # Directly use the predefined name-description pairs
            playlist = Playlist(
                name=name,
                description=description,
            )
            playlists.append(playlist)

        # Add playlists to session
        db.session.add_all(playlists)
        db.session.commit()





        # Create playlist_songs (many-to-many relationship between Song and Playlist)
        playlist_songs = []
        for playlist in playlists:
            for song in songs:
                playlist_song = Playlist_song(
                    song_id=song.id,
                    playlist_id=playlist.id,
                    explicit=rc([True, False])  # Random explicit flag (True/False)
                )
                playlist_songs.append(playlist_song)

        # Add playlist_song records to session
        db.session.add_all(playlist_songs)

        # Commit playlist_songs to the database
        db.session.commit()

        print("Seeding completed.")
