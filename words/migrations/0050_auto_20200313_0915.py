# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-03-13 13:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0049_auto_20200313_0914'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inflections',
            name='inflections',
            field=models.TextField(),
        ),
    ]