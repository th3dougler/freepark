# Generated by Django 3.1.6 on 2021-04-08 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main_app', '0003_auto_20210406_1558'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='url',
            field=models.CharField(default='http://placekitten.com/300/300', max_length=200),
        ),
        migrations.AlterField(
            model_name='spot',
            name='url',
            field=models.CharField(default='http://placekitten.com/1500/900', max_length=200),
        ),
    ]
