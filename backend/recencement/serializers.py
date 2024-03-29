from rest_framework import serializers
from .models import Eglise, Baptheme, Famille, Personne

from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','first_name','last_name')

class EgliseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eglise
        fields = ('id','name','contact','created_on','author')


class BapthemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Baptheme
        fields = ('id','name','description','eglise','created_on','author')


class FamilleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Famille
        fields = ('id','firstname','lastname','is_fidele','address','contact','eglise','created_on','author','image_url')


class PersonneSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(required=False,use_url=True)
    class Meta:
        model = Personne
        fields = ('id','firstname','lastname','age','address','contact','is_maried','is_baptised','situation_familiale','feu','sexe','famille','author','eglise','baptheme','created_on','image_url')


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user