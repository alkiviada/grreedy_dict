from django.db import models

class Etymology(models.Model):
    etymology = models.CharField(max_length=200)
    word = models.ForeignKey('Word', on_delete=models.CASCADE, related_name='etymologies')
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

class Word(models.Model):
    word = models.CharField(max_length=30)
    language = models.CharField(max_length=33)
    lookup_date = models.DateTimeField('date looked up')
    notes = models.CharField(max_length=200)
    translations = models.ManyToManyField("self", blank=True, related_name='translations')
    
    
    def __str__(self):
        return self.word

    class Meta:
        ordering = ('-lookup_date',)

class Collection(models.Model):
    name = models.CharField(max_length=30, blank=True)
    words = models.ManyToManyField(Word, blank=True, related_name='words')
    created_date = models.DateTimeField('date created')
    notes = models.CharField(max_length=200)
    
    def __str__(self):
        return self.name

    class Meta:
        ordering = ('-created_date',)
