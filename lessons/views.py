from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Lesson

from .serializers import (LessonPostSerializer, LessonWorkSerializer)


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
    print(request.data)
    lesson_id = request.data.get('lessonId')


    lesson = Lesson.objects.get(lesson_id=lesson_id)
    lesson.work = work
    lesson.save(update_fields=['work'])
    return Response(LessonPostSerializer(lesson).data)

class LessonCreateUpdate(generics.GenericAPIView):
  def get(self, request, lesson_id):
    print('GET Lesson')

    lesson = Lesson.objects.get(lesson_id=lesson_id)

    return Response(LessonPostSerializer(lesson).data)

  def post(self, request, format=None):
    print('ADD Lesson')
    text = request.data.get('text')
    print(request.data)
    lesson_id = request.data.get('lessonId')

    defaults = { 'text': text }
    print(lesson_id)

    if lesson_id:
      lesson = Lesson.objects.get(lesson_id=lesson_id)
      lesson.text = text
      lesson.save(update_fields=['text'])
    else:
      lesson = Lesson.objects.create(**{'text': text})

    return Response(LessonPostSerializer(lesson).data)
