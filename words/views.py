from words.models import Word, Definition, Etymology, Example, Collection, Collocation
from django.utils import timezone
from knox.models import AuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from words.constants import LANGUAGES

from words.serializers import (WordSerializer, SynonymSerializer, TranslationSerializer, CollectionSerializer, 
                               CollectionDetailSerializer, CollocationSerializer,
                               CreateUserSerializer, UserSerializer, LoginUserSerializer)

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

  def get(self, request, uuid, *args, **kwargs):
    words = []
    if uuid:
      print('I have UUID: ' + uuid)
      coll = Collection.objects.get(uuid=uuid) 
      words = coll.words
      
    serializer = WordSerializer(words, many=True)
    return Response(serializer.data)


class CollectionDetail(generics.RetrieveUpdateAPIView):
  permission_classes = [ IsAuthenticated, ]
  def get_queryset(self):
    print(self.request.user)
    return Collection.objects.all()

  lookup_field = 'uuid'
  serializer_class = CollectionDetailSerializer


class CollectionListCreate(generics.ListCreateAPIView):
  permission_classes = [ IsAuthenticated, ]
  lookup_field = 'name'
  serializer_class = CollectionSerializer

  def post(self, request):
    words = request.data.get('collection').split(',')

    name = request.data.get('name')
    uuid = request.data.get('uuid')
    user = self.request.user
    print(uuid);
    print(name);
    coll = '';
    new_fields = { 
                  'owner': user,
                  'name': name, 
                  'last_modified_date': timezone.now(),
                 }
    if uuid:
      if not name:
        next_count = Collection.objects.filter(name__startswith='Untitled', owner=user).count()
        next_count += 1
        new_fields['name'] = 'Untitled: ' + str(next_count);
      try:
        coll = Collection.objects.get(uuid=uuid) 
        coll.update_fields(new_fields)
      except ObjectDoesNotExist:
        print ("Something Wrong with UUID: ", uuid)
        raise Http404("No Fetch API for the word:", word)
    else: 
      print ("Something Wrong with UUID: ", uuid)
      raise Http404("No Fetch API for the word:", word)

    colls = Collection.objects.filter(owner=user)

    serializer = CollectionSerializer(colls, many=True)
    return Response(serializer.data)

  def get_queryset(self):
    print(self.request.user)
    print('retrieving collections for user');
    queryset = self.request.user.collections.all()
    return queryset

class WordSingleCreate(generics.ListAPIView):
  permission_classes = [ AllowAny, ]
  lookup_field = 'word'
  serializer_class = WordSerializer
  def get_queryset(self):
    word = self.kwargs['word']
    return Word.single_object.filter(word=word)

  def get(self, request, word, uuid, *args, **kwargs):
    print('GET ' + word);
    db_words = Word.single_object.filter(word=word, from_translation=False);
    print(db_words)
   
    if not db_words:
      db_words = ()
      print("Word is not in our DB");
      for language in LANGUAGES:
        print(language)
        try:
          objects_manager = getattr(Word, language + '_objects')
          print(objects_manager)
          try:
            fetch_method = getattr(objects_manager, 'fetch_word')
            words = fetch_method(word)
            if words:
              db_words = words + db_words
          except Exception as e:
            print(e)
            print('No method to fetch word')
            raise Http404("No Fetch API for the word:", word)
        except Exception as e:
          print(e)
          print('No method to fecth word')
          raise Http404("No Fetch API for the word:", word)

    if not db_words:
      print("Could not fetch word:" + word);
      raise Http404("No API for the word:", word)

# now that i have words in the db 
# it is time to collect them in a collection

    if not uuid:
      coll = Collection.objects.create(created_date=timezone.now(), 
                                       last_modified_date=timezone.now())
    else: 
      print('I have an UUID: ' + uuid)
      coll = Collection.objects.get(uuid=uuid)
      coll.update_last_modified()

# now that we have our collection - new or current
# let's add newly looked up words to it
    for w in db_words:
      coll.add_to_collection(w)
      
    serializer = WordSerializer(db_words, many=True)
    return Response(serializer.data)

class WordSingleCreateSynonyms(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  def get_queryset(self):
    word = self.kwargs['word']
    words = Word.single_object.filter(word=word)
    print('synonyms')
    synonyms = []
    [ synonyms.extend(w.synonyms.all()) for w in words ]
    return synonyms

  lookup_field = 'word'
  serializer_class = SynonymSerializer

  def get(self, request, word, *args, **kwargs):
    orig_word = ''
    print(word);

    synonyms = self.get_queryset()
    print(synonyms)

    if not synonyms:
      print("Synonyms for this Word are not in our DB");
      words = Word.single_object.filter(word=word)
      for w in words:
        language = w.language
        print(language)
        try:
          objects_manager = getattr(Word, language + '_objects')
          print(objects_manager)
          try:
            fetch_method = getattr(objects_manager, 'fetch_synonyms')
            word_synonyms = fetch_method(w)
            if word_synonyms:
              print(word_synonyms)
              w.synonyms.add(*word_synonyms)
              synonyms = synonyms + word_synonyms
          except Exception as e:
            print(e)
            print('No method to get synonyms of word')
            raise Http404("No SYnonyms API for the word:", word)
        except Exception as e:
          print(e)
          print('No method to get synonyms for word')
          raise Http404("No Synonyms API for the word:", word)
    if not synonyms:
      print("Could not fetch synonyms:" + word);
      raise Http404("No SYnonyms API for the word:", word)
      
    print(synonyms)
    serializer = SynonymSerializer(synonyms, many=True)
    return Response(serializer.data)

class WordSingleCreateTranslate(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  def get_queryset(self):
    word = self.kwargs['word']
    word = Word.english_objects.get(word=word)
    return w.translations.all() 

  lookup_field = 'word'
  serializer_class = TranslationSerializer

  def get(self, request, word, *args, **kwargs):
    orig_word = ''
    print(word);

    orig_word = Word.english_objects.get(word=word)
    translated_words = orig_word.translations.all()

    if not translated_words:
      translated_words = []
      print("Translations for this Word are not in our DB");
      for language in LANGUAGES:
        print(language)
        if orig_word.language == language:
          continue
        try:
          objects_manager = getattr(Word, language + '_objects')
          print(objects_manager)
          try:
            fetch_method = getattr(objects_manager, 'fetch_translation')
            translations = fetch_method(orig_word)
            if translations:
              print(translations)
              orig_word.translations.add(*translations)
              translated_words = translations + translated_words
          except Exception as e:
            print(e)
            print('No method to translate word')
            raise Http404("No Tranlate API for the word:", word)
        except Exception as e:
          print(e)
          print('No method to translate word')
          raise Http404("No Translate API for the word:", word)
    if not translated_words:
      print("Could not fetch translations:" + word);
      raise Http404("No Translation API for the word:", word)
      
    serializer = TranslationSerializer(translated_words, many=True)
    return Response(serializer.data)

class WordSingleCreateCollocations(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  lookup_field = 'word'

  def get_queryset(self):
    word = self.kwargs['word']
    words = Word.single_object.filter(word=word)
    return [ w.word_collocations.all() for w in words ] 

  serializer_class = CollocationSerializer

  def get(self, request, word, *args, **kwargs):
    print('Collocs: ', word);
    all_collocs = []
    words = Word.single_object.filter(word=word)
    for w in words:
      collocs = w.word_collocations.all()
      if not collocs:
        try:
          objects_manager = getattr(Word, w.language + '_objects')
          print(objects_manager)
          try:
            collocs_method = getattr(objects_manager, 'fetch_collocations')
            collocs = collocs_method(w)
            all_collocs.extend(collocs)
          except Exception as e: 
            print(e)
            print('No method to get collocations')
            raise Http404("No Collocations API for the word:", word)
        except Exception as e: 
          print(e)
          print('No method to get collocations')
          raise Http404("No Collocations API for the word:", word)
      else:
        all_collocs.extend(collocs)
    if not all_collocs:
      print("Could not fetch collocations:" + word);
      raise Http404("No API for the word:", word)
    serializer = CollocationSerializer(all_collocs, many=True)
    return Response(serializer.data)

lingvo_api_key = 'OTQwMTgzY2EtYmI3NC00OGQ4LTgyNjctYzhiYTI2ZWM4NzU4OjEwNTljMTg1MTEyOTQ5ODlhMmEyMThmY2Q0Y2M2MjE5'
