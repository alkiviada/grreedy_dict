# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-08-05 19:15
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='word',
            name='language',
            field=models.CharField(default='english', max_length=30),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='definition',
            name='word',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='word_definition', to='words.Word'),
        ),
        migrations.AlterField(
            model_name='etymology',
            name='word',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='word_etymology', to='words.Word'),
        ),
    ]
