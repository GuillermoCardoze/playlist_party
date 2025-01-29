#!/usr/bin/env python3

from flask import request, make_response, abort, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from config import app, db, api
from models import Song, Playlist_song, Playlist

# Views go here!
from sqlalchemy import func
from flask import request, make_response, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from config import app, db, api
from models import Song, Playlist_song, Playlist
from datetime import time
from flask import request, make_response, jsonify

class Songs(Resource):
    def get(self):
        song_list = [song.to_dict() for song in Song.query.all()]
        return make_response(jsonify(song_list), 200)
    
    def post(self):
        try:
            request_json = request.get_json()

            # Ensure duration is formatted as MM:SS
            duration_str = request_json.get('duration', '')
            if duration_str:
                try:
                    # Parse duration into MM:SS format
                    if len(duration_str.split(":")) == 2:
                        minutes, seconds = map(int, duration_str.split(":"))
                        if not (0 <= minutes <= 59):
                            return make_response({'error': 'Minutes must be between 0 and 59.'}, 400)
                        if not (0 <= seconds <= 59):
                            return make_response({'error': 'Seconds must be between 0 and 59.'}, 400)
                    else:
                        return make_response({'error': 'Invalid duration format. Use MM:SS.'}, 400)
                except ValueError:
                    return make_response({'error': 'Invalid duration format. Use MM:SS.'}, 400)
            else:
                return make_response({'error': 'Duration is required.'}, 400)

            # Create new song
            new_song = Song(
                title=request_json['title'],
                artist=request_json['artist'],
                genre=request_json['genre'],
                duration=duration_str  # Store duration as MM:SS format
            )
            db.session.add(new_song)
            db.session.commit()
            return make_response(jsonify(new_song.to_dict()), 201)
        except KeyError as e:
            return make_response({'error': f'Missing key: {str(e)}'}, 400)
        except Exception as e:
            return make_response({'error': 'Failed to create song', 'message': str(e)}, 500)

api.add_resource(Songs, '/songs')

class SongById(Resource):
    def get(self, id):
        song_id = Song.query.filter_by(id=id).first()
        if not song_id:
            return make_response({'error': 'Song not found'}, 404)

        return make_response(jsonify(song_id.to_dict()), 200)
    
    def patch(self, id):
        song_id = Song.query.filter_by(id=id).first()
        if not song_id:
            return make_response({'error': 'Song not found'}, 404)

        data = request.get_json()
        if not data:
            return make_response({'error': 'No data provided for update'}, 400)

        for key in data:
            setattr(song_id, key, data[key])

        db.session.add(song_id)
        db.session.commit()

        return make_response(jsonify(song_id.to_dict()), 202)
    
    def delete(self, id):
        song_id = Song.query.filter_by(id=id).first()
        if not song_id:
            return make_response({'error': 'Song not found'}, 404)

        db.session.delete(song_id)
        db.session.commit()

        return make_response({}, 204)
    
api.add_resource(SongById, '/songs/<int:id>')


class Playlists(Resource):
    def get(self):
        playlist_list = [playlist.to_dict() for playlist in Playlist.query.all()]
        return make_response(jsonify(playlist_list), 200)
    
    def post(self):
        try:
            request_json = request.get_json()
            new_playlist = Playlist(
                name=request_json['name'],
                description=request_json['description']
            )

            db.session.add(new_playlist)
            db.session.commit()
            return make_response(jsonify(new_playlist.to_dict()), 201)
        except KeyError as e:
            return make_response({'error': f'Missing key: {str(e)}'}, 400)
        except Exception as e:
            return make_response({'error': 'Failed to create playlist', 'message': str(e)}, 500)

api.add_resource(Playlists, '/playlists')

class PlaylistById(Resource):
    def get(self, id):
        playlist_id = Playlist.query.filter_by(id=id).first()
        if not playlist_id:
            return make_response({'error': 'Playlist not found'}, 404)

        return make_response(jsonify(playlist_id.to_dict()), 200)
    
    def patch(self, id):
        playlist_id = Playlist.query.filter_by(id=id).first()
        if not playlist_id:
            return make_response({'error': 'Playlist not found'}, 404)

        data = request.get_json()
        if not data:
            return make_response({'error': 'No data provided for update'}, 400)

        for key in data:
            setattr(playlist_id, key, data[key])

        db.session.add(playlist_id)
        db.session.commit()

        return make_response(jsonify(playlist_id.to_dict()), 202)
    
    def delete(self, id):
        playlist_id = Playlist.query.filter_by(id=id).first()
        if not playlist_id:
            return make_response({'error': 'Playlist not found'}, 404)

        db.session.delete(playlist_id)
        db.session.commit()

        return make_response({}, 204)

api.add_resource(PlaylistById, '/playlists/<int:id>')


class Party(Resource):
    def get(self):
        playsongs = [playsongs.to_dict() for playsongs in Playlist_song.query.all()]
        return make_response(jsonify(playsongs), 200)

    def post(self):
        try:
            request_json = request.get_json()
            song = Song.query.get(request_json['song_id'])
            playlist = Playlist.query.get(request_json['playlist_id'])

            if not song or not playlist:
                return make_response({'error': 'Song or Playlist not found'}, 404)
            
            playsong = Playlist_song(
                explicit=request_json['explicit'],
                song=song,
                playlist=playlist
            )

            db.session.add(playsong)
            db.session.commit()

            return make_response(jsonify(playsong.to_dict()), 201)
        except KeyError as e:
            return make_response({'error': f'Missing key: {str(e)}'}, 400)
        except Exception as e:
            return make_response({'error': 'Failed to create playlist_song', 'message': str(e)}, 500)

api.add_resource(Party, '/party')

class PartyById(Resource):
    def get(self, id):
        party = Playlist_song.query.filter_by(id=id).first()
        
        if not party:
            abort(404, "The party was not found.")
        
        return party.to_dict(), 200
    
    def patch(self, id):
        party = Playlist_song.query.filter_by(id=id).first()
        
        if not party:
            abort(404, "The party was not found.")
        
        data = request.get_json()
        
        for key in data:
            setattr(party, key, data[key])
        
        db.session.add(party)
        db.session.commit()

        return party.to_dict(), 202
    
    def delete(self, id):
        party = Playlist_song.query.filter_by(id=id).first()
        
        if not party:
            abort(404, "The party was not found.")
        
        db.session.delete(party)
        db.session.commit()

        return {}, 204


api.add_resource(PartyById, '/party/<int:id>')


### GET ALL SONGS BY A GENRE
class Genre(Resource):
    def get(self,genre):
        
        songs = Song.query.filter(Song.genre==genre).all()
        song_dict = [song.to_dict() for song in songs]
        return make_response(song_dict,200)


api.add_resource(Genre, '/genre/<string:genre>')        


if __name__ == '__main__':
    app.run(debug=True)