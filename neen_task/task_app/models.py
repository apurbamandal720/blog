from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Blog(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField(null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    is_published = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title