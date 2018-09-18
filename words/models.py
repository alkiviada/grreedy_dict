from django.db import models
from django.contrib.auth.models import User
from sortedm2m.fields import SortedManyToManyField
import uuid as uuid_lib
from django.db.models import Case, When, Value, IntegerField
from django.db.models import Q

class Etymology(models.Model):
    etymology = models.CharField(max_length=200, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_etymologies', null=True)
    def __str__(self):
        return self.etymology

    def __unicode__(self):
        return self.etymology

class Definition(models.Model):
    definition = models.CharField(max_length=200, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_definitions')
    etymology = models.ForeignKey(Etymology, on_delete=models.CASCADE, related_name='definitions', null=True)

    def __str__(self):
        return self.definition

class Example(models.Model):
    example = models.CharField(max_length=200)
    definition = models.ForeignKey(Definition, on_delete=models.CASCADE, related_name='examples', blank=True, null=True)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='word_examples')

class SingleWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language__in=['english', 'french', 'italian', 'russian', 'ukrainian']).annotate(order=Case(
      When(language='english', then=Value(0)),
      When(language='french', then=Value(1)),
      When(language='italian', then=Value(2)),
      When(language='russian', then=Value(3)),
      When(language='ukrainian', then=Value(4)),
      output_field=IntegerField())).order_by('order')

class EnglishWordManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(language='english')

class FreeWordsManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(Q(word_etymologies__isnull=False)|
          Q(word_definitions__isnull=False)
          ).filter(words=None).distinct()

class Word(models.Model):
    word = models.CharField(max_length=30)
    language = models.CharField(max_length=33)
    lookup_date = models.DateTimeField('date looked up')
    notes = models.CharField(max_length=200)
    translations = models.ManyToManyField("self", blank=True, related_name='translations')
    
    single_object = SingleWordManager()
    english_objects = EnglishWordManager()
    free_words = FreeWordsManager()
    objects = models.Manager()
    
    def __str__(self):
        return self.word

    class Meta:
        ordering = ('-lookup_date',)

class Collection(models.Model):
    name = models.CharField(max_length=30, blank=True)
    words = SortedManyToManyField(Word, related_name='words')
    created_date = models.DateTimeField('date created')
    last_modified_date = models.DateTimeField('date modified')
    notes = models.CharField(max_length=200)
    uuid = models.UUIDField(db_index=True, default=uuid_lib.uuid4, editable=False)
    owner = models.ForeignKey(User, related_name="collections", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-last_modified_date',)
