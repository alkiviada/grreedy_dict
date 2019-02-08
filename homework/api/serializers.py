from rest_framework import serializers
from words.models import Word, Example
from homework.models import Conjugation, ConjugationExample
from words.serializers import ExampleSerializer, CollocationExampleSerializer
from .helpers import pull_conjugations_arrays, process_examples_by_tense, search_books

class ConjugationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Conjugation
    fields = [ 'verb_form' ]

class VerbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']

class ConjugationExampleSerializer(serializers.ModelSerializer):
  conjugation = serializers.SerializerMethodField('get_verb')

  def get_verb(self, instance):
    c = instance.conjugation
    return ConjugationSerializer(c).data

  class Meta:
    model = ConjugationExample
    fields = ['example', 'conjugation']


  def to_representation(self, instance):
    ret = super().to_representation(instance)
    print(ret)
    return ret
