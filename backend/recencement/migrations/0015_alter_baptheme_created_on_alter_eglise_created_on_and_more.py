# Generated by Django 4.0.6 on 2023-03-10 14:19

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recencement', '0014_alter_baptheme_created_on_alter_eglise_created_on_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baptheme',
            name='created_on',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 10, 14, 19, 3, 510758)),
        ),
        migrations.AlterField(
            model_name='eglise',
            name='created_on',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 10, 14, 19, 3, 510758)),
        ),
        migrations.AlterField(
            model_name='famille',
            name='created_on',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 10, 14, 19, 3, 510758)),
        ),
        migrations.AlterField(
            model_name='personne',
            name='created_on',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 10, 14, 19, 3, 510758)),
        ),
    ]
