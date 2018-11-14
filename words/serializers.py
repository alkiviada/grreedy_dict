from rest_framework import serializers
from words.models import Word, Etymology, Definition, Example, Collection, Collocation, WordNote
from collections import OrderedDict
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

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
    words = CollectionUUIDSerializer(many=True)

    class Meta:
        model = Word
        fields = ['word', 'word_etymologies', 'language', 'words']

class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language', 'notes']

class SynonymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['word', 'language']

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
    words = WordSerializer(many=True)
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

