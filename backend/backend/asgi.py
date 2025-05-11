import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Đặt biến môi trường trước khi import các module Django
import django
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import api.routing  # Import routing sau khi đã cài đặt Django

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            api.routing.websocket_urlpatterns
        )
    ),
})