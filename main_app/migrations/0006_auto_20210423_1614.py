# Generated by Django 3.1.6 on 2021-04-23 16:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0005_favorite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='url',
            field=models.CharField(default='https://placekitten.com/300/300', max_length=200),
        ),
        migrations.AlterField(
            model_name='spot',
            name='url',
            field=models.CharField(default='https://placekitten.com/1500/900', max_length=200),
        ),
    ]
