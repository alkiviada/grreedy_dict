# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-11-03 17:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0025_auto_20181103_1318'),
    ]

    operations = [
        migrations.AlterField(
            model_name='word',
            name='notes',
            field=models.CharField(max_length=400),
        ),
    ]