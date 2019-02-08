from words.models import Word

from .serializers import (VerbSerializer, 
                         ConjugationSerializer,
                         ConjugateHomeworkSerializer,
)

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.core.exceptions import ObjectDoesNotExist 
from django.http import Http404
from django.shortcuts import get_object_or_404

class VerbsList(generics.ListAPIView):
  serializer_class = VerbSerializer

  def get_queryset(self):
    return Word.true_verb_objects.all()

class ConjugateMixIn(generics.RetrieveAPIView):
  def get_object(self):
    queryset = self.get_queryset()
    filter = {}
    for field in self.lookup_fields:
      if self.kwargs[field]:  # Ignore empty fields.
        filter[field] = self.kwargs[field]
    return get_object_or_404(queryset, **filter) 

class Conjugate(ConjugateMixIn):
  serializer_class = ConjugationSerializer
  lookup_fields = ['word', 'language']

  def get_queryset(self):
    return Word.true_verb_objects.all()

  def get(self, request, word, language, tense_idx, format=None):
     print(tense_idx)
     print(word)
     verb = self.get_object()
     serializer = ConjugationSerializer(verb, context={'tense_idx': tense_idx })
     return Response(serializer.data)


class ConjugateHomework(ConjugateMixIn):
  serializer_class = ConjugationSerializer
  lookup_fields = ['word', 'language']

  def get_queryset(self):
    return Word.true_verb_objects.all()

  def get(self, request, word, language, tense_idx, format=None):
     print(word)
     verb = self.get_object()
     serializer = ConjugateHomeworkSerializer(verb, context={'tense_idx': tense_idx })
     return Response(serializer.data)
