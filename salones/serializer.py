from rest_framework import serializers
from .models import Salon, Reserva

class SalonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    # Usamos `get_dia_semana_display` para mostrar el nombre del día en vez del número
    dia_semana = serializers.CharField(source='get_dia_semana_display', required=False)
    fecha = serializers.DateField(required=False)
    salon = SalonSerializer(read_only=True)

    class Meta:
        model = Reserva
        fields = ['id', 'salon', 'clase', 'fecha', 'hora_inicio', 'hora_fin', 'tipo', 'recurrente', 'dia_semana']

    def to_representation(self, instance):
        """Modificar la representación para mostrar el día en lugar de la fecha si es recurrente."""
        representation = super().to_representation(instance)
        
        # Si es recurrente, mostramos el día en lugar de la fecha
        if instance.recurrente:
            # Reemplazamos el campo `fecha` por el nombre del día correspondiente
            representation['fecha'] = dict(self.Meta.model.DIAS_SEMANA).get(instance.dia_semana)
        return representation
