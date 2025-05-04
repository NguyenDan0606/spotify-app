from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from cloudinary.uploader import upload
from .permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated


from .models import *
from .serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]


    def get_serializer_context(self):
        return {"request": self.request}

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Xử lý avatar nếu có
        avatar_file = request.FILES.get("avatar")
        if avatar_file:
            result = upload(avatar_file)
            print(result)  # In kết quả Cloudinary trả về
            data["avatar"] = result.get("secure_url")


        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Hash mật khẩu nếu có
        password = data.get("password")
        if password:
            user.set_password(password)
            user.save()

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


class PlaylistSongViewSet(viewsets.ModelViewSet):
    queryset = PlaylistSong.objects.all()
    serializer_class = PlaylistSongSerializer


class LikedSongViewSet(viewsets.ModelViewSet):
    queryset = LikedSong.objects.all()
    serializer_class = LikedSongSerializer


class ArtistFollowViewSet(viewsets.ModelViewSet):
    queryset = ArtistFollow.objects.all()
    serializer_class = ArtistFollowSerializer


class ListeningHistoryViewSet(viewsets.ModelViewSet):
    queryset = ListeningHistory.objects.all()
    serializer_class = ListeningHistorySerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
