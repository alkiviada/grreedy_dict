# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-09-18 16:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0013_collection_owner'),
    ]

    operations = [
        migrations.AddField(
            model_name='word',
            name='from_translation',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]