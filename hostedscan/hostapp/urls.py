from django.urls import path
from .views import TargetAPI

from . import views

urlpatterns = [
    path('upload-pdf/', views.upload_pdf, name='upload_pdf'),
]
