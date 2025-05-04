from rest_framework import viewsets, generics, status
from .models import *
from .serializers import *
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from cloudinary.uploader import upload
from rest_framework.decorators import action


User = get_user_model()
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer   
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        return {"request": self.request}  # Đảm bảo serializer có request context


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        user = request.user

        # Cập nhật họ tên nếu có
        last_name = request.data.get("last_name")
        if last_name:
            user.last_name = last_name

        # Cập nhật avatar nếu có
        avatar_file = request.FILES.get("avatar")
        if avatar_file:
            result = upload(avatar_file)
            user.avatar = result.get("secure_url")  # Lưu đường dẫn ảnh từ Cloudinary

        user.save()

        serializer = UserSerializer(user, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        artist = self.get_object()
        songs = Song.objects.filter(artists=artist)
        serializers = SongSerializer(songs,many=True)
        return Response(serializers.data)


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny]


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [AllowAny]


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    
    @action(detail=False, methods=['get'], url_path='my-playlists')
    def get_user_playlists(self, request):
        user = request.user
        playlists = Playlist.objects.filter(user=user)
        serializer = self.get_serializer(playlists, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PlaylistSongViewSet(viewsets.ModelViewSet):
    queryset = PlaylistSong.objects.all()
    serializer_class = PlaylistSongSerializer
    
    @action(detail=False, methods=['get'], url_path='by-playlist/(?P<playlist_id>[^/.]+)')
    def get_songs_by_playlist(self, request, playlist_id=None):
        playlist_songs = PlaylistSong.objects.filter(playlist_id=playlist_id).select_related('song')
        data = [{
            "id": ps.song.id,
            "title": ps.song.title,
            "image_url": ps.song.image_url.url if ps.song.image_url else None,
            "album": ps.song.album.title if getattr(ps.song, 'album', None) and ps.song.album else None,
            "duration": ps.song.duration,
            "created_at": ps.song.created_at,
        } for ps in playlist_songs]
        return Response(data)



class LikedSongViewSet(viewsets.ModelViewSet):
    queryset = LikedSong.objects.all()
    serializer_class = LikedSongSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request): 
        user = request.user
        liked_songs = LikedSong.objects.filter(user=user)
        serializer = LikedSongSerializer(liked_songs, many=True)
        return Response(serializer.data)
    

    
    @action(detail=False, methods=['post'], url_path='toggle-like')
    def toggle_like(self, request):
        song_id = request.data.get('song_id')
        user = request.user

        try:
            song = Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=404)

        liked_song, created = LikedSong.objects.get_or_create(user=user, song=song)

        if not created:
            liked_song.delete()
            return Response({"message": "Unliked"}, status=200)
        else:
            return Response({"message": "Liked"}, status=201)
    
    @action(detail=False, methods=['get'], url_path='check-liked/(?P<song_id>\d+)')
    def check_liked(self, request, song_id=None):
            song = Song.objects.get(id=song_id)
            is_liked = LikedSong.objects.filter(user=request.user, song_id=song_id).exists()
            return Response({
                'is_liked': is_liked,
                'song_id': song_id
            })


class ArtistFollowViewSet(viewsets.ModelViewSet):
    queryset = ArtistFollow.objects.all()
    serializer_class = ArtistFollowSerializer


class ListeningHistoryViewSet(viewsets.ModelViewSet):
    queryset = ListeningHistory.objects.all()
    serializer_class = ListeningHistorySerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
