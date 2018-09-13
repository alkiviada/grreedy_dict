from words.models import Word, Definition, Etymology, Example, Collection
from words.utils import fetch_translations, fetch_word
from django.db.models import Q
from django.utils import timezone

from words.serializers import WordSerializer, TranslationSerializer, CollectionSerializer, CollectionDetailSerializer

from rest_framework import generics
from rest_framework.response import Response

from django.core.exceptions import ObjectDoesNotExist 
from django.http import Http404

class WordList(generics.ListAPIView):
    serializer_class = WordSerializer
    def get_queryset(self):
        queryset = Word.single_object.filter(
          Q(word_examples__isnull=False)|
          Q(word_etymologies__isnull=False)
          ).filter(words=None).distinct()
        return queryset

class CollectionDetail(generics.RetrieveUpdateAPIView):
  queryset = Collection.objects.all()
  lookup_field = 'uuid'
  serializer_class = CollectionDetailSerializer


class CollectionCreate(generics.ListCreateAPIView):
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
        coll.save()
      except ObjectDoesNotExist:
        print ("Something Wrong with UUID: ", uuid)
    else: 
      coll = Collection.objects.create(created_date=timezone.now(), name=name, last_modified_date=timezone.now())

    words = Word.objects.filter(word__in=words)
    coll.words.add(*words)
    colls = Collection.objects.all()
    serializer = CollectionSerializer(colls, many=True)
    return Response(serializer.data)

  def get_queryset(self):
    queryset = Collection.objects.all()
    return queryset


class WordSingleCreate(generics.ListAPIView):
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
  queryset = Word.objects.all()
  lookup_field = 'word'
  serializer_class = TranslationSerializer
  def get(self, request, translate, word, *args, **kwargs):
    queryset = self.get_queryset()
    language = orig_word = ''
    print(word);
    orig_word = Word.english_objects.get(word=word);
    translated_words = Word.single_object.filter(translations=orig_word);
    print(translated_words);
    if not translated_words:
      print("Translations for this Word are not in our DB");
      fetch_translations(word, orig_word);
      translated_words = Word.objects.filter(translations=orig_word);
      print(translated_words);
      if not translated_words:
        print("Word is not in our DB");
        raise Http404("No Translation API for the word:", word)
      
    serializer = TranslationSerializer(translated_words, many=True)
    return Response(serializer.data)


yandex_api_key = "dict.1.1.20180805T185344Z.55f2c2cb3a648836.7bbf15c7374a967b79489eb097a0403e309aebcc"
lingvo_api_key = 'OTQwMTgzY2EtYmI3NC00OGQ4LTgyNjctYzhiYTI2ZWM4NzU4OjEwNTljMTg1MTEyOTQ5ODlhMmEyMThmY2Q0Y2M2MjE5'


