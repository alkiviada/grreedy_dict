from rest_framework import serializers
from .models import Word, Etymology, Definition, Example, Collection, Collocation, WordNote, WordExamples
from homework.models import Tense
from collections import OrderedDict
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    has_collections = serializers.SerializerMethodField('get_collections_boolean')

    def get_collections_boolean(self, instance):
      print(instance)
      print(Collection.objects.filter(owner=instance).count())
      return Collection.objects.filter(owner=instance).count() 

    def validate(self, data):
        print(data)
        user = authenticate(**data)
        print(user)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")


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
        return OrderedDict([(key, result[key]) for key in result if not (len(result[key]) == 1 and not result[key][0]) ])

class EtymologySerializer(serializers.ModelSerializer):
    definitions = DefinitionSerializer(many=True)
    class Meta:
        model = Etymology 
        fields = ['etymology', 'definitions']

    def to_representation(self, instance):
        result = super(EtymologySerializer, self).to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if not (len(result[key]) == 1 and not result[key][0]) ])

class CollectionUUIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = [ 'uuid', 'name' ]

class WordNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = WordNote
        fields = ['note' ]

class WordSerializer(serializers.ModelSerializer):
  word_etymologies = EtymologySerializer(many=True)
  has_corpora = serializers.SerializerMethodField('check_corpora')

  def check_corpora(self, instance):
    print('hmm');
    inflections = instance.inflections
    examples  = WordExamples.objects.filter(inflections=inflections).count()
    print(examples)
    return 1 if examples else 0

  class Meta:
    model = Word
    fields = [ 'word', 'word_etymologies', 'language', 'is_verb', 'has_corpora' ]

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language', 'notes']

class PronounceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['pronounce', 'language']

class ConjugateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Word
    fields = ['conjugations', 'language', 'did_book_examples', 'word']

  def to_representation(self, instance):
    result = super(ConjugateSerializer, self).to_representation(instance)
    if not result['did_book_examples']:
      return result
    print(self)
    tenses = Tense.objects.all()
    have_examples = 0
    for t in tenses:
      if instance.conjugation_word.filter(tense=t).count() > 4:
        have_examples = 1
        break
    if have_examples:
      result['did_book_examples'] = 1
    else:
      result['did_book_examples'] = 0 
    print(result['did_book_examples'])
    return result

class SynonymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']

class CollocationExampleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Collocation
    fields = ['example']
  def to_representation(self, instance):
    result = super(CollocationExampleSerializer, self).to_representation(instance)
    return OrderedDict([(key, result[key]) for key in result if result[key] is not ''])

class CollocationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Collocation
    fields = ['expression', 'translation', 'example']
  def to_representation(self, instance):
    result = super(CollocationSerializer, self).to_representation(instance)
    return OrderedDict([(key, result[key]) for key in result if result[key] is not ''])
  
class CollectionSerializer(serializers.ModelSerializer):
    last_modified_date = serializers.DateTimeField(format="%m-%d %H:%M", required=False, read_only=True)
    class Meta:
        model = Collection
        fields = ['name', 'uuid', 'last_modified_date']


class CollectionDetailSerializer(serializers.ModelSerializer):
  words = serializers.SerializerMethodField('get_words_list')

  def get_words_list(self, instance):
    words = Word.objects.filter(words=instance).order_by('collectionofwords')
    return WordSerializer(words, many=True).data

  class Meta:
    model = Collection
    fields = ['name', 'uuid', 'words']


class CreateUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'password')
    extra_kwargs = {'password': {'write_only': True}}

  def create(self, validated_data):
    user = User.objects.create_user(validated_data['username'],
                                    None,
                                    validated_data['password'])
    return user


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username')

class WordExampleSerializer(serializers.ModelSerializer):
  class Meta:
    model = WordExamples
    fields = ('example', 'pk')
