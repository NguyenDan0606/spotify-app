from rest_framework import serializers
from .models import (
    User, Artist, Album, Song, Playlist, PlaylistSong,
    LikedSong, ArtistFollow, ListeningHistory, Comment
)
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', "password" , 'email','first_name','last_name', 'is_premium', 'avatar']
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = str(instance.avatar)  # Luôn là URL string
        return data
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['last_name', 'avatar']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = str(instance.avatar)  # Luôn là URL string
        return data

class ArtistSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Artist
        fields = '__all__'
        
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url
        return None


class AlbumSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Album
        fields = '__all__'
        
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url
        return None



class SongSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    audio_file = serializers.SerializerMethodField()
    class Meta:
        model = Song
        fields = '__all__'
        
    def get_image_url(self, obj):
        if obj.image_url:
            return obj.image_url.url
        return None
    
    def get_audio_file(self, obj):
        if obj.audio_file:
            return obj.audio_file.url
        return None 


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
