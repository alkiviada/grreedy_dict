# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-09-20 15:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0015_auto_20180918_1217'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collocation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('expression', models.CharField(max_length=200, null=True)),
                ('translation', models.CharField(max_length=200, null=True)),
                ('example', models.CharField(max_length=200, null=True)),
            ],
        ),
        migrations.AlterModelManagers(
            name='word',
            managers=[
            ],
        ),
        migrations.AddField(
            model_name='collocation',
            name='word',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='word_collocations', to='words.Word'),
        ),
    ]
