from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import IncidentReport
from .serializers import IncidentReportSerializer


class IncidentReportView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = IncidentReportSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            incident = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Το περιστατικό αποθηκεύτηκε επιτυχώς.",
                    "incident": IncidentReportSerializer(
                        incident,
                        context={'request': request}
                    ).data,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class IncidentReportListView(ListAPIView):
    queryset = IncidentReport.objects.all().order_by('-submitted_at')
    serializer_class = IncidentReportSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class SendIncidentEmailView(APIView):
    def post(self, request, pk, *args, **kwargs):
        try:
            incident = IncidentReport.objects.get(pk=pk)
        except IncidentReport.DoesNotExist:
            return Response(
                {"message": "Το περιστατικό δεν βρέθηκε."},
                status=status.HTTP_404_NOT_FOUND
            )

        recipient_email = "kpapadim27@gmail.com"

        subject = f"Νέο Περιστατικό #{incident.id} - {incident.incident_type}"
        message = f"""
ID: {incident.id}
Είδος: {incident.incident_type}
Τίτλος: {incident.title}
Περιγραφή: {incident.description}
Περιοχή: {incident.area}
Αναφέρων: {incident.reporter_name}
Τηλέφωνο: {incident.phone}
Γεωγρ. Πλάτος: {incident.latitude}
Γεωγρ. Μήκος: {incident.longitude}
Ημερομηνία Υποβολής: {incident.submitted_at}
"""

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
                fail_silently=False,
            )

            incident.email_sent = True
            incident.email_sent_at = timezone.now()
            incident.save(update_fields=["email_sent", "email_sent_at"])

            return Response(
                {
                    "message": f"Το περιστατικό στάλθηκε επιτυχώς στο {recipient_email}.",
                    "email_sent": True,
                    "email_sent_at": incident.email_sent_at,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"message": f"Σφάλμα αποστολής email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )