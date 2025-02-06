from django.shortcuts import render
from rest_framework import viewsets
from .serializer import SalonSerializer, ReservaSerializer  # Corrección en el nombre del archivo
from .models import Salon, Reserva

# Vista para manejar los salones
class SalonView(viewsets.ModelViewSet):
    serializer_class = SalonSerializer
    queryset = Salon.objects.all()

# Vista para manejar las reservas
class ReservaView(viewsets.ModelViewSet):
    serializer_class = ReservaSerializer
    queryset = Reserva.objects.all()
