# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-09-13 20:53
from __future__ import unicode_literals

from django.db import migrations
import django.db.models.manager
import sortedm2m.fields
from sortedm2m.operations import AlterSortedManyToManyField

class Migration(migrations.Migration):

    dependencies = [
        ('words', '0006_auto_20180912_0757'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='word',
            managers=[
                ('single_object', django.db.models.manager.Manager()),
            ],
        ),
        AlterSortedManyToManyField(
            model_name='collection',
            name='words',
            field=sortedm2m.fields.SortedManyToManyField(help_text=None, to='words.Word'),
        ),
    ]