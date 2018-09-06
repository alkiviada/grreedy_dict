from rest_framework import serializers
from words.models import Word, Etymology, Definition, Example
from collections import OrderedDict

class NonNullModelSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        result = super(NonNullModelSerializer, self).to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key] is not None])


class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example 
        fields = ['example']
    def to_representation(self, instance):
        result = super(ExampleSerializer, self).to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key] is not ''])


class DefinitionSerializer(serializers.ModelSerializer):
    examples = ExampleSerializer(many=True)
    class Meta:
        model = Definition 
        fields = ['definition', 'examples']

    def to_representation(self, instance):
        result = super(DefinitionSerializer, self).to_representation(instance)
        [print(key, result[key][0]) for key in result if bool(result[key])]
        return OrderedDict([(key, result[key]) for key in result if not (len(result[key]) == 1 and not result[key][0]) ])


class EtymologySerializer(serializers.ModelSerializer):
    definitions = DefinitionSerializer(many=True)
    class Meta:
        model = Etymology 
        fields = ['etymology', 'definitions']


class WordSerializer(serializers.ModelSerializer):
    word_etymologies = EtymologySerializer(many=True)
    class Meta:
        model = Word
        fields = ['word', 'word_etymologies', 'language']

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']

