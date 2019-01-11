from .models import Word, Definition, Etymology, Example, Collection, Collocation, WordNote
from django.utils import timezone
from knox.models import AuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from .constants import LANGUAGES, WORDS_ON_PAGE
import datetime

from .serializers import (WordSerializer, SynonymSerializer, TranslationSerializer, CollectionSerializer, 
                               CollectionDetailSerializer, CollocationSerializer, WordNoteSerializer, PronounceSerializer,
                               CreateUserSerializer, UserSerializer, LoginUserSerializer, ConjugateSerializer)

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.core.paginator import Paginator, EmptyPage

class LoginAPI(generics.GenericAPIView):
  serializer_class = LoginUserSerializer

  def post(self, request, *args, **kwargs):
    print('LOGIN')
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data
    token = AuthToken.objects.create(user, expires=datetime.timedelta(days=10))
    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": token,
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

  def get(self, request, uuid, time, page, *args, **kwargs):
    words = []
    page_count = 0
    print(page)
    if uuid:
      print('I have UUID: ' + uuid)
      print(time)
      coll = Collection.objects.get(uuid=uuid) 
      print(int(coll.last_modified_date.timestamp()))
      if coll and ((not time or int(coll.last_modified_date.timestamp()) > int(time))):
        all_words = coll.words.all()
        distinct_words = set()
        words = [w for w in all_words if w.word not in distinct_words and (distinct_words.add(w.word) or True)]
        print(len(words))
        if len(words) > WORDS_ON_PAGE:
          p = Paginator(words, WORDS_ON_PAGE)
          page_count = p.num_pages 
          print(page)
          all_words_for_page = []
          for w in p.page(page).object_list:
            all_words_for_page.append(w)
            omonyms = Word.single_object.filter(words=coll, word=w.word).exclude(language=w.language)
            all_words_for_page.extend(omonyms)
            
          print(all_words_for_page)
          words = all_words_for_page
        else:
          words = coll.words.all()
        serializer = WordSerializer(words, many=True)
        print('i will return here');
        if page_count > 1:
          print(999999999)
          print(page)
          print(len(serializer.data))
          return Response({ 
                            'words': serializer.data, 
                            'page_next': int(page) + 1 if int(page) + 1 <= page_count else 0,
                            'page_prev': int(page) - 1 if int(page) - 1 > 0 else 0,
                            'name': coll.name,
                            'uuid': coll.uuid,
                            'all_word_count': len(distinct_words) if len(distinct_words) > 20 else 0
                         })
        else:
          return Response({
                            'words': serializer.data, 
                            'name': coll.name,
                            'uuid': coll.uuid
                         })
      else:
        return Response({})
    else:
      return Response({})

class CollectionModified(generics.RetrieveAPIView):
  permission_classes = [ AllowAny ]
  def get_queryset(self):
    uuid = self.kwargs['uuid']
    return Collection.objects.get(uuid=uuid)

  lookup_field = 'uuid'
  serializer_class = CollectionDetailSerializer

  def get(self, request, uuid, time, *args, **kwargs):
    pass
    

class CollectionDetail(generics.RetrieveUpdateAPIView):
  permission_classes = [ IsAuthenticated, ]
  def get_queryset(self):
    print(self.request.user)
    return Collection.objects.filter(owner=user)

  lookup_field = 'uuid'
  serializer_class = CollectionDetailSerializer

  def get(self, request, uuid, time, *args, **kwargs):
    print('I have UUID: ' + uuid)
    print(time)

    coll = Collection.objects.get(uuid=uuid) 
    print(int(int(coll.last_modified_date.timestamp())))
    print(self.request.user)
    if not self.request.user == coll.owner:
      coll.update_fields( {'user': self.request.user, 'last_modified_date': timezone.now()} )

    if coll and (not time or int(coll.last_modified_date.timestamp()) > int(time)):
      serializer = CollectionDetailSerializer(coll)

      print(coll.words.all().order_by('collectionofwords'))
      return Response(serializer.data)
    else:
      return Response({})


class CollectionListCreate(generics.ListCreateAPIView):
  permission_classes = [ IsAuthenticated, ]
  lookup_field = 'name'
  serializer_class = CollectionSerializer

  def post(self, request):

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
      try:
        coll = Collection.objects.get(uuid=uuid) 
        if not name and not coll.name:
          next_count = Collection.objects.filter(name__startswith='Untitled', owner=user).count()
          next_count += 1
          new_fields['name'] = 'Untitled: ' + str(next_count);
          while Collection.objects.filter(name=new_fields['name']).exists():
            next_count += 1
            new_fields['name'] = 'Untitled: ' + str(next_count);
        coll.update_fields(new_fields)
      except ObjectDoesNotExist:
        print ("Something Wrong with UUID: ", uuid)
        raise Http404("No Fetch API for the word:", word)
    else: 
      print ("Something Wrong with UUID: ", uuid)
      raise Http404("No Fetch API for the word:", word)

    colls = Collection.frontend_objects.filter(owner=user)

    serializer = CollectionSerializer(colls, many=True)
    return Response(serializer.data)

  def get_queryset(self):
    print(self.request.user)
    print('retrieving collections for user');
    queryset = Collection.frontend_objects.filter(owner=self.request.user)
    return queryset

class WordSingleDelete(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  lookup_field = 'word'
  serializer_class = WordSerializer
  def get_queryset(self):
    word = self.kwargs['word'].lower()
    return Word.single_object.filter(word=word)

  def get(self, request, word, uuid, page, *args, **kwargs):
    print('DELETE: ' + word);
    word = word.lower()
    db_words = Word.single_object.filter(word=word);
    coll = Collection.objects.get(uuid=uuid)

    is_empty = 0
    for w in db_words:
      coll.remove_from_collection(w)
      
    if not coll.words.count():
      coll.delete()
      is_empty = 1;

    for w in db_words:
      if not w.words.count():
        w.delete()

    if not is_empty:
      coll.update_fields({ 'last_modified_date': timezone.now() })
      page_count = 0
      all_words = coll.words.all()
      distinct_words = set()
      words = [w for w in all_words if w.word not in distinct_words and (distinct_words.add(w.word) or True)]
      print(len(words))
      if len(words) > WORDS_ON_PAGE:
        p = Paginator(words, WORDS_ON_PAGE)
        page_count = p.num_pages 
        print(page)
        all_words_for_page = []
        words_on_page = []
        try:
          words_on_page = p.page(page).object_list
        except EmptyPage:
          page = int(page) - 1
          words_on_page = p.page(page).object_list

        for w in words_on_page:
          all_words_for_page.append(w)
          omonyms = Word.single_object.filter(words=coll, word=w.word).exclude(language=w.language)
          all_words_for_page.extend(omonyms)
            
        print(all_words_for_page)
        words = all_words_for_page
      else:
        words = coll.words.all()
      serializer = WordSerializer(words, many=True)
      print('i will return here');
      if page_count > 1:
        print(999999999)
        print(page)
        print(len(serializer.data))
        return Response({ 
                          'words': serializer.data, 
                          'page_next': int(page) + 1 if int(page) + 1 <= page_count else 0,
                          'page_prev': int(page) - 1 if int(page) - 1 > 0 else 0,
                          'name': coll.name,
                          'page': page,
                          'uuid': coll.uuid,
                          'all_word_count': len(distinct_words) if len(distinct_words) > 20 else 0
                       })
      else:
        return Response({
                          'words': serializer.data, 
                          'name': coll.name,
                          'uuid': coll.uuid,
                          'page': page
                       })
    return Response({'empty': is_empty})

class WordSingleCreate(generics.ListAPIView):
  permission_classes = [ AllowAny ]
  lookup_field = 'word'
  serializer_class = WordSerializer
  def get_queryset(self):
    word = self.kwargs['word'].lower()
    return Word.single_object.filter(word=word)

  def get(self, request, word, uuid, *args, **kwargs):
    print('GET ' + word);
    word = word.lower()
    db_words = Word.single_object.filter(word=word, from_translation=False);
   
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
      print("Could not fetch word: " + word);
      raise Http404("No API for the word:", word)

# now that i have words in the db 
# it is time to collect them in a collection

    print(self.request.user)

    if not uuid:
      new_coll = { 'created_date': timezone.now(),
                   'last_modified_date': timezone.now()
      }

      if not self.request.user.is_anonymous:
        new_coll['owner'] = self.request.user; 

      coll = Collection.objects.create(**new_coll)
    else: 
      print('I have an UUID: ' + uuid)
      try:
        coll = Collection.objects.get(uuid=uuid)
        new_fields = { 'last_modified_date': timezone.now() }
        if not coll.owner and not self.request.user.is_anonymous:
          new_fields['owner'] = self.request.user
        coll.update_fields(new_fields)
      except Exception as e:
# it was a rogue uuid but we will try to use it anew
        print(e)
        new_coll = { 'created_date': timezone.now(),
                      'uuid': uuid,
                     'last_modified_date': timezone.now()
        }

        if not self.request.user.is_anonymous:
          new_coll['owner'] = self.request.user; 

        coll = Collection.objects.create(**new_coll)

# now that we have our collection - new or current
# let's add newly looked up words to it
    w_in_coll = 0
    for w in db_words:
      w_in_coll = w.words.filter(uuid=coll.uuid).distinct().first()
      if not w_in_coll:
        coll.add_to_collection(w)

    all_words = coll.words.all()
    distinct_words = set()
    words = [w for w in all_words if w.word not in distinct_words and (distinct_words.add(w.word) or True)]
    print(len(words))
   
    if w_in_coll: 
      if len(words) > WORDS_ON_PAGE:
        p = Paginator(words, WORDS_ON_PAGE)
        page_count = p.num_pages 
        while page_count:
          print(word)
          words = p.page(page_count).object_list
          word_on_page = list(filter(lambda w: w.word == word, words))
          if len(word_on_page):
            break
          page_count -= 1

        page = page_count 
        print(page)
        all_words_for_page = []
        words_on_page = []
        words_on_page = p.page(page).object_list

        for w in words_on_page:
          all_words_for_page.append(w)
          omonyms = Word.single_object.filter(words=coll, word=w.word).exclude(language=w.language)
          all_words_for_page.extend(omonyms)
            
        print(all_words_for_page)
        words = all_words_for_page
        serializer = WordSerializer(words, many=True)
        return Response({ 
                          'words': serializer.data, 
                          'page_next': int(page) + 1 if int(page) + 1 <= p.num_pages else 0,
                          'page_prev': int(page) - 1 if int(page) - 1 > 0 else 0,
                          'name': coll.name,
                          'page': page,
                          'uuid': coll.uuid,
                          'all_word_count': len(distinct_words) if len(distinct_words) > 20 else 0
                       })
      

    serializer = WordSerializer(db_words, many=True)
    return Response({ 'word': serializer.data, 
                      'uuid': coll.uuid, 
                      'name': coll.name, 
                      'page': 1,
                      'page_next': 2 if len(words) > 20 else 0, 
                      'all_word_count': len(words) if len(words) > 20 else 0
                    })

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
    #print(synonyms)

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

class WordNoteSingleCreate(generics.GenericAPIView):
  permission_classes = [ AllowAny, ]

  serializer_class = WordNoteSerializer

  def post(self, request, format=None):
    print('ADD NOTE')
    word = request.data.get('word')
    words = Word.objects.filter(word=word)
    collection_uuid = request.data.get('uuid')
    note = request.data.get('note')
    coll = Collection.objects.get(uuid=collection_uuid)

    defaults = { 'note': note }

    user = self.request.user

    word_note, created = WordNote.objects.update_or_create(collection=coll, word=words.first(), defaults=defaults )


    print(user)
    if not user.is_anonymous:
      print('i am here')
      notes_coll = ''
      word_note_colls = Collection.objects.filter(name__startswith='Words with Notes', owner=user)
      if len(word_note_colls):
        wn = WordNote.objects.filter(word=words.first(), collection__in=word_note_colls).first()
        if wn:
          wn.note += '\n' + note
          wn.save()
          notes_coll = wn.collection
        else:
          if word_note_colls.latest('name').words.count() > 100:
            name = 'Words with Notes ' + str(word_note_colls.count() + 1);
            notes_coll = Collection.objects.create(name=name, owner=user, 
                                                   created_date=timezone.now(),  
                                                   last_modified_date=timezone.now())
            print(notes_coll)
          else:
            notes_coll = word_note_colls.latest('name')
          for word in words:
            notes_coll.add_to_collection(word)
          notes_word_note = WordNote.objects.create(collection=notes_coll, word=words.first(), note=note)
      else:
        notes_coll = Collection.objects.create(name='Words with Notes', owner=user, 
                                               created_date=timezone.now(),  
                                               last_modified_date=timezone.now())
        for word in words:
          notes_coll.add_to_collection(word)
        notes_word_note = WordNote.objects.create(collection=notes_coll, word=words.first(), note=note)
        
      notes_coll.update_fields({ 'last_modified_date': timezone.now() })
      
    return Response(WordNoteSerializer(word_note).data)

class WordNoteSingleDetail(APIView):
  permission_classes = [ AllowAny, ]

  def get_queryset(self):
    word = self.kwargs['word']
    collection_uuid = self.kwargs['uuid']
    word = Word.objects.filter(word=word).first()
    collection = Collection.objects.get(uuid=collection_uuid)
    note = {}
    try:
      note = WordNote.objects.get(word=word, collection=collection)
    except ObjectDoesNotExist:
      print ("No note for word: ", word)
      note = WordNote.objects.none() 

    return note

  serializer_class = WordNoteSerializer

  def get(self, request, word, uuid, *args, **kwargs):
    word = Word.objects.filter(word=word).first()
    coll = Collection.objects.get(uuid=uuid)
    note = {}
    try:
      note = WordNote.objects.get(word=word, collection=coll)
      serializer = WordNoteSerializer(note)
      return Response(serializer.data)
    except ObjectDoesNotExist:
      print ("No note for word: ", word)
      return Response({'note': ''})

class WordSingleCreateConjugate(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  def get_queryset(self):
    word = self.kwargs['word']
    words = Word.objects.filter(word=word)
    return word 

  lookup_field = 'word'

  def get(self, request, word, *args, **kwargs):
    orig_word = ''
    print(word);
    conjs = []
    word = word.lower()
    words = Word.romance_words.filter(word=word, is_verb=True)
    print(words)
    for w in words:
      print('conjugate: ', w, ' ', w.language) 
      origin_verb = ''
      if w.conjugations:
        origin_verb = w 
        print('i am the original verb')
      else:
        origin_verb = w.origin_verb 
      print(origin_verb)
      if origin_verb:
        print('i have original verb')
        conjs.append(origin_verb)
      else: 
        try:
          objects_manager = getattr(Word, w.language + '_objects')
          print(objects_manager)
          try:
            conjugate_method = getattr(objects_manager, 'fetch_conjugate')
            conj = conjugate_method(w)
            if conj:
              conjs.append(conj)
          except Exception as e: 
            print(e)
            print('No method to get conjugations')
            raise Http404("No Conjugate API for the word: ", word)
        except Exception as e: 
          print(e)
          print('No method to get conjugations')
          raise Http404("No Conjugate API for the word: ", word)
    print(conjs)
    if not conjs:
      print("Could not fetch conjugations: " + word);
      raise Http404("No Conjugation API for the word: ", word)

    serializer = ConjugateSerializer(conjs, many=True)
    return Response(serializer.data)

class WordSingleCreatePronounce(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  def get_queryset(self):
    word = self.kwargs['word']
    words = Word.objects.filter(word=word)
    return word 

  lookup_field = 'word'
  serializer_class = PronounceSerializer

  def get(self, request, word, *args, **kwargs):
    orig_word = ''
    print(word);

    words = Word.single_object.filter(word=word)
    for w in words:
      pronounce = w.pronounce
      if not pronounce:
        try:
          objects_manager = getattr(Word, w.language + '_objects')
          print(objects_manager)
          try:
            pronounce_method = getattr(objects_manager, 'fetch_pronounce')
            pronounce_method(w)
          except Exception as e: 
            print(e)
            print('No method to get pronounce')
            raise Http404("No Pronunciation API for the word: ", word)
        except Exception as e: 
          print(e)
          print('No method to get pronunciations')
          raise Http404("No Pronunciation API for the word: ", word)
    serializer = PronounceSerializer(words, many=True)
    return Response(serializer.data)

class WordSingleCreateTranslate(generics.RetrieveAPIView):
  permission_classes = [ AllowAny, ]
  def get_queryset(self):
    word = self.kwargs['word']
    word = Word.english_objects.get(word=word)
    return word.translations.all() 

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
