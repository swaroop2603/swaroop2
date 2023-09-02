from rest_framework import serializers
from .models import Target,Scan,pdf,Risk
class Targetserializer(serializers.ModelSerializer):
    class Meta:
        model=Target
        fields='__all__'
class Scanserializer(serializers.ModelSerializer):
    class Meta:
        model=Scan
        fields='__all__'
class pdfserializer(serializers.ModelSerializer):
    class Meta:
        model=pdf
        fields="__all__"
class Riskserializer(serializers.ModelSerializer):
    class Meta:
        model=Risk
        fields="__all__"