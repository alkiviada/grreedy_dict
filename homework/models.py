from django.db import models
from words.models import Word

# Create your models here.

class Tense(models.Model):
  tense = models.CharField(max_length=50)
  language = models.CharField(max_length=33)
  num_id = models.IntegerField()

  def __str__(self):
    return self.tense

  class Meta:
    ordering = ('num_id',)


class Pronoun(models.Model):
  pronoun = models.CharField(max_length=50)
  language = models.CharField(max_length=33)
  num_id = models.IntegerField()

  def __str__(self):
    return self.pronoun

  class Meta:
    ordering = ('num_id',)

class Conjugation(models.Model):
  word = models.ForeignKey(Word, related_name="verb_word", on_delete=models.CASCADE)
  tense = models.ForeignKey(Tense, related_name="verb_tense", on_delete=models.CASCADE)
  verb_form = models.CharField(max_length=33)
  pronoun = models.ForeignKey(Pronoun, related_name="verb_pronoun", on_delete=models.CASCADE)

  def __str__(self):
    return self.verb_form

  class Meta:
    ordering = ('pronoun',)


class ConjugationExample(models.Model):
  example = models.TextField()
  conjugation = models.ForeignKey(Conjugation, related_name="conjugation", on_delete=models.CASCADE)
  is_bad = models.BooleanField(default=False)
  word = models.ForeignKey(Word, related_name="conjugation_word", on_delete=models.CASCADE)
  tense = models.ForeignKey(Tense, related_name="conjugation_tense", on_delete=models.CASCADE)
