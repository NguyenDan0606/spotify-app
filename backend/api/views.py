from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from cloudinary.uploader import upload
from .permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import random
import string

from .models import *
from .serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()

# class CreateUserView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]
#     parser_classes = [MultiPartParser, FormParser]

#     def get_serializer_context(self):
#         return {"request": self.request}

#     def create(self, request, *args, **kwargs):
#         data = request.data.copy()

#         # Xử lý avatar nếu có
#         avatar_file = request.FILES.get("avatar")
#         if avatar_file:
#             result = upload(avatar_file)
#             print(result)  # In kết quả Cloudinary trả về
#             data["avatar"] = result.get("secure_url")

#         serializer = self.get_serializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()

#         # Hash mật khẩu nếu có
#         password = data.get("password")
#         if password:
#             user.set_password(password)
#             user.save()

#         return Response(serializer.data, status=status.HTTP_201_CREATED)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    # Xóa parser_classes vì không cần xử lý file ở đây, dùng JSONParser mặc định

    def get_serializer_context(self):
        return {"request": self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  # Serializer tự xử lý set_password và avatar
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]  # Cho phép nhận file ảnh

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # Xử lý ảnh avatar nếu có
        avatar_file = request.FILES.get("avatar")
        if avatar_file:
            result = upload(avatar_file)
            data["avatar"] = result.get("secure_url")

        serializer = self.get_serializer(instance, data=data, partial=partial, context={"request": request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

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
            user.avatar = result.get("secure_url")

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

class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email là bắt buộc."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        # Tạo OTP ngẫu nhiên (6 chữ số)
        otp_code = ''.join(random.choices(string.digits, k=6))
        expires_at = timezone.now() + timedelta(minutes=10)  # OTP hết hạn sau 10 phút

        # Lưu OTP vào database
        OTP.objects.create(
            email=email,
            code=otp_code,
            expires_at=expires_at
        )

        # Gửi email chứa OTP
        subject = 'Mã OTP đặt lại mật khẩu'
        message = f'Mã OTP của bạn là: {otp_code}. Hiệu lực trong 10 phút.'
        from_email = 'danquatao@gmail.com'
        recipient_list = [email]

        try:
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        except Exception as e:
            return Response({"error": "Lỗi gửi OTP, vui lòng thử lại."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "OTP đã được gửi về email."}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not all([email, otp_code, new_password]):
            return Response({"error": "Tất cả các trường đều bắt buộc."}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra OTP
        try:
            otp = OTP.objects.get(email=email, code=otp_code)
            if otp.is_expired():
                return Response({"error": "OTP đã hết hạn."}, status=status.HTTP_400_BAD_REQUEST)
        except OTP.DoesNotExist:
            return Response({"error": "OTP không hợp lệ."}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        # Cập nhật mật khẩu mới
        user.set_password(new_password)
        user.save()

        # Xóa OTP sau khi sử dụng
        otp.delete()

        return Response({"message": "Mật khẩu đã được đặt lại."}, status=status.HTTP_200_OK)