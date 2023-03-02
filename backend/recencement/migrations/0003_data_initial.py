# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.contrib.auth.admin import User
from recencement.models import Eglise


def create_superuser(apps, schema_editor):
    superuser = User()
    superuser.is_active = True
    superuser.is_superuser = True
    superuser.is_staff = True
    superuser.username = 'admin'
    superuser.email = 'admin@fpem.com'
    superuser.set_password('Admin123#123#')
    superuser.save()


def create_user(apps, schema_editor):
    superuser = User()
    superuser.is_active = True
    superuser.is_superuser = False
    superuser.is_staff = True
    superuser.username = 'staff'
    superuser.email = 'staff@fpem.com'
    superuser.set_password('Staff123#123#')
    superuser.save()

class Migration(migrations.Migration):
    dependencies = [
    ]

    operations = [
        migrations.RunPython(create_superuser),
        migrations.RunPython(create_user)

    ]
