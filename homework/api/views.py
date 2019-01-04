from words.models import Word

from .serializers import (VerbSerializer, ConjugationSerializer)

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

class Conjugate(generics.RetrieveAPIView):
  serializer_class = ConjugationSerializer
  lookup_field = 'word'

  def get_queryset(self):
    return Word.true_verb_objects.all()

  def get_object(self):
    queryset = self.get_queryset()
    filter = {}
    filter[self.lookup_field] = self.kwargs[self.lookup_field]
    print(self.lookup_field)
    return get_object_or_404(queryset, **filter) 
