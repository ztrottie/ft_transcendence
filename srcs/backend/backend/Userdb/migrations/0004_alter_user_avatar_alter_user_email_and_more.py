# Generated by Django 4.2.11 on 2024-05-14 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Userdb', '0003_rename_name_user_name_remove_user_email_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='Avatar',
            field=models.CharField(default='NULL', max_length=80),
        ),
        migrations.AlterField(
            model_name='user',
            name='Email',
            field=models.CharField(default='NULL', max_length=80),
        ),
        migrations.AlterField(
            model_name='user',
            name='Login42',
            field=models.CharField(default='NULL', max_length=80),
        ),
        migrations.AlterField(
            model_name='user',
            name='Name',
            field=models.CharField(default='NULL', max_length=80),
        ),
        migrations.AlterField(
            model_name='user',
            name='Name_in_tournement',
            field=models.CharField(default='NULL', max_length=80),
        ),
        migrations.AlterField(
            model_name='user',
            name='Password',
            field=models.CharField(default='NULL', max_length=80),
        ),
    ]
