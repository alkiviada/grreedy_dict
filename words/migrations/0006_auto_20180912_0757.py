# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-09-12 11:57
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0005_auto_20180905_0815'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='collection',
            options={'ordering': ('-last_modified_date',)},
        ),
        migrations.AddField(
            model_name='collection',
            name='last_modified_date',
            field=models.DateTimeField(default='2018-09-12 00:00', verbose_name='date modified'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='collection',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4, editable=False),
        ),
    ]
