# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-02-08 14:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homework', '0002_auto_20190206_1619'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conjugationexample',
            name='example',
            field=models.CharField(max_length=800),
        ),
    ]
