from words.models import Word, Definition, Etymology, Example, Collection
from words.utils import fetch_translations, fetch_word
from django.utils import timezone
from knox.models import AuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from words.serializers import (WordSerializer, TranslationSerializer, CollectionSerializer, 
                               CollectionDetailSerializer, CreateUserSerializer, UserSerializer, LoginUserSerializer)

from rest_framework import generics
from rest_framework.response import Response

from django.core.exceptions import ObjectDoesNotExist 
from django.http import Http404


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class UserAPI(generics.RetrieveAPIView):
    permission_classes = [ IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class WordList(generics.ListAPIView):
  serializer_class = WordSerializer
  permission_classes = [ AllowAny, ]
  def get_queryset(self):
    return Word.free_words.all()

class CollectionDetail(generics.RetrieveUpdateAPIView):
  permission_classes = [ IsAuthenticated, ]
  def get_queryset(self):
    return Collection.objects.all()

  lookup_field = 'uuid'
  serializer_class = CollectionDetailSerializer

class CollectionCreate(generics.ListCreateAPIView):
  permission_classes = [ IsAuthenticated, ]
  lookup_field = 'name'
  serializer_class = CollectionSerializer
  def post(self, request):
    words = request.data.get('collection').split(',')

    name = request.data.get('name')
    uuid = request.data.get('uuid')
    print(uuid);
    print(name);
    coll = '';
    if uuid:
      try:
        coll = Collection.objects.get(uuid=uuid) 
        coll.name = name
        coll.last_modified_date = timezone.now() 
        coll.save()
      except ObjectDoesNotExist:
        print ("Something Wrong with UUID: ", uuid)
    elif name:
      print('i have no uuid but i have name')
      coll = Collection.objects.filter(name=name).first() 
      if not coll: 
        coll = Collection.objects.create(created_date=timezone.now(), name=name, last_modified_date=timezone.now())
      else:
        coll.last_modified_date = timezone.now() 
        coll.save()
    else: 
      next_count = str(Collection.objects.filter(name__startswith='Untitled').count() + 1)
      name = 'Untitled: ' + next_count;
      coll = Collection.objects.create(created_date=timezone.now(), name=name, last_modified_date=timezone.now())

    updated_words = []
    for w in words:
      w = Word.single_object.filter(word=w)
      updated_words.extend(w)
    
    coll.words.clear()
    coll.words.add(*updated_words)
    colls = Collection.objects.all()
    serializer = CollectionSerializer(colls, many=True)
    return Response(serializer.data)

  def get_queryset(self):
    queryset = Collection.objects.all()
    return queryset

class WordSingleCreate(generics.ListAPIView):
  permission_classes = [ AllowAny, ]
  lookup_field = 'word'
  serializer_class = WordSerializer
  queryset = Word.single_object.all()

  def get(self, request, word, *args, **kwargs):
    print('GET ' + word);
    db_words = Word.single_object.filter(word=word);
    complete_word = 0
    for w in db_words:
      for e in w.word_etymologies.all():
        print(e.etymology)
        if e.etymology: 
          complete_word = 1        
          break
      if not complete_word:
        for d in w.word_definitions.all():
          print(d.definition)
          if d.definition: 
            complete_word = 1        
            break
    print(complete_word)

    if not db_words or not complete_word:
      print("Word is not in our DB");
      fetch_word(word);
      db_words = Word.single_object.filter(word=word);
      if not db_words:
        print("Could not fetch word:" + word);
        raise Http404("No API for the word:", word)

    serializer = WordSerializer(db_words, many=True)
    return Response(serializer.data)
    
class WordSingleCreateTranslate(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  def get_queryset(self):
    queryset = Word.objects.all()
    return queryset
  lookup_field = 'word'
  serializer_class = TranslationSerializer
  def get(self, request, translate, word, *args, **kwargs):
    language = orig_word = ''
    print(word);
    orig_word = Word.english_objects.get(word=word);
    translated_words = Word.single_object.filter(translations=orig_word);
    print(translated_words);
    if not translated_words:
      print("Translations for this Word are not in our DB");
      fetch_translations(word, orig_word);
      translated_words = Word.single_object.filter(translations=orig_word);
      print(translated_words);
      if not translated_words:
        print("Word is not in our DB");
        raise Http404("No Translation API for the word:", word)
      
    serializer = TranslationSerializer(translated_words, many=True)
    return Response(serializer.data)

lingvo_api_key = 'OTQwMTgzY2EtYmI3NC00OGQ4LTgyNjctYzhiYTI2ZWM4NzU4OjEwNTljMTg1MTEyOTQ5ODlhMmEyMThmY2Q0Y2M2MjE5'


