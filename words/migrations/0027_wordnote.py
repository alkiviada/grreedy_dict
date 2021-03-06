# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-11-11 23:09
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0026_auto_20181103_1320'),
    ]

    operations = [
        migrations.CreateModel(
            name='WordNote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.TextField()),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='words.Collection')),
                ('word', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='words.Word')),
            ],
        ),
    ]
