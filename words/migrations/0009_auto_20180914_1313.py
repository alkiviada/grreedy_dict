# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-09-14 17:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0008_auto_20180913_1702'),
    ]

    operations = [
        migrations.AlterField(
            model_name='example',
            name='definition',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='examples', to='words.Definition'),
        ),
    ]
