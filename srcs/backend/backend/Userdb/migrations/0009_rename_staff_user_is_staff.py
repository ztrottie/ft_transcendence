# Generated by Django 4.2.11 on 2024-05-15 17:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Userdb', '0008_user_staff'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='Staff',
            new_name='is_staff',
        ),
    ]
