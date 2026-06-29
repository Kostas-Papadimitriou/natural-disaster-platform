from django.urls import path
from .views import IncidentReportView

urlpatterns = [
    path('submit/', IncidentReportView.as_view(), name='submit-report'),
]
