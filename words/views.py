from words.models import Word, Definition, Etymology, Example
from words.utils import fetch_translations, fetch_word

from words.serializers import WordSerializer, TranslationSerializer

from rest_framework import generics
from rest_framework.response import Response

from django.core.exceptions import ObjectDoesNotExist 
from django.http import Http404


class WordList(generics.ListAPIView):
    serializer_class = WordSerializer
    def get_queryset(self):
        queryset = Word.objects.filter(word_examples__isnull=False).distinct()
        return queryset

class WordSingleCreate(generics.ListAPIView):
  lookup_field = 'word'
  serializer_class = WordSerializer

  def get(self, request, word, *args, **kwargs):
    print('GET ' + word);
    db_words = Word.objects.filter(word=word);
    print('no word')
    if not db_words:
      print("Word is not in our DB");
      fetch_word(word);
      db_words = Word.objects.filter(word=word);
      if not db_words:
        print("Word is not in our DB");
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
    orig_word = Word.objects.get(word=word, language='english');
    translated_words = Word.objects.filter(translations=orig_word);
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


