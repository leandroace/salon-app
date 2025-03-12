from django.db import models
from django.core.exceptions import ValidationError

class Salon(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=255, unique=True)
    piso = models.IntegerField()
    capacidad = models.IntegerField()
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} (Piso {self.piso})"

class Reserva(models.Model):
    TIPOS = [
        ('único', 'Único'),
        ('semestral', 'Semestral'),
    ]
    
    DIAS_SEMANA = [
        (0, 'Lunes'),
        (1, 'Martes'),
        (2, 'Miércoles'),
        (3, 'Jueves'),
        (4, 'Viernes'),
        (5, 'Sábado'),
        (6, 'Domingo'),
    ]

    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    clase = models.CharField(max_length=255)
    fecha = models.DateField(null=True, blank=True)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    tipo = models.CharField(max_length=10, choices=TIPOS)
    recurrente = models.BooleanField(default=False)
    dia_semana = models.IntegerField(choices=DIAS_SEMANA, null=True, blank=True)

    def clean(self):
        if self.tipo == 'único' and not self.fecha:
            raise ValidationError("Debe especificar una fecha para eventos únicos.")
        if self.tipo == 'semestral' and self.fecha:
            raise ValidationError("No puede haber una fecha específica en clases semestrales.")

        reservas_existentes = Reserva.objects.filter(
            salon=self.salon,
            hora_inicio__lt=self.hora_fin,
            hora_fin__gt=self.hora_inicio
        )

        if self.recurrente:
            reservas_existentes = reservas_existentes.filter(
                recurrente=True,
                dia_semana=self.dia_semana
            )
        else:
            reservas_existentes = reservas_existentes.filter(fecha=self.fecha)

        if reservas_existentes.exists():
            raise ValidationError("El salón ya está reservado en ese horario.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        if self.recurrente:
            return f"{self.clase} - {dict(self.DIAS_SEMANA)[self.dia_semana]} de {self.hora_inicio} a {self.hora_fin}"
        return f"{self.clase} en {self.salon.nombre} el {self.fecha} de {self.hora_inicio} a {self.hora_fin}"
