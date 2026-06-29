"""
URL configuration for disaster_project project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Swagger imports
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


# Swagger schema config
schema_view = get_schema_view(
    openapi.Info(
        title="Disaster API",
        default_version="v1",
        description="Disaster Management API documentation",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Main disasters app (homepage routes)
    path('', include('disasters.urls')),

    # Reports API
    path('api/reports/', include('reports.urls')),
    path('api/auth/', include('accounts.urls')),
    # Swagger documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),
]

# Media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
