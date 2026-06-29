from django.db import models


class NaturalDisaster(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class IncidentReport(models.Model):
    INCIDENT_TYPES = [
        ('Πυρκαγιά', 'Πυρκαγιά'),
        ('Τροχαίο', 'Τροχαίο'),
        ('Διάσωση', 'Διάσωση'),
        ('Πλημμύρα', 'Πλημμύρα'),
        ('Άλλο', 'Άλλο'),
    ]

    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPES, default='Άλλο')
    title = models.CharField(max_length=200)
    description = models.TextField()

    area = models.CharField(max_length=255, blank=True, default='')
    reporter_name = models.CharField(max_length=255, blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    photo = models.ImageField(upload_to='incident_media/photos/', null=True, blank=True)
    video = models.FileField(upload_to='incident_media/videos/', null=True, blank=True)
    audio = models.FileField(upload_to='incident_media/audio/', null=True, blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)
    email_sent = models.BooleanField(default=False)
    email_sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title