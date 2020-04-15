from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Lesson
from words.models import Collection

from .serializers import (LessonPostSerializer, LessonWorkSerializer, LessonBareSerializer)


class LessonWork(generics.RetrieveUpdateAPIView):
  def get_queryset(self):
    return Lesson.objects.get(lesson_id=lesson_id)

  lookup_field = 'lesson_id'
  serializer_class = LessonWorkSerializer

  def get(self, request, lesson_id, *args, **kwargs):
    print('I have lesson ID: ' + lesson_id)

    lesson = Lesson.objects.get(lesson_id=lesson_id) 
    lesson_serialized = LessonWorkSerializer(lesson)
    return Response(lesson_serialized.data)

  def post(self, request, format=None):
    print('ADD Lesson Work')
    work = request.data.get('work')
    collId  = request.data.get('collId')
    print(request.data)
    lesson_id = request.data.get('lessonId')


    lesson = Lesson.objects.get(lesson_id=lesson_id)
    collection = Collection.objects.get(uuid=collId)

    lesson.work = work
    lesson.collection = collection
    lesson.save(update_fields=['work', 'collection'])
    return Response(LessonPostSerializer(lesson).data)

class LessonCreateUpdate(generics.GenericAPIView):
  def get(self, request, lesson_id):
    print('GET Lesson')

    lesson = Lesson.objects.get(lesson_id=lesson_id)

    return Response(LessonPostSerializer(lesson).data)

  def post(self, request, format=None):
    print('ADD Lesson')
    text = request.data.get('text')
    title = request.data.get('title')
    print(request.data)
    lesson_id = request.data.get('lessonId')

    defaults = { 'text': text }
    print(lesson_id)

    if lesson_id:
      lesson = Lesson.objects.get(lesson_id=lesson_id)
      lesson.text = text
      lesson.title = title 
      lesson.save(update_fields=['text', 'title'])
    else:
      lesson = Lesson.objects.create(**{'text': text, 'title': name})

    return Response(LessonPostSerializer(lesson).data)

class LessonList(generics.ListAPIView):
  serializer_class = LessonPostSerializer

  def get_queryset(self):
    return Lesson.objects.all()

  def get(self, request, *args, **kwargs):
    print('many')
    lessons = Lesson.objects.all()
    serializer = LessonBareSerializer(lessons, many=True)
    return Response({ 'lessons': serializer.data, })
