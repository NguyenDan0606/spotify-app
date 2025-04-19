from rest_framework import serializers
from .models import (
    User, Artist, Album, Song, Playlist, PlaylistSong,
    LikedSong, ArtistFollow, ListeningHistory, Comment
)
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', "password" , 'email','first_name','last_name', 'is_premium']
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'



class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'


class PlaylistSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistSong
        fields = '__all__'


class PlaylistSerializer(serializers.ModelSerializer):
    playlist_songs = PlaylistSongSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = '__all__'


class LikedSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = LikedSong
        fields = '__all__'


class ArtistFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtistFollow
        fields = '__all__'


class ListeningHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ListeningHistory
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
