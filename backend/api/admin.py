from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(Playlist)
admin.site.register(LikedSong)
admin.site.register(ArtistFollow)
admin.site.register(ListeningHistory)
admin.site.register(Comment)
admin.site.register(PlaylistSong)
