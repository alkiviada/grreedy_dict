from django.db import models
import uuid as uuid_lib
from words.models import Collection

# Create your models here.

class Lesson(models.Model):
    text = models.TextField(null=True)
    work = models.TextField(null=True)
    title = models.CharField(max_length=100, null=True)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, null=True)
    lesson_id = models.UUIDField(db_index=True, default=uuid_lib.uuid4, editable=False)

    def __str__(self):
        return self.title

    def __unicode__(self):
        return self.title
