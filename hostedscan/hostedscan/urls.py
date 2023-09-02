"""Hostedscan URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers  # add this
from hostapp import views  # add this
from django.conf import settings
from django.conf.urls.static import static
router = routers.DefaultRouter()  # add this
router.register("", views.TargetAPI, basename='target')
urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/target', views.ApiView.as_view(), name='api_target'),
    path('api/target/<int:id>', views.ApiView.as_view(), name='api_target'),
    path('api/scan', views.ApiView_s.as_view(), name='api_scan'),
    path('api/scan/<int:id>', views.ApiView_s.as_view(), name='api_scan'),
    path('api/target/pdf', views.JSONToPDF.as_view(), name='api_targetpdf'),
    path('api/risks', views.ApiView_Risk.as_view(), name='api_risk'),
    path('api/risks/<int:id>', views.ApiView_Risk.as_view(), name='api_risk'),
    path('api/sslyze-scan', views.SSLyzeScanAPI.as_view(), name='api_sslyze_scan'),
    path('', include('hostapp.urls')),

]