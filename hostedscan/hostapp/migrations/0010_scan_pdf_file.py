# Generated by Django 4.2.4 on 2023-08-31 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hostapp', '0009_risk'),
    ]

    operations = [
        migrations.AddField(
            model_name='scan',
            name='pdf_file',
            field=models.FileField(blank=True, null=True, upload_to='scans/pdfs/'),
        ),
    ]
