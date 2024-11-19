#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, abort, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Song, Playlist_song, Playlist

# Views go here!

# @app.route('/')
# def index():
#     return '<h1>Project Server</h1>'

class Songs(Resource):
    def get(self):
        song_list = [song.to_dict() for song in Song.query.all()]
        
        # response = make_response(song_list, 200)
        return song_list, 200
    
    def post(self):
        # request_json = request.get_json()
        # new_song = Song(
        #     title=request_json['title'],
        #     artist=request_json['artist'],        #<<--- THIS WAY WORKS FOR JSON DATA
        #     genre=request_json['genre'],
        #     duration=request_json['duration']
        # )
        new_song = Song(
            title=request.form['title'],
            artist=request.form['artist'],
            genre=request.form['genre'],                #<<--- THIS WAY WORKS FOR FORM DATA
            duration=request.form['duration']
        )

        db.session.add(new_song)
        db.session.commit()

        return new_song.to_dict(),201

api.add_resource(Songs,'/songs')


class Playlists(Resource):
    def get(self):
        playlist_list = [playlist.to_dict() for playlist in Playlist.query.all()]
        return playlist_list, 200
    
    def post(self):
        # request_json = request.get_json()
        # new_playlist = Playlist(
        #     name=request_json['name'],
        #     description=request_json['description']        #<<--- THIS WAY WORKS FOR JSON DATA
        # )

        new_playlist = Playlist(
            name=request.form['name'],
            description=request.form['description']       #<<---- THIS WAY WORKS FOR FORM DATA
        )
        
        db.session.add(new_playlist)
        db.session.commit()

        return new_playlist.to_dict(), 201

api.add_resource(Playlists,'/playlists')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

