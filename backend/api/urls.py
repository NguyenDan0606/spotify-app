from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'songs', SongViewSet)
router.register(r'playlists', PlaylistViewSet)
router.register(r'playlist-songs', PlaylistSongViewSet)
router.register(r'liked-songs', LikedSongViewSet)
router.register(r'artist-follows', ArtistFollowViewSet)
router.register(r'listening-history', ListeningHistoryViewSet)
router.register(r'comments', CommentViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
]
