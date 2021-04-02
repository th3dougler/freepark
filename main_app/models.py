from django.db import models
from django.urls import reverse
from datetime import date
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Spot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lat = models.FloatField()
    lon = models.FloatField()
    notes = models.CharField(max_length=150)
    
    def __str__(self):
        return f'{self.user} - [{self.lat[:.2]},{self.lon[:.2]}]'

class Comment(models.Model):
    spot = models.ForeignKey(Spot, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(5)
        ])
    notes = models.CharField(max_length=150)
    
    def __str__(self):
        return f'{self.user} - [{self.spot}]'


# Create your models here.
