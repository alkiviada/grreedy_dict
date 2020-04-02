from rest_framework import serializers
from .models import Lesson

class LessonPostSerializer(serializers.ModelSerializer):

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'text', 'name', ]

class LessonBareSerializer(serializers.ModelSerializer):
  title = serializers.SerializerMethodField('pseudo_title')

  def pseudo_title(self, instance):
    return instance.title if instance.title else ' '.join(instance.text.split(' ')[0:3])
   

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'title', ]

class LessonWorkSerializer(serializers.ModelSerializer):

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'text', 'work', 'collection', ]
