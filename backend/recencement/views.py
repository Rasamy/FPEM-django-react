from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from .serializers import EgliseSerializer, BapthemeSerializer, FamilleSerializer, PersonneSerializer, RegisterSerializer, UserSerializer
from .models import Eglise, Baptheme, Famille, Personne
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken


class UserConnectedView(APIView):
    
    def get(self, request):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data)
    
class LoggedInUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data)
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class EgliseView(viewsets.ModelViewSet):
    serializer_class = EgliseSerializer
    queryset = Eglise.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Eglise.objects.all()
        user = self.request.query_params.get('author', None)
        if user is not None:
            return qs.filter(author=user)
        return qs


class BapthemeView(viewsets.ModelViewSet):
    serializer_class = BapthemeSerializer
    queryset = Baptheme.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Baptheme.objects.all()
        eglises = self.request.query_params.get('eglise', None)
        user = self.request.query_params.get('author', None)

        if eglises is not None and user is not None:
            return qs.filter(eglise=eglises,author=user)
        return qs


class FamilleView(viewsets.ModelViewSet):
    serializer_class = FamilleSerializer
    queryset = Famille.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Famille.objects.all()
        eglises = self.request.query_params.get('eglise', None)
        user = self.request.query_params.get('author', None)

        if eglises is not None and user is not None:
            return qs.filter(eglise=eglises, author=user)
        return qs


class PersonneView(viewsets.ModelViewSet):
    serializer_class = PersonneSerializer
    queryset = Personne.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Personne.objects.all()
        eglises = self.request.query_params.get('eglise', None)
        bapteme = self.request.query_params.get('bapteme', None)
        user = self.request.query_params.get('author', None)

        if eglises is not None and bapteme is not None and user is not None:
            return qs.filter(eglise=eglises, bapteme=bapteme,author=user)
        return qs
