# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-07-09 22:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0040_language'),
    ]

    operations = [
        migrations.CreateModel(
            name='LookupMap',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lookup_date', models.DateTimeField(verbose_name='date looked up')),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='words.Language')),
                ('word', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='words.Word')),
            ],
            options={
                'ordering': ('-lookup_date',),
            },
        ),
    ]