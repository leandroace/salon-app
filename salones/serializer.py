from rest_framework import serializers
from .models import Salon, Reserva

class SalonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    # Mostrar el nombre del salón
    salon_nombre = serializers.CharField(source='salon.nombre', read_only=True)
    salon_capacidad = serializers.CharField(source ='salon.capacidad', read_only=True)
    
   
    dia_semana = serializers.ChoiceField(choices=Reserva.DIAS_SEMANA, required=False, allow_null=True)
    fecha = serializers.DateField(required=False)

    class Meta:
        model = Reserva
        fields = ['id', 'salon', 'salon_nombre','salon_capacidad', 'clase', 'fecha', 'hora_inicio', 'hora_fin', 'tipo', 'recurrente', 'dia_semana']

    def to_representation(self, instance):
        """Modificar la representación para que en la respuesta se muestre el nombre del día en lugar del número"""
        representation = super().to_representation(instance)
        if instance.dia_semana is not None:
            representation['dia_semana'] = dict(Reserva.DIAS_SEMANA).get(instance.dia_semana)
        return representation
    
    def to_representation(self, instance):
        """Modificar la representación para mostrar el día en lugar de la fecha si es recurrente."""
        representation = super().to_representation(instance)
        
        if instance.recurrente:
            representation['fecha'] = dict(self.Meta.model.DIAS_SEMANA).get(instance.dia_semana)
        
        return representation
