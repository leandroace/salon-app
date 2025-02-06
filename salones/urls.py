from django.urls import path, include
from rest_framework import routers
from salones import views

router = routers.DefaultRouter()
router.register(r'salones', views.SalonView, basename='salones')  
router.register(r'reservas', views.ReservaView, basename='reservas')  

urlpatterns = [
    path("api/v1/", include(router.urls)),  
]
