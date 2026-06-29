

from django.urls import path
from .views import IncidentReportView, IncidentReportListView, SendIncidentEmailView
from .views_keycloak_users import (
    KeycloakUsersView,
    KeycloakUserDeleteView,
    KeycloakGroupsView,
    AssignUserGroupView,
    RemoveUserGroupView,
)

urlpatterns = [
path('submit/', IncidentReportView.as_view(), name='submit-report'),
    path('incidents/', IncidentReportListView.as_view(), name='incident-list'),
    path('incidents/<int:pk>/send-email/', SendIncidentEmailView.as_view(), name='incident-send-email'),
    path("api/kc-users/", KeycloakUsersView.as_view(), name="kc-users"),
    path("api/kc-users/<str:user_id>/", KeycloakUserDeleteView.as_view(), name="kc-user-delete"),
    path("api/kc-groups/", KeycloakGroupsView.as_view(), name="kc-groups"),
    path("api/kc-users/<str:user_id>/assign-group/", AssignUserGroupView.as_view(), name="kc-assign-group"),
    path("api/kc-users/<str:user_id>/remove-group/", RemoveUserGroupView.as_view(), name="kc-remove-group"),
]