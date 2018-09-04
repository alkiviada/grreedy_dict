from rest_framework import serializers
from words.models import Word, Etymology, Definition, Example


class ExampleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Example 
        fields = ['example']


class DefinitionSerializer(serializers.ModelSerializer):
    examples = ExampleSerializer(many=True)
    class Meta:
        model = Definition 
        fields = ['definition', 'examples']


class EtymologySerializer(serializers.ModelSerializer):
    definitions = DefinitionSerializer(many=True)
    class Meta:
        model = Etymology 
        fields = ['etymology', 'definitions']


class WordSerializer(serializers.ModelSerializer):
    etymologies = EtymologySerializer(many=True)
    class Meta:
        model = Word
        fields = ['word', 'etymologies']

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']

