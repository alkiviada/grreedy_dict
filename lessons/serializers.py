from rest_framework import serializers
from .models import Lesson

class LessonPostSerializer(serializers.ModelSerializer):

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'text', ]

class LessonWorkSerializer(serializers.ModelSerializer):

  class Meta:
    model = Lesson
    fields = [ 'lesson_id', 'text', 'work', 'collection', ]
