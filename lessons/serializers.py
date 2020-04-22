from rest_framework import serializers
from .models import Lesson
from words.models import Word
from words.serializers import WordBareSerializer
from django.core.paginator import Paginator, EmptyPage

class LessonPostSerializer(serializers.ModelSerializer):

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'text', 'title', ]

class LessonBareSerializer(serializers.ModelSerializer):
  title = serializers.SerializerMethodField('pseudo_title')

  def pseudo_title(self, instance):
    return instance.title if instance.title else ' '.join(instance.text.split(' ')[0:3])
   

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'title', ]

class LessonWorkSerializer(serializers.ModelSerializer):
  words = serializers.SerializerMethodField('get_collection_words')
  collId = serializers.SerializerMethodField('get_collection_id')

  def get_collection_id(self, instance):
    if instance.collection:
      return instance.collection.uuid
    else:
      return []

  def get_collection_words(self, instance):
    if instance.collection:
      coll = instance.collection
      page = 1
      all_words = coll.words.all()
      distinct_words = set()
      words = [w for w in all_words if w.word not in distinct_words and (distinct_words.add(w.word) or True)]
      print(len(words))
          
      return WordBareSerializer(words, many=True).data
    else:
      return []

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'text', 'work', 'collId', 'title' , 'words']
