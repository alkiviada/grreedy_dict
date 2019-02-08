from rest_framework import serializers
from words.models import Word, Example
from words.serializers import ExampleSerializer, CollocationExampleSerializer
from .helpers import pull_conjugations_arrays, process_examples_by_tense, search_books

class ConjugationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Word
    fields = ['word', 'conjugations']

  def to_representation(self, instance):
    tense_idx = self.context['tense_idx']
    ret = super().to_representation(instance)
    ret['conjugations'] = pull_conjugations_arrays(ret['conjugations'], tense_idx)
    return ret

class VerbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']

class ConjugateHomeworkSerializer(serializers.ModelSerializer):
  examples = serializers.SerializerMethodField('get_examples_list')

  def get_examples_list(self, instance):
    examples = instance.word_examples.distinct()
    collocs = instance.word_collocations.distinct()

    if not len([ *collocs, *examples]): 
      w = Word.objects.filter(origin_verb=instance).first()
      print(w)
      if w:
        examples = w.word_examples.distinct()
        collocs = w.word_collocations.distinct()
    if not len(collocs): 
      try:
        objects_manager = getattr(Word, instance.language + '_objects')
        print(objects_manager)
        try:
          collocs_method = getattr(objects_manager, 'fetch_collocations')
          collocs = collocs_method(instance)
        except Exception as e: 
          print(e)
          print('No method to get collocations')
          raise Http404("No Collocations API for the word:", word)
      except Exception as e: 
        print(e)
        print('No method to get collocations')
        raise Http404("No Collocations API for the word:", word)
    print(collocs)
    #print(CollocationExampleSerializer(collocs, many=True).data)
    #print(ExampleSerializer(examples, many=True).data)
    return [ *ExampleSerializer(examples, many=True).data, *CollocationExampleSerializer(collocs, many=True).data]

  class Meta:
    model = Word
    fields = ['word', 'examples']

  def to_representation(self, instance):
    tense_idx = self.context['tense_idx']
    ret = super().to_representation(instance)
    conjugations = pull_conjugations_arrays(instance.conjugations, tense_idx)
    #ret['examples'])
    examples = process_examples_by_tense(ret['examples'], conjugations)
    if len(examples) < 110:
      print('malo')
      examples = [ *examples, *search_books(conjugations) ]
      print(examples)
    ret['examples'] = examples
    return ret

