#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, abort, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound

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
        request_json = request.get_json()
        new_song = Song(
            title=request_json['title'],
            artist=request_json['artist'],        #<<--- THIS WAY WORKS FOR JSON DATA
            genre=request_json['genre'],
            duration=request_json['duration']
        )
        # new_song = Song(
        #     title=request.form['title'],
        #     artist=request.form['artist'],
        #     genre=request.form['genre'],                #<<--- THIS WAY WORKS FOR FORM DATA
        #     duration=request.form['duration']
        # )

        db.session.add(new_song)
        db.session.commit()

        return new_song.to_dict(),201

api.add_resource(Songs,'/songs')


class SongById(Resource):
    def get(self, id):
        song_id = Song.query.filter_by(id=id).first()
        if not song_id:
            abort(404, "The song was not found.")

        return song_id.to_dict(),200
    
    def patch(self, id):
        song_id = Song.query.filter_by(id=id).first()
        if not song_id:
            abort(404, "The song was not found.")

        data = request.get_json()
        for key in data:
            setattr(song_id, key, data[key])
        
        db.session.add(song_id)
        db.session.commit()

        return song_id.to_dict(), 202
    
    def delete(self, id):
        song_id = Song.query.filter_by(id=id).first()
        if not song_id:
            abort(404, "The song was not found.")

        db.session.delete(song_id)
        db.session.commit()

        return {}, 204
    
api.add_resource(SongById, '/songs/<int:id>')


class Playlists(Resource):
    def get(self):
        playlist_list = [playlist.to_dict() for playlist in Playlist.query.all()]
        return playlist_list, 200
    
    def post(self):
        request_json = request.get_json()
        new_playlist = Playlist(
            name=request_json['name'],
            description=request_json['description']        #<<--- THIS WAY WORKS FOR JSON DATA
        )

        # new_playlist = Playlist(
        #     name=request.form['name'],
        #     description=request.form['description']       #<<---- THIS WAY WORKS FOR FORM DATA
        # )

        db.session.add(new_playlist)
        db.session.commit()

        return new_playlist.to_dict(), 201

api.add_resource(Playlists,'/playlists')

class PlaylistById(Resource):
    def get(self, id):
        playlist_id = Playlist.query.filter_by(id=id).first()
        if not playlist_id:
            abort(404, "The playlist was not found.")
        
        return playlist_id.to_dict(),200
    
    def patch(self, id):
        playlist_id = Playlist.query.filter_by(id=id).first()
        if not playlist_id:
            abort(404, "The playlist was not found.")

        data = request.get_json()
        for key in data:
            setattr(playlist_id, key, data[key])
        
        db.session.add(playlist_id)
        db.session.commit()

        return playlist_id.to_dict(), 202
    
    def delete(self, id):
        playlist_id = Playlist.query.filter_by(id=id).first()
        if not playlist_id:
            abort(404, "The playlist was not found.")

        db.session.delete(playlist_id)
        db.session.commit()

        return {}, 204

## DELETE WITH .GET() OPTION
    # def delete(self, id):
    #     playlist = Playlist.query.get(id)
    #     if not playlist:
    #         abort(404, description="The playlist was not found.")

    #     db.session.delete(playlist)
    #     db.session.commit()

    #     return {}, 204

    
api.add_resource(PlaylistById, '/playlists/<int:id>')


        

# @app.errorhandler(NotFound)
# def handle_not_found(e):
#     return make_response("Not Found: The resource was not found.", 404)   <<--- CAN BE USED FOR ALL 404 ERROR MESSAGES

if __name__ == '__main__':
    app.run(port=5555, debug=True)

