from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Target(models.Model):
    
    target = models.CharField(max_length=100)
    tags = models.CharField(max_length=100)

    label = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    


    def __str__(self):
        return self.Target
class Scan(models.Model):
    id=models.IntegerField(primary_key=True,auto_created=True)
    target = models.CharField(max_length=100)
    pdf_file = models.FileField(upload_to='scans/pdfs/', null=True, blank=True)  # Store PDF file here
    pdf_file_raw = models.FileField(upload_to='scans/pdfs/raw', null=True, blank=True)  # Store PDF file here
    label = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    json_file = models.FileField(upload_to='scans/jsons/', null=True, blank=True)  # Store JSON file here
    def __str__(self):
        return self.Scan
class Risk(models.Model):
    id_risk=models.IntegerField()
    Title= models.CharField(max_length=100,default="")
    pdf_file_risk = models.FileField(upload_to='scans/pdfs/risks', null=True, blank=True)  # Store PDF file here
    Scantype= models.CharField(max_length=100)
    target = models.URLField(max_length=100)
    Thread_Level= models.CharField(max_length=100)
    STatus= models.CharField(max_length=100)
    date = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.Risk
class pdf(models.Model):
    pdf_file = models.FileField(upload_to='pdfs/', null=True, blank=True)
