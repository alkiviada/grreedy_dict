# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-09-14 20:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0009_auto_20180914_1313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='etymology',
            name='word',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='word_etymologies', to='words.Word'),
        ),
    ]