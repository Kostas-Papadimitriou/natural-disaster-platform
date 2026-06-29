from rest_framework import serializers
from .models import NaturalDisaster, IncidentReport


class NaturalDisasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaturalDisaster
        fields = ['id', 'name']


class IncidentReportSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()

    class Meta:
        model = IncidentReport
        fields = [
            'id',
            'incident_type',
            'title',
            'description',
            'area',
            'reporter_name',
            'phone',
            'latitude',
            'longitude',
            'photo',
            'video',
            'audio',
            'photo_url',
            'video_url',
            'audio_url',
            'submitted_at',
            'email_sent',
            'email_sent_at',
        ]

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo:
            return request.build_absolute_uri(obj.photo.url) if request else obj.photo.url
        return None

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video:
            return request.build_absolute_uri(obj.video.url) if request else obj.video.url
        return None

    def get_audio_url(self, obj):
        request = self.context.get('request')
        if obj.audio:
            return request.build_absolute_uri(obj.audio.url) if request else obj.audio.url
        return None