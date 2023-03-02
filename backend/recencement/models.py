from django.db import models
from django.contrib.auth.models import User

import datetime

now = datetime.datetime.now()

STATUSFIDELE = (
    (0, "pas fidele"),
    (1, "fidele")
)

FEU = (
    (0, "mort"),
    (1, "vivant")
)

SEXE = (
    (0, "Féminin"),
    (1, "Masculin")
)

STATUSBAPTISE = (
    (0, "Pas encore baptisé"),
    (1, "baptisé")
)

STATUSMARIED = (
    (0, "Marié"),
    (1, "Célibataire"),
    (2, "Veuve/veuf")
)

SITUATIONFAMILIALE = (
    (0, "Père"),
    (1, "Mère"),
    (2, "Fils/Fille"),
    (3, "Adopté (Taiza)"),
    (4, "MPANAMPY")
)


class Eglise(models.Model):
    name = models.CharField(max_length=200, unique=True)
    contact = models.CharField(max_length=50)
    created_on = models.DateTimeField(default=now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name


class Baptheme(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    eglise = models.ForeignKey('Eglise', on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name


class Famille(models.Model):
    firstname = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)
    is_fidele = models.IntegerField(choices=STATUSFIDELE, default=0)
    address = models.CharField(max_length=200)
    contact = models.CharField(max_length=50)
    eglise = models.ForeignKey('Eglise', on_delete=models.CASCADE)
    created_on = models.DateTimeField(default=now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.firstname


class Personne(models.Model):
    firstname = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)
    age = models.IntegerField(default=0)
    address = models.CharField(max_length=200)
    contact = models.CharField(max_length=20)
    is_maried = models.IntegerField(choices=STATUSMARIED, default=0)
    is_baptised = models.IntegerField(choices=STATUSBAPTISE, default=0)
    situation_familiale = models.IntegerField(choices=SITUATIONFAMILIALE, default=0)
    feu = models.IntegerField(choices=FEU, default=1)
    sexe = models.IntegerField(choices=SEXE, default=0)
    famille = models.ForeignKey('Famille', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    eglise = models.ForeignKey('Eglise', on_delete=models.CASCADE)
    baptheme = models.ForeignKey('Baptheme', on_delete=models.CASCADE,default=0)
    created_on = models.DateTimeField(default=now)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.firstname
