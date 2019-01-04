from rest_framework import serializers
from words.models import Word
from .helpers import pull_conjugations_arrays

class ConjugationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Word
    fields = ['word', 'conjugations']

  def to_representation(self, instance):
    ret = super().to_representation(instance)
    ret['conjugations'] = pull_conjugations_arrays(ret['conjugations'])
    return ret

class VerbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']
