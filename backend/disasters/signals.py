from asgiref.sync import async_to_sync
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer

from .models import IncidentReport
from .serializers import IncidentReportSerializer


@receiver(post_save, sender=IncidentReport)
def incident_created_handler(sender, instance, created, **kwargs):
    if not created:
        return

    channel_layer = get_channel_layer()
    serializer = IncidentReportSerializer(instance)

    async_to_sync(channel_layer.group_send)(
        "incidents_group",
        {
            "type": "incident_created",
            "incident": serializer.data,
        }
    )