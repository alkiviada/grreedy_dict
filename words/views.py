from words.models import Word, Definition, Etymology, Example, Collection, Collocation
from words.utils import fetch_translations, fetch_word
from django.utils import timezone
from knox.models import AuthToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from words.serializers import (WordSerializer, TranslationSerializer, CollectionSerializer, 
                               CollectionDetailSerializer, CollocationSerializer,
                               CreateUserSerializer, UserSerializer, LoginUserSerializer)

from rest_framework import generics
from rest_framework.response import Response

from django.core.exceptions import ObjectDoesNotExist 
from django.http import Http404

class LogoutAPI(generics.GenericAPIView):

  def post(self, request, *args, **kwargs):
    print(request.user.auth_token)
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)

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
                  'name': name, 
                  'last_modified_date': timezone.now(),
                 }
    if uuid:
      try:
        coll = Collection.objects.get(uuid=uuid, owner=user) 
        for k, v in new_fields.items():
          print(k, ' ', v)
          setattr(coll, k, v)
        coll.save(update_fields=[*new_fields.keys()])
      except ObjectDoesNotExist:
        print ("Something Wrong with UUID: ", uuid)
    elif name:
# this is a new collection of words and the name given is either new
# or could be of a previously saved collection
      print('i have no uuid but i have name')
      coll = Collection.objects.filter(name=name, owner=user).first() 
      if not coll: 
# this is a brand new collection
        coll = Collection(created_date=timezone.now(), owner=user, **new_fields)
        coll.save()
      else:
# this is a request to resave a collection with the new set of words
        coll.last_modified_date = timezone.now() 
        coll.save(update_fields=['last_modified_date'])
# will have to 'conflate' old set with the new one
        old_words_coll = [ w.word for w in coll.words.all() ]
        words.extend(w for w in old_words_coll if w not in words)
    else: 
# this is a new and unnamed collection (someone is lazy)
      next_count = Collection.objects.filter(name__startswith='Untitled', owner=user).count()
      next_count += 1
      new_fields['name'] = 'Untitled: ' + str(next_count);
      coll = Collection(created_date=timezone.now(), owner=user, **new_fields)
      coll.save()
# need to get the words for the collection not only in their right order
# but also in their right order by language
    updated_words = []
    for w in words:
      w = Word.single_object.filter(word=w)
      updated_words.extend(w)
    
    coll.words.clear()
    coll.words.add(*updated_words)
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

  def get(self, request, word, *args, **kwargs):
    print('GET ' + word);
    db_words = Word.single_object.filter(word=word, from_translation=False);
   
    LANGUAGES = [ 'french', 'italian', 'english' ]

    if not db_words:
      db_words = ()
      print("Word is not in our DB");
      for language in LANGUAGES:
        print(language)
        try:
          foreign_objects_manager = getattr(Word, language + '_objects')
          print(foreign_objects_manager)
          try:
            fetch_method = getattr(foreign_objects_manager, 'fetch_word')
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

    serializer = WordSerializer(db_words, many=True)
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

    print(translated_words);

    LANGUAGES = [ 'french', 'italian' ]

    if not translated_words:
      translated_words = []
      print("Translations for this Word are not in our DB");
      for language in LANGUAGES:
        print(language)
        try:
          foreign_objects_manager = getattr(Word, language + '_objects')
          print(foreign_objects_manager)
          try:
            fetch_method = getattr(foreign_objects_manager, 'fetch_translation')
            translations = fetch_method(orig_word)
            if translations:
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
    print(word);
    all_collocs = []
    words = Word.single_object.filter(word=word)
    for w in words:
      collocs = w.word_collocations.all()
      if not collocs:
        try:
          foreign_objects = getattr(Word, w.language + '_objects')
          print(foreign_objects)
          try:
            collocs_method = getattr(foreign_objects, 'fetch_collocations')
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
    #print(all_collocs) 
    serializer = CollocationSerializer(all_collocs, many=True)
    return Response(serializer.data)

lingvo_api_key = 'OTQwMTgzY2EtYmI3NC00OGQ4LTgyNjctYzhiYTI2ZWM4NzU4OjEwNTljMTg1MTEyOTQ5ODlhMmEyMThmY2Q0Y2M2MjE5'
