from rest_framework import serializers
from .models import (
    User, Artist, Album, Song, Playlist,PlaylistSong,
    LikedSong, ArtistFollow, ListeningHistory, Comment
)
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', "password", 'email', 'first_name', 'last_name', 'is_premium', 'avatar', 'role']
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "avatar": {"required": False, "allow_null": True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            try:
                data['avatar'] = instance.avatar.url  # ✅ URL đầy đủ từ Cloudinary
            except:
                data['avatar'] = str(instance.avatar)  # fallback nếu có lỗi
        else:
            data['avatar'] = ""  # hoặc default URL
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
    class Meta:
        model = Song
        fields = ['id', 'title', 'artists', 'album', 'audio_file', 'image_url', 'duration', 'created_at']
        extra_kwargs = {
            'audio_file': {'required': False},
            'image_url': {'required': False},
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.audio_file:
            rep['audio_file'] = instance.audio_file.url
        if instance.image_url:
            rep['image_url'] = instance.image_url.url
        return rep

    


class PlaylistSerializer(serializers.ModelSerializer):
    image_url_display = serializers.SerializerMethodField()  # <-- Đây là chỗ định nghĩa

    class Meta:
        model = Playlist
        fields = '__all__'  # Gồm tất cả trường trong model + image_url_display
        read_only_fields = ['user']

    def get_image_url_display(self, obj):
        if obj.image_url:
            return obj.image_url.url  # Trả về full URL từ Cloudinary
        return None

class PlaylistSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistSong
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
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'user', 'song', 'content', 'created_at']
