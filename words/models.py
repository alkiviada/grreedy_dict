from django.db import models
import uuid as uuid_lib
from django.db.models import Case, When, Value, IntegerField

class Etymology(models.Model):
    etymology = models.CharField(max_length=200)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_etymologies')
    def __str__(self):
        return self.etymology

    def __unicode__(self):
        return self.etymology

class Definition(models.Model):
    definition = models.CharField(max_length=200)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_definitions')
    etymology = models.ForeignKey(Etymology, on_delete=models.CASCADE, related_name='definitions')

    def __str__(self):
        return self.definition

class Example(models.Model):
    example = models.CharField(max_length=200)
    definition = models.ForeignKey(Definition, on_delete=models.CASCADE, related_name='examples')
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_examples')

class WordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language__in=['english', 'french', 'italian']).annotate(order=Case(
      When(language='english', then=Value(0)),
      When(language='french', then=Value(1)),
      When(language='italian', then=Value(2)),
      output_field=IntegerField())).order_by('order')

class EnglishWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='english')

class Word(models.Model):
    word = models.CharField(max_length=30)
    language = models.CharField(max_length=33)
    lookup_date = models.DateTimeField('date looked up')
    notes = models.CharField(max_length=200)
    translations = models.ManyToManyField("self", blank=True, related_name='translations')
    
    objects = WordManager()
    english_objects = EnglishWordManager()
    
    def __str__(self):
        return self.word

    class Meta:
        ordering = ('-lookup_date',)

class Collection(models.Model):
    name = models.CharField(max_length=30, blank=True)
    words = models.ManyToManyField(Word, blank=True, related_name='words')
    created_date = models.DateTimeField('date created')
    last_modified_date = models.DateTimeField('date modified')
    notes = models.CharField(max_length=200)
    uuid = models.UUIDField(db_index=True, default=uuid_lib.uuid4, editable=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-last_modified_date',)
