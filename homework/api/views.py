from words.models import Word
from homework.models import Tense, Conjugation, ConjugationExample

from .serializers import (VerbSerializer, 
                         ConjugationSerializer,
                         ConjugationExampleSerializer,
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
    all_verbs = Word.true_verb_objects.exclude(conjugation_word=None)
    tenses = Tense.objects.all()
    verbs_list = []
    for v in all_verbs:
      u_v = ''
      for t in tenses:
        if ConjugationExample.objects.filter(word=v, tense=t).count() >= 5:
          u_v = v
          continue
      if u_v:
        verbs_list.append(u_v)
        continue
    return verbs_list


class Conjugate(generics.RetrieveAPIView):
  serializer_class = ConjugationSerializer
  verb_lookup_fields = ['word', 'language'] 

  def get_queryset(self):
    verb_filter = {}
    filter = {}
    for field in self.verb_lookup_fields:
      if self.kwargs[field]:  # Ignore empty fields.
        verb_filter[field] = self.kwargs[field]
    verb = Word.true_verb_objects.get(**verb_filter)
    print(verb)
    tense = Tense.objects.get(num_id=self.kwargs['tense_idx'])
    filter = {'word': verb, 'tense': tense }
    return Conjugation.objects.filter(**filter)

  def get(self, request, word, language, tense_idx, format=None):
     verb_forms = self.get_queryset()
     serializer = ConjugationSerializer(verb_forms, many=True)
     return Response(serializer.data)


class ConjugateHomework(generics.RetrieveAPIView):
  serializer_class = ConjugationExampleSerializer
  verb_lookup_fields = ['word', 'language']

  def get_queryset(self):
    verb_filter = {}
    for field in self.verb_lookup_fields:
      if self.kwargs[field]:  # Ignore empty fields.
        verb_filter[field] = self.kwargs[field]
    verb = Word.true_verb_objects.get(**verb_filter)
    print(verb)
    tense = Tense.objects.get(num_id=self.kwargs['tense_idx'])
    conjugs_filter = {'word': verb, 'tense': tense }
    conjugs = Conjugation.objects.filter(**conjugs_filter)
    return ConjugationExample.objects.filter(conjugation__in=conjugs)

  def get(self, request, word, language, tense_idx, format=None):
     print(word)
     examples = self.get_queryset()
     serializer = ConjugationExampleSerializer(examples, many=True)
     return Response(serializer.data)
