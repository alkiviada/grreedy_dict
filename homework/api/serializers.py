from rest_framework import serializers
from words.models import Word
from .helpers import pull_conjugations_arrays

class ConjugationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Word
    fields = ['word', 'conjugations']

  def to_representation(self, instance):
    print(self.context)
    tense_idx = self.context['tense_idx']
    ret = super().to_representation(instance)
    ret['conjugations'] = pull_conjugations_arrays(ret['conjugations'], tense_idx)
    return ret

class VerbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']
