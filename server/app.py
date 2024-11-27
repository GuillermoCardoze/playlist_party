# #!/usr/bin/env python3

# # Standard library imports

# # Remote library imports
# from flask import request, make_response, abort, jsonify
# from flask_restful import Resource
# from werkzeug.exceptions import NotFound

# # Local imports
# from config import app, db, api
# # Add your model imports
# from models import Song, Playlist_song, Playlist

# # Views go here!

# # @app.route('/')
# # def index():
# #     return '<h1>Project Server</h1>'

# class Songs(Resource):
#     def get(self):
#         song_list = [song.to_dict() for song in Song.query.all()]
        
#         # response = make_response(song_list, 200)
#         return song_list, 200
    
#     def post(self):
#         request_json = request.get_json()
#         new_song = Song(
#             title=request_json['title'],
#             artist=request_json['artist'],        #<<--- THIS WAY WORKS FOR JSON DATA
#             genre=request_json['genre'],
#             duration=request_json['duration']
#         )
#         # new_song = Song(
#         #     title=request.form['title'],
#         #     artist=request.form['artist'],
#         #     genre=request.form['genre'],                #<<--- THIS WAY WORKS FOR FORM DATA
#         #     duration=request.form['duration']
#         # )

#         db.session.add(new_song)
#         db.session.commit()

#         return new_song.to_dict(),201

# api.add_resource(Songs,'/songs')


# class SongById(Resource):
#     def get(self, id):
#         song_id = Song.query.filter_by(id=id).first()
#         if not song_id:
#             abort(404, "The song was not found.")

#         return song_id.to_dict(),200
    
#     def patch(self, id):
#         song_id = Song.query.filter_by(id=id).first()
#         if not song_id:
#             abort(404, "The song was not found.")

#         data = request.get_json()
#         for key in data:
#             setattr(song_id, key, data[key])
        
#         db.session.add(song_id)
#         db.session.commit()

#         return song_id.to_dict(), 202
    
#     def delete(self, id):
#         song_id = Song.query.filter_by(id=id).first()
#         if not song_id:
#             abort(404, "The song was not found.")

#         db.session.delete(song_id)
#         db.session.commit()

#         return {}, 204
    
# api.add_resource(SongById, '/songs/<int:id>')


# class Playlists(Resource):
#     def get(self):
#         playlist_list = [playlist.to_dict() for playlist in Playlist.query.all()]
#         return playlist_list, 200
    
#     def post(self):
#         request_json = request.get_json()
#         new_playlist = Playlist(
#             name=request_json['name'],
#             description=request_json['description']        #<<--- THIS WAY WORKS FOR JSON DATA
#         )

#         # new_playlist = Playlist(
#         #     name=request.form['name'],
#         #     description=request.form['description']       #<<---- THIS WAY WORKS FOR FORM DATA
#         # )

#         db.session.add(new_playlist)
#         db.session.commit()

#         return new_playlist.to_dict(), 201

# api.add_resource(Playlists,'/playlists')

# class PlaylistById(Resource):
#     def get(self, id):
#         playlist_id = Playlist.query.filter_by(id=id).first()
#         if not playlist_id:
#             abort(404, "The playlist was not found.")
        
#         return playlist_id.to_dict(),200
    
#     def patch(self, id):
#         playlist_id = Playlist.query.filter_by(id=id).first()
#         if not playlist_id:
#             abort(404, "The playlist was not found.")

#         data = request.get_json()
#         for key in data:
#             setattr(playlist_id, key, data[key])
        
#         db.session.add(playlist_id)
#         db.session.commit()

#         return playlist_id.to_dict(), 202
    
#     def delete(self, id):
#         playlist_id = Playlist.query.filter_by(id=id).first()
#         if not playlist_id:
#             abort(404, "The playlist was not found.")

#         db.session.delete(playlist_id)
#         db.session.commit()

#         return {}, 204

# ## DELETE WITH .GET() OPTION
#     # def delete(self, id):
#     #     playlist = Playlist.query.get(id)
#     #     if not playlist:
#     #         abort(404, description="The playlist was not found.")

#     #     db.session.delete(playlist)
#     #     db.session.commit()

#     #     return {}, 204

# api.add_resource(PlaylistById, '/playlists/<int:id>')


# class Party(Resource):
#     def get(self):
#         playsongs = [playsongs.to_dict() for playsongs in Playlist_song.query.all()]
#         return playsongs, 200

#     def post(self):
#         request_json = request.get_json()
#         try:
#             song = Song.query.get(request_json['song_id'])
#             playlist = Playlist.query.get(request_json['playlist_id'])

#             if not song or not playlist:
#                 return make_response({'error': 'Game or Store not found'}, 404)
#             playsong = Playlist_song(
#                 explicit=request_json['explicit'],
#                 song=song,  # Associate the song object
#                 playlist=playlist  # Associate the playlist object
#             )
#             db.session.add(playsong)
#             db.session.commit()
#             return playsong.to_dict(),200
#         except Exception as e:
#             return {"errors": "Failed to add song to playlist", 'message': str(e)}, 500
        
# api.add_resource(Party,"/party")

# class PartyById(Resource):
#     def get(self, id):
#         party = Playlist_song.query.filter_by(id=id).first()
#         if not party:
#             abort(404, "The party was not found.")
        
#         return party.to_dict(),200
    
#     def patch(self, id):
#         party = Playlist_song.query.filter_by(id=id).first()
#         if not party:
#             abort(404, "The party was not found.")

#         data = request.get_json()
#         for key in data:
#             setattr(party, key, data[key])
        
#         db.session.add(party)
#         db.session.commit()

#         return party.to_dict(), 202
    
#     def delete(self, id):
#         party = Playlist_song.query.filter_by(id=id).first()
#         if not party:
#             abort(404, "The party was not found.")

#         db.session.delete(party)
#         db.session.commit()

#         return {}, 204

# api.add_resource(PartyById, '/party/<int:id>')



            


# # @app.errorhandler(NotFound)
# # def handle_not_found(e):
# #     return make_response("Not Found: The resource was not found.", 404)   <<--- CAN BE USED FOR ALL 404 ERROR MESSAGES

# if __name__ == '__main__':
#     app.run(port=5555, debug=True)




#######################
###########################

#!/usr/bin/env python3

from flask import request, make_response, abort, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from config import app, db, api
from models import Song, Playlist_song, Playlist

# Views go here!

class Songs(Resource):
    def get(self):
        song_list = [song.to_dict() for song in Song.query.all()]
        return make_response(jsonify(song_list), 200)
    
    def post(self):
        try:
            request_json = request.get_json()
            new_song = Song(
                title=request_json['title'],
                artist=request_json['artist'],
                genre=request_json['genre'],
                duration=request_json['duration']
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
        # Retrieve a party (Playlist_song) by its ID
        party = Playlist_song.query.filter_by(id=id).first()
        
        if not party:
            # If party is not found, return a 404 error
            abort(404, "The party was not found.")
        
        # Return the party data in dictionary form
        return party.to_dict(), 200
    
    def patch(self, id):
        # Find the party entry by ID
        party = Playlist_song.query.filter_by(id=id).first()
        
        if not party:
            # If party is not found, return a 404 error
            abort(404, "The party was not found.")
        
        # Get the data from the request body
        data = request.get_json()
        
        # Update the fields of the party object with the new data
        for key in data:
            setattr(party, key, data[key])
        
        # Commit the changes to the database
        db.session.add(party)
        db.session.commit()

        # Return the updated party data in dictionary form
        return party.to_dict(), 202
    
    def delete(self, id):
        # Find the party entry by ID
        party = Playlist_song.query.filter_by(id=id).first()
        
        if not party:
            # If party is not found, return a 404 error
            abort(404, "The party was not found.")
        
        # Delete the party from the database
        db.session.delete(party)
        db.session.commit()

        # Return an empty response with a 204 status code
        return {}, 204


# Add PartyById resource to the API
api.add_resource(PartyById, '/party/<int:id>')



if __name__ == '__main__':
    app.run(debug=True)
