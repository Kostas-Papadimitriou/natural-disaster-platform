from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

class IncidentReportView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        title = request.data.get('title')
        description = request.data.get('description')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        media = request.FILES.get('media')  # optional
        lang = request.data.get('lang')
        log = request.data.get('log')

        # Εδώ μπορείς να κάνεις save ή log
        print(f"Received: {title}, {description}, {latitude}, {longitude}, lang={lang}, log={log}, media={media}")

        return Response({"message": "Report received successfully"})

# Create your views here.
