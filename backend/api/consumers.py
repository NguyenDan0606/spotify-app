import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Comment, Song
from .serializers import CommentSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.song_id = self.scope['url_route']['kwargs']['song_id']
        self.room_group_name = f'song_{self.song_id}'

        # Tham gia group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Rời group khi đóng kết nối
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('content')
        user_id = data.get('user')

        # Lưu vào database
        comment = await self.create_comment(user_id, self.song_id, content)

        # Serialize và gửi cho group
        serializer = CommentSerializer(comment)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_comment',
                'comment': serializer.data
            }
        )

    async def send_comment(self, event):
        await self.send(text_data=json.dumps(event['comment']))
        
    @database_sync_to_async
    def create_comment(self, user_id, song_id, content):
        user = User.objects.get(id=user_id)
        song = Song.objects.get(id=song_id)
        return Comment.objects.create(user=user, song=song, content=content)

    

