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
    
    target = models.CharField(max_length=100)
    pdf_file = models.FileField(upload_to='scans/pdfs/', null=True, blank=True)  # Store PDF file here
    label = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    
    json_file = models.FileField(upload_to='scans/jsons/', null=True, blank=True)  # Store JSON file here
    def __str__(self):
        return self.Scan
class Risk(models.Model):
    Title= models.CharField(max_length=100,default="")
    Scantype= models.CharField(max_length=100)
    target = models.URLField(max_length=100)
    Thread_Level= models.CharField(max_length=100)
    
    STatus= models.CharField(max_length=100)
    
    date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.Risk
class pdf(models.Model):
    pdf_file = models.FileField(upload_to='pdfs/', null=True, blank=True)
