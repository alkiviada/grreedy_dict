# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-11-16 21:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0028_auto_20181116_1643'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collocation',
            name='example',
            field=models.CharField(max_length=700, null=True),
        ),
        migrations.AlterField(
            model_name='collocation',
            name='expression',
            field=models.CharField(max_length=700, null=True),
        ),
        migrations.AlterField(
            model_name='collocation',
            name='translation',
            field=models.CharField(max_length=700, null=True),
        ),
        migrations.AlterField(
            model_name='example',
            name='example',
            field=models.CharField(max_length=700),
        ),
    ]
