# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-10-02 17:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0020_auto_20181002_0824'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collocation',
            name='example',
            field=models.CharField(max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='collocation',
            name='expression',
            field=models.CharField(max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='collocation',
            name='translation',
            field=models.CharField(max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='example',
            name='example',
            field=models.CharField(max_length=400),
        ),
    ]