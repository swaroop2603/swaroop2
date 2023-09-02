# Generated by Django 4.2.4 on 2023-08-28 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hostapp', '0002_alter_target_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Scan',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('target', models.URLField(max_length=100)),
                ('label', models.CharField(max_length=100)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]