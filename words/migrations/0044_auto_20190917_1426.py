# Generated by Django 2.2.5 on 2019-09-17 18:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0043_translationsmap'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inflections',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inflections', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ('pk',),
            },
        ),
        migrations.CreateModel(
            name='WordExamples',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('example', models.TextField()),
                ('inflections', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='example_inflections', to='words.Inflections')),
            ],
            options={
                'ordering': ('pk',),
            },
        ),
        migrations.AddField(
            model_name='word',
            name='inflections',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='word_inflections', to='words.Inflections'),
        ),
    ]
